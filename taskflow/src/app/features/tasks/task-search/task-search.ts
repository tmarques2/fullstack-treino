import { Component, input, output } from '@angular/core';

/**
 * Provides a search field and emits the typed search term.
 */
@Component({
  selector: 'app-task-search',
  templateUrl: './task-search.html',
  styleUrl: './task-search.css'
})
export class TaskSearch {
  readonly searchTerm = input('');

  readonly searchChanged = output<string>();

  /**
   * Emits the current text entered by the user.
   *
   * @param event The native input event.
   */
  updateSearch(event: Event): void {
    const inputElement = event.target as HTMLInputElement;

    this.searchChanged.emit(inputElement.value);
  }

  /**
   * Clears the current search term.
   */
  clearSearch(): void {
    this.searchChanged.emit('');
  }
}
