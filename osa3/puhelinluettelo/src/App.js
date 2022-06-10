import { useEffect, useState } from 'react'
import personService from './services/persons'

const Filter = ({ value, filterChange }) => {
  return (
    <div>
      <p>
        filter term <input value={value} onChange={filterChange}></input>
      </p>
    </div>
  )
}

const PersonForm = (props) => {
  return (
    <form onSubmit={props.onSubmit}>
      <div>
        name:
        <input
          value={props.nameValue}
          onChange={props.onNameChange}
        />
      </div>
      <div>
        number:
        <input
          value={props.numValue}
          onChange={props.onNumChange}
        />
      </div>
      <div>
        <button type="submit">add</button>
      </div>
    </form>
  )
}

const Persons = ({ persons, remove }) => {
  return (
    <div>
      {persons.map(person => 
        <p key= {person.id}>
          {person.name} {person.number}
          <button onClick={() => remove(person.id)}>delete</button>
        </p>)}
    </div>
  )
}

const Notification = ({ notification }) => {
  if (notification === null) {
    return null
  }
  return (
  <div className={notification[1]}>
    {notification[0]}
  </div>
  )
}
const App = () => {
  const [persons, setPersons] = useState([])
  const [newName, setNewName] = useState('')
  const [newNumber, setNewNumber] = useState('')
  const [notification, setNotification] = useState(null)
  const [filter, setFilter] = useState(persons)

  useEffect(() => {
    personService
      .getAll()
      .then(initialPeople => {
        setPersons(initialPeople)
        })
  }, [])
  
  const postNotification = (content) => {
    setNotification(content)
    setTimeout((() => {
      setNotification(null)
    }, 5000))
  }
  const removePerson = id => {
    if (window.confirm('Do you really want to delete this person? Like, from existence?')) {
      personService
        .remove(id)
        .then(() => {
          setPersons(persons.filter(p => p.id !== id))
          postNotification(['person removed, you Hitman you', 'success'])
        })
      
    } else {
      postNotification(['person not removed', 'success'])
    }
  }

  const addNumber = (event) => {
    event.preventDefault()

    const oldPerson = persons.find(p => p.name === newName)
    if (oldPerson) {
      if (window.confirm(`${newName} already exists. Replace the number?`)) {
        const changedPerson = {...oldPerson, number: newNumber}
        personService
          .edit(changedPerson)
          .then(newPerson => {
            setPersons(persons.map(p => p.id === changedPerson.id ? newPerson : p))
          })
          .catch(error => {
            postNotification(['already deleted from server', 'error'])
            setPersons(persons.filter(p => p.id !== changedPerson.id))
        })
      } else {
        postNotification(['person not changed', 'success'])
      }
      
    } else {
      const nameObject = {
        name: newName,
        number: newNumber
      }

      personService
        .add(nameObject)
        .then(returnPerson => {
          setPersons(persons.concat(returnPerson))
          postNotification(['person added', 'success'])
        })
        .catch(error => {
          console.log('error:', error)
          postNotification([error.response.data.error, 'error'])
        })
    } 
    setNewName('')
    setNewNumber('')
  }
  
  const handleNameChange = (event) => {
    setNewName(event.target.value)
  }

  const handleNumberChange = (event) => {
    setNewNumber(event.target.value)
  }

  const handleFilterChange = (event) => {
    setFilter(event.target.value)
  }

  const activeFilter = (filter.length === 0) ? persons : persons.filter(person => person.name.toLowerCase().includes(filter.toLowerCase()))
  return (
    <div>
      <Notification notification={notification}/>
      <h2>Phonebook</h2>
      <Filter filterChange={handleFilterChange}/>
      <h3>Add a new contact</h3>
      <PersonForm
        onSubmit={addNumber}
        nameValue={newName}
        onNameChange={handleNameChange}
        numValue={newNumber}
        onNumChange={handleNumberChange}
      />
      <h3>Numbers</h3>
      <Persons
        persons={activeFilter}
        remove={removePerson}
      />
    </div>
  )

}

export default App