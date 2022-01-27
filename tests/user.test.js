const request = require('supertest')
const app = require('../src/app')
const User = require('../src/models/user')
const {userOne,userOneId,setupDatabase} = require('./fixtures/db.js')

beforeEach(setupDatabase)

test('Should signup new user', async()=>{
    const response = await request(app).post('/users').send({
        "name":"nick",
        "email":"testing@testing.com",
        "password":"supersecret123"
    }).expect(201)

    // assert that database was changed correctly
    const user = await User.findById(response.body.user._id)
    expect(user).not.toBeNull()

    // assertions about the response
    expect(response.body).toMatchObject({
        user:{
            name: "nick",
            email: "testing@testing.com"
        },
        token: user.tokens[0].token
    })
    // password should be hashed
    expect(response.body.password).not.toBe('supersecret123')
})

test('Should login existing user', async ()=>{
    const response = await request(app).post('/users/login').send({
        email: userOne.email,
        password: userOne.password
    }).expect(200)

    // verify user in DB
    const user = await User.findById(userOneId)

    // verify appropriate (2nd) token -- not the created with token
    expect(response.body.token).toBe(user.tokens[1].token)
})

test('Should not log in with bad credentials', async ()=>{
    await request(app).post('/users/login').send({
        email: "notarealuser@email.com",
        password: "notarealpassword123"
    }).expect(400)
})

test('Should get profile for user', async ()=>{
    await request(app)
        .get('/users/me')
        .set('Authorization',`Bearer ${userOne.tokens[0].token}`)
        .send()
        .expect(200)
})

test('Should get profile for unauthenticated user', async ()=>{
    await request(app)
        .get('/users/me')
        .send()
        .expect(401)
})

test('Should delete account for authenticated user', async ()=>{
    await request(app)
        .delete('/users/me')
        .set('Authorization',`Bearer ${userOne.tokens[0].token}`)
        .send()
        .expect(200)
    
    // verify user is gone
    const user = await User.findById(userOneId)
    expect(user).toBeNull()
})

test('Should NOT delete account for unauthenticated user', async ()=>{
    await request(app)
        .delete('/users/me')
        .send()
        .expect(401)
})

test('Should upload avatar image', async()=>{
    await request(app)
        .post('/users/me/avatar')
        .set('Authorization',`Bearer ${userOne.tokens[0].token}`)
        .attach('avatar','tests/fixtures/profile-pic.jpg')
        .expect(200)
    
    const user = await User.findById(userOneId)
    expect(user.avatar).toEqual(expect.any(Buffer))
})

test('Should update valid user fields', async ()=>{
    await request(app)
        .patch('/users/me')
        .set('Authorization',`Bearer ${userOne.tokens[0].token}`)
        .send({name: "LOLOLOLOL"})
        .expect(200)
    
    const user = await User.findById(userOneId)
    expect(user.name).toEqual('LOLOLOLOL')
})

test('Should not update valid user fields', async () => {
    await request(app)
        .patch('/users/me')
        .set('Authorization',`Bearer ${userOne.tokens[0].token}`)
        .send({notafield:"Nope"})
        .expect(400)
})

//
// Additional User Test Ideas
//
// Should not signup user with invalid name/email/password
// Should not update user if unauthenticated
// Should not update user with invalid name/email/password
// Should not delete user if unauthenticated