import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject, Observable, map } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  // options = {
  //   headers: new HttpHeaders().set('Content-Type', 'application/x-www-form-urlencoded')
  // };
  private currentUserSubject: BehaviorSubject<any>;
  public currentUser: Observable<any>;

  constructor(private router: Router, private http: HttpClient) {
    this.currentUserSubject = new BehaviorSubject<any>(
      JSON.parse(localStorage.getItem(`${environment.currentUserKey}`) || '{}')
    );
    this.currentUser = this.currentUserSubject.asObservable();
  }
  public get currentUserValue(): any {
    if (this.currentUserSubject.value != null) {
      return this.currentUserSubject.value;
    }
  }

  login(form: any) {
    const formData: FormData = new FormData();
    formData.append('email', form.email_or_phone);
    formData.append('password', form.password);
    // new Response(formData).text().then(console.log)
    return this.http.post(`${environment.endpoint}/admin/login`, formData).pipe(
      map((user: any) => {
        console.log(user);

        if (user && user.data.access_token) {
          localStorage.setItem(
            `${environment.currentUserKey}`,
            JSON.stringify(user)
          ); //JSON.stringify(user)
          localStorage.setItem(`access_token_admin`, user.data.access_token);
          this.currentUserSubject.next(user);
        }
        return user;
      })
    );
  }
  sendOtpMessage(form: any) {
    return this.http.post(`${environment.endpoint}/code/send`, form);
  }

  confirmOtpMessage(form: any) {
    return this.http.post(`${environment.endpoint}/code/confirm`, form);
  }
  changePassword(form: any) {
    return this.http.post(`${environment.endpoint}/admin/password`, form);
  }
}
