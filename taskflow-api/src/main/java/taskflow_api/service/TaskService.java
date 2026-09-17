package taskflow_api.service;

import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;
import taskflow_api.model.Task;
import taskflow_api.model.TaskPriority;
import taskflow_api.repository.TaskRepository;

import java.time.LocalDate;
import java.util.List;

/**
 * Contains the business rules used to manage tasks.
 */
@Service
public class TaskService {
    private final TaskRepository taskRepository;

    /**
     * Creates the service with access to the task repository.
     *
     * @param taskRepository Repository used to access task data.
     */
    public TaskService(TaskRepository taskRepository){
        this.taskRepository = taskRepository;
    }

    /**
     * Returns every task stored in the database.
     *
     * @return A list containing all saved tasks.
     */
    public List<Task> getAllTasks(){
        return taskRepository.findAll();
    }

    /**
     * Creates a task with the default priority and no due date.
     *
     * @param title The title of the new task.
     * @return The saved task.
     */
    public Task createTask(String title) {
        return createTask(title, null, null);
    }

    /**
     * Creates and saves a new task with optional priority and due date.
     *
     * @param title The title of the new task.
     * @param priority The optional priority of the task.
     * @param dueDate The optional due date of the task.
     * @return The saved task.
     */
    public Task createTask(String title, TaskPriority priority, LocalDate dueDate) {
        Task task = new Task();

        task.setTitle(title.trim());
        task.setCompleted(false);
        task.setPriority(
                priority != null ? priority : TaskPriority.MEDIUM
        );
        task.setDueDate(dueDate);

        return taskRepository.save(task);
    }

    /**
     * Changes the completion status of a task.
     *
     * @param taskId The identifier of the task to update.
     * @return The updated task.
     */
    public Task toggleTask(Long taskId) {
        Task task = findTaskById(taskId);

        task.setCompleted(!task.isCompleted());

        return taskRepository.save(task);
    }

    /**
     * Updates the title of an existing task.
     *
     * @param taskId The identifier of the task to update.
     * @param title The new title for the task.
     * @return The task after its title has been updated.
     */
    public Task updateTaskTitle(Long taskId, String title) {
        Task task = findTaskById(taskId);

        task.setTitle(title.trim());

        return taskRepository.save(task);
    }

    /**
     * Deletes a task using its identifier.
     *
     * @param taskId The identifier of the task to delete.
     */
    public void deleteTask(Long taskId) {
        Task task = findTaskById(taskId);

        taskRepository.delete(task);
    }

    /**
     * Finds a task or returns an HTTP 404 error when it does not exist.
     *
     * @param taskId The identifier of the requested task.
     * @return The task found in the database.
     */
    private Task findTaskById(Long taskId) {
        return taskRepository.findById(taskId)
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.NOT_FOUND,
                        "Task not found"
                ));
    }
}
