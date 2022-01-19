const request = require('supertest')
const app = require('../src/app')
const User = require('../src/models/user')

beforeEach(async()=>{
    await User.deleteMany()
})

test('Should signup new users', async()=>{
    await request(app).post('/users').send({
        "name":"nick",
        "email":"testing@testing.com",
        "password":"supersecret123"
    }).expect(201)
})