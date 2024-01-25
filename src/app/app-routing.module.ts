import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AddUserComponent } from './pages/add-user/add-user.component';
import { AdminDashboardComponent } from './pages/admin-dashboard/admin-dashboard.component';
import { AdminLayoutComponent } from './pages/admin-layout/admin-layout.component';
import { LoginComponent } from './pages/login/login.component';
import { UserDashboardComponent } from './pages/user-dashboard/user-dashboard.component';
import { UserLayoutComponent } from './pages/user-layout/user-layout.component';

import { ExamComponent } from './pages/exam/exam.component';
import { DetailsComponent } from './pages/details/details.component';
import { DisplaystudentComponent } from './pages/displaystudent/displaystudent.component';
import { EditdetailsComponent } from './pages/editdetails/editdetails.component';
import { AuthGuard } from './pages/auth.service';
import { TabsComponent } from './reusable/tabs/tabs.component';
import { NotfoundComponent } from './reusable/notfound/notfound.component';
import { LandingpageComponent } from './pages/landingpage/landingpage.component';
const routes: Routes = [



  {
    path: 'login',
    component: LoginComponent
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



    ]
  },

  {
    path: 'unauthorized',
    component: TabsComponent
  },
  {
    path: 'notfound',
    component: NotfoundComponent
  },
  {
    path: 'invalid/:msg',
    component: LandingpageComponent
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
