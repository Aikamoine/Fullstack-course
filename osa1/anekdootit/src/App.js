import { useState } from 'react'

const Header = (props) => {
  return (
    <>
      <h1>{props.text}</h1>
    </>
  )
}

const Button = (props) => {
  return (
    <button onClick={props.handleClick}>
      {props.text}
    </button>
  )
}

const BestAnecdote = (props) => {
  const i = votes.indexOf(Math.max.apply(Math, props.votes))
  return (
    <p>
      {props.anecdotes[i]}
    </p>
  )
} 

const MostVotes = (props) => {
  console.log(props)
  return (
    <p>
      has {Math.max(...props.votes)} votes
    </p>
  )
}

const ListVotes = (props) => {
  return (
    <>
      <p>has {props.amt} votes</p>
    </>
  )
}
const votes = Array(7).fill(0)

const App = () => {
  const anecdotes = [
    'If it hurts, do it more often.',
    'Adding manpower to a late software project makes it later!',
    'The first 90 percent of the code accounts for the first 90 percent of the development time...The remaining 10 percent of the code accounts for the other 90 percent of the development time.',
    'Any fool can write code that a computer can understand. Good programmers write code that humans can understand.',
    'Premature optimization is the root of all evil.',
    'Debugging is twice as hard as writing the code in the first place. Therefore, if you write the code as cleverly as possible, you are, by definition, not smart enough to debug it.',
    'Programming without an extremely heavy use of console.log is same as if a doctor would refuse to use x-rays or blood tests when dianosing patients.'
  ]

  const addVote = () => {
    votes[selected] += 1
    return (votes)
  }
  
  const getRandom = () => {
    setSelected(Math.floor(Math.random() * anecdotes.length))
  }

  const [selected, setSelected] = useState(0)
  return (
    <div>
      <Header text="Anecdote of the day"/>
      {anecdotes[selected]}<p></p>
      <ListVotes amt={votes[selected]} />
      <Button handleClick={() => addVote()} text="vote"/>
      <Button handleClick={() => getRandom()} text="next anecdote" />
      <Header text="Anecdote with most votes" />
      <BestAnecdote votes={votes} anecdotes={anecdotes} />
      <MostVotes votes={votes} />
    </div>
  )
}

export default App