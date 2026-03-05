import { Component, OnInit, OnDestroy, signal, computed, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import {
  IonContent, IonHeader, IonTitle, IonToolbar, IonFab, IonFabButton,
  IonIcon, IonButton, IonCheckbox, IonChip, IonSearchbar,
  ToastController, AlertController, ModalController
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import {
  add, trashOutline, createOutline, checkmarkCircle,
  ellipseOutline, listOutline, searchOutline, funnelOutline,
  checkmarkCircleOutline, pricetagsOutline
} from 'ionicons/icons';

import { TASK_REPOSITORY_TOKEN, CATEGORY_REPOSITORY_TOKEN } from '../../../core/tokens/repository.tokens';
import { ITaskRepository } from '../../../core/interfaces/task-repository.interface';
import { ICategoryRepository } from '../../../core/interfaces/category-repository.interface';

import { GetTasksUseCase } from '../../../core/use-cases/task/get-tasks.usecase';
import { CreateTaskUseCase } from '../../../core/use-cases/task/create-task.usecase';
import { UpdateTaskUseCase } from '../../../core/use-cases/task/update-task.usecase';
import { DeleteTaskUseCase } from '../../../core/use-cases/task/delete-task.usecase';
import { GetCategoriesUseCase } from '../../../core/use-cases/category/get-categories.usecase';

import { Task } from '../../../core/models/task.model';
import { Category } from '../../../core/models/category.model';
import { TaskModalComponent } from '../../shared/components/task-modal/task-modal.component';
import { RemoteConfigService } from '../../../core/services/remote-config.service';

@Component({
  selector: 'app-tasks',
  templateUrl: './tasks.page.html',
  styleUrls: ['./tasks.page.scss'],
  standalone: true,
  imports: [
    CommonModule, FormsModule,
    IonContent, IonHeader, IonTitle, IonToolbar, IonFab, IonFabButton,
    IonIcon, IonButton, IonCheckbox, IonChip, IonSearchbar
  ]
})
export class TasksPage implements OnInit, OnDestroy {
  // --- Signals ---
  tasks = signal<Task[]>([]);
  categories = signal<Category[]>([]);
  selectedCategoryFilter = signal<string | null>(null);
  searchQuery = signal('');
  showCategories = signal<boolean>(true);

  // --- Computed signals (evitan recalculos innecesarios) ---
  filteredTasks = computed(() => {
    let result = this.tasks();
    const categoryFilter = this.selectedCategoryFilter();
    const query = this.searchQuery().toLowerCase();

    if (categoryFilter) {
      result = result.filter(t => t.categoryId === categoryFilter);
    }
    if (query) {
      result = result.filter(t =>
        t.title.toLowerCase().includes(query) ||
        t.description?.toLowerCase().includes(query)
      );
    }
    return result;
  });

  pendingCount = computed(() => this.tasks().filter(t => !t.completed).length);
  completedCount = computed(() => this.tasks().filter(t => t.completed).length);

  // --- Mapa de categorías para O(1) lookup en lugar de O(n) ---
  private categoryMap = computed(() => {
    const map = new Map<string, Category>();
    this.categories().forEach(c => map.set(c.id, c));
    return map;
  });

  private getTasksUC: GetTasksUseCase;
  private createTaskUC: CreateTaskUseCase;
  private updateTaskUC: UpdateTaskUseCase;
  private deleteTaskUC: DeleteTaskUseCase;
  private getCategoriesUC: GetCategoriesUseCase;

  constructor(
    @Inject(TASK_REPOSITORY_TOKEN) private taskRepository: ITaskRepository,
    @Inject(CATEGORY_REPOSITORY_TOKEN) private categoryRepository: ICategoryRepository,
    private toastCtrl: ToastController,
    private alertCtrl: AlertController,
    private modalCtrl: ModalController,
    private router: Router,
    private remoteConfigService: RemoteConfigService
  ) {
    addIcons({
      add, trashOutline, createOutline, checkmarkCircle,
      ellipseOutline, listOutline, searchOutline, funnelOutline,
      checkmarkCircleOutline, pricetagsOutline
    });
    this.getTasksUC = new GetTasksUseCase(this.taskRepository);
    this.createTaskUC = new CreateTaskUseCase(this.taskRepository);
    this.updateTaskUC = new UpdateTaskUseCase(this.taskRepository);
    this.deleteTaskUC = new DeleteTaskUseCase(this.taskRepository);
    this.getCategoriesUC = new GetCategoriesUseCase(this.categoryRepository);
  }

  async ngOnInit() {
    this.showCategories.set(this.remoteConfigService.getShowCategories());
    await this.loadData();
  }

  ngOnDestroy() {
    // Limpieza de signals para liberar memoria
    this.tasks.set([]);
    this.categories.set([]);
  }

  async loadData() {
    // Carga paralela para reducir tiempo de espera
    const [tasks, categories] = await Promise.all([
      this.getTasksUC.execute(),
      this.getCategoriesUC.execute()
    ]);
    this.tasks.set(tasks);
    this.categories.set(categories);
  }

  filterByCategory(categoryId: string | null) {
    this.selectedCategoryFilter.set(categoryId);
  }

  onSearch(event: any) {
    this.searchQuery.set(event.detail.value ?? '');
  }

  // O(1) gracias al Map en lugar de O(n) con find()
  getCategoryById(id: string | null): Category | undefined {
    if (!id) return undefined;
    return this.categoryMap().get(id);
  }

  async openCreateModal() {
    const modal = await this.modalCtrl.create({
      component: TaskModalComponent,
      componentProps: {
        isEditing: false,
        categories: this.categories(),
        taskData: { id: '', title: '', description: '', categoryId: null }
      }
    });
    modal.onDidDismiss().then(async (result) => {
      if (result.data) {
        try {
          await this.createTaskUC.execute({
            title: result.data.title,
            description: result.data.description,
            categoryId: result.data.categoryId
          });
          await this.showToast('Task created!', 'success');
          await this.loadData();
        } catch (error: any) {
          await this.showToast(error.message, 'danger');
        }
      }
    });
    await modal.present();
  }

  async openEditModal(task: Task) {
    const modal = await this.modalCtrl.create({
      component: TaskModalComponent,
      componentProps: {
        isEditing: true,
        categories: this.categories(),
        taskData: {
          id: task.id,
          title: task.title,
          description: task.description,
          categoryId: task.categoryId
        }
      }
    });
    modal.onDidDismiss().then(async (result) => {
      if (result.data) {
        try {
          await this.updateTaskUC.execute(task.id, {
            title: result.data.title,
            description: result.data.description,
            categoryId: result.data.categoryId
          });
          await this.showToast('Task updated!', 'success');
          await this.loadData();
        } catch (error: any) {
          await this.showToast(error.message, 'danger');
        }
      }
    });
    await modal.present();
  }

  async toggleComplete(task: Task) {
    await this.updateTaskUC.execute(task.id, { completed: !task.completed });
    await this.loadData();
  }

  async confirmDelete(task: Task) {
    const alert = await this.alertCtrl.create({
      header: 'Delete Task',
      message: `Are you sure you want to delete "${task.title}"?`,
      buttons: [
        { text: 'Cancel', role: 'cancel' },
        {
          text: 'Delete',
          role: 'destructive',
          handler: async () => {
            await this.deleteTaskUC.execute(task.id);
            await this.loadData();
            await this.showToast('Task deleted!', 'success');
          }
        }
      ]
    });
    await alert.present();
  }

  goToCategories() {
    window.location.href = '/categories';
  }

  goToTasks() {
    window.location.href = '/tasks';
  }

  private async showToast(message: string, color: string) {
    const toast = await this.toastCtrl.create({
      message, color, duration: 2000, position: 'bottom'
    });
    await toast.present();
  }
}