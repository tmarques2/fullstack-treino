package taskflow_api.dto;

import jakarta.validation.constraints.FutureOrPresent;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import taskflow_api.model.TaskPriority;

import java.time.LocalDate;

/**
 * Represents the data required to create a new task.
 *
 * @param title The title of the task to create.
 * @param priority The optional priority assigned to the task.
 * @param dueDate The optional due date of the task.
 */
public record CreateTaskRequest (
        @NotBlank(message = "Task title is required")
        @Size(max = 120, message = "Task title must not exceed 120 characters")
        String title,

        TaskPriority priority,

        @FutureOrPresent(message = "Due date must be today or in the future")
        LocalDate dueDate
) {
}
