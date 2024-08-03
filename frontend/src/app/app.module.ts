import { HttpClientModule } from '@angular/common/http';
import {
  CUSTOM_ELEMENTS_SCHEMA,
  NgModule,
} from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { GoogleMapsModule } from '@angular/google-maps';
import {
  ErrorStateMatcher,
  ShowOnDirtyErrorStateMatcher,
} from '@angular/material/core';
import { MAT_SNACK_BAR_DEFAULT_OPTIONS } from '@angular/material/snack-bar';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import {
  SocketIoConfig,
  SocketIoModule,
} from 'ngx-socket-io';

import { JwtModule } from '@auth0/angular-jwt';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { AdminComponent } from './Components/admin/admin.component';
import { DeliveryComponent } from './Components/delivery/delivery.component';
import { DriverComponent } from './Components/driver/driver.component';
import { HomeComponent } from './Components/home/home.component';
import { LoginComponent } from './Components/login/login.component';
import { MapComponent } from './Components/map/map.component';
import { PackageComponent } from './Components/package/package.component';
import { PaginatorComponent } from './Components/paginator/paginator.component';
import { RegisterComponent } from './Components/register/register.component';
import { TrackerComponent } from './Components/tracker/tracker.component';
import { UserComponent } from './Components/user/user.component';
import { authInterceptorProviders } from './Interceptor/auth.interceptor';
import { MaterialModule } from './material.module';
import { AuthService } from './Services/auth.service';
import { DataService } from './Services/data.service';
import { DeliveryService } from './Services/delivery.service';
import { PackageService } from './Services/package.service';

export function tokenGetter() {
  return sessionStorage.getItem('TOKEN_KEY');
}

const config: SocketIoConfig = { url: 'http://localhost:3000', options: {} };
@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    RegisterComponent,
    UserComponent,
    AdminComponent,
    HomeComponent,
    PackageComponent,
    DeliveryComponent,
    PaginatorComponent,
    TrackerComponent,
    DriverComponent,
    MapComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    MaterialModule,
    ReactiveFormsModule,
    HttpClientModule,
    JwtModule.forRoot({
      config: {
        tokenGetter: tokenGetter,
        allowedDomains: ['localhost:3000'],
        disallowedRoutes: [],
      },
    }),
    GoogleMapsModule,
    SocketIoModule.forRoot(config),
  ],
  providers: [
    authInterceptorProviders,
    DataService,
    AuthService,
    DeliveryService,
    PackageService,
    { provide: MAT_SNACK_BAR_DEFAULT_OPTIONS, useValue: { duration: 3500 } },
    { provide: ErrorStateMatcher, useClass: ShowOnDirtyErrorStateMatcher },
  ],
  bootstrap: [AppComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class AppModule {}
