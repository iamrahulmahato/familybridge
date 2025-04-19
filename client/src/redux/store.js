import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice';
import familyReducer from './slices/familySlice';
import calendarReducer from './slices/calendarSlice';
import taskReducer from './slices/taskSlice';
import healthReducer from './slices/healthSlice';
import communicationReducer from './slices/communicationSlice';
import journeyReducer from './slices/journeySlice';
import resourceReducer from './slices/resourceSlice';

const store = configureStore({
  reducer: {
    auth: authReducer,
    family: familyReducer,
    calendar: calendarReducer,
    tasks: taskReducer,
    health: healthReducer,
    communication: communicationReducer,
    journey: journeyReducer,
    resources: resourceReducer
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false
    })
});

export default store; 