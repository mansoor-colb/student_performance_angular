import { Component, OnInit, Input ,Output, EventEmitter } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-tabs',
  templateUrl: './tabs.component.html',
  styleUrls: ['./tabs.component.css']
})
export class TabsComponent implements OnInit {


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
