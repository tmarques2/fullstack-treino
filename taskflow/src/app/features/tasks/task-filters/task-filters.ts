import { Component, input, output } from '@angular/core';

import { TaskFilter } from '../../../core/models/task-filter.model';

/**
 * Displays task filtering options and emits the selected filter.
 */
@Component({
  selector: 'app-task-filters',
  templateUrl: './task-filters.html',
  styleUrl: './task-filters.css'
})
export class TaskFilters {
  readonly activeFilter = input.required<TaskFilter>();

  readonly filterChanged = output<TaskFilter>();

  /**
   * Emits the filter selected by the user.
   *
   * @param filter The selected task filter.
   */
  selectFilter(filter: TaskFilter): void {
    this.filterChanged.emit(filter);
  }
}
