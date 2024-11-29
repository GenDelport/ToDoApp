// task-dialog.component.ts
import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Task } from '../../models/tasks.model';
import { FormGroup, FormControl, Validators } from '@angular/forms';

@Component({
  selector: 'app-task-dialog',
  templateUrl: './task-dialog.component.html',
  styleUrls: ['./task-dialog.component.css'],
  standalone: false,
})
export class TaskDialogComponent {
  taskForm: FormGroup;

  constructor(
    public dialogRef: MatDialogRef<TaskDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: Partial<Task>
  ) {
    this.taskForm = new FormGroup({
      title: new FormControl(data.title || '', [Validators.required]),
      status: new FormControl(data.status || 'Pending'),
    });
  }

  get titleControl(): FormControl {
    return this.taskForm.get('title') as FormControl;
  }

  onCancel(): void {
    this.dialogRef.close();
  }

  onSave() {
    if (this.taskForm.valid) {
      this.dialogRef.close(this.taskForm.value);
    }
  }
}
