package taskflow_api.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

/**
 * Represents the data required to update an existing task title.
 *
 * @param title The new title for the task.
 */
public record UpdateTaskRequest(
        @NotBlank(message = "Task title is required")
        @Size(max = 120, message = "Task title must not exceed 120 characters")
        String title
) {
}
