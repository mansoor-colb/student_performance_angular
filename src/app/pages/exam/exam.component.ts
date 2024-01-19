import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';
@Component({
  selector: 'app-exam',
  templateUrl: './exam.component.html',
  styleUrls: ['./exam.component.css']
})
export class ExamComponent implements OnInit {

  examobj:any;
  maxDate: Date;
  exam_exist:any=false;

  constructor(private fb: FormBuilder,private router: Router, private http: HttpClient) {
    // this.examobj.reset();
    this.maxDate = new Date();
   }

  ngOnInit(): void {
   this.examobj=this.fb.group({
      examname:new FormControl(null,[Validators.required]),
      examdate:new FormControl(null,[Validators.required]),
      exammax:new FormControl(100,[Validators.required,Validators.min(1),Validators.max(100)]),
      exammin:new FormControl(10,[Validators.required,Validators.min(10),Validators.max(100)])
    })
  }
  dosubmit(){
    if(this.examobj.valid){
      this.http.post<any>("http://localhost:8771/addexam", this.examobj.value).subscribe(res=>{
        if(res.status==200){
          Swal.fire({

            icon: "success",
            title: `Added Exam Successfully`,
            showConfirmButton: false,
            timer:1500

          });
          // alert("Added Exam Successfully" )
          this.examobj.reset();
            // this.router.navigateByUrl('Addexam');
        }
        console.log(res)
  
    })
    }
    else{
      Swal.fire({

        icon: "error",
        title: `Opps something went wrong`,
        showConfirmButton: false,
        timer:2000

      });
      // alert("Opps something went wrong")
    }
    console.log(this.examobj.valid)
    console.log(this.examobj.value)

  }

  checkexist(){
    this.exam_exist=false
    this.http.post<any>("http://localhost:8771/checkexist", this.examobj.value).subscribe(res=>{
      if(res.status==200 ){
        console.log(res.data[0].exam_name)
        this.exam_exist=true
      }
      else{
        this.exam_exist=false
      }

  })
  }

}
