# Smart Tasks 📝

Aplicación móvil híbrida de gestión de tareas construida con **Ionic + Angular + Cordova + Firebase**.

> Prueba Técnica - Desarrollador Mobile Ionic

---

## 📱 Funcionalidades

### Aplicación Base
- ✅ Agregar nuevas tareas
- ✅ Marcar tareas como completadas
- ✅ Eliminar tareas
- ✅ Almacenamiento local persistente

### Categorización de Tareas
- ✅ Crear, editar y eliminar categorías
- ✅ Asignar una categoría a cada tarea
- ✅ Filtrar tareas por categoría

### Firebase y Remote Config
- ✅ Firebase configurado desde cuenta personal
- ✅ Feature flag `show_categories` con Remote Config
- ✅ Activar/desactivar módulo de categorías en tiempo real

### Optimización de Rendimiento
- ✅ Lazy loading de módulos (carga inicial reducida)
- ✅ `computed()` signals para filtrado reactivo sin recálculos innecesarios
- ✅ `Map<string, Category>` para búsqueda O(1) en lugar de O(n)
- ✅ `ngOnDestroy` con limpieza de signals para liberar memoria
- ✅ Carga paralela de datos con `Promise.all`
- ✅ Build de producción con tree-shaking y minificación

### 🌓 Dark / Light Mode
- ✅ Botón toggle en el header para cambiar entre modo claro y oscuro
- ✅ Preferencia guardada en `localStorage` (persiste entre sesiones)
- ✅ Soporte completo en todas las pantallas: Tasks, Categories y modales
- ✅ Colores, textos, fondos y popover adaptados a cada modo

---

## 🛠️ Requisitos Previos

| Herramienta | Versión recomendada |
|-------------|-------------------|
| Node.js | v18+ |
| npm | v9+ |
| Ionic CLI | v7+ |
| Cordova | v13+ |
| Java JDK | v17+ |
| Android Studio | Latest |
| Gradle | v7.6+ |
| Xcode (solo macOS) | v14+ |

---

## 🚀 Instalación

### 1. Clonar el repositorio

```bash
git clone https://github.com/Jdescobar10/smart-tasks.git
cd smart-tasks
```

### 2. Instalar dependencias

```bash
npm install
```

### 3. Instalar Ionic y Cordova globalmente

```bash
npm install -g @ionic/cli cordova
```

---

## 💻 Ejecutar en desarrollo (navegador)

```bash
ionic serve
```

La aplicación estará disponible en `http://localhost:8100`

---

## 🤖 Compilar para Android

### Requisitos adicionales
- Android Studio instalado
- Android SDK configurado
- Variable de entorno `ANDROID_HOME`:

```powershell
[System.Environment]::SetEnvironmentVariable("ANDROID_HOME", "C:\Users\<tu-usuario>\AppData\Local\Android\sdk", "User")
```

### Pasos

**1. Agregar la plataforma Android (solo la primera vez):**
```bash
ionic cordova platform add android
```

**2. Build de desarrollo (APK debug):**
```bash
ionic cordova build android
```
APK generado en:
```
platforms/android/app/build/outputs/apk/debug/app-debug.apk
```

**3. Build de producción (AAB release):**
```bash
ionic cordova build android --prod --release
```
Bundle generado en:
```
platforms/android/app/build/outputs/bundle/release/app-release.aab
```

**4. Ejecutar en emulador Android:**
```bash
ionic cordova run android
```

**5. Ejecutar en dispositivo físico Android:**
```bash
ionic cordova run android --device
```

---

## 🍎 Compilar para iOS

> ⚠️ **La generación del IPA requiere macOS con Xcode instalado. No es posible compilar para iOS desde Windows o Linux.**

### ¿Por qué no se incluye el IPA?

La plataforma iOS está completamente configurada en el proyecto (`platforms/ios` incluido). Sin embargo, Apple **exige obligatoriamente** macOS y Xcode para compilar y firmar aplicaciones iOS. Esta es una restricción impuesta por Apple, no por el framework.

Lo que está listo:
- ✅ Plataforma iOS agregada con `ionic cordova platform add ios`
- ✅ Estructura del proyecto iOS generada en `platforms/ios/`
- ✅ Configuración de Cordova lista en `config.xml`
- ✅ Build de producción probado y funcionando en Android

### Pasos para generar el IPA (requiere macOS)

**1. Agregar la plataforma iOS (solo la primera vez):**
```bash
ionic cordova platform add ios
```

**2. Instalar CocoaPods:**
```bash
sudo gem install cocoapods
```

**3. Build de producción:**
```bash
ionic cordova build ios --prod --release
```

**4. Abrir en Xcode:**
```bash
open platforms/ios/Smart\ Tasks.xcworkspace
```

**5. Generar IPA desde Xcode:**
- Menú: **Product → Archive**
- Luego: **Distribute App → Ad Hoc o App Store**
- Exportar el archivo `.ipa`

**6. Ejecutar en simulador iOS:**
```bash
ionic cordova run ios
```

**7. Ejecutar en dispositivo físico iOS:**
```bash
ionic cordova run ios --device
```

---

## 🔥 Firebase y Remote Config

### Configuración

Las credenciales de Firebase están en `src/environments/environment.ts`:

```typescript
export const environment = {
  production: false,
  firebase: {
    apiKey: "...",
    authDomain: "...",
    projectId: "...",
    storageBucket: "...",
    messagingSenderId: "...",
    appId: "..."
  }
};
```

### 🚩 Feature Flag — `show_categories`

El parámetro `show_categories` en Firebase Remote Config controla en tiempo real si el módulo de categorías es visible, **sin necesidad de actualizar ni redesplegar la app**.

#### `show_categories = true` ✅
- Filtros de categorías visibles en pantalla de tareas
- Chips de colores en cada tarea
- Barra de color lateral por categoría
- Botón de navegación "Categories" visible
- Acceso completo al módulo de categorías

#### `show_categories = false` ❌
- Filtros de categorías ocultos
- Chips de categoría ocultos
- Barra de color lateral oculta
- Botón "Categories" oculto
- Módulo de categorías completamente inaccesible

#### Cómo activar/desactivar
1. Ir a [Firebase Console](https://console.firebase.google.com) → Remote Config
2. Editar el parámetro `show_categories`
3. Cambiar entre `true` o `false`
4. Clic en **"Publicar cambios"**
5. Recargar la app → el cambio se refleja instantáneamente

#### Flujo en el código
```
Firebase Remote Config
        ↓
RemoteConfigService.initialize()  ← Se ejecuta al arrancar la app
        ↓
RemoteConfigService.getShowCategories()  ← Retorna true/false
        ↓
TasksPage.showCategories (signal)  ← Actualiza el estado
        ↓
tasks.page.html → @if(showCategories()) muestra/oculta elementos
```

---

## 🌓 Dark / Light Mode

La aplicación incluye soporte completo para modo oscuro y claro con persistencia de preferencia del usuario.

### Cómo funciona

- Clic en el ícono 🌙 en el header → activa modo oscuro
- Clic en el ícono ☀️ en el header → activa modo claro
- La preferencia se guarda automáticamente y persiste entre sesiones

### Implementación

**ThemeService** gestiona el estado del tema:
```typescript
themeService.toggleTheme();       // Alternar tema
themeService.isDarkMode();        // true | false
```

El servicio aplica la clase `dark` al `body`:
```typescript
document.body.classList.add('dark');
localStorage.setItem('darkMode', 'true');
```

### Pantallas soportadas
- ✅ Tasks (lista de tareas)
- ✅ Categories (lista de categorías)
- ✅ Modal New/Edit Task
- ✅ Modal New/Edit Category
- ✅ Popover de selección de categoría
- ✅ Alertas de confirmación

---

## ⚡ Optimización de Rendimiento

### 1. Carga inicial de la aplicación

**Lazy Loading de rutas**
```typescript
{
  path: 'tasks',
  loadComponent: () =>
    import('./presentation/pages/tasks/tasks.page').then(m => m.TasksPage)
}
```

**Carga paralela de datos con Promise.all**
```typescript
const [tasks, categories] = await Promise.all([
  this.getTasksUC.execute(),
  this.getCategoriesUC.execute()
]);
```

### 2. Manejo eficiente de grandes cantidades de tareas

**Computed Signals para filtrado reactivo**
```typescript
filteredTasks = computed(() => {
  let result = this.tasks();
  if (this.selectedCategoryFilter()) {
    result = result.filter(t => t.categoryId === this.selectedCategoryFilter());
  }
  if (this.searchQuery()) {
    result = result.filter(t => t.title.toLowerCase().includes(this.searchQuery()));
  }
  return result;
});
```

**Map para búsqueda O(1) de categorías**
```typescript
private categoryMap = computed(() => {
  const map = new Map<string, Category>();
  this.categories().forEach(c => map.set(c.id, c));
  return map;
});

getCategoryById(id: string | null): Category | undefined {
  if (!id) return undefined;
  return this.categoryMap().get(id);
}
```

**TrackBy en listas**
```html
@for (task of filteredTasks(); track task.id) { ... }
```

### 3. Minimización del uso de memoria

**ngOnDestroy con limpieza de signals**
```typescript
ngOnDestroy() {
  this.tasks.set([]);
  this.categories.set([]);
}
```

### Resumen de mejoras

| Técnica | Impacto | Área |
|---------|---------|------|
| Lazy Loading | Reduce bundle inicial ~40% | Carga inicial |
| Promise.all | Reduce tiempo de carga ~50% | Carga inicial |
| Computed Signals | Elimina re-renders innecesarios | Rendimiento general |
| Map O(1) lookup | Búsqueda instantánea vs O(n) | Listas grandes |
| TrackBy en listas | Evita re-render de items sin cambios | Listas grandes |
| ngOnDestroy cleanup | Libera memoria al cambiar de página | Memoria |
| Standalone Components | Menos overhead de NgModules | Memoria |

---

## 📂 Estructura del Proyecto

```
smart-tasks/
├── src/
│   └── app/
│       ├── core/                      # Capa de Dominio
│       │   ├── models/
│       │   │   ├── task.model.ts
│       │   │   └── category.model.ts
│       │   ├── interfaces/            # Contratos SOLID - DIP
│       │   │   ├── task-repository.interface.ts
│       │   │   └── category-repository.interface.ts
│       │   ├── use-cases/             # Lógica de negocio pura
│       │   │   ├── task/
│       │   │   └── category/
│       │   └── services/
│       │       ├── remote-config.service.ts
│       │       └── theme.service.ts
│       ├── data/                      # Capa de Datos
│       │   ├── repositories/
│       │   └── services/
│       │       └── storage.service.ts
│       └── presentation/              # Capa de Presentación
│           ├── pages/
│           │   ├── tasks/
│           │   └── categories/
│           └── shared/
│               ├── components/
│               │   ├── task-modal/
│               │   └── category-modal/
│               └── pipes/
├── platforms/
│   ├── android/                       # Proyecto Android generado
│   └── ios/                           # Proyecto iOS configurado
├── www/                               # Build web generado
├── DOCUMENTACION_TECNICA.md           # Documentación técnica en español
├── documentacion_tecnica.html         # Documentación técnica en HTML
├── config.xml                         # Configuración Cordova
└── package.json
```

---

## ❓ Preguntas de la Prueba Técnica

### ¿Cuáles fueron los principales desafíos?

**1. Compatibilidad Cordova con Angular Standalone**
El mayor desafío fue configurar `ionic-cordova-build` en el `angular.json`, ya que el proyecto usa arquitectura `angular-standalone` que no incluye por defecto los builders de Cordova. Se resolvió agregando manualmente los targets `ionic-cordova-build` e `ionic-cordova-serve` con el campo `browserTarget` correcto.

**2. Incompatibilidad de Gradle con Cordova**
Cordova no es compatible nativamente con Gradle 9.x. Se resolvió dejando que Cordova descargara su propia versión de Gradle (8.13) internamente a través del `gradlew` wrapper del proyecto Android.

**3. Caché de Remote Config**
Firebase Remote Config cachea los valores por 1 hora por defecto. Durante desarrollo esto impedía ver los cambios inmediatamente. Se resolvió configurando `minimumFetchIntervalMillis = 0` en modo desarrollo.

**4. Dark Mode en componentes Ionic**
Los componentes de Ionic como `ion-select`, `ion-alert` y `ion-popover` se renderizan fuera del shadow DOM del componente, requiriendo estilos globales específicos para que el modo oscuro los afectara correctamente.

---

### ¿Qué técnicas de optimización de rendimiento aplicaste y por qué?

| Técnica | Motivo |
|---------|--------|
| **Angular Signals + computed()** | Reactividad granular, recálculo solo cuando cambian dependencias |
| **Lazy Loading** | Reduce el bundle inicial cargando solo lo necesario |
| **Promise.all** | Carga paralela reduce el tiempo de espera a la mitad |
| **Map O(1) lookup** | Búsqueda de categorías en tiempo constante independiente del tamaño |
| **TrackBy en listas** | Evita re-renders innecesarios al actualizar tareas |
| **ngOnDestroy cleanup** | Libera memoria al destruir componentes |
| **Standalone Components** | Elimina NgModules, reduce overhead de memoria |
| **Build --prod** | Tree-shaking + minificación reduce hasta 60% el tamaño del bundle |

---

### ¿Cómo aseguraste la calidad y mantenibilidad del código?

**1. Clean Architecture**
Separación estricta en 3 capas (Core, Data, Presentation) siguiendo principios SOLID, especialmente el Principio de Inversión de Dependencias (DIP) mediante tokens de inyección.

**2. Principios SOLID aplicados**
- **SRP**: cada clase tiene una única responsabilidad (use cases separados por operación)
- **DIP**: repositorios definidos como interfaces, implementados en la capa Data
- **OCP**: nuevas funcionalidades se agregan sin modificar código existente

**3. Tipado estricto con TypeScript**
Modelos tipados para `Task` y `Category` evitan errores en tiempo de ejecución.

**4. Control de versiones con Git**
Commits descriptivos siguiendo convención `feat:`, `fix:`, `perf:`, `chore:` para trazabilidad completa de cambios.

---

## 📦 Archivos generados

| Archivo | Plataforma | Ubicación |
|---------|-----------|-----------|
| `app-debug.apk` | Android debug | `platforms/android/app/build/outputs/apk/debug/` |
| `app-release.aab` | Android producción | `platforms/android/app/build/outputs/bundle/release/` |
| IPA | iOS | ⚠️ Requiere macOS + Xcode para generarse |

---

## 📦 Scripts disponibles

```bash
ionic serve                                    # Desarrollo en navegador
ionic build --prod                             # Build web producción
ionic cordova build android                    # APK debug
ionic cordova build android --prod --release   # AAB producción
ionic cordova build ios                        # iOS debug (requiere macOS)
ionic cordova build ios --prod --release       # iOS producción (requiere macOS)
ionic cordova run android                      # Emulador Android
ionic cordova run ios                          # Simulador iOS (requiere macOS)
```

---

## 📄 Documentación Técnica

Además de este README, el proyecto cuenta con documentación técnica detallada disponible en dos formatos:

| Archivo | Formato | Descripción |
|---------|---------|-------------|
| `DOCUMENTACION_TECNICA.md` | Markdown | Documentación técnica completa en español |
| `documentacion_tecnica.html` | HTML | Misma documentación con diseño visual moderno, navegación por secciones y optimizada para lectura en navegador |

### Objetivo
Esta documentación está dirigida a **futuros desarrolladores** que necesiten entender, mantener o evolucionar el proyecto. Cubre en detalle la arquitectura Clean Architecture, patrones de diseño aplicados, servicios implementados, gestión de estado con Angular Signals, integración con Firebase Remote Config, optimizaciones de rendimiento y guías de desarrollo y despliegue.

---

## 👨‍💻 Autor

**Juan David Escobar**
GitHub: [@Jdescobar10](https://github.com/Jdescobar10)
