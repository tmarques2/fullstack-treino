package taskflow_api.model;

import jakarta.persistence.*;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Table(name = "tasks")
public class Task {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private long id;

    @Column(nullable = false, length = 120)
    private String title;

    @Column(nullable = false)
    private boolean completed;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 10)
    private TaskPriority priority = TaskPriority.MEDIUM;

    @Column
    private LocalDate dueDate;

    @Column(nullable = false, updatable = false)
    private LocalDateTime createdAt;



    /**
     * Sets default values before a new task is inserted into the database.
     */
    @PrePersist
    private void setDefaulValues(){
        if (createdAt == null){
            createdAt = LocalDateTime.now();
        }
    }

    /**
     * Returns the task identifier.
     *
     * @return The task identifier.
     */
    public long getId(){
        return id;
    }

    /**
     * Updates the task identifier.
     *
     * @param id The task identifier.
     */
    public void setId(Long id){
        this.id = id;
    }

    /**
     * Returns the task title.
     *
     * @return The task title.
     */
    public String getTitle(){
        return title;
    }

    /**
     * Updates the task title.
     *
     * @param title The new task title.
     */
    public void setTitle(String title){
        this.title = title;
    }

    /**
     * Returns the task completion status.
     *
     * @return True when the task is completed.
     */
    public boolean isCompleted(){
        return completed;
    }

    /**
     * Updates the task completion status.
     *
     * @param completed The new task completion status.
     */
    public void setCompleted(boolean completed) {
        this.completed = completed;
    }

    /**
     * Returns the task priority.
     *
     * @return The priority assigned to the task.
     */
    public TaskPriority getPriority() {
        return priority;
    }

    /**
     * Updates the task priority.
     *
     * @param priority The new priority assigned to the task.
     */
    public void setPriority(TaskPriority priority) {
        this.priority = priority;
    }

    /**
     * Returns the optional due date of the task.
     *
     * @return The due date, or null when no due date was defined.
     */
    public LocalDate getDueDate() {
        return dueDate;
    }

    /**
     * Updates the optional due date of the task.
     *
     * @param dueDate The new due date, or null to remove it.
     */
    public void setDueDate(LocalDate dueDate) {
        this.dueDate = dueDate;
    }

    /**
     * Returns the date and time when the task was created.
     *
     * @return The task creation date and time.
     */
    public LocalDateTime getCreatedAt(){
        return createdAt;
    }

    /**
     * Returns the date and time when the task was created.
     *
     * @return The task creation date and time.
     */
    public void setCreatedAt(LocalDateTime createdAt){
        this.createdAt = createdAt;
    }
}
