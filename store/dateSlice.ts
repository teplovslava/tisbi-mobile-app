import { createSlice } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit'
import type { RootState } from './index'
import dayjs from 'dayjs'


// Define the initial state using that type
const initialState:any = {
  date:dayjs().format('YYYY-MM-DD')
}


export const dateSlice = createSlice({
  name: 'date',
  // `createSlice` will infer the state type from the `initialState` argument
  initialState,
  reducers: {
    setDate: (state, action : PayloadAction<string>) => {
      state.date = action.payload
    },

  },
})

export const { setDate } = dateSlice.actions

// Other code such as selectors can use the imported `RootState` type
export const currentDate = (state: RootState) => state.date

export default dateSlice.reducer