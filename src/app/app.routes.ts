import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./pages/home/home.component').then(m => m.HomeComponent)
  },
  {
    path: 'about',
    loadComponent: () => import('./pages/about/about.component').then(m => m.AboutComponent)
  },
  {
    path: 'projects',
    loadComponent: () => import('./pages/projects/projects.component').then(m => m.ProjectsComponent)
  },
  {
    path: 'projects/ayodhara',
    redirectTo: 'projects/ayodhara-plotting',
    pathMatch: 'full'
  },
  {
    path: 'ayodhara',
    redirectTo: 'projects/ayodhara-plotting',
    pathMatch: 'full'
  },
  {
    path: 'projects/:id',
    loadComponent: () => import('./pages/project-detail/project-detail').then(m => m.ProjectDetailComponent)
  },
  {
    path: 'connect',
    loadComponent: () => import('./pages/connect/connect.component').then(m => m.ConnectComponent)
  },
  {
    path: 'admin',
    loadComponent: () => import('./pages/admin/admin.component').then(m => m.AdminComponent)
  },
  {
    path: '**',
    redirectTo: '',
    pathMatch: 'full'
  }
];
