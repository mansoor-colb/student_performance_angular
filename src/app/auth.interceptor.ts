import { Injectable } from '@angular/core';
import {
  HttpInterceptor,
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpErrorResponse,
} from '@angular/common/http';
import { catchError, finalize, tap } from 'rxjs/operators';
import { Router } from '@angular/router';
import { Observable, throwError } from 'rxjs';


@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  private responseData: any;
  constructor(private router: Router) {}

  intercept(
    req: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    const token = localStorage.getItem('token');

    if (token) {
      const authReq = req.clone({
        setHeaders: {
          Authorization: `Bearer ${token}`,
        },
      });

      return next.handle(authReq).pipe(tap( (data) => {this.responseData=data}),
        catchError((error: HttpErrorResponse) => {
          alert(error.error.data)
          if (error.status === 401) {
            console.log(this.responseData)
            // debugger
            this.router.navigateByUrl(`invalid/${error.error.data}`);
          }
          return throwError(error);
        }),finalize(()=>{
          
        })
      );
    }

    return next.handle(req);
  }
}
