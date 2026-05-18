import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchTasks } from '../store/slices/tasksSlice';
import TaskCard from '../components/Tasks/TaskCard';
import TaskModal from '../components/Tasks/TaskModal';
import styles from './Tasks.module.css';

const FILTERS = ['All', 'Pending', 'In Progress', 'Completed'];
const CATEGORIES = ['All', 'Work', 'Personal', 'Health', 'Learning', 'Finance', 'Other'];

export default function Tasks() {
  const dispatch = useDispatch();
  const { items, loading } = useSelector((s) => s.tasks);
  const [showModal, setShowModal] = useState(false);
  const [editTask, setEditTask] = useState(null);
  const [statusFilter, setStatusFilter] = useState('All');
  const [categoryFilter, setCategoryFilter] = useState('All');
  const [search, setSearch] = useState('');

  useEffect(() => {
    dispatch(fetchTasks());
    // Refresh priorities every 60s
    const interval = setInterval(() => dispatch(fetchTasks()), 60000);
    return () => clearInterval(interval);
  }, [dispatch]);

  const filtered = items.filter((t) => {
    if (statusFilter !== 'All' && t.status !== statusFilter) return false;
    if (categoryFilter !== 'All' && t.category !== categoryFilter) return false;
    if (search && !t.title.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });

  const handleEdit = (task) => { setEditTask(task); setShowModal(true); };
  const handleClose = () => { setShowModal(false); setEditTask(null); };

  return (
    <div className={styles.page}>
      <div className={styles.pageHeader}>
        <div>
          <h1 className={styles.title}>My Tasks</h1>
          <p className={styles.sub}>
            {items.length} total · {items.filter(t => t.status === 'Completed').length} completed
          </p>
        </div>
        <button className={styles.addBtn} onClick={() => { setEditTask(null); setShowModal(true); }}>
          <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
            <path d="M12 5v14M5 12h14"/>
          </svg>
          New Task
        </button>
      </div>

      <div className={styles.toolbar}>
        <div className={styles.search}>
          <svg width="15" height="15" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
            <circle cx="11" cy="11" r="8"/><path d="M21 21l-4.35-4.35"/>
          </svg>
          <input
            placeholder="Search tasks..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        <div className={styles.filters}>
          <div className={styles.filterGroup}>
            {FILTERS.map((f) => (
              <button
                key={f}
                className={`${styles.filterBtn} ${statusFilter === f ? styles.activeFilter : ''}`}
                onClick={() => setStatusFilter(f)}
              >{f}</button>
            ))}
          </div>
          <select
            className={styles.catSelect}
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
          >
            {CATEGORIES.map((c) => <option key={c}>{c}</option>)}
          </select>
        </div>
      </div>

      {loading ? (
        <div className={styles.center}><span className="spinner" /></div>
      ) : filtered.length === 0 ? (
        <div className={styles.empty}>
          <div className={styles.emptyIcon}>📋</div>
          <p>{search || statusFilter !== 'All' || categoryFilter !== 'All'
            ? 'No tasks match your filters'
            : 'No tasks yet. Create your first task!'}</p>
          {!search && statusFilter === 'All' && categoryFilter === 'All' && (
            <button className={styles.addBtn} onClick={() => setShowModal(true)}>
              Create Task
            </button>
          )}
        </div>
      ) : (
        <div className={styles.grid}>
          {filtered.map((task) => (
            <TaskCard key={task._id} task={task} onEdit={handleEdit} />
          ))}
        </div>
      )}

      {showModal && (
        <TaskModal task={editTask} onClose={handleClose} />
      )}
    </div>
  );
}
