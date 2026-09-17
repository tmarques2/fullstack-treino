/**
 * Represents the priority levels supported by a task.
 */
export type TaskPriority = 'LOW' | 'MEDIUM' | 'HIGH';

/**
 * Represents a task returned by the TaskFlow API.
 */
export interface Task {
    id: number;
    title: string;
    completed: boolean;
    priority: TaskPriority;
    dueDate: string | null;
    createdAt: string;
}