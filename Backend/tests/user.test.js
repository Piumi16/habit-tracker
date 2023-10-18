/* eslint-disable no-console */
/* eslint-disable no-undef */
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { login } = require('../controllers/user').handlers;
const User = require('../models/user');

jest.mock('../models/user'); // Mock the User model

describe('login function', () => {
  test('Valid login', async () => {
    // Define a mock user and its properties
    const mockUser = {
      _id: 'user_id',
      email: 'user@example.com',
      password: 'hashedPassword',
      user_type: 'user_type',
    };

    // Mock the behavior of User.findOne
    User.findOne.mockResolvedValue(mockUser);

    // Mock the behavior of bcrypt.compare
    bcrypt.compare = jest.fn().mockResolvedValue(true);

    // Mock the behavior of jwt.sign
    jwt.sign = jest.fn().mockReturnValue('mockedAuthToken');

    const req = { body: { email: 'user@example.com', password: 'password' } };
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };

    await login(req, res);

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({
      status_code: 200,
      message: 'success',
      data: {
        token: 'mockedAuthToken',
        expiresIn: 3600,
      },
    });
  });

  test('Wrong password', async () => {
    // Define a mock user with correct email and a hashed password
    const mockUser = {
      _id: 'user_id',
      email: 'user@example.com',
      password: 'hashedPassword', // Correct hashed password
      user_type: 'user_type',
    };

    // Mock the behavior of User.findOne to return the user
    User.findOne.mockResolvedValue(mockUser);

    // Mock the behavior of bcrypt.compare to simulate a wrong password
    bcrypt.compare = jest.fn().mockResolvedValue(false); // Simulate wrong password

    const req = { body: { email: 'user@example.com', password: 'wrongPassword' } };
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };

    await login(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({
      status_code: 400,
      message: 'error',
      error: 'Auth failed',
    });
  });
});
