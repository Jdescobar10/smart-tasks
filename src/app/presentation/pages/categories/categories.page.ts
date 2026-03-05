import { Component, OnInit, OnDestroy, signal, computed, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import {
  IonContent, IonHeader, IonTitle, IonToolbar, IonFab, IonFabButton,
  IonIcon, IonList, IonItem, IonLabel, IonButton,
  ToastController, AlertController, ModalController
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import {
  add, trashOutline, createOutline, pricetagsOutline, checkmarkCircleOutline
} from 'ionicons/icons';

import { CATEGORY_REPOSITORY_TOKEN } from '../../../core/tokens/repository.tokens';
import { ICategoryRepository } from '../../../core/interfaces/category-repository.interface';
import { CreateCategoryUseCase } from '../../../core/use-cases/category/create-category.usecase';
import { UpdateCategoryUseCase } from '../../../core/use-cases/category/update-category.usecase';
import { DeleteCategoryUseCase } from '../../../core/use-cases/category/delete-category.usecase';
import { GetCategoriesUseCase } from '../../../core/use-cases/category/get-categories.usecase';
import { Category } from '../../../core/models/category.model';
import { CategoryModalComponent } from '../../shared/components/category-modal/category-modal.component';

@Component({
  selector: 'app-categories',
  templateUrl: './categories.page.html',
  styleUrls: ['./categories.page.scss'],
  standalone: true,
  imports: [
    CommonModule,
    IonContent, IonHeader, IonTitle, IonToolbar, IonFab, IonFabButton,
    IonIcon, IonList, IonItem, IonLabel, IonButton
  ]
})
export class CategoriesPage implements OnInit, OnDestroy {
  categories = signal<Category[]>([]);

  // Computed: estadísticas calculadas automáticamente sin métodos extra
  totalCategories = computed(() => this.categories().length);

  private getCategories: GetCategoriesUseCase;
  private createCategoryUC: CreateCategoryUseCase;
  private updateCategoryUC: UpdateCategoryUseCase;
  private deleteCategoryUC: DeleteCategoryUseCase;

  constructor(
    @Inject(CATEGORY_REPOSITORY_TOKEN) private categoryRepository: ICategoryRepository,
    private toastCtrl: ToastController,
    private alertCtrl: AlertController,
    private modalCtrl: ModalController,
    private router: Router
  ) {
    addIcons({ add, trashOutline, createOutline, pricetagsOutline, checkmarkCircleOutline });
    this.getCategories = new GetCategoriesUseCase(this.categoryRepository);
    this.createCategoryUC = new CreateCategoryUseCase(this.categoryRepository);
    this.updateCategoryUC = new UpdateCategoryUseCase(this.categoryRepository);
    this.deleteCategoryUC = new DeleteCategoryUseCase(this.categoryRepository);
  }

  async ngOnInit() {
    await this.loadCategories();
  }

  ngOnDestroy() {
    // Limpieza de signals para liberar memoria
    this.categories.set([]);
  }

  async loadCategories() {
    const data = await this.getCategories.execute();
    this.categories.set(data);
  }

  async openCreateModal() {
    const modal = await this.modalCtrl.create({
      component: CategoryModalComponent,
      componentProps: {
        isEditing: false,
        categoryData: { id: '', name: '', color: '#6C63FF' }
      }
    });
    modal.onDidDismiss().then(async (result) => {
      if (result.data) {
        try {
          await this.createCategoryUC.execute({
            name: result.data.name,
            color: result.data.color
          });
          await this.showToast('Category created!', 'success');
          await this.loadCategories();
        } catch (error: any) {
          await this.showToast(error.message, 'danger');
        }
      }
    });
    await modal.present();
  }

  async openEditModal(category: Category) {
    const modal = await this.modalCtrl.create({
      component: CategoryModalComponent,
      componentProps: {
        isEditing: true,
        categoryData: { id: category.id, name: category.name, color: category.color }
      }
    });
    modal.onDidDismiss().then(async (result) => {
      if (result.data) {
        try {
          await this.updateCategoryUC.execute(category.id, {
            name: result.data.name,
            color: result.data.color
          });
          await this.showToast('Category updated!', 'success');
          await this.loadCategories();
        } catch (error: any) {
          await this.showToast(error.message, 'danger');
        }
      }
    });
    await modal.present();
  }

  async confirmDelete(category: Category) {
    const alert = await this.alertCtrl.create({
      header: 'Delete Category',
      message: `Are you sure you want to delete "${category.name}"?`,
      buttons: [
        { text: 'Cancel', role: 'cancel' },
        {
          text: 'Delete',
          role: 'destructive',
          handler: async () => {
            await this.deleteCategoryUC.execute(category.id);
            await this.loadCategories();
            await this.showToast('Category deleted!', 'success');
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