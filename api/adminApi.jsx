export const users = [
  {
    id: 1,
    name: 'Krishna Vijayan',
    role: 'seeker'
  },
  {
    id: 2,
    name: 'Rahul Employer',
    role: 'employer'
  },
  {
    id: 3,
    name: 'Admin User',
    role: 'admin'
  }
];


// GET ALL USERS
export const getAllUsers = () => {
  return users;
};

// GET USER BY ROLE
export const getUsersByRole = (role) => {
  return users.filter(user => user.role === role);
};

// ADD USER (optional simulation)
export const addUser = (user) => {
  users.push(user);
};