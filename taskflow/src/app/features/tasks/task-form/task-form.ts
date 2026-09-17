import { Component, output } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { TaskPriority } from '../../../core/models/task.model';

/**
 * Represents the data collected when a user creates a task.
 */
export interface TaskCreationData {
  title: string;
  priority: TaskPriority;
  dueDate: string | null;
}

/**
 * Collects a task title and emits it to the parent component.
 */
@Component({
  selector: 'app-task-form',
  imports: [FormsModule],
  templateUrl: './task-form.html',
  styleUrl: './task-form.css',
})
export class TaskForm {
  newTaskTitle = '';
  newTaskPriority: TaskPriority = 'MEDIUM';
  newTaskDueDate = '';

  readonly taskCreated = output<TaskCreationData>();

  /**
   * Emits the task title when the form is valid.
   */
  submitTask(): void {
    const title = this.newTaskTitle.trim();

    if (!title) {
      return;
    }

    this.taskCreated.emit({
      title,
      priority: this.newTaskPriority,
      dueDate: this.newTaskDueDate || null
    });

    this.resetForm();
  }

  private resetForm(): void {
    this.newTaskTitle = '';
    this.newTaskPriority = 'MEDIUM';
    this.newTaskDueDate = '';
  }
}
