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
    @Inject(MAT_DIALOG_DATA) public data: Task
  ) {
    this.taskForm = new FormGroup({
      title: new FormControl(data.title, [Validators.required]),
    });
  }

  onCancel(): void {
    this.dialogRef.close();
  }
  onSave(): void {
    if (this.taskForm.valid) {
      this.dialogRef.close(this.taskForm.value);
    }
  }
  //onSave(): void {
  //  if (this.taskForm.valid) {
  //    const taskData = {
  //      title: this.taskForm.value.title,
  //      status: 'Pending' // Hardcoded status
  //    };
  //    this.dialogRef.close(taskData);
  //    console.log('TaskDialogComponent: Saving task', taskData); // Debugging
  //  }
  //}
}
