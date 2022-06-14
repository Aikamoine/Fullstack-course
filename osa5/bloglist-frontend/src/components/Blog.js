const Blog = ({ blog, toggleDetails }) => (
  <div>
    {blog.title} {blog.author} <button onClick={toggleDetails}>view</button>
    <p></p>
  </div>
)

export default Blog