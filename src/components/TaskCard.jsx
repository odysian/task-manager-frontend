import { useState } from 'react';

function TaskCard({ task, onToggle, onDelete }) {
  // 1. STATE: Tracks if the card details are visible
  const [isExpanded, setIsExpanded] = useState(false);

  // 2. LOGIC: Check if task is overdue (Past due date AND not completed)
  const isOverdue =
    task.due_date && !task.completed && new Date(task.due_date) < new Date();

  // 3. STYLES: Extracted to keep JSX clean
  const styles = {
    card: 'group bg-zinc-900 border border-zinc-800 rounded-lg overflow-hidden transition-all hover:border-emerald-500/50 shadow-sm',

    // The main clickable row
    header:
      'flex items-center justify-between p-4 cursor-pointer hover:bg-zinc-800/50 transition-colors',

    checkbox:
      'w-5 h-5 accent-emerald-500 cursor-pointer rounded bg-zinc-800 border-zinc-600 focus:ring-emerald-500',

    // The hidden details section
    detailsContainer:
      'px-14 pb-4 pt-0 text-sm animate-in slide-in-from-top-2 duration-200',
    detailsGrid:
      'pt-4 border-t border-zinc-800/50 grid grid-cols-1 md:grid-cols-2 gap-4',

    // Text labels
    label: 'text-xs font-bold text-zinc-500 uppercase tracking-wider mb-1',

    // The Delete button (hidden until hover)
    deleteBtn:
      'cursor-pointer p-2 text-zinc-500 hover:text-red-400 hover:bg-red-950/30 rounded transition-all opacity-0 group-hover:opacity-100',
  };

  // Dynamic colors for Priority Badges
  const priorityColors = {
    high: 'border-l-red-500 text-red-400 bg-red-950/30',
    medium: 'border-l-yellow-500 text-yellow-400 bg-yellow-950/30',
    low: 'border-l-emerald-500 text-emerald-400 bg-emerald-950/30',
  };

  return (
    <div className={styles.card}>
      {/* HEADER ROW (Click to Expand) */}
      <div className={styles.header} onClick={() => setIsExpanded(!isExpanded)}>
        {/* Left Side: Checkbox + Title */}
        <div className="flex items-center gap-4 flex-1">
          <input
            type="checkbox"
            checked={task.completed}
            // Stop click from bubbling to parent div (prevents expanding)
            onClick={(e) => e.stopPropagation()}
            onChange={() => onToggle(task.id, task.completed)}
            className={styles.checkbox}
          />

          <div className="flex flex-col">
            <div className="flex items-center gap-2">
              <span
                className={`font-medium transition-all ${
                  task.completed
                    ? 'line-through text-zinc-600'
                    : 'text-zinc-100 group-hover:text-white'
                }`}
              >
                {task.title}
              </span>

              {/* Overdue Badge */}
              {isOverdue && (
                <span className="px-1.5 py-0.5 text-[10px] font-bold text-red-400 bg-red-950/50 border border-red-900/50 rounded uppercase tracking-wider">
                  Overdue
                </span>
              )}
            </div>

            {/* Tags */}
            {task.tags && task.tags.length > 0 && (
              <div className="flex gap-2 mt-1">
                {task.tags.map((tag, i) => (
                  <span key={i} className="text-xs text-zinc-500">
                    #{tag}
                  </span>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Right Side: Priority + Expand Icon + Delete */}
        <div className="flex items-center gap-4">
          <span
            className={`
              w-20 text-center shrink-0 block
              py-1 text-xs font-bold uppercase rounded border-l-4 
              shadow-sm
              ${priorityColors[task.priority] || priorityColors.medium}
            `}
          >
            {task.priority}
          </span>

          {/* Visual Indicator (Rotates when open) */}
          <span
            className="text-zinc-600 text-xs transition-transform duration-200"
            style={{
              transform: isExpanded ? 'rotate(180deg)' : 'rotate(0deg)',
            }}
          >
            ▼
          </span>

          <button
            onClick={(e) => {
              e.stopPropagation();
              onDelete(task.id);
            }}
            className={styles.deleteBtn}
            title="Delete Task"
          >
            ✖
          </button>
        </div>
      </div>

      {/* EXPANDED DETAILS */}
      {isExpanded && (
        <div className={styles.detailsContainer}>
          <div className={styles.detailsGrid}>
            {/* Description */}
            <div className="md:col-span-2">
              <p className={styles.label}>Description</p>
              <p className="text-zinc-300 whitespace-pre-wrap leading-relaxed">
                {task.description || 'No description provided.'}
              </p>
            </div>

            {/* Created Date */}
            <div>
              <p className={styles.label}>Created</p>
              <p className="text-zinc-400 font-mono text-xs">
                {new Date(task.created_at).toLocaleString()}
              </p>
            </div>

            {/* Due Date (Only if exists) */}
            {task.due_date && (
              <div>
                <p
                  className={`${styles.label} ${
                    isOverdue ? 'text-red-500' : ''
                  }`}
                >
                  Due Date
                </p>

                <p
                  className={`font-mono text-xs ${
                    isOverdue ? 'text-red-400 font-bold' : 'text-emerald-400'
                  }`}
                >
                  {new Date(task.due_date).toLocaleDateString()}
                </p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default TaskCard;
