import { Component, OnInit } from '@angular/core';
import { TodoService } from '../../services/todo.service';
import { Task } from '../../models/tasks.model';
import { ToDoTaskDto } from '../../models/todo-task-dto.model';
import { MatDialog } from '@angular/material/dialog';
import { AuthService } from '../../services/auth.service';
import { TaskDialogComponent } from '../task-dialog/task-dialog.component';

@Component({
  selector: 'app-todo-list',
  templateUrl: './todo-list.component.html',
  styleUrls: ['./todo-list.component.css'],
  standalone: false,
})
export class TodoListComponent implements OnInit {
  displayedColumns: string[] = ['select', 'task', 'status', 'edit', 'delete'];
  dataSource: Task[] = [];
  tasks: Task[] = [];
  filteredTasks: Task[] = [];
  filterStatus: 'All' | 'Pending' | 'Completed' = 'All';
  newTaskTitle: string = '';

  constructor(
    private todoService: TodoService,
    private dialog: MatDialog,
    private authService: AuthService
  ) { }

  ngOnInit() {
    this.loadTasks();
  }
  loadTasks() {
    console.log('TodoListComponent: Loading tasks');
    this.todoService.getTasksWithAuth().subscribe({
      next: (response) => {
        this.tasks = response;
        this.dataSource = this.tasks;
        console.log('Tasks loaded successfully:', this.tasks);
      },
      error: (err) => {
        console.error('Error fetching tasks:', err);
      },
    });
  }
  applyFilter() {
    if (this.filterStatus === 'All') {
      this.filteredTasks = this.tasks;
      this.dataSource = this.tasks
    } else {
      this.filteredTasks = this.tasks.filter(
        (task) => task.status === this.filterStatus
      );
      this.dataSource = this.filteredTasks
    }
    console.log(`Filtered Tasks: ${this.filterStatus}`, this.filteredTasks);
  }

  addTask() {
    const dialogRef = this.dialog.open(TaskDialogComponent, {
      width: '400px',
      data: { title: '', status: 'Pending' },
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        const taskDto: ToDoTaskDto = {
          title: result.title,
          status: 'Pending'
        };
        this.todoService.addTaskWithAuth(taskDto).subscribe({
          next: () => {
            this.loadTasks();
            console.log('Task added successfully');
          },
          error: (err) => {
            console.error('Error adding task:', err);
          }
        });
      }
    });
  }
  deleteTask(task: Task) {
    if (confirm(`Are you sure you want to delete the task "${task.title}"?`)) {
      this.todoService.deleteTaskWithAuth(task.id).subscribe({
        next: () => {
          this.loadTasks();
          console.log(`Task "${task.title}" deleted successfully.`);
        },
        error: (err) => {
          console.error('Error deleting task:', err);
        },
      });
    }
  }
  editTask(task: Task) {
    const dialogRef = this.dialog.open(TaskDialogComponent, {
      width: '400px',
      data: { ...task },
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        const updatedTask: ToDoTaskDto = {
          title: result.title,
          status: task.status,
        };

        this.todoService.updateTaskWithAuth(task.id, updatedTask).subscribe({
          next: () => {
            this.loadTasks();
            console.log(`Task "${task.title}" updated successfully.`);
          },
          error: (err) => {
            console.error('Error updating task:', err);
          },
        });
      }
    });
  }

  toggleTaskStatus(task: Task) {
    console.log("The selected task: " + task);
    const updatedStatus = task.status === 'Pending' ? 'Completed' : 'Pending';
    const taskDto: ToDoTaskDto = {
      title: task.title,
      status: updatedStatus,
    };
    console.log('Toggling task status:', task, 'to:', updatedStatus);
    this.todoService.updateTaskWithAuth(task.id, taskDto).subscribe({
      next: () => {
        this.loadTasks();
        console.log(`Task status successfully updated to ${updatedStatus}`);
      },
      error: (err) => {
        console.error('Error toggling task status:', err);
      },
    });
  }
  logout() {
    this.authService.logout();
    window.location.href = '/login';
  }
}
