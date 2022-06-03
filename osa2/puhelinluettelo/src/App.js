import { useEffect, useState } from 'react'
import personService from './services/persons'

const Filter = ({ filterChange }) => {
  return (
    <div>
      <p>
        filter term <input onChange={filterChange}></input>
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

const Person = (props) => {
  return (
    <div key={props.id}>
      {props.name} {props.number} <button key={props.id} onClick={props.remove}>delete</button>
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
  const [show, setShow] = useState('')
  const [notification, setNotification] = useState(null)
  const [activeFilter, setActiveFilter] = useState(persons)

  useEffect(() => {
    personService
      .getAll()
      .then(initialPeople => {
        setPersons(initialPeople)
        setActiveFilter((show === '') ? persons : persons.filter(person => person.name.toLowerCase().indexOf(show.toLowerCase()) >= 0))
      })
  }, [])
  
  const removePerson = id => {

    if (window.confirm('Do you really want to delete this person? Like, from existence?')) {
      console.log("poistettu", id)
      personService
        .remove(id)
        .then(augmentedPeople => {
          setPersons(augmentedPeople)
        })
      setNewName('')
      setNewNumber('')
      setShow('')
      setNotification(['user removed', 'success'])
      setActiveFilter((show === '') ? persons : persons.filter(person => person.name.toLowerCase().indexOf(show.toLowerCase()) >= 0))
      setTimeout(() => {
        setNotification(null)
      }, 5000)
    } else {
      setNotification(['user not removed', 'error'])
      setTimeout(() => {
        setNotification(null)
      }, 5000)
    }
  }

  const addNumber = (event) => {
    event.preventDefault()

    if (persons.some(person => person['name'] === newName)) {
      if (window.confirm(`${newName} already exists. Replace the number?`)) {
        const person = persons.find(p => p.name === newName)
        const changedPerson = {...person, number: newNumber}
        personService
          .edit(changedPerson)
          .then(augmentedPeople => {
            setPersons(augmentedPeople)
          })
          .catch(error => {
          setNotification(['already deleted from server', 'error'])
        })
      } else {
        setNotification(['user not changed', 'error'])
        setTimeout(() => {
          setNotification(null)
        }, 5000)
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
          setNewName('')
          setNewNumber('')
          setActiveFilter((show === '') ? persons : persons.filter(person => person.name.toLowerCase().indexOf(show.toLowerCase()) >= 0))
          setNotification(['user added', 'success'])
          setTimeout(() => {
            setNotification(null)
          }, 5000)
        })
    }    
  }

  const handleNameChange = (event) => {
    setNewName(event.target.value)
  }

  const handleNumberChange = (event) => {
    setNewNumber(event.target.value)
  }

  const handleFilterChange = (event) => {
    setShow(event.target.value)
    setActiveFilter((show === '') ? persons : persons.filter(person => person.name.toLowerCase().indexOf(show.toLowerCase()) >= 0))
  }
  
  //const activeFilter = (show === '') ? persons : persons.filter(person => person.name.toLowerCase().indexOf(show.toLowerCase()) >= 0)
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
      {activeFilter.map((person) =>
        <Person key={person.id}
          id={person.id}
          name={person.name}
          number={person.number}
          remove={() => removePerson(person.id)}
        />
      )}
    </div>
  )

}

export default App