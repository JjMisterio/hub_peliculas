import { Routes } from '@angular/router';
import { LoginComponent } from '@auth/login/login.component';
import { RegisterComponent } from '@auth/register/register.component';
import { AuthGuard } from '@core/guards/auth.guard';
import { HomeComponent } from './pages/home/home.component';
import { TitleDetailComponent } from './pages/title-detail/title-detail.component';

export const routes: Routes = [
    {   path: 'login', 
        component: LoginComponent 
    },
    {   path: '', 
        redirectTo: 'login', 
        pathMatch: 'full' 
    },
    {
        path: 'register',
        component: RegisterComponent
    },
    { 
        path: 'home',
        component: HomeComponent, 
        canActivate: [AuthGuard] 
    },
    {
        path: 'title/:id',
        component: TitleDetailComponent,
        canActivate: [AuthGuard]
    },
];
