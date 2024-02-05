import { createSlice } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit'
import type { RootState } from './index'



// Define the initial state using that type
const initialState:any = {}


export const scheduleSlice = createSlice({
  name: 'schedule',
  // `createSlice` will infer the state type from the `initialState` argument
  initialState,
  reducers: {
    setSchedule: (state, action : PayloadAction<any>) => {
        const [date,sched] = action.payload
        const newSched = {...state}
        newSched[date] = sched
      return newSched
    },
    clearSchedule:(state) => {
      return {}
    }
  },
})

export const { setSchedule, clearSchedule } = scheduleSlice.actions

// Other code such as selectors can use the imported `RootState` type
export const currentSchedule = (state: RootState) => state.schedule

export default scheduleSlice.reducer