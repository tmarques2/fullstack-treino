import { Component, input } from '@angular/core';

@Component({
  selector: 'app-task-summary',
  templateUrl: './task-summary.html',
  styleUrl: './task-summary.css',
})
export class TaskSummary {
  readonly totalTasks = input.required<number>();
  readonly pendingTasks = input.required<number>();
  readonly completedTasks = input.required<number>();
}
