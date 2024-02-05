import { createSlice } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit'
import type { RootState } from './index'

type IUser = any


// Define the initial state using that type
const initialState: IUser | null = {
  user:null,
  token:null, 
  role:null
}

export const userSlice = createSlice({
  name: 'user',
  // `createSlice` will infer the state type from the `initialState` argument
  initialState,
  reducers: {
    setUser: (state, action : PayloadAction<IUser>) => {
      return action.payload
    },
    clearUser: (state) => {
      return {
        user:null,
        token:null, 
        role:null
      }
    }
  },
})

export const { setUser, clearUser } = userSlice.actions

// Other code such as selectors can use the imported `RootState` type
export const currentUser = (state: RootState) => state.user

export default userSlice.reducer