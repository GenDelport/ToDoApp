import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private baseUrl = 'https://localhost:7253/api/auth'; // Adjust to match your backend routes

  constructor(private http: HttpClient) { }

  signup(user: { email: string; password: string }): Observable<any> {
    return this.http.post(`${this.baseUrl}/signup`, user);
  }

  login(credentials: { username: string; password: string }): Observable<{ token: string }> {
    return this.http.post<{ token: string }>(`${this.baseUrl}/login`, credentials)
      .pipe(
        tap(({ token }) => {
          localStorage.setItem('token', token);
          console.log('User logged in with token:', token); // For debugging
        })
      );
  }
  getToken(): string | null {
    return localStorage.getItem('token');
  }
  //isLoggedIn(): boolean {
  //  return !!localStorage.getItem('token');
  //}
  //if you want a logout method
  logout(): void {
    localStorage.removeItem('token');
  }
}
