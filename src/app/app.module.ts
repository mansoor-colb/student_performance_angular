import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { AddUserComponent } from './pages/add-user/add-user.component';

import { UserDashboardComponent } from './pages/user-dashboard/user-dashboard.component';
import { AdminDashboardComponent } from './pages/admin-dashboard/admin-dashboard.component';
import { LoginComponent } from './pages/login/login.component';
import { AdminLayoutComponent } from './pages/admin-layout/admin-layout.component';
import { UserLayoutComponent } from './pages/user-layout/user-layout.component';
import { FormsModule } from '@angular/forms';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { TabsComponent } from './reusable/tabs/tabs.component';
import { ExamComponent } from './pages/exam/exam.component';
import { DetailsComponent } from './pages/details/details.component';
import { ReactiveFormsModule } from '@angular/forms';
import { DisplaystudentComponent } from './pages/displaystudent/displaystudent.component';
import { EditdetailsComponent } from './pages/editdetails/editdetails.component';
import { NotfoundComponent } from './reusable/notfound/notfound.component';
import { AuthInterceptor } from './auth.interceptor';
import { LandingpageComponent } from './pages/landingpage/landingpage.component';


@NgModule({
  declarations: [
    AppComponent,
    AddUserComponent,
    // UserListComponent,
    UserDashboardComponent,
    AdminDashboardComponent,
    // RolesComponent,
    // EmployeeComponent,
    LoginComponent,
    AdminLayoutComponent,
    UserLayoutComponent,
    // HomeLayoutComponent,
    // VoidTableComponent,
    TabsComponent,
    // QuizAppComponent,
    // StepperCrudComponent,
    ExamComponent,
    DetailsComponent,
    DisplaystudentComponent,
    EditdetailsComponent,
    NotfoundComponent,
    LandingpageComponent,
  
    
    
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule
  ],
  providers: [{
    provide: HTTP_INTERCEPTORS,
    useClass: AuthInterceptor,
    multi: true,
  },],
  bootstrap: [AppComponent]
})
export class AppModule { }
