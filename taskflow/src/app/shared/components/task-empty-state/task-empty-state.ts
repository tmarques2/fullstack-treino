import { Component, input } from '@angular/core';

import { TaskFilter } from '../../../core/models/task-filter.model';

/**
 * Displays an empty-state message when no tasks match the current filter.
 */
@Component({
  selector: 'app-task-empty-state',
  templateUrl: './task-empty-state.html',
  styleUrl: './task-empty-state.css'
})
export class TaskEmptyState {
  readonly filter = input.required<TaskFilter>();

  /**
   * Returns a message according to the active filter.
   */
  get title(): string {
    if (this.filter() === 'pending') {
      return 'Nenhuma tarefa pendente.';
    }

    if (this.filter() === 'completed') {
      return 'Nenhuma tarefa concluída.';
    }

    return 'Nenhuma tarefa encontrada.';
  }

  /**
   * Returns a contextual description according to the active filter.
   */
  get description(): string {
    if (this.filter() === 'pending') {
      return 'Você concluiu todas as tarefas disponíveis.';
    }

    if (this.filter() === 'completed') {
      return 'Conclua uma tarefa para vê-la nesta lista.';
    }

    return 'Crie sua primeira tarefa para começar a organizar seu dia.';
  }
}
