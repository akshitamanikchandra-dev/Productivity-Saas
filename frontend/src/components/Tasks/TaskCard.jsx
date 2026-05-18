import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { updateTask, deleteTask } from '../../store/slices/tasksSlice';
import styles from './TaskCard.module.css';

const STATUS_OPTIONS = ['Pending', 'In Progress', 'Completed'];
const CATEGORY_COLORS = {
  Work: '#3b82f6', Personal: '#a855f7', Health: '#22c55e',
  Learning: '#f59e0b', Finance: '#10b981', Other: '#6b7280',
};

const getPriorityLabel = (score) => {
  if (score >= 10000) return { label: 'OVERDUE', cls: 'overdue' };
  if (score >= 800)   return { label: 'CRITICAL', cls: 'critical' };
  if (score >= 500)   return { label: 'HIGH', cls: 'high' };
  if (score >= 200)   return { label: 'MEDIUM', cls: 'medium' };
  return { label: 'LOW', cls: 'low' };
};

const formatDate = (d) => new Date(d).toLocaleDateString('en-US', {
  month: 'short', day: 'numeric', year: 'numeric'
});

const isOverdue = (deadline, status) =>
  status !== 'Completed' && new Date(deadline) < new Date();

export default function TaskCard({ task, onEdit }) {
  const dispatch = useDispatch();
  const [deleting, setDeleting] = useState(false);
  const [statusChanging, setStatusChanging] = useState(false);

  const priority = getPriorityLabel(task.priorityScore);
  const overdue = isOverdue(task.deadline, task.status);

  const handleStatusChange = async (e) => {
    setStatusChanging(true);
    await dispatch(updateTask({ id: task._id, data: { status: e.target.value } }));
    setStatusChanging(false);
  };

  const handleDelete = async () => {
    if (!window.confirm('Delete this task?')) return;
    setDeleting(true);
    await dispatch(deleteTask(task._id));
  };

  return (
    <div className={`${styles.card} ${overdue ? styles.overdueCard : ''} fade-in`}>
      <div className={styles.header}>
        <span
          className={`${styles.priority} ${styles[priority.cls]}`}
        >
          {priority.label}
        </span>
        <span
          className={styles.category}
          style={{ color: CATEGORY_COLORS[task.category] || '#6b7280',
                   background: (CATEGORY_COLORS[task.category] || '#6b7280') + '18' }}
        >
          {task.category}
        </span>
      </div>

      <h3 className={styles.title}>{task.title}</h3>
      {task.description && (
        <p className={styles.desc}>{task.description}</p>
      )}

      <div className={styles.meta}>
        <span className={`${styles.deadline} ${overdue ? styles.overdueDate : ''}`}>
          <svg width="13" height="13" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
            <rect x="3" y="4" width="18" height="18" rx="2"/><path d="M16 2v4M8 2v4M3 10h18"/>
          </svg>
          {formatDate(task.deadline)}
          {overdue && ' · Overdue'}
        </span>
        <span className={styles.score}>Score: {Math.round(task.priorityScore)}</span>
      </div>

      <div className={styles.footer}>
        <select
          className={`${styles.status} ${styles[task.status.replace(' ', '')]}`}
          value={task.status}
          onChange={handleStatusChange}
          disabled={statusChanging}
        >
          {STATUS_OPTIONS.map((s) => (
            <option key={s} value={s}>{s}</option>
          ))}
        </select>
        <div className={styles.actions}>
          <button className={styles.editBtn} onClick={() => onEdit(task)}>
            <svg width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
              <path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z"/>
            </svg>
          </button>
          <button className={styles.deleteBtn} onClick={handleDelete} disabled={deleting}>
            {deleting ? <span className="spinner" style={{width:12,height:12}} /> : (
              <svg width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                <polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14a2 2 0 01-2 2H8a2 2 0 01-2-2L5 6"/><path d="M10 11v6M14 11v6"/><path d="M9 6V4a1 1 0 011-1h4a1 1 0 011 1v2"/>
              </svg>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
