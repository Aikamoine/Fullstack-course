const { ApolloServer, gql, UserInputError, AuthenticationError } = require('apollo-server')
const { v1: uuid } = require('uuid')
require('dotenv').config()
const jwt = require('jsonwebtoken')
const mongoose = require('mongoose')
const Book = require('./models/book')
const Author = require('./models/author')
const User = require('./models/user')

const MONGODB_URI = process.env.MONGODB_URI
const JWT_SECRET = process.env.SECRET

console.log('connecting to', MONGODB_URI)

mongoose
  .connect(MONGODB_URI)
  .then(() => {
    console.log('connected to MongoDB')
  })
  .catch((error) => {
    console.log('error connection to MongoDB:', error.message)
  })

const typeDefs = gql`
  type Book {
    title: String!
    published: Int!
    author: Author!
    genres: [String!]!
    id: ID!
  }

  type Author {
    name: String!
    born: Int
    id: String!
    bookCount: Int
  }

  type User {
    username: String!
    favoriteGenre: String!
    id: ID!
  }

  type Token {
    value: String!
  }

  type Query {
    bookCount: Int!
    authorCount: Int!
    allBooks(author: String, genre: String): [Book!]!
    allAuthors: [Author]
    me: User
  }

  type Mutation {
    addBook(
      title: String!
      author: String!
      published: Int!
      genres: [String]!
    ): Book!
    editAuthor(
      name: String!, setBornTo: Int!
    ): Author
    createUser(
      username: String!, favoriteGenre: String!
    ): User
    login(
      username: String!, password: String!
    ): Token
  }
`

const resolvers = {
  Query: {
    bookCount: async () => Book.collection.countDocuments(),
    authorCount: async () => Author.collection.countDocuments(),
    allBooks: async (root, args) => {
      let books
      if (args.genre) {
        books = await Book.find({ genres: { $in: [args.genre] } })
      } else {
        books = await Book.find({})
      }
    
      return books
    },
    allAuthors: async () => Author.find({}),
    me: (root, args, context) => {
      return context.currentUser
    }
  },
  Book: {
    author: async (root) => {
      const thisAuthor = await Author.findById(root.author)
      return thisAuthor
    }
  },
  Author: {
    bookCount: async ({ name }) => {
      const authorId = await Author.findOne({name: name})
      const books = await Book.find({author: authorId})
      return books.length
    },
    born: (root) => {
      if (root.born) {
        return root.born
      }
      return null
    },
  },
  Mutation: {
    addBook: async (root, args, context) => {
      console.log('addbook', args)
      const currentUser = context.username
      if (!currentUser) {
        throw new AuthenticationError('not authenticated')
      }
      
      let author = await Author.findOne({ name: args.author })
      if (!author) {
        try {
          const newAuthor = new Author({ name: args.author })
          author = await newAuthor.save()
        } catch (error) {
          throw new UserInputError(error.message, {
            invalidArgs: args,
          })
        }
      }

      const book = new Book({ ...args, author: author })
      
      try {
        await book.save()
      } catch (error) {
        throw new UserInputError(error.message, {
          invalidArgs: args,
        })
      }
      return book.save()
    },
    editAuthor: async (root, args, context) => {
      const currentUser = context.username
      console.log('editauthor, context', context)
      if (!currentUser) {
        throw new AuthenticationError('not authenticated')
      }

      console.log('editauthor', args)
      const author = await Author.findOne({ name: args.name })
      author.born = args.setBornTo

      try {
        await author.save()
      } catch (error) {
        throw new UserInputError(error.message, {
          invalidArgs: args
        })
      }
      return author
    },
    createUser: async (root, args) => {
      const user = new User({ ...args })
      
      return user.save()
        .catch(error => {
          throw new UserInputError(error.message, {
            invalidArgs: args
          })
        })
    },
    login: async (root, args) => {
      console.log('login args', args)
      const user = await User.findOne({ username: args.username })
      console.log('user', user)
      if (!user || args.password !== 'secret1') {
        throw new UserInputError("Wrong credientials")
      }

      const userForToken = {
        username: user.username,
        id: user._id
      }

      return {value: jwt.sign(userForToken, JWT_SECRET)}
    }
  },
}

const server = new ApolloServer({
  typeDefs,
  resolvers,
  context: async ({ req }) => {
    const auth = req ? req.headers.authorization : null
    if (auth && auth.toLowerCase().startsWith('bearer ')) {
      const decodedToken = jwt.verify(
        auth.substring(7), JWT_SECRET
      )
      const currentUser = await User
        .findById(decodedToken.id)
      return currentUser
    }
  }
})

server.listen().then(({ url }) => {
  console.log(`Server ready at ${url}`)
})