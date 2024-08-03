import { NgModule } from '@angular/core';
import {
  RouterModule,
  Routes,
} from '@angular/router';

import { AdminComponent } from './Components/admin/admin.component';
import { DeliveryComponent } from './Components/delivery/delivery.component';
import { DriverComponent } from './Components/driver/driver.component';
import { HomeComponent } from './Components/home/home.component';
import { LoginComponent } from './Components/login/login.component';
import { PackageComponent } from './Components/package/package.component';
import { RegisterComponent } from './Components/register/register.component';
import { TrackerComponent } from './Components/tracker/tracker.component';
import { UserComponent } from './Components/user/user.component';
import { AuthGuard } from './Guards/auth.guard';
import { SecureInnerPagesGuard } from './Guards/secure-inner-pages.guard';

const routes: Routes = [
  {
    path: 'signin',
    component: LoginComponent,
    canActivate: [SecureInnerPagesGuard],
  },
  {
    path: 'signup',
    component: RegisterComponent,
    canActivate: [SecureInnerPagesGuard],
  },
  {
    path: 'user',
    component: UserComponent,
    canActivate: [AuthGuard],
    data: {
      role: ['customer', 'admin', 'driver'],
    },
  },
  {
    path: 'package',
    component: PackageComponent,
    canActivate: [AuthGuard],
    data: {
      role: ['customer', 'admin'],
    },
  },
  {
    path: 'delivery',
    component: DeliveryComponent,
    canActivate: [AuthGuard],
    data: {
      role: ['driver', 'admin'],
    },
  },
  {
    path: 'driver',
    component: DriverComponent,
    canActivate: [AuthGuard],
    data: {
      role: ['driver', 'admin'],
    },
  },
  {
    path: 'tracker',
    component: TrackerComponent,
    canActivate: [AuthGuard],
    data: {
      role: ['customer', 'admin'],
    },
  },
  {
    path: 'admin',
    component: AdminComponent,
    canActivate: [AuthGuard],
    data: {
      role: ['admin'],
    },
  },

  { path: 'home', component: HomeComponent },
  { path: '', redirectTo: '/home', pathMatch: 'full' }, // redirect to Home component on root path
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
