import { Routes } from '@angular/router';
import { LoginComponent } from './auth/login/login.component';
import { AuthGuard } from './core/guards/auth.guard';
import { HomeComponent } from './pages/home/home.component';

export const routes: Routes = [
    {   path: 'login', 
        component: LoginComponent 
    },
    {   path: '', 
        redirectTo: 'login', 
        pathMatch: 'full' 
    },
    { 
        path: 'home',
        component: HomeComponent, 
        canActivate: [AuthGuard] 
    },
];
