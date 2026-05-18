import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getSocket, initSocket } from '../api/socket';
import {
  socketTaskCreated,
  socketTaskUpdated,
  socketTaskDeleted,
  fetchAnalytics,
} from '../store/slices/tasksSlice';

const useSocket = () => {
  const dispatch = useDispatch();
  const token = useSelector((state) => state.auth.token);

  useEffect(() => {
    if (!token) return;

    let socket = getSocket();
    if (!socket || !socket.connected) {
      socket = initSocket(token);
    }

    const handleCreated = (task) => {
      dispatch(socketTaskCreated(task));
      dispatch(fetchAnalytics());
    };
    const handleUpdated = (task) => {
      dispatch(socketTaskUpdated(task));
      dispatch(fetchAnalytics());
    };
    const handleDeleted = (data) => {
      dispatch(socketTaskDeleted(data));
      dispatch(fetchAnalytics());
    };

    socket.on('task:created', handleCreated);
    socket.on('task:updated', handleUpdated);
    socket.on('task:deleted', handleDeleted);

    return () => {
      socket.off('task:created', handleCreated);
      socket.off('task:updated', handleUpdated);
      socket.off('task:deleted', handleDeleted);
    };
  }, [token, dispatch]);
};

export default useSocket;
