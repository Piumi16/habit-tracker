const urlDoc = {
  user: {
    login: { url: '/api/user/login', type: 'post' },
    register: { url: '/api/user/signup', type: 'post' },
    // log habit
    logHabit: { url: '/api/habit/log-habit', type: 'post' },
    // edit user
    editUser: { url: '/api/user/profile', type: 'patch' },
    // get profile data
    getProfile: { url: '/api/user/profile', type: 'get' },
    // delete profile
    setAccountDelete: { url: '/api/user/profile/delete-request', type: 'post' },
    // admin
    deleteAccount: { url: '/api/user/profile', type: 'delete' },
    getAccountDelete: { url: '/api/user/profile/delete-request', type: 'get' },
    // get help form admin
    postHelp: { url: '/api/user/help-center', type: 'post' }
  },
  habit: {
    getPreHabits: { url: '/api/habit/predefined-habit', type: 'get' },
    createPreHabits: { url: '/api/habit/predefined-habit', type: 'post' },
    deletePreHabits: { url: '/api/habit/predefined-habit/', type: 'delete' },
    editPreHabits: { url: '/api/habit/predefined-habit/', type: 'patch' },
    createHabit: { url: '/api/habit/', type: 'post' },
    // getUserHabitById we can use same endpoint for both
    getUserHabit: { url: '/api/habit', type: 'get' },
    editHabit: { url: '/api/habit/', type: 'patch' },
    deleteHabit: { url: '/api/habit/', type: 'delete' },
    logHabitProgress: { url: '/api/habit/progress', type: 'post' },
    getHabitProgress: { url: '/api/habit/progress', type: 'get' },
    // admin help center
    getUsersQuestions: { url: '/api/user/help-center', type: 'get' },
    // get delete req
    getUserAccountDeleteRequests: {
      url: '/api/user/profile/delete-requests',
      type: 'get'
    },
    // delete account
    deleteUserAccount: { url: '/api/user/profile/', type: 'delete' }
  }
}

export default urlDoc
