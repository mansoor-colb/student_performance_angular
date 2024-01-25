import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import Swal from 'sweetalert2';
interface MyObject {
  exam: String;
  marks: number;
  remark: string;
}
@Component({
  selector: 'app-add-user',
  templateUrl: './add-user.component.html',
  styleUrls: ['./add-user.component.css']
})

export class AddUserComponent implements OnInit {

 exam_array:MyObject[]=[];
 studentobj:any;
 stu_exist:any;
 stu_existusn:any;
 sel_exam:any=[]
 exam_data:any;
 exam_status:any;
 addedexam_count:any=1;
 maxDate: Date;

  constructor(private http: HttpClient,private fb: FormBuilder,) { 

    this.stu_exist=false
    this.stu_existusn=false
    this.maxDate = new Date();
    this.getexam()
  }

  ngOnInit(): void {
    this.studentobj=this.fb.group({
      student_name:new FormControl(null,[Validators.required,Validators.minLength(3)]),
      student_email:new FormControl(null,[Validators.required,Validators.email]),
      student_usn:new FormControl(null,[Validators.required,Validators.minLength(2)]),
      student_dob:new FormControl(null,[Validators.required]),
      student_class:new FormControl(null,[Validators.required,Validators.max(10),Validators.min(1)]),
      student_gender:new FormControl("male",[Validators.required]),
      student_exams:new FormArray([
        new FormGroup({
          exam_id:new FormControl(null,[Validators.required]),
          exam_name:new FormControl(null,[Validators.required]),
          exam_marks:new FormControl(null,[Validators.required,Validators.min(1),Validators.max(100)]),
          exam_remarks:new FormControl("",[Validators.required])
        })
      ])

    })


  }


  getexam(){
    this.http.get<any>("http://localhost:8771/getexam").subscribe(data => {
      if(data.status==200){

        this.exam_data=data.data
      }
      else{
        this.exam_status=false
      }
      console.log(this.exam_data)
  
  },(error) => {
    Swal.fire({

      icon: "error",
      title: `opps!! Internal Server Error `,
      showConfirmButton: false,
      timer: 2500

    })

})
  }


  update(index:any){
    if(this.exam_status!=false){
    let control=<FormArray>this.studentobj.controls['student_exams']
    console.log(control.at(index).value.exam_name)
   let  itm=control.at(index).value.exam_name
   if(this.sel_exam.includes(itm)){
    Swal.fire({

      icon: "info",
      title: "Subject is Already Added",
      showConfirmButton: false,
      timer:1500

    });
    // alert("Subject is Already Added")
    control.removeAt(index)
    this.addedexam_count-=1
   }
   else{
     let cont= (this.studentobj.controls['student_exams'] as FormArray).at(index);
     console.log(cont)
   for( let itm of this.exam_data){
    if (itm.exam_name==cont.value.exam_name){
      cont?.get('exam_id')?.setValue(itm.exam_id);
      break;
    }
  
   }
    this.sel_exam.push(itm)
   }
  }
  else{
    Swal.fire({

      icon: "error",
      title: "No more exam Available to add!!",
      showConfirmButton: false,
      timer:1500

    });
    // alert("No examas Available to add!!")
  }
  }


  addexam(){
    if(this.addedexam_count<this.exam_data.length){
      let control=<FormArray>this.studentobj.controls['student_exams']
      console.log(control)
      control.push(new FormGroup({
        exam_id:new FormControl(null,[Validators.required]),
        exam_name:new FormControl(null,[Validators.required]),
        exam_marks:new FormControl(null,[Validators.required,Validators.min(1),Validators.max(100)]),
        exam_remarks:new FormControl(null,[Validators.required])
      }))
      this.addedexam_count+=1
    }
    else{
      Swal.fire({

        icon: "error",
        title: "No more Exams to Add!!",
        showConfirmButton: false,
        timer:1500

      });
      // alert("No more Exams to Add!!")
    }
    
    // this.exam_array.push({exam:"hel","marks":65,remark:"pass"})

  }

  removeexam(i:any){
    this.addedexam_count-=1
    let control=<FormArray>this.studentobj.controls['student_exams']
   control.removeAt(i)
   console.log(control)

  }
  dosubmit(){
    console.log(this.studentobj.value)
    if(this.studentobj.valid){
      this.http.post<any>("http://localhost:8771/addstudent", this.studentobj.value).subscribe(res=>{
        if(res.status==200){
          Swal.fire({

            icon: "success",
            title: "Added Student Successfully",
            showConfirmButton: false,
            timer:1500

          });
          // alert("Added Student Successfully" )
          this.studentobj.reset();
        }
        else{
        
            Swal.fire({

              icon: "error",
              title: "Opps something went wrong",
              showConfirmButton: false,
              timer:1500
  
            });
       
          // alert("Opps something went wrong")
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
    else{
      Swal.fire({

        icon: "error",
        title: "Details are invalid!!",
        showConfirmButton: false,
        timer:1500

      });
      // alert("Details are invalid!!")
    }
    console.log(this.studentobj.valid)
    console.log(this.studentobj.value)

  }

   dynamic(index:any){
   let cont= (this.studentobj.controls['student_exams'] as FormArray).at(index);
   let marks=cont.value.exam_marks
   let res:any;
   switch(true){
    case marks >= 90:
      res = 'Excellent';
      break;
    case marks >= 75:
      res = 'Good';
      break;
    case marks >= 60:
      res = 'Average';
      break;
    default:
      res = 'Below Average';
   }
   cont?.get('exam_remarks')?.setValue(res);

  }



  checkexistemail(){
    this.stu_exist=false
    this.http.post<any>("http://localhost:8771/checkstuexistmail", this.studentobj.value).subscribe(res=>{
      if(res.status==200 ){
      
        this.stu_exist=true
      }
      else{
        this.stu_exist=false
      }

  },(error) => {
    Swal.fire({

      icon: "error",
      title: `opps!! Internal Server Error `,
      showConfirmButton: false,
      timer: 2500

    })

})
 
  }


  checkexistusn(){
    this.stu_existusn=false
    this.http.post<any>("http://localhost:8771/checkstuexistusn", this.studentobj.value).subscribe(res=>{
      if(res.status==200 ){
      
        this.stu_existusn=true
      }
      else{
        this.stu_existusn=false
      }

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

