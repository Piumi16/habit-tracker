/* eslint-disable no-console */
/* eslint-disable no-undef */
const { createHabit } = require('../controllers/habit').handlers; // Import the createHabit function
const UserHabit = require('../models/user_habit'); // Import the UserHabit model (or mock it)

jest.mock('../models/user_habit'); // Mock the UserHabit model

describe('createHabit function', () => {
  test('Create a new habit successfully', async () => {
    // Define the expected request data
    const req = {
      user: { user_id: 'user_id' },
      body: {
        name: 'New Habit',
        target_value: 5,
        description: 'Description',
      },
    };

    // Mock the behavior of UserHabit.findOne to return null (habit doesn't exist)
    UserHabit.findOne.mockResolvedValue(null);

    // Mock the behavior of UserHabit.create to return the created habit
    const createdHabit = {
      _id: 'habit_id',
      user_id: 'user_id',
      name: 'New Habit',
      target_value: 5,
      description: 'Description',
    };
    UserHabit.create.mockResolvedValue(createdHabit);

    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };

    await createHabit(req, res);

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({
      status_code: 200,
      message: 'Success',
      result: createdHabit,
    });
  });

  test('Habit already exists', async () => {
    // Define the expected request data
    const req = {
      user: { user_id: 'user_id' },
      body: {
        name: 'Existing Habit', // Habit with the same name already exists
        target_value: 5,
        description: 'Description',
      },
    };

    // Mock the behavior of UserHabit.findOne to return an existing habit
    const existingHabit = {
      _id: 'existing_habit_id',
      user_id: 'user_id',
      name: 'Existing Habit',
      target_value: 5,
      description: 'Description',
    };
    UserHabit.findOne.mockResolvedValue(existingHabit);

    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };

    await createHabit(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({
      status_code: 400,
      message: 'error',
      error: 'Habit already Exists',
    });
  });
});
