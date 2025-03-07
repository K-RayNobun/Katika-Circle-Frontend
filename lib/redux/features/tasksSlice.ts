import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { HYDRATE } from 'next-redux-wrapper';

export interface Task {
    id: string,
    title: string,
    completed: boolean;
    createdAt: string;
}

interface TasksState {
    items: Task[],
    loading: boolean;
    error: string | null;
}

const initialState: TasksState = {
    items: [],
    loading: false,
    error: null,
}

// Create the slice
export const tasksSlice = createSlice({
    name: 'tasks',
    initialState,
    reducers: {
      // Add a new task
      addTask: (state, action: PayloadAction<Omit<Task, 'id' | 'createdAt'>>) => {
        const newTask: Task = {
          id: Date.now().toString(),
          title: action.payload.title,
          completed: action.payload.completed || false,
          createdAt: new Date().toISOString(),
        };
        state.items.push(newTask);
      },
      // Toggle task completion status
      toggleTaskCompletion: (state, action: PayloadAction<string>) => {
        const task = state.items.find(task => task.id === action.payload);
        if (task) {
          task.completed = !task.completed;
        }
      },
      // Delete a task
      deleteTask: (state, action: PayloadAction<string>) => {
        state.items = state.items.filter(task => task.id !== action.payload);
      },
      // Update task title
      updateTaskTitle: (
        state, 
        action: PayloadAction<{ id: string; title: string }>
      ) => {
        const task = state.items.find(task => task.id === action.payload.id);
        if (task) {
          task.title = action.payload.title;
        }
      },
    },
    // Handle hydration for Next.js
    extraReducers: (builder) => {
      builder.addCase(HYDRATE, (state, action) => {
        // This is needed for server-side rendering
        // It merges the state from the server with the client state
        return {
          ...state,
          // @ts-ignore - The action.payload type is difficult to define correctly
          ...action.payload.tasks,
        };
      });
    },
  });

  export const { addTask, toggleTaskCompletion, deleteTask, updateTaskTitle } = tasksSlice.actions;
  export default tasksSlice.reducer;