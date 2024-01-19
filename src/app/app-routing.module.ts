import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AddUserComponent } from './pages/add-user/add-user.component';
import { AdminDashboardComponent } from './pages/admin-dashboard/admin-dashboard.component';
import { AdminLayoutComponent } from './pages/admin-layout/admin-layout.component';
import { EmployeeComponent } from './pages/employee/employee.component';
import { HomeLayoutComponent } from './pages/home-layout/home-layout.component';
import { LoginComponent } from './pages/login/login.component';
import { RolesComponent } from './pages/roles/roles.component';
import { UserDashboardComponent } from './pages/user-dashboard/user-dashboard.component';
import { UserLayoutComponent } from './pages/user-layout/user-layout.component';
import { UserListComponent } from './pages/user-list/user-list.component';
import { QuizAppComponent } from './pages/quiz-app/quiz-app.component';
import { StepperCrudComponent } from './pages/stepper-crud.component/stepper-crud.component';
import { ExamComponent } from './pages/exam/exam.component';
import { DetailsComponent } from './pages/details/details.component';
import { DisplaystudentComponent } from './pages/displaystudent/displaystudent.component';
import { EditdetailsComponent } from './pages/editdetails/editdetails.component';
import { AuthGuard } from './pages/auth.service';
import { TabsComponent } from './reusable/tabs/tabs.component';
const routes: Routes = [
  {
    path: 'quizApp',
    component: QuizAppComponent
  },
  {
    path: 'newEmp',
    component: EmployeeComponent
  },
  {
    path: 'stepperCrud',
    component: StepperCrudComponent
  },
  {
    path: 'Courses',
    component: RolesComponent
  },
  {
    path: 'login',
    component: LoginComponent
  },
  {
    path: 'courses',
    component: RolesComponent
  },
  {
    path: '',
    redirectTo: '/login',
    pathMatch: 'full'
  },
  
 


  
  {
    path: '',
    component: AdminLayoutComponent,
    children: [
      {
        path: 'admin-dash',
        component: AdminDashboardComponent,
        canActivate: [AuthGuard]
      },
      {
        path: 'Addexam',
        component: ExamComponent,
        canActivate: [AuthGuard]
      },
      {
        path: 'editdetails',
        component: DetailsComponent,
        canActivate: [AuthGuard]
      },
      {
        path: 'displaydetails/:userid',
        component: DisplaystudentComponent,
        canActivate: [AuthGuard]
      },
      {
        path: 'editstudetails/:userid',
        component: EditdetailsComponent,
        canActivate: [AuthGuard]
      },
    
      {
        path: 'AddStudent',
        component: AddUserComponent,
        canActivate: [AuthGuard]
      }
    ]
  },
  {
    path: '',
    component: UserLayoutComponent,
    children: [
      {
        path: 'addUser',
        component: AddUserComponent
      },
      {
        path: 'user-dashboard/:userid',
        component: UserDashboardComponent
      },
      {
        path: 'user-list',
        component: UserListComponent
      },
            {
        path: 'unauthorized',
        component: TabsComponent
      },

    ]
  },
   {
    path: '**',
    redirectTo: '/login',
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
