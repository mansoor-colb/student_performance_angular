import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-notfound',
  templateUrl: './notfound.component.html',
  styleUrls: ['./notfound.component.css']
})
export class NotfoundComponent implements OnInit {
id:any;
  constructor(private router:Router) {
    let str=localStorage.getItem("uid")
    if(str){
      this.id=str.split("-")[0]
    

    }
    else{
      alert("Please Login!!")
      router.navigateByUrl("login")
    
    }
   }

  ngOnInit(): void {
  }

}
