# Documentación Técnica - Smart Tasks

## Introducción

Smart Tasks es una aplicación móvil híbrida de gestión de tareas desarrollada con Ionic Framework y Angular. Esta aplicación permite a los usuarios crear, editar, eliminar y categorizar tareas, con soporte para modo oscuro/claro y configuración remota a través de Firebase.

Esta documentación técnica está destinada a desarrolladores que necesiten trabajar en el proyecto, proporcionando una visión detallada de la arquitectura, tecnologías y patrones de diseño utilizados.

## Arquitectura de la Aplicación

La aplicación sigue una arquitectura limpia (Clean Architecture) con separación clara de responsabilidades, organizada en las siguientes capas:

### Capas Arquitectónicas

1. **Presentation Layer** (`src/app/presentation/`): Componentes de interfaz de usuario, páginas y componentes compartidos.
2. **Use Cases Layer** (`src/app/core/use-cases/`): Lógica de negocio y casos de uso de la aplicación.
3. **Core Layer** (`src/app/core/`): Modelos de datos, interfaces, tokens de inyección de dependencias y servicios transversales.
4. **Data Layer** (`src/app/data/`): Repositorios y servicios de acceso a datos.

### Principios Arquitectónicos

- **Dependency Inversion**: Uso de tokens de inyección de dependencias para desacoplar interfaces de implementaciones.
- **Single Responsibility**: Cada clase tiene una única responsabilidad.
- **Open/Closed**: Las clases están abiertas a extensión pero cerradas a modificación.
- **Liskov Substitution**: Las implementaciones pueden ser sustituidas por sus interfaces.
- **Interface Segregation**: Interfaces específicas para cada repositorio.

## Tecnologías Utilizadas

### Framework y Lenguajes
- **Angular 20**: Framework principal para el desarrollo de la aplicación.
- **TypeScript**: Lenguaje de programación con tipado estático.
- **Ionic 8**: Framework para desarrollo de aplicaciones móviles híbridas.

### Plataformas Móviles
- **Capacitor**: Runtime para aplicaciones híbridas que permite acceso nativo.
- **Cordova**: Plataforma para construir aplicaciones móviles con HTML, CSS y JavaScript.

### Servicios Backend
- **Firebase**: Plataforma de Google para backend como servicio.
  - **Firebase Remote Config**: Configuración remota de features.
  - **Firebase Hosting**: Hosting de la aplicación web (opcional).

### Gestión de Estado y Reactividad
- **Signals**: Sistema de señales de Angular para gestión reactiva de estado.
- **RxJS**: Biblioteca para programación reactiva (usada en algunos servicios).

### Almacenamiento
- **LocalStorage**: Almacenamiento local persistente del navegador/dispositivo.

### Herramientas de Desarrollo
- **Angular CLI**: Herramientas de línea de comandos para Angular.
- **Ionic CLI**: Herramientas de línea de comandos para Ionic.
- **ESLint**: Linting y formateo de código.
- **Karma + Jasmine**: Framework de testing.

## Estructura del Proyecto

```
src/
├── app/
│   ├── core/                    # Capa central de la aplicación
│   │   ├── interfaces/          # Interfaces de repositorios
│   │   ├── models/              # Modelos de datos
│   │   ├── services/            # Servicios transversales
│   │   ├── tokens/              # Tokens de inyección de dependencias
│   │   └── use-cases/           # Casos de uso
│   ├── data/                    # Capa de acceso a datos
│   │   ├── repositories/        # Implementaciones de repositorios
│   │   └── services/            # Servicios de infraestructura
│   ├── presentation/            # Capa de presentación
│   │   ├── pages/               # Páginas de la aplicación
│   │   └── shared/              # Componentes compartidos
│   ├── home/                    # Página de inicio (redirige a tasks)
│   ├── app.config.ts            # Configuración de Angular
│   ├── app.routes.ts            # Definición de rutas
│   └── app.component.*          # Componente raíz
├── environments/                # Configuraciones por entorno
├── theme/                       # Tema global de la aplicación
├── assets/                      # Recursos estáticos
├── index.html                   # Punto de entrada HTML
└── main.ts                      # Punto de entrada TypeScript
```

## Configuración y Dependencias

### Archivo `package.json`

Las dependencias principales incluyen:

```json
{
  "@angular/core": "^20.0.0",
  "@ionic/angular": "^8.0.0",
  "@angular/fire": "^20.0.1",
  "firebase": "^11.10.0",
  "@capacitor/core": "8.1.0"
}
```

### Configuración de Angular (`app.config.ts`)

La configuración incluye:
- Proveedores de Ionic
- Configuración de rutas con preload de módulos
- Inyección de dependencias para repositorios usando tokens

### Configuración de Ionic (`ionic.config.json`)

```json
{
  "name": "smart-tasks",
  "integrations": {
    "capacitor": {}
  },
  "type": "angular-standalone"
}
```

## Servicios y Repositorios

### Repositorios

Los repositorios implementan interfaces definidas en `core/interfaces/` y proporcionan acceso a datos:

- **TaskRepository**: Gestiona operaciones CRUD de tareas
- **CategoryRepository**: Gestiona operaciones CRUD de categorías

Ambos repositorios usan `StorageService` para persistencia local.

### Servicios Transversales

- **StorageService**: Abstracción sobre localStorage con prefijo de aplicación
- **RemoteConfigService**: Integración con Firebase Remote Config
- **ThemeService**: Gestión del modo oscuro/claro

## Use Cases

Los casos de uso encapsulan la lógica de negocio y se organizan por entidad:

### Task Use Cases
- `GetTasksUseCase`: Obtener todas las tareas
- `CreateTaskUseCase`: Crear nueva tarea
- `UpdateTaskUseCase`: Actualizar tarea existente
- `DeleteTaskUseCase`: Eliminar tarea

### Category Use Cases
- `GetCategoriesUseCase`: Obtener todas las categorías
- `CreateCategoryUseCase`: Crear nueva categoría
- `UpdateCategoryUseCase`: Actualizar categoría
- `DeleteCategoryUseCase`: Eliminar categoría

## Componentes de Presentación

### Páginas

- **TasksPage**: Página principal con lista de tareas, filtros y acciones
- **CategoriesPage**: Página de gestión de categorías

### Componentes Compartidos

- **TaskModalComponent**: Modal para crear/editar tareas
- **CategoryModalComponent**: Modal para crear/editar categorías

### Características de UI

- Diseño responsivo con Ionic components
- Soporte completo para modo oscuro/claro
- Animaciones y transiciones nativas de Ionic
- Toast y alertas para feedback de usuario

## Gestión de Estado

La aplicación utiliza **Angular Signals** para gestión reactiva de estado:

```typescript
// Señales para estado reactivo
tasks = signal<Task[]>([]);
categories = signal<Category[]>([]);
selectedCategoryFilter = signal<string | null>(null);
searchQuery = signal('');

// Señales computadas para filtrado reactivo
filteredTasks = computed(() => {
  let filtered = this.tasks();
  // Lógica de filtrado...
  return filtered;
});
```

Ventajas:
- Actualización automática de UI
- Optimización automática de cambios
- Limpieza automática en `ngOnDestroy`

## Persistencia de Datos

### Estrategia de Almacenamiento

- **LocalStorage** para persistencia local
- Datos serializados en JSON
- Prefijo `smart_tasks_` para evitar conflictos

### Estructura de Datos

```typescript
interface Task {
  id: string;
  title: string;
  description: string;
  completed: boolean;
  categoryId: string | null;
  createdAt: Date;
  updatedAt: Date;
}

interface Category {
  id: string;
  name: string;
  color: string;
  createdAt: Date;
  updatedAt: Date;
}
```

## Integración con Firebase

### Remote Config

- Configuración remota de features sin despliegue
- Feature flag `show_categories` para activar/desactivar módulo de categorías
- Actualización en tiempo real

```typescript
// Inicialización
async initialize(): Promise<void> {
  await fetchAndActivate(this.remoteConfig);
}

// Obtener valor
getShowCategories(): boolean {
  return getValue(this.remoteConfig, 'show_categories').asBoolean();
}
```

### Configuración de Firebase

Archivo `environment.ts`:
```typescript
export const environment = {
  firebase: {
    apiKey: "...",
    authDomain: "...",
    projectId: "...",
    // ...
  }
};
```

## Optimizaciones de Rendimiento

### Lazy Loading
- Módulos cargados bajo demanda
- Reducción del bundle inicial

### Gestión Eficiente de Estado
- Signals computadas para filtrado sin recálculos innecesarios
- Map para búsqueda O(1) en categorías

### Optimizaciones de Build
- Tree-shaking automático
- Minificación y compresión
- Source maps para debugging

### Limpieza de Memoria
- `ngOnDestroy` con limpieza de signals
- Cancelación de suscripciones RxJS

## Guía de Desarrollo

### Configuración del Entorno

1. Instalar dependencias:
```bash
npm install
```

2. Instalar Ionic CLI globalmente:
```bash
npm install -g @ionic/cli
```

3. Ejecutar en desarrollo:
```bash
npm start
# o
ionic serve
```

### Comandos Útiles

```bash
# Build para producción
npm run build

# Ejecutar tests
npm test

# Linting
npm run lint

# Build para plataformas móviles
ionic capacitor build android
ionic capacitor build ios
```

### Estructura de Commits

- `feat:` Nuevas funcionalidades
- `fix:` Corrección de bugs
- `docs:` Cambios en documentación
- `style:` Cambios de estilo
- `refactor:` Refactorización de código
- `test:` Cambios en tests

### Convenciones de Código

- **TypeScript**: Tipado estricto, interfaces para DTOs
- **Nombres**: PascalCase para clases, camelCase para variables
- **Imports**: Agrupados por Angular, Ionic, terceros, locales
- **Signals**: Preferidos sobre BehaviorSubject para estado local

## Despliegue

### Web
```bash
npm run build
# Desplegar dist/ a hosting (Firebase, Vercel, etc.)
```

### Móvil

1. Build web:
```bash
npm run build
```

2. Sincronizar con Capacitor:
```bash
npx cap sync
```

3. Abrir en IDE nativo:
```bash
npx cap open android
npx cap open ios
```

### Variables de Entorno

- `environment.ts`: Desarrollo
- `environment.prod.ts`: Producción
- Configurar Firebase credentials por entorno

## Consideraciones de Seguridad

- Validación de entrada en DTOs
- Sanitización de datos de localStorage
- Configuración de Firebase con reglas de seguridad
- No almacenar datos sensibles en localStorage

## Testing

### Estrategia de Testing

- **Unit Tests**: Servicios, use cases, utilidades
- **Integration Tests**: Repositorios con StorageService
- **E2E Tests**: Flujos completos de usuario (futuro)

### Ejecución de Tests

```bash
# Tests unitarios
npm test

# Coverage
npm test -- --code-coverage
```

## Mantenimiento y Evolución

### Deuda Técnica
- Migración gradual a Angular Signals completa
- Implementación de tests E2E
- Optimización de bundle size

### Escalabilidad
- Arquitectura modular facilita agregar nuevas features
- Separación de capas permite cambiar implementaciones
- Lazy loading soporta crecimiento de la aplicación

### Monitoreo
- Logging de errores en consola
- Firebase Analytics para métricas de uso
- Remote Config para feature flags

---

Esta documentación debe mantenerse actualizada con cualquier cambio significativo en la arquitectura o tecnologías utilizadas.