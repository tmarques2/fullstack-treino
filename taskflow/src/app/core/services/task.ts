import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { Task, TaskPriority } from '../models/task.model';

/**
 * Handles communication between the Angular application and the TaskFlow API.
 */
@Injectable({
  providedIn: 'root'
})
export class TaskService {
  private readonly http = inject(HttpClient);

  private readonly apiUrl = 'http://localhost:8080/api/tasks';

  /**
   * Retrieves every task stored by the backend.
   *
   * @returns An observable containing the task list.
   */
  getTasks(): Observable<Task[]> {
    return this.http.get<Task[]>(this.apiUrl);
  }

  /**
   * Creates a new task through the backend API.
   *
   * @param title The title of the task to create.
   * @param priority The priority assigned to the task.
   * @param dueDate The optional task due date in ISO format.
   * @returns An observable containing the created task.
   */
  addTask(
    title: string,
    priority : TaskPriority = 'MEDIUM',
    dueDate: string | null = null
  ): Observable<Task> {
    return this.http.post<Task>(this.apiUrl, {
      title: title.trim(),
      priority,
      dueDate
    });
  }

  /**
   * Changes the completion status of a task.
   *
   * @param taskId The identifier of the task to update.
   * @returns An observable containing the updated task.
   */
  toggleTask(taskId: number): Observable<Task> {
    return this.http.patch<Task>(
      `${this.apiUrl}/${taskId}/toggle`,
      null
    );
  }

  /**
 * Updates the title of an existing task.
 *
 * @param taskId The identifier of the task to update.
 * @param title The new task title.
 * @returns An observable containing the updated task.
 */
  updateTaskTitle(taskId: number, title: string): Observable<Task> {
    return this.http.patch<Task>(`${this.apiUrl}/${taskId}`, {
      title: title.trim()
    });
  }

  /**
   * Deletes a task through the backend API.
   *
   * @param taskId The identifier of the task to delete.
   * @returns An observable completed when the task is deleted.
   */
  deleteTask(taskId: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${taskId}`);
  }
}
