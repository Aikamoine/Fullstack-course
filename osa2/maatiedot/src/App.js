import { useEffect, useState } from 'react'
import axios from 'axios'

const Filter = ({ filterChange }) => {
  return (
    <div>
      <p>
        filter term <input onChange={filterChange}></input>
      </p>
    </div>
  )
}

const Countries = ({ filtered, setShow, weather }) => {
  if (filtered.length === 1) {
    const country = filtered[0]
    return (
      <div>
        <h1>{country.name}</h1>
        <div>capital {country.capital}</div>
        <div>area {country.area}</div>

        <h3>languages:</h3>
        <ul>
          {country.languages.map((language) =>
            <li key={language.name}>
              {language.name}
            </li>
          )}
        </ul>
        <img src={country.flag} width="300" height="250" alt="country flag"/>
        <h2>Weather in {country.capital}</h2>
        <div>
          temperature {Math.floor(weather.main.temp - 273.15)} Celsius
        </div>
        <div><img src={'http://openweathermap.org/img/wn/' + weather.weather[0].icon+'@2x.png'} alt="weather icon"/></div>
        <div>
          wind {weather.wind.speed}
        </div>
      </div>
    )
  }
  
  if (filtered.length > 10) {
    return (
      <div>
        Too many matches, be more specific
      </div>
    )
  }
  return (
    <div>
      {filtered.map((country) =>
        <div key={country.name}>
          {country.name} <button onClick={() => setShow(country.name)}>
            show
          </button>
        </div>
      )}
    </div>
  )
}

const App = () => {
  const [countries, setCountries] = useState([])
  const [show, setShow] = useState('')
  const [weather, setWeather] = useState([])
  const api_key = process.env.REACT_APP_API_KEY

  const hookCountries = () => {
    axios
      .get('https://restcountries.com/v2/all')
      .then(response => {
        setCountries(response.data)
      })
  }
  useEffect(hookCountries, [])
  
  const activeFilter = (show === '') ? countries : countries.filter(country => country.name.toLowerCase().indexOf(show.toLowerCase()) >= 0)

  const handleFilterChange = (event) => {
    setShow(event.target.value)
    hookWeather()
  }

  let api_address = ''
  if (activeFilter.length === 0) {
    api_address = 'http://api.openweathermap.org/data/2.5/weather?q=London&appid=' + api_key
  } else {
    api_address = 'http://api.openweathermap.org/data/2.5/weather?q=' + activeFilter[0].capital + '&appid=' + api_key
  }
 
  const hookWeather = () => {
    axios
      .get(api_address)
      .then(response => {
        setWeather(response.data)
      })
  }
  useEffect(hookWeather, [])

  return (
    <div>
      <Filter filterChange={handleFilterChange} />
      <Countries filtered={activeFilter} setShow={setShow} weather={weather}/>
    </div>
  )

}

export default App