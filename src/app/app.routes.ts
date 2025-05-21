import { Routes } from '@angular/router';
import { LoginComponent } from '@auth/login/login.component';
import { AuthGuard } from '@core/guards/auth.guard';
import { HomeComponent } from './pages/home/home.component';

/**
 * Configuración de rutas de la aplicación
 * Implementa lazy loading para optimizar el rendimiento inicial
 */
export const routes: Routes = [
    {   
        path: 'login', 
        component: LoginComponent 
    },
    {   
        path: '', 
        redirectTo: 'login', 
        pathMatch: 'full' 
    },
    {
        path: 'register',
        loadComponent: () => import('./auth/register/register.component').then(m => m.RegisterComponent)
    },
    { 
        path: 'home',
        component: HomeComponent, 
        canActivate: [AuthGuard] 
    },
    {
        path: 'title/:id',
        loadComponent: () => import('./pages/title-detail/title-detail.component').then(m => m.TitleDetailComponent),
        canActivate: [AuthGuard]
    },
];
