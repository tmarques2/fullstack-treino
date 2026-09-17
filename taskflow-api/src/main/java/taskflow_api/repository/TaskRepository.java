package taskflow_api.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import taskflow_api.model.Task;


public interface TaskRepository extends JpaRepository<Task, Long> {

}
