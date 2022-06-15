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
      },
      headers: {
        'Authorization': `bearer ${JSON.parse(localStorage.getItem('loggedNoteappUser')).token}`
      }
    })
    cy.visit('http://localhost:3000')
  })

  it('Login form is shown', function () {
    cy.contains('username')
    cy.contains('password')
    cy.contains('login')
  })

  describe('Login', function () {
    it('succeeds with correct credentials', function () {
      // ...
    })

    it('fails with wrong credentials', function () {
      // ...
    })
  })
})