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
  }

  title = 'todoapp.client';
}
