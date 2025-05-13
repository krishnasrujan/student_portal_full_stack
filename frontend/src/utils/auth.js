export const login = (username, password) => {
  if (username === 'admin' && password === 'admin123') {
    localStorage.setItem('userRole', 'schoolCoordinator');
    return true;
  }
  return false;
};

export const logout = () => {
  localStorage.removeItem('userRole');
};

export const getUserRole = () => {
  return localStorage.getItem('userRole');
};
