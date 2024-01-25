import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, NavigationEnd, Router, Event as RouterEvent } from '@angular/router';
import { filter } from 'rxjs';

@Component({
  selector: 'app-admin-layout',
  templateUrl: './admin-layout.component.html',
  styleUrls: ['./admin-layout.component.css']
})
export class AdminLayoutComponent implements OnInit {
  isOpen = false;
currentUrl:any;
outurl:any;
  toggleSidebar() {
    this.isOpen = !this.isOpen;
  }
  constructor( private route:ActivatedRoute,private router:Router) { 
   
    this.router.events
      .pipe(filter((event: RouterEvent): event is NavigationEnd => event instanceof NavigationEnd))
      .subscribe((event: NavigationEnd) => {
        this.currentUrl = event.url;
        // console.log(this.currentUrl)
        this.dourl(this.currentUrl)
      });
      
  }
dourl(cur:any){
switch(cur){
  case "/editdetails": this.outurl="Edit Student";break
  case "/Addexam": this.outurl="Create Exam";break
  case "/AddStudent": this.outurl="Create Student";break
  case "/admin-dash": this.outurl="Dashboard";break
}
}
  ngOnInit() {
    console.log(this.route.snapshot)
    this.route.params.subscribe(function(data:any){
      console.log(data)

    })
  }

  logout(){
    localStorage.removeItem("uid")
    localStorage.removeItem("token")
     this.router.navigateByUrl('login');
  }

}
