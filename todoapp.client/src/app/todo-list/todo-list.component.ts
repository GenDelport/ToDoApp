import { Component, OnInit } from '@angular/core';
import { TodoService } from '../../services/todo.service';
import { Task } from '../../models/tasks.model';
import { MatDialog } from '@angular/material/dialog';
import { AuthService } from '../../services/auth.service';
import { TaskDialogComponent } from '../task-dialog/task-dialog.component';


@Component({
  selector: 'app-todo-list',
  standalone: false,
  templateUrl: './todo-list.component.html',
  styleUrls: ['./todo-list.component.css'] 

})
export class TodoListComponent implements OnInit {
  tasks: Task[] = [];
  filteredTasks: Task[] = [];
  filterStatus: 'All' | 'Pending' | 'Completed' = 'All';

  constructor(
    private todoService: TodoService,
    private dialog: MatDialog,
    private authService: AuthService
  ) { }

  ngOnInit() {
    this.loadTasks();
  }

  loadTasks() {
    this.todoService.getTasks().subscribe({
      next: (response) => {
        this.tasks = response;
        this.applyFilter();
      },
      error: (err) => {
        console.error('Error fetching tasks:', err);
      },
    });
  }

  applyFilter() {
    if (this.filterStatus === 'All') {
      this.filteredTasks = this.tasks;
    } else {
      this.filteredTasks = this.tasks.filter(
        (task) => task.status === this.filterStatus
      );
    }
  }

  addTask() {
    const dialogRef = this.dialog.open(TaskDialogComponent, {
      width: '400px',
      data: { title: '', status: 'Pending' },
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.todoService.addTask(result).subscribe(() => {
          this.loadTasks();
        });
      }
    });
  }

  editTask(task: Task) {
    const dialogRef = this.dialog.open(TaskDialogComponent, {
      width: '400px',
      data: { ...task },
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.todoService.updateTask(task.id, result).subscribe(() => {
          this.loadTasks();
        });
      }
    });
  }

  deleteTask(task: Task) {
    if (confirm(`Are you sure you want to delete task "${task.title}"?`)) {
      this.todoService.deleteTask(task.id).subscribe(() => {
        this.loadTasks();
      });
    }
  }

  toggleTaskStatus(task: Task) {
    const updatedStatus = task.status === 'Pending' ? 'Completed' : 'Pending';
    this.todoService
      .updateTask(task.id, { status: updatedStatus })
      .subscribe(() => {
        this.loadTasks();
      });
  }

  logout() {
    this.authService.logout();
    // Redirect to login page
    window.location.href = '/login';
  }
}
