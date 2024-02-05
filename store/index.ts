import { configureStore } from '@reduxjs/toolkit'

import userSlice from './userSlice'
import dateSlice from './dateSlice'
import scheduleSlice from './scheduleSlice'
import detailsSlice from './detailsSlice'


const store = configureStore({
  reducer: {
    user: userSlice,
    date: dateSlice,
    schedule: scheduleSlice,
    details: detailsSlice
  },
})
export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch

export default store