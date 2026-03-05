import { Injectable } from '@angular/core';
import { initializeApp } from 'firebase/app';
import { getRemoteConfig, getValue, fetchAndActivate } from 'firebase/remote-config';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class RemoteConfigService {
  private remoteConfig;

  constructor() {
    const app = initializeApp(environment.firebase);
    this.remoteConfig = getRemoteConfig(app);
    // Solo para desarrollo para que el cambio realizado en Firebase se vea de manera inmediata
    this.remoteConfig.settings.minimumFetchIntervalMillis = 0; 
    this.remoteConfig.defaultConfig = {
      show_categories: true
    };
  }

  async initialize(): Promise<void> {
    try {
      await fetchAndActivate(this.remoteConfig);
      console.log('Remote Config inicializado correctamente');
    } catch (error) {
      console.error('Error al inicializar Remote Config:', error);
    }
  }

  getShowCategories(): boolean {
    return getValue(this.remoteConfig, 'show_categories').asBoolean();
  }
}

