import axios from 'axios'

const baseUrl = 'http://localhost:3001/anecdotes'

const getAll = async () => {
  const response = await axios.get(baseUrl)
  console.log(response.data)
  return response.data.sort((a, b) => b.votes - a.votes)
}

const createNew = async (content) => {
  const object = {content, votes: 0}
  const response = await axios.post(baseUrl, object)
  return response.data
}

const vote = async (content) => {
  const url = baseUrl + '/' + content
  const current = await axios.get(url)
  const updated = await axios.put(url, {...current.data, votes: current.data.votes + 1})
  return updated.data
} 

export default { getAll, createNew, vote }