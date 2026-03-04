import { Component, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { addIcons } from 'ionicons';
import { closeOutline } from 'ionicons/icons';
import {
  IonHeader, IonToolbar, IonTitle, IonButtons, IonButton,
  IonContent, IonInput, IonTextarea, IonSelect, IonSelectOption,
  IonIcon, ModalController
} from '@ionic/angular/standalone';
import { Category } from '../../../../core/models/category.model';

export interface TaskFormData {
  id: string;
  title: string;
  description: string;
  categoryId: string | null;
}

@Component({
  selector: 'app-task-modal',
  templateUrl: './task-modal.component.html',
  styleUrls: ['./task-modal.component.scss'],
  standalone: true,
  imports: [
    CommonModule, FormsModule,
    IonHeader, IonToolbar, IonTitle, IonButtons, IonButton,
    IonContent, IonInput, IonTextarea, IonSelect, IonSelectOption,
    IonIcon 
  ]
})
export class TaskModalComponent implements OnInit {
  @Input() isEditing = false;
  @Input() categories: Category[] = [];
  @Input() taskData: TaskFormData = { id: '', title: '', description: '', categoryId: null };

  form: TaskFormData = { id: '', title: '', description: '', categoryId: null };

  constructor(private modalCtrl: ModalController) {
    addIcons({ closeOutline }); 
  }

  ngOnInit() {
    this.form = { ...this.taskData };
  }

  async onSave() {
    await this.modalCtrl.dismiss(this.form);
  }

  async onCancel() {
    await this.modalCtrl.dismiss(null);
  }
}