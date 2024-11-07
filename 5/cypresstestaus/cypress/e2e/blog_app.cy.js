describe('Blog app', function () {
  beforeEach(function () {
    cy.request('POST', `${Cypress.env('BACKEND')}/testing/reset`)
    const user = {
      name: 'Test User',
      username: 'testuser',
      password: 'password',
    }
    cy.request('POST', `${Cypress.env('BACKEND')}/users`, user)
    cy.visit('')
  })

  it('Login form is shown', function () {
    cy.contains('log in')
    cy.get('input[name="Username"]')
    cy.get('input[name="Password"]')
  })

  describe('Login', function () {
    it('fails with wrong credentials', function () {
      cy.get('#username').type('testuser')
      cy.get('#password').type('wrongpassword')
      cy.get('#login-button').click()

      cy.get('.error').should('contain', 'Invalid username or password')
      cy.get('.error').should('have.css', 'color', 'rgb(255, 0, 0)')
    })
    it('succeeds with correct credentials', function () {
      cy.get('#username').type('testuser')
      cy.get('#password').type('password')
      cy.get('#login-button').click()

      cy.contains('Test User logged in')
    })
  })
  describe('When logged in', function () {
    beforeEach(function () {
      cy.login('testuser', 'password')
      cy.addBlog('Testblog', 'testuser', 'http://test.com', 0)
    })

    it('A blog can be created', function () {
      cy.contains('create new blog').click()

      cy.get('input[placeholder="Title"]').type('Test Blog Title')
      cy.get('input[placeholder="Author"]').type('Test Author')
      cy.get('input[placeholder="URL"]').type('http://testblog.com')
      cy.get('button[type="submit"]').click()

      cy.contains('Test Blog Title')
      cy.contains('Test Author')
    })
    it('allows a user to like a blog', function () {
      cy.contains('Testblog').contains('view').click()

      cy.contains('Testblog').parent().as('blog')
      cy.get('@blog').contains('likes 0')

      cy.get('@blog').contains('like').click()
      cy.get('@blog').contains('likes 1')
    })
    it('allows the user who added a blog to delete it', function () {
      cy.contains('Testblog').contains('view').click()

      cy.contains('Testblog').parent().as('blog')
      cy.get('@blog').contains('remove').click()

      cy.on('window:confirm', () => true)
      cy.get('html').should('not.contain', 'Testblog')
    })
    it('only shows the delete button to the user who added the blog', function () {
      const user = {
        name: 'Wrong User',
        username: 'notTheUser',
        password: 'password',
      }
      cy.request('POST', `${Cypress.env('BACKEND')}/users`, user)
      cy.login('notTheUser', 'password')

      cy.contains('Testblog').contains('view').click()
      cy.contains('Testblog').parent().as('blog')
      cy.get('@blog').should('not.contain', 'remove')
    })
    it('displays blogs in order: most liked first', function () {
      cy.addBlog('Most liked blog', 'Author1', 'http://test.com', 5)
      cy.addBlog('Second most liked blog', 'Author2', 'http://test.com', 3)
      cy.addBlog('Least liked blog', 'Author3', 'http://test.com', 1)

      cy.visit('')

      cy.get('.blog').eq(0).should('contain', 'Most Liked Blog')
      cy.get('.blog').eq(1).should('contain', 'Second Most Liked Blog')
      cy.get('.blog').eq(2).should('contain', 'Least Liked Blog')
    })
  })
})

