const oneBlog = [{
    'title': 'test3',
    'author': 'author2',
    'url': 'www.w2.w',
    'likes': 10
}]

const threeBlogs = [
    {
        '_id': '629eec33bb2a8c4d857d2fa4',
        'title': 'test1',
        'author': 'author1',
        'url': 'www.w.w',
        'likes': 2,
        '__v': 0
    },
    {
        '_id': '629ef20a6b2d334df36cef66',
        'title': 'test2',
        'author': 'author1',
        'url': 'www.w.w',
        'likes': 0,
        '__v': 0
    },
    {
        '_id': '629ef6a35cfa94a8d7a66f24',
        'title': 'test3',
        'author': 'author2',
        'url': 'www.w2.w',
        'likes': 10,
        '__v': 0
    }
]


const dummy = (blogs) => {
    if (blogs.length >= 0) {
        return 1
    }
}

const totalLikes = (blogs) => {
    return blogs.length === 0
        ? 0
        : blogs.reduce(
            (prev, current) => prev + current.likes, 0
        )
}

const favoriteBlog = (blogs) => {
    const likes = blogs.map(blog => {
        return blog.likes
    })
    const favorite = blogs.find(blog => blog.likes === (Math.max(...likes)))
    return favorite
}

const mostBlogs = (blogs) => {
    const authors = [...new Set(blogs.map(blog => blog.author))]
    const authorBlogs = authors.map(author => {
        return {
            author: author,
            blogs: blogs.filter(blog => blog.author===author).length
        }
    })

    const mostBlogs = authorBlogs.map(ab => {
        return ab.blogs
    })

    return authorBlogs[mostBlogs.indexOf(Math.max(...mostBlogs))]
}

const mostLikes = (blogs) => {
    const authors = [...new Set(blogs.map(blog => blog.author))]
    console.log('authors', authors)
    const authorLikes = authors.map(author => {
        return {
            author: author, likes: totalLikes(blogs.filter(
                blog => blog.author === author))
        }
    })
    console.log(authorLikes)

    const mostLikes = authorLikes.map(ab => {
        return ab.likes
    })
    console.log('mostlikes', mostLikes)
    return authorLikes[mostLikes.indexOf(Math.max(...mostLikes))]
}

module.exports = {
    dummy,
    totalLikes,
    favoriteBlog,
    mostBlogs,
    mostLikes,
    oneBlog,
    threeBlogs
}