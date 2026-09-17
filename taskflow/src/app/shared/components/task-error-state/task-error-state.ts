import { Component, input, output } from '@angular/core';

/**
 * Displays an error message and allows the user to retry an operation.
 */
@Component({
  selector: 'app-task-error-state',
  templateUrl: './task-error-state.html',
  styleUrl: './task-error-state.css'
})
export class TaskErrorState {
  readonly message = input.required<string>();

  readonly retryRequested = output<void>();

  /**
   * Emits an event requesting that the parent retries the failed operation.
   */
  requestRetry(): void {
    this.retryRequested.emit();
  }
}
