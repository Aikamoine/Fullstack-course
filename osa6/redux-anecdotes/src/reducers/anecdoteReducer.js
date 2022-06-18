import { createSlice } from '@reduxjs/toolkit'
import anecdoteService from '../services/anecdotes'

const anecdotesAtStart = []
const getId = () => (100000 * Math.random()).toFixed(0)

const asObject = (anecdote) => {
  return {
    content: anecdote,
    //id: getId(),
    votes: 0
  }
}

const initialState = anecdotesAtStart.map(asObject)

const anecdoteSlice = createSlice({
  name: 'anecdotes',
  initialState,
  reducers: {
    voteAnecdote(state, action) {
      const voted = state.map(
        a => a.id === action.payload ? {...a, votes: a.votes+1} : a
      )
      return voted.sort((a, b) => b.votes - a.votes)
    },
    newAnecdote(state, action) {
      console.log('action', action.payload)
      state.push(action.payload)
    },
    setAnecdotes(state, action) {
      return action.payload
    }
  }
})

export const initializeAnecdotes = () => {
  return async dispatch => {
    const anecdotes = await anecdoteService.getAll()
    dispatch(setAnecdotes(anecdotes))
  }
}

export const createNew = content => {
  return async dispatch => {
    const newOne = await anecdoteService.createNew(content)
    console.log('new anecdote', newOne)
    dispatch(newAnecdote(newOne))
  }
}

export const addVote = content => {
  return async dispatch => {
    const voted = await anecdoteService.vote(content)
    dispatch(voteAnecdote(content))
  }
}

export const { voteAnecdote, newAnecdote, setAnecdotes } = anecdoteSlice.actions
export default anecdoteSlice.reducer