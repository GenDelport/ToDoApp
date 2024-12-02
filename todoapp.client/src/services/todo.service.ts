import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Task } from '../models/tasks.model';
import { ToDoTaskDto } from '../models/todo-task-dto.model';

@Injectable({
  providedIn: 'root'
})
export class TodoService {
  private baseUrl = 'https://localhost:7253/api/todos';

  constructor(private http: HttpClient) { }

  getTasksWithAuth(): Observable<Task[]> {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });
    return this.http.get<Task[]>(this.baseUrl, { headers });
  }

  addTaskWithAuth(task: ToDoTaskDto): Observable<Task> {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });
    return this.http.post<Task>(this.baseUrl, task, { headers });
  }

  updateTaskWithAuth(id: number, task: ToDoTaskDto): Observable<Task> {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });
    return this.http.put<Task>(`${this.baseUrl}/${id}`, task, { headers });
  }

  deleteTaskWithAuth(id: number): Observable<void> {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });
    return this.http.delete<void>(`${this.baseUrl}/${id}`, { headers });
  }
}
