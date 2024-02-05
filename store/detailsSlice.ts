import { createSlice } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit'
import type { RootState } from './index'
import { ISchedule } from '@/interface'


interface IState{
  details:ISchedule | null
}

// Define the initial state using that type
const initialState:IState = {
  details: null
}


export const detailsSlice = createSlice({
  name: 'details',
  // `createSlice` will infer the state type from the `initialState` argument
  initialState,
  reducers: {
    setDetails: (state, action : PayloadAction<ISchedule>) => {
        state.details = action.payload
    }
  },
})

export const { setDetails } = detailsSlice.actions

// Other code such as selectors can use the imported `RootState` type
export const currentSchedule = (state: RootState) => state.details

export default detailsSlice.reducer