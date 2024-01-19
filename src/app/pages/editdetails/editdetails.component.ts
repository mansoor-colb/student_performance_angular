import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import Swal from 'sweetalert2';
interface MyObject {
  exam: String;
  marks: number;
  remark: string;
}
@Component({
  selector: 'app-editdetails',
  templateUrl: './editdetails.component.html',
  styleUrls: ['./editdetails.component.css']
})
export class EditdetailsComponent implements OnInit {


  exam_array: MyObject[] = [];
  studenteditobj: any;
  stu_exist: any;
  sel_exam: any = []
  exam_data: any;
  exam_status: any;
  addedexam_count: any = 0;
  exampleValues: any;
  user_id: any;
  maxDate: Date;
  constructor(private http: HttpClient, private fb: FormBuilder, private route: ActivatedRoute, private router: Router) {

    this.stu_exist = false
    this.getexam()
    this.maxDate = new Date();
    this.user_id = this.route.snapshot.params['userid']

  }

  ngOnInit(): void {

    this.studenteditobj = this.fb.group({
      student_name: new FormControl(null, [Validators.required, Validators.minLength(3)]),
      student_email: new FormControl(null, [Validators.required, Validators.email]),
      student_usn: new FormControl(null, [Validators.required, Validators.minLength(2)]),
      student_dob: new FormControl(null, [Validators.required]),
      student_class: new FormControl(null, [Validators.required]),
      student_gender: new FormControl("male", [Validators.required]),
      student_exams: new FormArray([])

    })
    this.loadform()
  }

  loadform() {
    this.http.post<any>("http://localhost:8771/getstudent", { id: this.user_id }).subscribe(data => {
      console.log(data)

      this.exampleValues = {
        student_name: data.data.student_name,
        student_email: data.data.student_email,
        student_usn: data.data.student_usn,
        student_dob: data.data.student_dob,
        student_class: data.data.student_class,
        student_gender: data.data.student_gender,
      };

      // Use patchValue to set values without requiring all controls to be present
      this.studenteditobj.patchValue(this.exampleValues);


      let control = <FormArray>this.studenteditobj.controls['student_exams']
      console.log(control)
      for (let item of data.data.student_exams) {
        this.addedexam_count += 1
        this.sel_exam.push(item.exam_name)
        control.push(new FormGroup({
          exam_id: new FormControl(item.exam_id, [Validators.required]),
          exam_name: new FormControl(item.exam_name, [Validators.required]),
          exam_marks: new FormControl(item.exam_marks, [Validators.required, Validators.min(1)]),
          exam_remarks: new FormControl(item.exam_remarks, [Validators.required])
        }))
      }

      console.log(data)
      console.log(this.studenteditobj.value)
    })



  }
  getexam() {
    this.http.get<any>("http://localhost:8771/getexam").subscribe(data => {
      if (data.status == 200) {

        this.exam_data = data.data
      }
      else {
        this.exam_status = false
      }
      console.log(this.exam_data)

    })
  }

  update(index: any) {
    if (this.exam_status != false) {
      let control = <FormArray>this.studenteditobj.controls['student_exams']
      console.log(control.at(index).value.exam_name)
      let itm = control.at(index).value.exam_name
      if (this.sel_exam.includes(itm)) {
        Swal.fire({

          icon: "info",
          title: "Subject is Already Added",
          showConfirmButton: false,
          timer: 1500

        });
        //  alert("Subject is Already Added")
        control.removeAt(index)
        this.addedexam_count -= 1
      }
      else {
        let cont = (this.studenteditobj.controls['student_exams'] as FormArray).at(index);
        console.log(cont)
        for (let itm of this.exam_data) {
          if (itm.exam_name == cont.value.exam_name) {
            cont?.get('exam_id')?.setValue(itm.exam_id);
            break;
          }

        }
        this.sel_exam.push(itm)
      }
    }
    else {
      Swal.fire({

        icon: "info",
        title: "No examas Available to add!!",
        showConfirmButton: false,
        timer: 1500

      });
      //  alert("No examas Available to add!!")
    }
  }


  addexam() {
    if (this.addedexam_count < this.exam_data.length) {
      let control = <FormArray>this.studenteditobj.controls['student_exams']
      console.log(control)
      control.push(new FormGroup({
        exam_id: new FormControl(null, [Validators.required]),
        exam_name: new FormControl(null, [Validators.required]),
        exam_marks: new FormControl(null, [Validators.required, Validators.min(1)]),
        exam_remarks: new FormControl(null, [Validators.required])
      }))
      this.addedexam_count += 1
    }
    else {
      Swal.fire({

        icon: "error",
        title: "No more Exams to Add!!",
        showConfirmButton: false,
        timer: 1500

      });
      //  alert("No more Exams to Add!!")
    }

    // this.exam_array.push({exam:"hel","marks":65,remark:"pass"})

  }

  removeexam(i: any) {
    this.addedexam_count -= 1
    let control = <FormArray>this.studenteditobj.controls['student_exams']
    control.removeAt(i)
    console.log(control)

  }
  dosubmit() {
    console.log(this.studenteditobj.value)
    let obj = this.studenteditobj.value
    obj["stu_id"] = this.user_id
    if (this.studenteditobj.valid) {
      this.http.post<any>("http://localhost:8771/updatestudent", obj).subscribe(res => {
        if (res.status == 200) {
          Swal.fire({

            icon: "success",
            title: "Student Details Updated Successfully",
            showConfirmButton: false,
            timer: 1500

          });
          //  alert("Student Details Updated Successfully" )
          setTimeout(() => {

            this.router.navigateByUrl('editdetails');
          }, 1500);
        }
        else {
          Swal.fire({

            icon: "error",
            title: "Opps something went wrong",
            showConfirmButton: false,
            timer: 1500

          });
          //  alert("")
        }
        console.log(res)

      })
    }
    else {
      Swal.fire({

        icon: "error",
        title: "Details are invalid!!",
        showConfirmButton: false,
        timer: 1500

      });
      //  alert("Details are invalid!!")
    }
    console.log(this.studenteditobj.valid)
    console.log(this.studenteditobj.value)

  }

  dynamic(index: any) {
    let cont = (this.studenteditobj.controls['student_exams'] as FormArray).at(index);
    let marks = cont.value.exam_marks
    let res: any;
    switch (true) {
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



  checkexistemail() {
    this.stu_exist = false
    this.http.post<any>("http://localhost:8771/checkstuexistmail", this.studenteditobj.value).subscribe(res => {
      if (res.status == 200) {

        this.stu_exist = true
      }
      else {
        this.stu_exist = false
      }

    })
  }


  checkexistusn() {
    this.stu_exist = false
    this.http.post<any>("http://localhost:8771/checkstuexistusn", this.studenteditobj.value).subscribe(res => {
      console.log(this.exampleValues.student_usn)
      console.log(res.data.student_usn)
      console.log(res)
      if (res.status == 200 && res.data[0].student_usn != this.exampleValues.student_usn) {

        this.stu_exist = true
      }
      else {
        this.stu_exist = false
      }

    })
  }


}
