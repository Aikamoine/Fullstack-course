const RemoveButton = ({ blogUser, loggedUser, remove }) => {
  console.log(blogUser, loggedUser)
  if (blogUser === loggedUser) {
    return <button onClick={remove}>remove</button>
  }
}

const BlogDetails = ({ blog, toggleDetails, addLike, userName, remove }) => (
  <div>
    <div>
      {blog.title} <button onClick={toggleDetails}>hide</button>
    </div>
    <div>
      {blog.author}
    </div>
    <div>{blog.url}</div>
    <div>
      {blog.likes} likes <button onClick={addLike}>like</button>
    </div>
    <div>{blog.user.name}</div>
    <div>
      <RemoveButton blogUser={blog.user.username} loggedUser={userName} remove={remove} />
    </div>
    <p></p>
  </div>
)

export default BlogDetails