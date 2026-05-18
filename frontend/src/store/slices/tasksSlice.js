import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../api/axios';

export const fetchTasks = createAsyncThunk('tasks/fetchAll', async (_, { rejectWithValue }) => {
  try {
    const res = await api.get('/tasks');
    return res.data;
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || 'Failed to fetch tasks');
  }
});

export const createTask = createAsyncThunk('tasks/create', async (taskData, { rejectWithValue }) => {
  try {
    const res = await api.post('/tasks', taskData);
    return res.data;
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || 'Failed to create task');
  }
});

export const updateTask = createAsyncThunk('tasks/update', async ({ id, data }, { rejectWithValue }) => {
  try {
    const res = await api.put(`/tasks/${id}`, data);
    return res.data;
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || 'Failed to update task');
  }
});

export const deleteTask = createAsyncThunk('tasks/delete', async (id, { rejectWithValue }) => {
  try {
    await api.delete(`/tasks/${id}`);
    return id;
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || 'Failed to delete task');
  }
});

export const fetchAnalytics = createAsyncThunk('tasks/analytics', async (_, { rejectWithValue }) => {
  try {
    const res = await api.get('/analytics');
    return res.data;
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || 'Failed to fetch analytics');
  }
});

// Helper: sort tasks by priority score desc, then createdAt asc
const sortByPriority = (tasks) =>
  [...tasks].sort((a, b) => {
    if (b.priorityScore !== a.priorityScore) return b.priorityScore - a.priorityScore;
    return new Date(a.createdAt) - new Date(b.createdAt);
  });

const tasksSlice = createSlice({
  name: 'tasks',
  initialState: {
    items: [],
    analytics: null,
    loading: false,
    analyticsLoading: false,
    error: null,
  },
  reducers: {
    // Socket.io real-time updates
    socketTaskCreated: (state, action) => {
      const exists = state.items.find((t) => t._id === action.payload._id);
      if (!exists) {
        state.items = sortByPriority([...state.items, action.payload]);
      }
    },
    socketTaskUpdated: (state, action) => {
      state.items = sortByPriority(
        state.items.map((t) => (t._id === action.payload._id ? action.payload : t))
      );
    },
    socketTaskDeleted: (state, action) => {
      state.items = state.items.filter((t) => t._id !== action.payload._id);
    },
    clearTaskError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // fetchTasks
      .addCase(fetchTasks.pending, (state) => { state.loading = true; state.error = null; })
      .addCase(fetchTasks.fulfilled, (state, action) => {
        state.items = action.payload;
        state.loading = false;
      })
      .addCase(fetchTasks.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // createTask
      .addCase(createTask.fulfilled, (state, action) => {
        state.items = sortByPriority([...state.items, action.payload]);
      })
      .addCase(createTask.rejected, (state, action) => {
        state.error = action.payload;
      })
      // updateTask
      .addCase(updateTask.fulfilled, (state, action) => {
        state.items = sortByPriority(
          state.items.map((t) => (t._id === action.payload._id ? action.payload : t))
        );
      })
      .addCase(updateTask.rejected, (state, action) => {
        state.error = action.payload;
      })
      // deleteTask
      .addCase(deleteTask.fulfilled, (state, action) => {
        state.items = state.items.filter((t) => t._id !== action.payload);
      })
      .addCase(deleteTask.rejected, (state, action) => {
        state.error = action.payload;
      })
      // analytics
      .addCase(fetchAnalytics.pending, (state) => { state.analyticsLoading = true; })
      .addCase(fetchAnalytics.fulfilled, (state, action) => {
        state.analytics = action.payload;
        state.analyticsLoading = false;
      })
      .addCase(fetchAnalytics.rejected, (state) => { state.analyticsLoading = false; });
  },
});

export const { socketTaskCreated, socketTaskUpdated, socketTaskDeleted, clearTaskError } = tasksSlice.actions;
export default tasksSlice.reducer;
