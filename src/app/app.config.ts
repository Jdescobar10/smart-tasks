import { ApplicationConfig } from '@angular/core';
import { provideRouter, withPreloading, PreloadAllModules } from '@angular/router';
import { RouteReuseStrategy } from '@angular/router';
import { IonicRouteStrategy, provideIonicAngular } from '@ionic/angular/standalone';
import { routes } from './app.routes';

// Tokens
import { TASK_REPOSITORY_TOKEN, CATEGORY_REPOSITORY_TOKEN } from './core/tokens/repository.tokens';

// Repositories
import { TaskRepository } from './data/repositories/task.repository';
import { CategoryRepository } from './data/repositories/category.repository';

export const appConfig: ApplicationConfig = {
  providers: [
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy },
    provideIonicAngular(),
    provideRouter(routes, withPreloading(PreloadAllModules)),

    // Dependency Inversion
    {
      provide: TASK_REPOSITORY_TOKEN,
      useClass: TaskRepository
    },
    {
      provide: CATEGORY_REPOSITORY_TOKEN,
      useClass: CategoryRepository
    }
  ]
};