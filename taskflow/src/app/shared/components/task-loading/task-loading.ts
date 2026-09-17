import { Component, input } from '@angular/core';

@Component({
  selector: 'app-task-loading',
  templateUrl: './task-loading.html',
  styleUrl: './task-loading.css',
})
export class TaskLoading {
  readonly message = input('Carregando tarefas...');
}
