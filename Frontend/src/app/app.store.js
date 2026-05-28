import { configureStore } from '@reduxjs/toolkit'
import authReducer from '../features/auth/auth.slice';
import workspaceReducer from '../features/workspace/workspace.slice.js';
import dashboardReducer from '../features/dashboard/dashboard.slice.js'

const store = configureStore({
  reducer: {
    auth: authReducer,
    workspace: workspaceReducer,
    dashboard: dashboardReducer
  },
})

export default store;