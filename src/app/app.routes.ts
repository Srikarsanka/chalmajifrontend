import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    title: 'Chalamaji Infra Projects | Luxury Real Estate & Plotted Developments in Visakhapatnam',
    loadComponent: () => import('./pages/home/home.component').then(m => m.HomeComponent)
  },
  {
    path: 'about',
    title: 'About Us | 35+ Years of Architectural Excellence | Chalamaji Infra',
    loadComponent: () => import('./pages/about/about.component').then(m => m.AboutComponent)
  },
  {
    path: 'projects',
    title: 'Our Projects | Luxury Coastal Residences & Plotted Layouts | Chalamaji Infra',
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
    title: 'Project Portfolio | Chalamaji Infra Projects',
    loadComponent: () => import('./pages/project-detail/project-detail').then(m => m.ProjectDetailComponent)
  },
  {
    path: 'connect',
    title: 'Connect & Inquire | Pandurangapuram Headquarters | Chalamaji Infra',
    loadComponent: () => import('./pages/connect/connect.component').then(m => m.ConnectComponent)
  },
  {
    path: 'admin',
    title: 'Admin Management Portal | Chalamaji Infra',
    loadComponent: () => import('./pages/admin/admin.component').then(m => m.AdminComponent)
  },
  {
    path: '**',
    loadComponent: () => import('./pages/not-found/not-found.component').then(m => m.NotFoundComponent)
  }
];
