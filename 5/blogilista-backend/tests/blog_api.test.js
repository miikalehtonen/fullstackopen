const { test, describe, after, beforeEach } = require('node:test')
const mongoose = require('mongoose')
const supertest = require('supertest')
const assert = require('node:assert')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const app = require('../app')
const Blog = require('../models/blog')
const User = require('../models/user')
const testHelper = require('../utils/test_helper')

const api = supertest(app)

beforeEach(async () => {
    await Blog.deleteMany({})
    await User.deleteMany({})

    const passwordHash = await bcrypt.hash('password', 10)
    const user = new User({ username: 'tester', passwordHash })
    const savedUser = await user.save()

    const userForToken = { username: savedUser.username, id: savedUser._id }
    token = jwt.sign(userForToken, process.env.SECRET, { expiresIn: 60 * 60 })

    const blogsWithUser = testHelper.initialBlogs.map(blog => ({
        ...blog,
        user: savedUser._id
    }))
    await Blog.insertMany(blogsWithUser)
})

test('blogs returned as json and correct amount', async () => {
    const response = await api
        .get('/api/blogs')
        .expect(200)
        .expect('Content-Type', /application\/json/)

    assert.strictEqual(response.body.length, testHelper.initialBlogs.length)
})

test('blogs have id field instead of _id', async () => {
    const response = await api
        .get('/api/blogs')
        .expect(200)
        .expect('Content-Type', /application\/json/)

    response.body.forEach(blog => {
        assert(blog.id)
        assert(!blog._id)
    })
})

test('new blog can be added', async () => {
    const newBlog = {
        title: "test case",
        author: "tester",
        url: "http://test.com/",
        likes: 3,
    }
    await api
        .post('/api/blogs')
        .set('Authorization', `Bearer ${token}`)
        .send(newBlog)
        .expect(201)
        .expect('Content-Type', /application\/json/)

    const response = await api.get('/api/blogs')
    const content = response.body.map(r => r.title)

    assert.strictEqual(response.body.length, testHelper.initialBlogs.length + 1)
    assert(content.includes("test case"))
})

test('adding blog fails no token is provided', async () => {
    const newBlog = {
        title: "Unauthorized",
        author: "Unauthorized",
        url: "http://test.com/",
        likes: 0,
    }

    await api
        .post('/api/blogs')
        .send(newBlog)
        .expect(401)
})

test('if likes not given, set it to 0', async () => {
    const newBlog = {
        title: "no likes",
        author: "tester",
        url: "http://test.com/",
    }

    const response = await api
        .post('/api/blogs')
        .set('Authorization', `Bearer ${token}`)
        .send(newBlog)
        .expect(201)
        .expect('Content-Type', /application\/json/)

    assert.strictEqual(response.body.likes, 0)
})

test('adding blog without title', async () => {
    const newBlog = {
        author: "no title",
        url: "http://test.com/",
        likes: 3
    }

    await api
        .post('/api/blogs')
        .set('Authorization', `Bearer ${token}`)
        .send(newBlog)
        .expect(400)
})

test('adding blog without url', async () => {
    const newBlog = {
        title: "no URL",
        author: "tester",
        likes: 3
    }

    await api
        .post('/api/blogs')
        .set('Authorization', `Bearer ${token}`)
        .send(newBlog)
        .expect(400)
})

describe('delete blog', () => {
    test('get 204 for valid request', async () => {
        const blogsAtStart = await testHelper.blogsInDb()
        const blogToDelete = blogsAtStart[0]

        await api
            .delete(`/api/blogs/${blogToDelete.id}`)
            .set('Authorization', `Bearer ${token}`)
            .expect(204)

        const blogsAtEnd = await testHelper.blogsInDb()
        assert.strictEqual(blogsAtEnd.length, blogsAtStart.length - 1)
        const contents = blogsAtEnd.map(b => b.title)
        assert.notStrictEqual(contents.includes(blogToDelete.title), true)
    })

    test('get 404 if blog does not exist', async () => {
        const nonExistentId = await testHelper.nonExistingId()

        await api
            .delete(`/api/blogs/${nonExistentId}`)
            .set('Authorization', `Bearer ${token}`)
            .expect(404)
    })
})

describe('update blog', () => {
    test('test update likes', async () => {
        const blogsAtStart = await testHelper.blogsInDb()
        const blogToUpdate = blogsAtStart[0]

        const updatedData = { likes: blogToUpdate.likes + 1 }

        const response = await api
            .put(`/api/blogs/${blogToUpdate.id}`)
            .send(updatedData)
            .expect(200)
            .expect('Content-Type', /application\/json/)

        assert.strictEqual(response.body.likes, updatedData.likes)
    })

    test('get 404 if blog does not exist', async () => {
        const nonExistentId = await testHelper.nonExistingId()
        const updatedData = { likes: 10 }

        await api
            .put(`/api/blogs/${nonExistentId}`)
            .send(updatedData)
            .expect(404)
    })

    test('get 400 if id is invalid', async () => {
        const invalidId = 'thisdoesnotexist'
        const updatedData = { likes: 25 }

        await api
            .put(`/api/blogs/${invalidId}`)
            .send(updatedData)
            .expect(400)
    })
})

describe('test users api', () => {
    beforeEach(async () => {
        await User.deleteMany({})

        const passwordHash = await bcrypt.hash('dummypassword', 10)
        const user = new User({ username: 'root', passwordHash })

        await user.save()
    })

    test('test with unique username', async () => {
        const usersAtStart = await testHelper.usersInDb()

        const newUser = {
            username: 'miika',
            name: 'Miika Lehtonen',
            password: 'salasana',
        }

        await api
            .post('/api/users')
            .send(newUser)
            .expect(201)
            .expect('Content-Type', /application\/json/)

        const usersAtEnd = await testHelper.usersInDb()
        assert.strictEqual(usersAtEnd.length, usersAtStart.length + 1)

        const usernames = usersAtEnd.map(u => u.username)
        assert(usernames.includes(newUser.username))
    })

    test('test for already taken username', async () => {
        const usersAtStart = await testHelper.usersInDb()

        const newUser = {
            username: 'root',
            name: 'Superuser',
            password: 'salasana',
        }

        const result = await api
            .post('/api/users')
            .send(newUser)
            .expect(400)
            .expect('Content-Type', /application\/json/)

        assert(result.body.error.includes('this username is already in use'))
        const usersAtEnd = await testHelper.usersInDb()
        assert.strictEqual(usersAtEnd.length, usersAtStart.length)
    })

    test('test for missing username or password', async () => {
        let user = {}
        user = {
            name: 'No Username',
            password: 'validpassword',
        }

        const resultUsername = await api
            .post('/api/users')
            .send(user)
            .expect(400)
            .expect('Content-Type', /application\/json/)

        assert(resultUsername.body.error.includes('username and password are required'))

        user = {
            username: 'validusername',
            name: 'No Password',
        }

        const resultPassword = await api
            .post('/api/users')
            .send(user)
            .expect(400)
            .expect('Content-Type', /application\/json/)

        assert(resultPassword.body.error.includes('username and password are required'))
    })

    test('test for short username', async () => {
        const newUser = {
            username: 'a',
            name: 'short username',
            password: 'password',
        }

        const result = await api
            .post('/api/users')
            .send(newUser)
            .expect(400)
            .expect('Content-Type', /application\/json/)

        assert(result.body.error.includes('username and password must be at least 3 characters long'))
    })

    test('test for short password', async () => {
        const newUser = {
            username: 'usernamenottaken',
            name: 'short password',
            password: 'a',
        }

        const result = await api
            .post('/api/users')
            .send(newUser)
            .expect(400)
            .expect('Content-Type', /application\/json/)

        assert(result.body.error.includes('username and password must be at least 3 characters long'))
    })
})

after(async () => {
    await mongoose.connection.close()
})
