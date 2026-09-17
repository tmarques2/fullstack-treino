package taskflow_api.controller;

import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import jakarta.validation.Valid;
import taskflow_api.dto.CreateTaskRequest;
import taskflow_api.dto.UpdateTaskRequest;
import taskflow_api.model.Task;
import taskflow_api.service.TaskService;

/**
 * Exposes HTTP endpoints used to manage tasks.
 */
@RestController
@RequestMapping("/api/tasks")
@CrossOrigin(origins = "http://localhost:4200")
public class TaskController {

    private final TaskService taskService;

    /**
     * Creates the controller with access to task business rules.
     *
     * @param taskService Service responsible for task operations.
     */
    public TaskController(TaskService taskService) {
        this.taskService = taskService;
    }

    /**
     * Returns all tasks stored in the database.
     *
     * @return A list containing all tasks.
     */
    @GetMapping
    public List<Task> getAllTasks() {
        return taskService.getAllTasks();
    }

    /**
     * Creates and saves a new task.
     *
     * @param request Data received from the HTTP request body.
     * @return The saved task.
     */
    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public Task createTask(@Valid @RequestBody CreateTaskRequest request) {
        return taskService.createTask(
                request.title(),
                request.priority(),
                request.dueDate()
        );
    }

    /**
     * Changes the completion status of a task.
     *
     * @param taskId The identifier of the task to update.
     * @return The task after its completion status has changed.
     */
    @PatchMapping("/{taskId}/toggle")
    public Task toggleTask(@PathVariable Long taskId) {
        return taskService.toggleTask(taskId);
    }

    /**
     * Updates the title of an existing task.
     *
     * @param taskId The identifier of the task to update.
     * @param request Data containing the new task title.
     * @return The task after its title has been updated.
     */
    @PatchMapping("/{taskId}")
    public Task updateTaskTitle(
            @PathVariable Long taskId,
            @Valid @RequestBody UpdateTaskRequest request
    ) {
        return taskService.updateTaskTitle(taskId, request.title());
    }


    /**
     * Deletes a task using its identifier.
     *
     * @param taskId The identifier of the task to delete.
     */
    @DeleteMapping("/{taskId}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void deleteTask(@PathVariable Long taskId) {
        taskService.deleteTask(taskId);
    }
}
