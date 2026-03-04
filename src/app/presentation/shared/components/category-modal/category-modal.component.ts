import { Component, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { addIcons } from 'ionicons';
import { closeOutline } from 'ionicons/icons';
import {
  IonHeader, IonToolbar, IonTitle, IonButtons, IonButton,
  IonContent, IonInput, IonIcon, ModalController
} from '@ionic/angular/standalone';

export interface CategoryFormData {
  id: string;
  name: string;
  color: string;
}

@Component({
  selector: 'app-category-modal',
  templateUrl: './category-modal.component.html',
  styleUrls: ['./category-modal.component.scss'],
  standalone: true,
  imports: [
    CommonModule, FormsModule,
    IonHeader, IonToolbar, IonTitle, IonButtons, IonButton,
    IonContent, IonInput, IonIcon
  ]
})
export class CategoryModalComponent implements OnInit {
  @Input() isEditing = false;
  @Input() categoryData: CategoryFormData = { id: '', name: '', color: '#6C63FF' };

  form: CategoryFormData = { id: '', name: '', color: '#6C63FF' };

  colors = [
    '#6C63FF', '#FF6B6B', '#4ECDC4', '#45B7D1',
    '#96CEB4', '#FFEAA7', '#DDA0DD', '#98D8C8'
  ];

  constructor(private modalCtrl: ModalController) {
    addIcons({ closeOutline });
  }

  ngOnInit() {
    this.form = { ...this.categoryData };
  }

  async onSave() {
    await this.modalCtrl.dismiss(this.form);
  }

  async onCancel() {
    await this.modalCtrl.dismiss(null);
  }
}