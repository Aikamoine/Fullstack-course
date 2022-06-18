import { useDispatch, useSelector } from 'react-redux'
import { addVote } from '../reducers/anecdoteReducer'
import { voteNotification, noNotification } from '../reducers/notificationReducer'
import { setNotification } from '../reducers/notificationReducer'

const Anecdote = ({ anecdote, handleClick }) => {
  return(
    <div >
      <div>{anecdote.content}</div>
      has {anecdote.votes} <button onClick={handleClick} type="submit">vote</button>
      <p></p>
    </div>
  )
}

const Anecdotes = () => {
  const dispatch = useDispatch()
  
  const currentState = useSelector(state => state)
  const anecdotes = currentState.filter === ''
    ? currentState.anecdotes
    : currentState.anecdotes.filter(a => a.content.toLowerCase().includes(currentState.filter.toLowerCase()))
  return(
    <ul>
      {anecdotes.map(anecdote =>
        <Anecdote
          key={anecdote.id}
          anecdote={anecdote}
          handleClick={() => { 
            dispatch(addVote(anecdote.id))
            dispatch(setNotification(`you voted '${anecdote.content}'`, 5))
            }      
          }
        />
      )}
    </ul>
  )
}

export default Anecdotes