import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import Swal from 'sweetalert2';
@Component({
  selector: 'app-details',
  templateUrl: './details.component.html',
  styleUrls: ['./details.component.css']
})
export class DetailsComponent implements OnInit {
studentdata:any=[]
isSearchOpen = false;
filterval:any;



  getdata(){
    this.http.get<any>("http://localhost:8771/getstudentall").subscribe(data => {
     this.studentdata=data.data
    console.log(data.data)
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

  toggleSearch() {
    this.isSearchOpen = !this.isSearchOpen;
  }

  filter(val:any){
    console.log(val)
    this.http.post<any>("http://localhost:8771/getstudentfilter",{"val":val}).subscribe(data => {
      this.studentdata=data.data
     console.log(data.data)
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
