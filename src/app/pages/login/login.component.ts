import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';
@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  loginObj: any = {
    UserId: 0,
    UserName: '',
    Password: '',
    Result: false,
    Message: ''
  };
  registerObj: any = {
    UserId: 0,
    UserName: '',
    Password: '',
    CreatedDate: new Date()
  };
  togged: boolean = false;
  isRegister: boolean = false;
  constructor(private router: Router, private http: HttpClient) {
    let islogg = localStorage.getItem("uid")
    if (islogg) {
      const parts = islogg.split('-');
      if (parts[1] == "Admin") {
        this.router.navigateByUrl('admin-dash');
      }
      else if (parts[1] == "stu") {
        this.router.navigateByUrl(`user-dashboard/${islogg.substring(0, 6)}`);

      }
    }
  }

  ngOnInit(): void {

  }
  onRegister() {
    this.http.post("http://localhost:61334/api/Registration/Register", this.registerObj).subscribe(res => {

    })
  }
  tog() {
    this.togged = !this.togged;
    console.log(this.togged)
  }
  onLogin() {
    // alert(this.loginObj.Password)
    if (this.togged) {
      this.http.post<any>("http://localhost:8771/signup", this.loginObj).subscribe(res => {
        if (res.status == 200) {
          // alert(`Login Succesfull as ${res.data[0].role}`)
          localStorage.removeItem("uid")
          localStorage.setItem("uid", `${res.data[0].user_id}-${res.data[0].role}`)
          if (res.data[0].role == "Admin") {
            Swal.fire({

              icon: "success",
              title: `Login Succesfull as ${res.data[0].role}`,
              showConfirmButton: false,
              timer: 1500

            });
            setTimeout(() => {

              this.router.navigateByUrl('admin-dash');
            }, 1500);
          }
          else {
            Swal.fire({

              icon: "error",
              title: "Some errror occured!!",
              showConfirmButton: false,
              timer: 1500

            });
            // alert()


          }

        }
        else {
          Swal.fire({

            icon: "error",
            title: `No Admin Match for given Credientials`,
            showConfirmButton: false,
            timer: 1500

          });
          // alert("No Admin Match for given Credientials")
        }
        console.log(res)
      })
    }
    else {
      console.log(this.loginObj)

      this.http.post<any>("http://localhost:8771/signupstu", this.loginObj).subscribe(res => {
        console.log(res)
        if (res.status == 200) {
          if (res.data.val == "true") {
            // alert(`Login Succesfull as ${res.data.name}`)
            localStorage.removeItem("uid")
            localStorage.setItem("uid", `${res.data.id}-${res.data.role}`)
            if (res.data.role == "stu") {
              Swal.fire({

                icon: "success",
                title: `Login Succesfull as ${res.data.name}`,
                showConfirmButton: false,
                timer: 1500
  
              });
              setTimeout(() => {
                
                this.router.navigateByUrl(`user-dashboard/${res.data.id}`);
              }, 1500);

            }
            else {
              Swal.fire({

                icon: "error",
                title: "Some error occured!!",
                showConfirmButton: false,
                timer: 2000
    
              });
              // alert("Some error occured!!")

            }
          }
          else {
            Swal.fire({

              icon: "error",
              title: `Your account is suspended.Please Contact Admin!`,
              showConfirmButton: false,
              timer: 2000
  
            });
            // alert("Your account is suspended.Please Contact Admin!")
          }
        }

        else {
          Swal.fire({

            icon: "error",
            title: `No Student Match for given Credientials`,
            showConfirmButton: false,
            timer: 2000

          });
          // alert("No Student Match for given Credientials")
        }
        // console.log(res)
      })

    }
    // debugger;
    // this.http.post("http://localhost:61334/api/Registration/Login", this.loginObj).subscribe((response: any)=>{
    //   debugger;
    //   if(response.result) {
    //     alert(response.message)
    //     this.router.navigateByUrl('way2user-dashboard');
    //   } else {
    //     alert(response.message)
    //   }
    // })

    //way 1
    // if(this.loginObj.userName == 'user123' && this.loginObj.password =='user@123') {
    //   localStorage.setItem('role','user');
    //   this.router.navigateByUrl('user-dashboard');
    // } else if (this.loginObj.userName == 'admin' && this.loginObj.password =='admin@123') {
    //   localStorage.setItem('role','admin');
    //   this.router.navigateByUrl('admin-dash');
    // }
    //way 2

    // if(this.loginObj.userName == 'user123' && this.loginObj.password =='user@123') {
    //   localStorage.setItem('role','user');
    //   this.router.navigateByUrl('way2user-dashboard');
    // } else if (this.loginObj.userName == 'admin' && this.loginObj.password =='admin@123') {
    //   localStorage.setItem('role','admin');
    //   this.router.navigateByUrl('way2admin-dash');
    // }
  }

}
