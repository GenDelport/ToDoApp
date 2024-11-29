import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { catchError, throwError, timer } from 'rxjs';
import { retry } from 'rxjs/operators';
interface WeatherForecast {
  date: string;
  temperatureC: number;
  temperatureF: number;
  summary: string;
}

interface Tasks {
  id: number,
  title: string,
  status: string,
  member: string,
}

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  standalone: false,
  styleUrl: './app.component.css'
})
export class AppComponent implements OnInit {
  public forecasts: WeatherForecast[] = [];
  //public tasks: Tasks[] = [];

  constructor(private http: HttpClient) { }

  ngOnInit() {
    //this.getForecasts();
    //this.getTasks();
  }
  //getTasks() {
  //  this.http.get<Tasks[]>('/tasks')
  //    .pipe(
  //      retry({
  //        count: 5, // Retry up to 5 times
  //        delay: (error, retryCount) => {
  //          // Only retry for retriable errors
  //          if ([408, 500, 502, 503, 504].includes((error as HttpErrorResponse).status)) {
  //            return timer(retryCount * 2000); // Incremental backoff: 2s, 4s, 6s...
  //          }
  //          return throwError(() => error); // Do not retry non-retriable errors
  //        }
  //      }),
  //      catchError((error: HttpErrorResponse) => {
  //        console.error('Backend not reachable after retries.', error);
  //        return throwError(() => error); // Final error handling
  //      })
  //    )
  //    .subscribe({
  //      next: (result) => {
  //        this.tasks = result;
  //      },
  //      error: (error) => {
  //        console.error('Error fetching forecasts:', error);
  //      }
  //    });
  //}
  //Instead of passing next, error, and complete as separate arguments, you now pass an object to subscribe. aligns with modern RxJS practices and avoids deprecation warnings
  //getForecasts() {
  //  this.http.get<WeatherForecast[]>('/weatherforecast')
  //    .pipe(
  //      retry({
  //        count: 5, // Retry up to 5 times
  //        delay: (error, retryCount) => {
  //          // Only retry for retriable errors
  //          if ([408, 500, 502, 503, 504].includes((error as HttpErrorResponse).status)) {
  //            return timer(retryCount * 2000); // Incremental backoff: 2s, 4s, 6s...
  //          }
  //          return throwError(() => error); // Do not retry non-retriable errors
  //        }
  //      }),
  //      catchError((error: HttpErrorResponse) => {
  //        console.error('Backend not reachable after retries.', error);
  //        return throwError(() => error); // Final error handling
  //      })
  //    )
  //    .subscribe({
  //      next: (result) => {
  //        this.forecasts = result;
  //      },
  //      error: (error) => {
  //        console.error('Error fetching forecasts:', error);
  //      }
  //    });
  //}

  title = 'todoapp.client';
}
//old endpoint
//  getForecasts() {
//    this.http.get<WeatherForecast[]>('/weatherforecast').subscribe({
//      next: (result) => {
//        this.forecasts = result;
//      },
//      error: (error) => {
//        console.error(error);
//      }
//    });
//  }

//  title = 'todoapp.client';
//}
