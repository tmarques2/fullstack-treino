import { CommonModule } from "@angular/common";
import { Component, OnInit, ChangeDetectorRef, inject } from "@angular/core";
import { Task } from "../../../core/models/task.model";
import { TaskService } from "../../../core/services/task";


import {
  TaskCreationData,
  TaskForm
} from "../task-form/task-form";

import {
  TaskItem,
  TaskTitleUpdate
} from "../task-item/task-item";

import { TaskFilter } from "../../../core/models/task-filter.model";

import { TaskSummary } from "../task-summary/task-summary";
import { TaskToolbar } from '../task-toolbar/task-toolbar';


import { TaskLoading } from '../../../shared/components/task-loading/task-loading';
import { TaskEmptyState } from '../../../shared/components/task-empty-state/task-empty-state';
import { TaskErrorState } from '../../../shared/components/task-error-state/task-error-state';
import { TaskDeleteConfirmDialog } from '../../../shared/components/task-delete-confirm-dialog/task-delete-confirm-dialog';
import {
  TaskToast,
  TaskToastType
} from '../../../shared/components/task-toast/task-toast';



@Component({
  selector: 'app-task-list',
  imports: [
    CommonModule,
    TaskForm,
    TaskItem,
    TaskSummary,
    TaskLoading,
    TaskEmptyState,
    TaskErrorState,
    TaskToolbar,
    TaskDeleteConfirmDialog,
    TaskToast
  ],
  templateUrl: './task-list.html',
  styleUrl: './task-list.css',
})
export class TaskList implements OnInit {
  private readonly changeDetectorRef = inject(ChangeDetectorRef);

  tasks: Task[] = [];
  activeFilter: TaskFilter = 'all';

  isLoading = false;
  errorMessage = '';
  searchTerm = '';
  taskPendingDeletion: Task | null = null;

  toastMessage = '';
  toastType: TaskToastType = 'success';


  constructor(private readonly taskService: TaskService) { }


  ngOnInit(): void {
    this.loadTasks();
  }

  get filteredTasks(): Task[] {
    const normalizedSearchTerm = this.searchTerm.trim().toLowerCase();

    return this.tasks.filter((task) => {
      const matchesSearch =
        !normalizedSearchTerm ||
        task.title.toLowerCase().includes(normalizedSearchTerm);

      const matchesFilter =
        this.activeFilter === 'all' ||
        (this.activeFilter === 'pending' && !task.completed) ||
        (this.activeFilter === 'completed' && task.completed);

      return matchesSearch && matchesFilter;
    });
  }

  get pendingTasksCount(): number {
    return this.tasks.filter((task) => !task.completed).length
  }

  get totalTasksCount(): number {
    return this.tasks.length;
  }

  get completedTasksCount(): number {
    return this.tasks.filter((task) => task.completed).length;
  }


  /**
 * Creates a task using the data emitted by the task form.
 *
 * @param taskData The title, priority, and optional due date of the new task.
 */
  addTask(taskData: TaskCreationData): void {
    this.taskService
      .addTask(
        taskData.title,
        taskData.priority,
        taskData.dueDate
      )
      .subscribe({
        next: (createdTask) => {
          this.tasks = [...this.tasks, createdTask];
          this.showToast('Tarefa criada com sucesso.');
          this.changeDetectorRef.markForCheck();
        },
        error: (error) => {
          console.error('Unable to create the task.', error);
          this.showToast('Não foi possível criar a tarefa.', 'error');
          this.changeDetectorRef.markForCheck();
        }
      });
  }


  toggleTask(taskId: number): void {
    this.taskService.toggleTask(taskId).subscribe({
      next: (updatedTask) => {
        this.tasks = this.tasks.map((task) =>
          task.id === taskId ? updatedTask : task
        );
        this.showToast(
          updatedTask.completed
            ? 'Tarefa concluída.'
            : 'Tarefa marcada como pendente.'
        );
        this.changeDetectorRef.markForCheck();
      },
      error: (error) => {
        console.error('Unable to update the task.', error);
        this.showToast('Não foi possível atualizar a tarefa.', 'error');
        this.changeDetectorRef.markForCheck();
      }
    });
  }

  /**
 * Updates a task title through the API and refreshes the local task list.
 *
 * @param update The task identifier and the new title requested by the user.
 */
  updateTaskTitle(update: TaskTitleUpdate): void {
    this.taskService.updateTaskTitle(update.taskId, update.title).subscribe({
      next: (updatedTask) => {
        this.tasks = this.tasks.map((task) =>
          task.id === updatedTask.id ? updatedTask : task
        );

        this.showToast('Tarefa atualizada com sucesso.');
        this.changeDetectorRef.markForCheck();
      },
      error: (error) => {
        console.error('Unable to update the task title.', error);

        this.showToast('Não foi possível atualizar o título da tarefa.', 'error');
        this.changeDetectorRef.markForCheck();
      }
    });
  }


  /**
 * Deletes a task from the API and removes it from the local task list.
 *
 * @param taskId The identifier of the task to delete.
 */
  deleteTask(taskId: number): void {
    this.taskService.deleteTask(taskId).subscribe({
      next: () => {
        this.tasks = this.tasks.filter((task) => task.id !== taskId);
        this.showToast('Tarefa excluída com sucesso.');
        this.changeDetectorRef.markForCheck();
      },
      error: (error) => {
        console.error('Unable to delete the task.', error);
        this.showToast('Não foi possível excluir a tarefa.', 'error');
        this.changeDetectorRef.markForCheck();
      }
    });
  }


  /**
 * Updates the active task filter.
 *
 * @param filter The filter selected by the user.
 */
  setFilter(filter: TaskFilter): void {
    this.activeFilter = filter;
  }

  /**
 * Updates the text used to filter tasks by title.
 *
 * @param searchTerm The term entered in the search field.
 */
  setSearchTerm(searchTerm: string): void {
    this.searchTerm = searchTerm;
  }

  /**
 * Opens the deletion confirmation dialog for the selected task.
 *
 * @param taskId The identifier of the task selected for deletion.
 */
  openDeleteConfirmation(taskId: number): void {
    const task = this.tasks.find((currentTask) => currentTask.id === taskId);

    if (!task) {
      return;
    }

    this.taskPendingDeletion = task;
  }

  /**
   * Deletes the task selected in the confirmation dialog.
   */
  confirmDeletion(): void {
    const taskId = this.taskPendingDeletion?.id;

    if (taskId === undefined) {
      return;
    }

    this.taskPendingDeletion = null;
    this.deleteTask(taskId);
  }

  /**
   * Closes the deletion confirmation dialog without deleting the task.
   */
  cancelDeletion(): void {
    this.taskPendingDeletion = null;
  }

  /**
 * Shows a toast notification with the provided message and visual type.
 *
 * @param message The text displayed to the user.
 * @param type The visual type of the toast notification.
 */
  showToast(message: string, type: TaskToastType = 'success'): void {
    this.toastMessage = message;
    this.toastType = type;
    this.changeDetectorRef.markForCheck();
  }

  /**
   * Clears the active toast notification.
   */
  hideToast(): void {
    this.toastMessage = '';
    this.changeDetectorRef.markForCheck();
  }

  /**
 * Loads all tasks from the API and updates the screen states.
 */
  loadTasks(): void {
    this.isLoading = true;
    this.errorMessage = '';
    this.changeDetectorRef.markForCheck();

    this.taskService.getTasks().subscribe({
      next: (tasks) => {
        this.tasks = tasks;
        this.isLoading = false;
        this.changeDetectorRef.markForCheck();
      },
      error: (error) => {
        console.error('Unable to load tasks from the API.', error);

        this.errorMessage =
          'Verifique se o backend Spring Boot está em execução na porta 8080 e tente novamente.';

        this.isLoading = false;
        this.changeDetectorRef.markForCheck();
      }
    });
  }


}