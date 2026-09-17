import { Component, OnDestroy, effect, input, output } from '@angular/core';

export type TaskToastType = 'success' | 'error';

/**
 * Displays a temporary toast notification for success or error feedback.
 *
 * The component automatically closes after four seconds and can also be
 * dismissed manually by the user.
 */
@Component({
  selector: 'app-task-toast',
  templateUrl: './task-toast.html',
  styleUrl: './task-toast.css'
})
export class TaskToast implements OnDestroy {
  readonly message = input('');

  readonly type = input<TaskToastType>('success');

  readonly dismissed = output<void>();

  private timeoutId: ReturnType<typeof setTimeout> | undefined;

  constructor() {
    effect(() => {
      const currentMessage = this.message();

      this.clearTimeout();

      if (!currentMessage) {
        return;
      }

      this.timeoutId = setTimeout(() => {
        this.close();
      }, 4000);
    });
  }

  /**
   * Emits an event requesting the parent component to hide the toast.
   */
  close(): void {
    this.clearTimeout();
    this.dismissed.emit();
  }

  /**
   * Clears the current automatic-dismiss timer.
   */
  ngOnDestroy(): void {
    this.clearTimeout();
  }

  /**
   * Cancels the active timer when one exists.
   */
  private clearTimeout(): void {
    if (this.timeoutId) {
      clearTimeout(this.timeoutId);
      this.timeoutId = undefined;
    }
  }
}
