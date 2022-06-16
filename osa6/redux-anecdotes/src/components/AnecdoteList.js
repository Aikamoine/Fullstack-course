import { useDispatch, useSelector } from 'react-redux'
import { vote } from '../reducers/anecdoteReducer'

const Anecdote = ({ anecdote, handleClick }) => {
  return(
    <div >
      <p>{anecdote.content}</p>
      has {anecdote.votes} <button onClick={handleClick} type="submit">vote</button>
    </div>
  )
}

const Anecdotes = () => {
  const dispatch = useDispatch()
  const anecdotes = useSelector(state => state)

  return(
    <ul>
      {anecdotes.map(anecdote =>
        <Anecdote
          key={anecdote.id}
          anecdote={anecdote}
          handleClick={() => 
            dispatch(vote(anecdote.id))
          }
        />
      )}
    </ul>
  )
}

export default Anecdotes