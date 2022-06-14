import axios from 'axios'
const baseUrl = '/api/blogs'

let token = null

const setToken = newToken => {
  token = `bearer ${newToken}`
}
const getAll = () => {
  const request = axios.get(baseUrl)
  return request.then(response => response.data)
}

const addBlog = async newObject => {
  const config = {
    headers: { Authorization: token }
  }
  console.log('adding', newObject)
  const response = await axios.post(baseUrl, newObject, config)
  return response.data
}

const addLike = async blog => {
  const config = {
    headers: { Authorization: token }
  }

  const likes = { likes: blog.likes + 1 }
  await axios.put(baseUrl + '/' + blog.id, likes, config)
}

const remove = async blog => {
  console.log('removing', blog.id)
  const config = {
    headers: { Authorization: token }
  }

  await axios.delete(baseUrl + '/' + blog.id, config)
}

export default { getAll, setToken, addBlog, addLike, remove }