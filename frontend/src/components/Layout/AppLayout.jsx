import { Outlet } from 'react-router-dom';
import Navbar from './Navbar';
import useSocket from '../../hooks/useSocket';
import styles from './AppLayout.module.css';

export default function AppLayout() {
  useSocket(); // Initialize real-time socket connection

  return (
    <div className={styles.layout}>
      <Navbar />
      <main className={styles.main}>
        <Outlet />
      </main>
    </div>
  );
}
