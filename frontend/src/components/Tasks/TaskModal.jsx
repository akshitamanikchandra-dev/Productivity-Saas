import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { createTask, updateTask } from '../../store/slices/tasksSlice';
import { clearTaskError } from '../../store/slices/tasksSlice';
import styles from './TaskModal.module.css';

const CATEGORIES = ['Work', 'Personal', 'Health', 'Learning', 'Finance', 'Other'];
const STATUSES   = ['Pending', 'In Progress', 'Completed'];

const today = () => {
  const d = new Date();
  d.setMinutes(d.getMinutes() - d.getTimezoneOffset());
  return d.toISOString().slice(0, 10);
};

export default function TaskModal({ task, onClose }) {
  const dispatch = useDispatch();
  const { error } = useSelector((s) => s.tasks);
  const isEditing = Boolean(task?._id);

  const [form, setForm] = useState({
    title: '',
    description: '',
    category: 'Work',
    status: 'Pending',
    deadline: today(),
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isEditing) {
      setForm({
        title: task.title,
        description: task.description || '',
        category: task.category,
        status: task.status,
        deadline: new Date(task.deadline).toISOString().slice(0, 10),
      });
    }
    return () => dispatch(clearTaskError());
  }, [task, isEditing, dispatch]);

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    let result;
    if (isEditing) {
      result = await dispatch(updateTask({ id: task._id, data: form }));
    } else {
      result = await dispatch(createTask(form));
    }
    setLoading(false);
    if (!result.error) onClose();
  };

  return (
    <div className={styles.overlay} onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className={styles.modal + ' fade-in'}>
        <div className={styles.header}>
          <h2>{isEditing ? 'Edit Task' : 'New Task'}</h2>
          <button className={styles.close} onClick={onClose}>
            <svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
              <path d="M18 6L6 18M6 6l12 12"/>
            </svg>
          </button>
        </div>

        {error && <div className={styles.error}>{error}</div>}

        <form onSubmit={handleSubmit} className={styles.form}>
          <div className={styles.field}>
            <label>Title *</label>
            <input name="title" value={form.title} onChange={handleChange}
              placeholder="Task title" required />
          </div>
          <div className={styles.field}>
            <label>Description</label>
            <textarea name="description" value={form.description} onChange={handleChange}
              placeholder="Optional description..." rows={3} />
          </div>
          <div className={styles.row}>
            <div className={styles.field}>
              <label>Category *</label>
              <select name="category" value={form.category} onChange={handleChange}>
                {CATEGORIES.map((c) => <option key={c}>{c}</option>)}
              </select>
            </div>
            <div className={styles.field}>
              <label>Status</label>
              <select name="status" value={form.status} onChange={handleChange}>
                {STATUSES.map((s) => <option key={s}>{s}</option>)}
              </select>
            </div>
          </div>
          <div className={styles.field}>
            <label>Deadline *</label>
            <input type="date" name="deadline" value={form.deadline}
              onChange={handleChange} required />
          </div>
          <div className={styles.btnRow}>
            <button type="button" className={styles.cancelBtn} onClick={onClose}>Cancel</button>
            <button type="submit" className={styles.submitBtn} disabled={loading}>
              {loading ? <span className="spinner" /> : isEditing ? 'Save Changes' : 'Create Task'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
