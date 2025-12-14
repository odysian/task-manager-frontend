function TaskForm({ newTaskTitle, onTaskTitleChange, onAddTask }) {
  return (
    <div style={{ marginTop: '20px', marginBottom: '20px' }}>
      <input
        type="text"
        placeholder="New task title..."
        value={newTaskTitle}
        onChange={(e) => onTaskTitleChange(e.target.value)}
        onKeyDown={(e) => e.key === 'Enter' && onAddTask()}
        style={{ padding: '8px', width: '300px' }}
      />
      <button onClick={onAddTask} style={{ marginLeft: '10px' }}>
        Add Task
      </button>
    </div>
  );
}
export default TaskForm;
