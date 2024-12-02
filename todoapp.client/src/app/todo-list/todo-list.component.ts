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
  displayedColumns: string[] = ['select', 'task', 'status', 'edit','delete' ];
  dataSource: Task[] =[];
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
        this.dataSource= this.tasks; 
        console.log('Tasks loaded successfully:', this.tasks);
      },
      error: (err) => {
        console.error('Error fetching tasks:', err);
      },
    });
  }
  //allSelected(): boolean {
  //  return this.tasks.every(task => task.status === 'Completed');
  //}

  //loadTasks() {
  //  console.log('TodoListComponent: Loading tasks');
  //  this.todoService.getTasksWithAuth().subscribe({
  //    next: (response) => {
  //      this.tasks = response;
  //      this.applyFilter();
  //      console.log('Tasks loaded successfully:', this.tasks);
  //    },
  //    error: (err) => {
  //      console.error('Error fetching tasks:', err);
  //    },
  //  });
  //}
  //working
  applyFilter() {
    if (this.filterStatus === 'All') {
      this.filteredTasks = this.tasks;
      this.dataSource = this.tasks
    } else {
      this.filteredTasks = this.tasks.filter(
        (task) => task.status === this.filterStatus
        //dataSource = this.filteredTasks
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
          status: 'Pending' // Hardcoded as 'Pending'
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

  //editTask(task: Task) {
  //  const dialogRef = this.dialog.open(TaskDialogComponent, {
  //    width: '400px',
  //    data: { ...task },
  //  });

  //  dialogRef.afterClosed().subscribe((result) => {
  //    if (result) {
  //      const taskDto: ToDoTaskDto = {
  //        title: result.title,
  //        status: result.status // Can be 'Pending' or 'Completed' if you allow editing
  //      };
  //      this.todoService.updateTaskWithAuth(task.id, taskDto).subscribe({
  //        next: () => {
  //          this.loadTasks();
  //          console.log('Task updated successfully');
  //        },
  //        error: (err) => {
  //          console.error('Error updating task:', err);
  //        }
  //      });
  //    }
  //  });
  //}

  // Delete task with Authorization header
  //deleteTask(task: Task) {
  //  if (confirm(`Are you sure you want to delete task "${task.title}"?`)) {
  //    this.todoService.deleteTaskWithAuth(task.id).subscribe({
  //      next: () => {
  //        this.loadTasks();
  //        console.log('Task deleted successfully');
  //      },
  //      error: (err) => {
  //        console.error('Error deleting task:', err);
  //      }
  //    });
  //  }
  //}
  deleteTask(task: Task) {
    if (confirm(`Are you sure you want to delete the task "${task.title}"?`)) {
      this.todoService.deleteTaskWithAuth(task.id).subscribe({
        next: () => {
          this.loadTasks(); // Reload tasks after deletion
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
      data: { ...task }, // Pass the task data to the dialog
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        const updatedTask: ToDoTaskDto = {
          title: result.title,
          status: task.status, // Keep the current status unchanged
        };

        this.todoService.updateTaskWithAuth(task.id, updatedTask).subscribe({
          next: () => {
            this.loadTasks(); // Reload tasks to reflect the update
            console.log(`Task "${task.title}" updated successfully.`);
          },
          error: (err) => {
            console.error('Error updating task:', err);
          },
        });
      }
    });
  }
  //editTaskTitle(task: Task) {
  //  // For now, just log the task to be edited
  //  console.log('Editing task title for:', task);

  //  // You can implement a dialog or inline editing logic here
  //}
  toggleTaskStatus(task: Task) {
    console.log("The selected task: "+ task);
    // Determine the updated status based on the current status
    const updatedStatus = task.status === 'Pending' ? 'Completed' : 'Pending';

    // Create a DTO with the updated status
    const taskDto: ToDoTaskDto = {
      title: task.title, // Keep the title unchanged
      status: updatedStatus, // Use the updated status
    };

    console.log('Toggling task status:', task, 'to:', updatedStatus);

    // Call the service to update the task in the backend
    this.todoService.updateTaskWithAuth(task.id, taskDto).subscribe({
      next: () => {
        // Reload the tasks after successful update
        this.loadTasks();
        console.log(`Task status successfully updated to ${updatedStatus}`);
      },
      error: (err) => {
        console.error('Error toggling task status:', err);
      },
    });
  }
  //toggleTaskStatus(task: Task) {
  //  const updatedStatus = task.status === 'Pending' ? 'Completed' : 'Pending';

  //  const taskDto: ToDoTaskDto = {
  //    title: task.title,
  //    status: updatedStatus,
  //  };

  //  console.log('Toggling task status:', task, 'to:', updatedStatus);

  //  this.todoService.updateTaskWithAuth(task.id, taskDto).subscribe({
  //    next: () => {
  //      this.loadTasks(); // Reload tasks to reflect the updated status
  //      console.log(`Task status updated successfully to ${updatedStatus}`);
  //    },
  //    error: (err) => {
  //      console.error('Error toggling task status:', err);
  //    },
  //  });
  //}
  //toggleTaskStatus(task: Task) {
  //  const updatedStatus = task.status === 'Pending' ? 'Completed' : 'Pending';
  //  const taskDto: ToDoTaskDto = {
  //    title: task.title,
  //    status: updatedStatus
  //  };
  //  this.todoService.updateTaskWithAuth(task.id, taskDto).subscribe({
  //    next: () => {
  //      this.loadTasks();
  //      console.log(`Task status updated to ${updatedStatus}`);
  //    },
  //    error: (err) => {
  //      console.error('Error toggling task status:', err);
  //    }
  //  });
  //}

  logout() {
    this.authService.logout();
    window.location.href = '/login';
  }
}
