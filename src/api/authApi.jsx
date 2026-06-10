const users = [
  {
    name:'Admin',
    email:'admin@jobportal.com',
    password:'admin123',
    role:'admin'
  }
];

export const registerUser = (user) => {
  users.push(user);
};

export const loginUser = (email, password) => {
  return users.find(
    user =>
      user.email === email &&
      user.password === password
  );
};