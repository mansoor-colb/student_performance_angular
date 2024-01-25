import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-landingpage',
  templateUrl: './landingpage.component.html',
  styleUrls: ['./landingpage.component.css']
})
export class LandingpageComponent implements OnInit {
  sessionStatus: string = '';

  constructor(private route:ActivatedRoute,private router:Router) { }

  ngOnInit(): void {
    this.sessionStatus= this.route.snapshot.params['msg']
    console.log(this.sessionStatus)
  }

  redirectToLogin(){
    localStorage.removeItem("uid")
    localStorage.removeItem("token")
    this.router.navigateByUrl("login")
  }

}
