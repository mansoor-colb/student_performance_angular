import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import Swal from 'sweetalert2';
import { Subject, debounceTime, first, switchMap, takeWhile } from 'rxjs';
@Component({
  selector: 'app-details',
  templateUrl: './details.component.html',
  styleUrls: ['./details.component.css']
})
export class DetailsComponent implements OnInit {
studentdata:any=[]
isSearchOpen = false;
filterval:any;
 flag=true
dummy=false
// @ViewChild('filval', { static: false }) inp!: ElementRef;




  getdata(){
    this.http.get<any>("http://localhost:8771/getstudentall").subscribe(data => {
     this.studentdata=data.data
    console.log(data.data)
    if(data.data.length==0){
      this.dummy=true
     }
     else{
      this.dummy=false

     }


    //  for (let item of data.data){
    //   // if(item.isactive=="true"){
    //     this.studentdata.push(item)
    //   // }
    //  }

  },(error) => {
    Swal.fire({

      icon: "error",
      title: `opps!! Internal Server Error `,
      showConfirmButton: false,
      timer: 2500

    })

})
  }
  constructor(private http: HttpClient,private fb: FormBuilder,) { 


    this.getdata()
  }

  ngOnInit(): void {
  }

  toggleSearch(inp: HTMLInputElement) {
  
    this.isSearchOpen = !this.isSearchOpen;
    if(this.isSearchOpen){
      inp.focus()

    }
  
  }


 debounce(val:any) {
  // let timer:any;
 
  // if(this.flag){
  this.filter(val);
this.flag=false
// clearTimeout (timer) ;
// }
//   timer = setTimeout(() => { this.flag=true }, 2000);
}


  filter(val:any):void{

    
    // const clickSubject = new Subject();
  // Create an observable from the click subject
  // const click$ = clickSubject.pipe(debounceTime(1000));
  //   console.log(val)
  //   click$
  //   .pipe(
  //     switchMap(() =>))

    this.http.post<any>("http://localhost:8771/getstudentfilter",{"val":val}).pipe().subscribe(data => {
      // alert(0)
      this.studentdata=data.data
     console.log(data.data)
     if(data.data.length==0){
      this.dummy=true

      



     }
     else{
      this.dummy=false

     }
      // for (let item of data.data){
      //  if(item.name==val){
      //    this.studentdata.push(item)
      //  }
      // }
 
   },(error) => {
    Swal.fire({

      icon: "error",
      title: `opps!! Internal Server Error `,
      showConfirmButton: false,
      timer: 2500

    })

})

  }
  act(id:any,status:any){
    let obj={stu_id:id,stu_status:status}
    if(status=="true"){
      obj.stu_status="false"
    }
    else{
      obj.stu_status="true"
    }
      
    this.http.post<any>("http://localhost:8771/activate", obj).subscribe(res=>{
      if(res.status==200){
        this.getdata()
      }
      else{
        alert("Some Error ocured!!")
        
      }
      console.log(res)


    },(error) => {
      Swal.fire({
  
        icon: "error",
        title: `opps!! Internal Server Error `,
        showConfirmButton: false,
        timer: 2500
  
      })
  
  })

  }
}
