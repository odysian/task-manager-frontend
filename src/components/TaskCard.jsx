function TaskCard({ task, onToggle, onDelete }) {
  return (
    <li
      key={task.id}
      style={{ marginBottom: '10px', display: 'flex', alignItems: 'center' }}
    >
      <input
        type="checkbox"
        checked={task.completed}
        onChange={() => onToggle(task.id, task.completed)}
      />
      <span
        style={{
          textDecoration: task.completed ? 'line-through' : 'none',
          marginLeft: '10px',
          flex: 1,
        }}
      >
        {task.title}
      </span>
      <span
        style={{
          color: '#666',
          fontSize: '12px',
          marginLeft: '10px',
        }}
      >
        {task.priority}
      </span>
      <button onClick={() => onDelete(task.id)}>Delete</button>
    </li>
  );
}

export default TaskCard;
