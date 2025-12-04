# Angular Integration Guide

Integrate Next-Gen Build Tool with Angular applications for faster builds.

## Supported Versions

- Angular 14+
- Angular CLI 14+
- Standalone components (Angular 15+)

## Installation

```bash
npm install -D @nextgen/build-tool
```

## Basic Configuration

Create `nextgen.build.ts`:

```typescript
import { defineConfig } from '@nextgen/build-tool'

export default defineConfig({
  pipeline: [
    {
      type: 'resolver',
      config: {
        baseUrl: './src',
        extensions: ['.ts', '.html', '.scss', '.css'],
        alias: {
          '@app': './src/app',
          '@environments': './src/environments',
        },
      },
    },
    {
      type: 'transformer',
      config: {
        loader: 'esbuild',
        target: 'es2020',
        tsx: false, // Angular uses decorators, not JSX
      },
    },
    {
      type: 'bundler',
      config: {
        format: 'esm',
        splitting: true,
      },
    },
    {
      type: 'optimizer',
      config: {
        minify: true,
        sourcemap: true,
        treeShaking: true,
      },
    },
    {
      type: 'plugin',
      config: {
        plugins: ['@nextgen/plugin-angular'],
      },
    },
  ],

  output: {
    dir: 'dist',
  },

  server: {
    port: 4200,
  },
})
```

## Angular Plugin

```bash
npm install -D @nextgen/plugin-angular
```

Handles:
- TypeScript compilation with decorators
- Template compilation
- Style processing (CSS/SCSS/Less)
- AOT (Ahead-of-Time) compilation

## Project Structure

```
my-angular-app/
├── src/
│   ├── app/
│   │   ├── app.component.ts
│   │   ├── app.component.html
│   │   ├── app.component.scss
│   │   └── app.module.ts
│   ├── environments/
│   ├── main.ts
│   └── index.html
├── package.json
├── tsconfig.json
└── nexten.build.ts
```

## Example Files

### main.ts

```typescript
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic'
import { AppModule } from './app/app.module'

platformBrowserDynamic()
  .bootstrapModule(AppModule)
  .catch(err => console.error(err))
```

### app.module.ts

```typescript
import { NgModule } from '@angular/core'
import { BrowserModule } from '@angular/platform-browser'
import { AppComponent } from './app.component'

@NgModule({
  declarations: [AppComponent],
  imports: [BrowserModule],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
```

### app.component.ts

```typescript
import { Component } from '@angular/core'

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'my-angular-app'
  count = 0

  increment() {
    this.count++
  }
}
```

### app.component.html

```html
<div class="container">
  <h1>{{ title }}</h1>
  <p>Count: {{ count }}</p>
  <button (click)="increment()">Increment</button>
</div>
```

## Standalone Components (Angular 15+)

```typescript
import { Component } from '@angular/core'
import { CommonModule } from '@angular/common'

@Component({
  selector: 'app-counter',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div>
      <p>Count: {{ count }}</p>
      <button (click)="increment()">+</button>
    </div>
  `,
  styles: [`
    div {
      padding: 20px;
      border: 1px solid #ccc;
    }
  `]
})
export class CounterComponent {
  count = 0

  increment() {
    this.count++
  }
}
```

Bootstrap standalone app:

```typescript
// main.ts
import { bootstrapApplication } from '@angular/platform-browser'
import { AppComponent } from './app/app.component'

bootstrapApplication(AppComponent)
```

## Services

```typescript
import { Injectable } from '@angular/core'

@Injectable({
  providedIn: 'root'
})
export class DataService {
  private data: any[] = []

  getData() {
    return this.data
  }

  addData(item: any) {
    this.data.push(item)
  }
}
```

Use in component:

```typescript
import { Component } from '@angular/core'
import { DataService } from './data.service'

@Component({
  selector: 'app-list',
  template: `
    <ul>
      <li *ngFor="let item of items">{{ item }}</li>
    </ul>
  `
})
export class ListComponent {
  items: any[]

  constructor(private dataService: DataService) {
    this.items = this.dataService.getData()
  }
}
```

## Routing

Install router:

```bash
npm install @angular/router
```

Create `app-routing.module.ts`:

```typescript
import { NgModule } from '@angular/core'
import { RouterModule, Routes } from '@angular/router'
import { HomeComponent } from './home/home.component'
import { AboutComponent } from './about/about.component'

const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'about', component: AboutComponent },
  { 
    path: 'lazy',
    loadChildren: () => import('./lazy/lazy.module').then(m => m.LazyModule)
  }
]

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
```

## RxJS

```typescript
import { Component, OnInit } from '@angular/core'
import { Observable, interval } from 'rxjs'
import { map, take } from 'rxjs/operators'

@Component({
  selector: 'app-timer',
  template: `<p>Timer: {{ time$ | async }}</p>`
})
export class TimerComponent implements OnInit {
  time$!: Observable<number>

  ngOnInit() {
    this.time$ = interval(1000).pipe(
      take(10),
      map(n => n + 1)
    )
  }
}
```

## Forms

### Template-driven

```typescript
import { Component } from '@angular/core'
import { FormsModule } from '@angular/forms'

@Component({
  selector: 'app-form',
  standalone: true,
  imports: [FormsModule],
  template: `
    <form #myForm="ngForm" (ngSubmit)="onSubmit(myForm.value)">
      <input
        name="name"
        [(ngModel)]="model.name"
        required
      />
      <button type="submit">Submit</button>
    </form>
  `
})
export class FormComponent {
  model = { name: '' }

  onSubmit(value: any) {
    console.log(value)
  }
}
```

### Reactive Forms

```typescript
import { Component } from '@angular/core'
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms'

@Component({
  selector: 'app-reactive-form',
  standalone: true,
  imports: [ReactiveFormsModule],
  template: `
    <form [formGroup]="form" (ngSubmit)="onSubmit()">
      <input formControlName="email" />
      <button type="submit" [disabled]="form.invalid">
        Submit
      </button>
    </form>
  `
})
export class ReactiveFormComponent {
  form = this.fb.group({
    email: ['', [Validators.required, Validators.email]]
  })

  constructor(private fb: FormBuilder) {}

  onSubmit() {
    console.log(this.form.value)
  }
}
```

## SCSS Support

The Angular plugin automatically handles SCSS:

```scss
// app.component.scss
$primary-color: #3f51b5;

.container {
  padding: 20px;
  background: $primary-color;

  h1 {
    color: white;
  }
}
```

## Performance Tips

### 1. Lazy Loading

```typescript
{
  path: 'feature',
  loadChildren: () => import('./feature/feature.module')
    .then(m => m.FeatureModule)
}
```

### 2. OnPush Change Detection

```typescript
import { ChangeDetectionStrategy } from '@angular/core'

@Component({
  selector: 'app-optimized',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `...`
})
export class OptimizedComponent { }
```

### 3. TrackBy in ngFor

```typescript
trackById(index: number, item: any) {
  return item.id
}
```

```html
<div *ngFor="let item of items; trackBy: trackById">
  {{ item.name }}
</div>
```

## Migration from Angular CLI

1. Install Next-Gen Build Tool
2. Create `nextgen.build.ts`
3. Update `package.json`:

```json
{
  "scripts": {
    "dev": "nextgen dev",
    "build": "nextgen build",
    "test": "nextgen test"
  }
}
```

4. Remove `angular.json`

## Common Issues

### Decorators not working

Ensure TypeScript config has:

```json
{
  "compilerOptions": {
    "experimentalDecorators": true,
    "emitDecoratorMetadata": true
  }
}
```

### Templates not compiling

Install Angular plugin:

```bash
npm install -D @nextgen/plugin-angular
```

### Zone.js errors

Make sure zone.js is imported in `main.ts`:

```typescript
import 'zone.js'
```

## Next Steps

- [Build your first app](/docs/tutorials/first-pipeline)
- [Explore Angular docs](https://angular.io/docs)
- [Optimize builds](/docs/tutorials/optimization)

---

**Questions?** Join [Discord](https://discord.gg/nextgen) or check [FAQ](/docs/faq).
