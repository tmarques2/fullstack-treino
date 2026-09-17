import { Component, input, output, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { Task, TaskPriority } from '../../../core/models/task.model';

export interface TaskTitleUpdate {
  taskId: number;
  title: string;
}

/**
 * Displays one task and emits user actions to the parent component.
 *
 * Supports changing a task title locally before requesting the API update.
 */
@Component({
  selector: 'app-task-item',
  imports: [FormsModule],
  templateUrl: './task-item.html',
  styleUrl: './task-item.css'
})
export class TaskItem {
  readonly task = input.required<Task>();

  readonly taskToggled = output<number>();
  readonly taskDeleted = output<number>();
  readonly taskEdited = output<TaskTitleUpdate>();

  readonly isEditing = signal(false);

  editTitle = '';

  /**
   * Emits the identifier of the task that should change completion status.
   */
  requestToggle(): void {
    this.taskToggled.emit(this.task().id);
  }

  /**
   * Emits the identifier of the task that should be deleted.
   */
  requestDelete(): void {
    this.taskDeleted.emit(this.task().id);
  }

  /**
   * Opens the inline title editing mode.
   */
  startEdit(): void {
    this.editTitle = this.task().title;
    this.isEditing.set(true);
  }

  /**
   * Validates and emits the requested title update.
   */
  saveEdit(): void {
    const normalizedTitle = this.editTitle.trim();

    if (!normalizedTitle) {
      return;
    }

    if (normalizedTitle === this.task().title) {
      this.cancelEdit();
      return;
    }

    this.taskEdited.emit({
      taskId: this.task().id,
      title: normalizedTitle
    });

    this.isEditing.set(false);
  }

  /**
   * Closes the editing mode without changing the task title.
   */
  cancelEdit(): void {
    this.editTitle = '';
    this.isEditing.set(false);
  }

  /**
   * Returns the Portuguese label associated with a task priority.
   *
   * @param priority The priority received from the API.
   * @returns A user-friendly priority label.
   */
  getPriorityLabel(priority: TaskPriority): string {
    const labels: Record<TaskPriority, string> = {
      LOW: 'Baixa',
      MEDIUM: 'Média',
      HIGH: 'Alta'
    };

    return labels[priority];
  }

  /**
   * Formats an ISO date received from the API without timezone conversion.
   *
   * @param dueDate The date in YYYY-MM-DD format, or null.
   * @returns A Brazilian-formatted date or a fallback label.
   */
  formatDueDate(dueDate: string | null): string {
    if (!dueDate) {
      return 'Sem prazo';
    }

    const [year, month, day] = dueDate.split('-');

    if (!year || !month || !day) {
      return dueDate;
    }

    return `${day}/${month}/${year}`;
  }
}
