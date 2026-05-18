import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchTasks, fetchAnalytics } from '../store/slices/tasksSlice';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid } from 'recharts';
import TaskModal from '../components/Tasks/TaskModal';
import styles from './Dashboard.module.css';

const COLORS = ['#7c5cfc','#22c55e','#f59e0b','#3b82f6','#10b981','#6b7280'];

const StatCard = ({ label, value, sub, accent }) => (
  <div className={styles.stat} style={{ '--accent-local': accent }}>
    <span className={styles.statValue}>{value}</span>
    <span className={styles.statLabel}>{label}</span>
    {sub && <span className={styles.statSub}>{sub}</span>}
  </div>
);

export default function Dashboard() {
  const dispatch = useDispatch();
  const { user } = useSelector((s) => s.auth);
  const { items, analytics, analyticsLoading } = useSelector((s) => s.tasks);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    dispatch(fetchTasks());
    dispatch(fetchAnalytics());
    const interval = setInterval(() => {
      dispatch(fetchTasks());
      dispatch(fetchAnalytics());
    }, 30000);
    return () => clearInterval(interval);
  }, [dispatch]);

  const overdueTasks = items.filter(
    (t) => t.status !== 'Completed' && new Date(t.deadline) < new Date()
  );
  const urgentTasks = items
    .filter((t) => t.status !== 'Completed' && t.priorityScore >= 500)
    .slice(0, 5);

  const statusData = analytics
    ? [
        { name: 'Pending', value: analytics.pending },
        { name: 'In Progress', value: analytics.inProgress },
        { name: 'Completed', value: analytics.completed },
      ].filter((d) => d.value > 0)
    : [];

  const STATUS_COLORS = ['#f59e0b', '#3b82f6', '#22c55e'];

  return (
    <div className={styles.page}>
      {/* Header */}
      <div className={styles.hero}>
        <div>
          <h1 className={styles.greeting}>
            Good {new Date().getHours() < 12 ? 'morning' : new Date().getHours() < 17 ? 'afternoon' : 'evening'},
            <span className={styles.name}> {user?.name?.split(' ')[0]}</span> 👋
          </h1>
          <p className={styles.sub}>
            {analytics?.completedToday
              ? `You completed ${analytics.completedToday} task${analytics.completedToday !== 1 ? 's' : ''} today. Keep it up!`
              : "Let's tackle your tasks today."}
          </p>
        </div>
        <button className={styles.addBtn} onClick={() => setShowModal(true)}>
          <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
            <path d="M12 5v14M5 12h14"/>
          </svg>
          New Task
        </button>
      </div>

      {/* Stats Row */}
      <div className={styles.statsRow}>
        <StatCard label="Total Tasks"    value={analytics?.total ?? '—'}      accent="var(--accent)" />
        <StatCard label="Completed"      value={analytics?.completed ?? '—'}   accent="var(--green)" sub={analytics ? `${analytics.completionRate}% rate` : ''} />
        <StatCard label="In Progress"    value={analytics?.inProgress ?? '—'}  accent="var(--blue)" />
        <StatCard label="Pending"        value={analytics?.pending ?? '—'}     accent="var(--yellow)" />
        <StatCard label="Overdue"        value={analytics?.overdue ?? '—'}     accent="var(--red)" />
      </div>

      {/* Insights Banner */}
      {analytics && (
        <div className={styles.insightsBanner}>
          <div className={styles.insightItem}>
            <span className={styles.insightIcon}>🎯</span>
            <span>Most active: <strong>{analytics.mostActiveCategory}</strong></span>
          </div>
          <div className={styles.insightItem}>
            <span className={styles.insightIcon}>✅</span>
            <span>Completed today: <strong>{analytics.completedToday}</strong></span>
          </div>
          <div className={styles.insightItem}>
            <span className={styles.insightIcon}>⚡</span>
            <span>Completion rate: <strong>{analytics.completionRate}%</strong></span>
          </div>
          {overdueTasks.length > 0 && (
            <div className={`${styles.insightItem} ${styles.insightAlert}`}>
              <span className={styles.insightIcon}>⚠️</span>
              <span><strong>{overdueTasks.length}</strong> overdue task{overdueTasks.length !== 1 ? 's' : ''}</span>
            </div>
          )}
        </div>
      )}

      {/* Charts + Urgent */}
      <div className={styles.grid2}>
        {/* Status Distribution */}
        <div className={styles.card}>
          <h3 className={styles.cardTitle}>Status Distribution</h3>
          {statusData.length > 0 ? (
            <div className={styles.chartWrap}>
              <ResponsiveContainer width="100%" height={220}>
                <PieChart>
                  <Pie data={statusData} cx="50%" cy="50%" innerRadius={60} outerRadius={90}
                    paddingAngle={4} dataKey="value">
                    {statusData.map((_, i) => (
                      <Cell key={i} fill={STATUS_COLORS[i % STATUS_COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{ background: 'var(--bg-elevated)', border: '1px solid var(--border)', borderRadius: 8, color: 'var(--text-primary)' }}
                  />
                </PieChart>
              </ResponsiveContainer>
              <div className={styles.legend}>
                {statusData.map((d, i) => (
                  <div key={d.name} className={styles.legendItem}>
                    <span className={styles.legendDot} style={{ background: STATUS_COLORS[i] }} />
                    <span>{d.name}</span>
                    <span className={styles.legendVal}>{d.value}</span>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className={styles.noData}>No task data yet</div>
          )}
        </div>

        {/* Category Distribution */}
        <div className={styles.card}>
          <h3 className={styles.cardTitle}>Tasks by Category</h3>
          {analytics?.categoryDistribution?.length > 0 ? (
            <ResponsiveContainer width="100%" height={240}>
              <BarChart data={analytics.categoryDistribution} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                <XAxis dataKey="name" tick={{ fill: 'var(--text-secondary)', fontSize: 12 }} />
                <YAxis tick={{ fill: 'var(--text-secondary)', fontSize: 12 }} allowDecimals={false} />
                <Tooltip
                  contentStyle={{ background: 'var(--bg-elevated)', border: '1px solid var(--border)', borderRadius: 8, color: 'var(--text-primary)' }}
                />
                <Bar dataKey="count" radius={[6, 6, 0, 0]}>
                  {analytics.categoryDistribution.map((_, i) => (
                    <Cell key={i} fill={COLORS[i % COLORS.length]} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <div className={styles.noData}>No category data yet</div>
          )}
        </div>
      </div>

      {/* Urgent Tasks */}
      {urgentTasks.length > 0 && (
        <div className={styles.card}>
          <h3 className={styles.cardTitle}>
            🔥 High Priority Tasks
            <span className={styles.badge}>{urgentTasks.length}</span>
          </h3>
          <div className={styles.urgentList}>
            {urgentTasks.map((task) => {
              const isOD = new Date(task.deadline) < new Date();
              return (
                <div key={task._id} className={`${styles.urgentItem} ${isOD ? styles.overdueItem : ''}`}>
                  <div className={styles.urgentInfo}>
                    <span className={styles.urgentTitle}>{task.title}</span>
                    <span className={styles.urgentMeta}>
                      {task.category} · Due {new Date(task.deadline).toLocaleDateString()}
                      {isOD && ' · OVERDUE'}
                    </span>
                  </div>
                  <span className={styles.urgentScore}>
                    {Math.round(task.priorityScore)}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {showModal && <TaskModal onClose={() => setShowModal(false)} />}
    </div>
  );
}
