import { Component, input, output } from '@angular/core';

/**
 * Displays a confirmation dialog before a task is permanently deleted.
 *
 * The parent component controls whether this dialog is rendered and reacts
 * to the confirmed or cancelled events emitted by this component.
 */
@Component({
  selector: 'app-task-delete-confirm-dialog',
  templateUrl: './task-delete-confirm-dialog.html',
  styleUrl: './task-delete-confirm-dialog.css',
  host: {
    '(document:keydown.escape)': 'handleCancel()'
  }
})
export class TaskDeleteConfirmDialog {
  readonly taskTitle = input.required<string>();

  readonly confirmed = output<void>();

  readonly cancelled = output<void>();

  /**
   * Emits an event confirming that the current task should be deleted.
   */
  handleConfirm(): void {
    this.confirmed.emit();
  }

  /**
   * Emits an event indicating that deletion was cancelled.
   */
  handleCancel(): void {
    this.cancelled.emit();
  }
}
