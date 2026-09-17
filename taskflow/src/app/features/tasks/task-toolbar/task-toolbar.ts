import { Component, input, output } from '@angular/core';

import { TaskFilter } from '../../../core/models/task-filter.model';
import { TaskFilters } from '../task-filters/task-filters';
import { TaskSearch } from '../task-search/task-search';

/**
 * Groups task search and filter controls.
 *
 * The component receives the current search term and active filter from the
 * parent component, then forwards user interactions back through outputs.
 */
@Component({
  selector: 'app-task-toolbar',
  imports: [TaskSearch, TaskFilters],
  templateUrl: './task-toolbar.html',
  styleUrl: './task-toolbar.css'
})
export class TaskToolbar {
  readonly searchTerm = input('');

  readonly activeFilter = input.required<TaskFilter>();

  readonly searchChanged = output<string>();

  readonly filterChanged = output<TaskFilter>();

  /**
   * Forwards the search term emitted by the search component.
   *
   * @param searchTerm The search term entered by the user.
   */
  handleSearchChanged(searchTerm: string): void {
    this.searchChanged.emit(searchTerm);
  }

  /**
   * Forwards the selected filter emitted by the filters component.
   *
   * @param filter The selected task filter.
   */
  handleFilterChanged(filter: TaskFilter): void {
    this.filterChanged.emit(filter);
  }
}
