import { createSlice } from '@reduxjs/toolkit'
let timeOutId

const notificationSlice = createSlice({
    name: 'notifications',
    initialState: 'Totally a notification',
    reducers: {
        displayNotification(state, action) {
          return action.payload
        }
    }
})

export const setNotification = (content, displayTime) => {
  return async dispatch => {
    dispatch(displayNotification(content))
    clearTimeout(timeOutId)
    timeOutId = setTimeout(() => {
      dispatch(displayNotification(''))
    }, displayTime * 1000)
  }
}

export const { displayNotification } = notificationSlice.actions
export default notificationSlice.reducer