import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private baseUrl = 'https://localhost:7253/api/auth';

  constructor(private http: HttpClient) { }

  signup(user: { email: string; password: string }): Observable<any> {
    return this.http.post(`${this.baseUrl}/signup`, user);
  }

  login(credentials: { username: string; password: string }): Observable<{ token: string }> {
    return this.http.post<{ token: string }>(`${this.baseUrl}/login`, credentials)
      .pipe(
        tap(({ token }) => {
          localStorage.setItem('token', token);
          console.log('User logged in with token:', token);
        })
      );
  }
  getToken(): string | null {
    const token = localStorage.getItem('token');
    console.log('Retrieved token from AuthService:', token);
    return token;
  }
  isLoggedIn(): boolean {
    return !!localStorage.getItem('token');
  }
  logout(): void {
    localStorage.removeItem('token');
  }
}
