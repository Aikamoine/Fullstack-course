const blog = require("../../../../blogilista/models/blog")

describe('Blog app', function () {
  beforeEach(function () {
    cy.request('POST', 'http://localhost:3003/api/testing/reset')
    cy.request({
      url: 'http://localhost:3003/api/users',
      method: 'POST',
      body: {
        username: 'testAccount',
        name: 'Mr Bluffington',
        password: 'publicKnowledge'
      }
    })
    cy.visit('http://localhost:3000')
  })

  it('Login form is shown', function () {
    cy.contains('username')
    cy.contains('password')
    cy.contains('login').click()
  })

  describe('Login', function () {
    it('succeeds with correct credentials', function () {
      cy.get('#username').type('testAccount')
      cy.get('#password').type('publicKnowledge')
      cy.get('#login-button').click()

      cy.contains('Mr Bluffington logged in')
    })

    it('fails with wrong credentials', function () {
      cy.get('#username').type('testAccount')
      cy.get('#password').type('secret')
      cy.get('#login-button').click()

      cy.get('.error').should('contain', 'wrong username or password')
    })
  })

  describe('When logged in', function () {
    beforeEach(function () {
      /*
      cy.request('POST', 'http://localhost:3003/api/login', {
        username: 'testAccount', password: 'publicKnowledge'
      }).then(response => {
        localStorage.setItem('loggedAppUser', JSON.stringify(response.body))
        cy.visit('http://localhost:3000')
      })
      */
      cy.visit('http://localhost:3000')
      cy.get('#username').type('testAccount')
      cy.get('#password').type('publicKnowledge')
      cy.get('#login-button').click()
    })

    it('A blog can be created', function () {
      cy.addBlog({ title: 'blog title', author: 'blog author', url: 'blog.url' })
      cy.contains('blog title blog author')
    })

    it('A blog can be liked', function () {
      cy.addBlog({ title: 'blog title', author: 'blog author', url: 'blog.url' })
      cy.contains('view').click()
      cy.contains('0 likes')
      cy.contains('like').click()
      cy.contains('1 likes')
    })

    /*
    it.only('Most liked blog is first', function () {
      cy.addBlog({ title: 'blog title', author: 'blog author', url: 'blog.url' })
      cy.contains('view').click()
      cy.addBlog({ title: 'second blog', author: 'second author', url: 'blog2.url' })
      cy.contains('view').click()
      cy.get('.blog').then(blogs => {
        console.log('number of blogs', blogs[0])
      })
      cy.get('.blog').eq(0).should('contain', 'blog title')
      cy.get('.blog').eq(1).should('contain', 'second blog')
      cy.get('.blog').eq(1).contains('like').click()
      cy.get('.blog').eq(1).should('contain', 'blog title')
      cy.get('.blog').eq(0).should('contain', 'second blog')
    })
    */
  })
})