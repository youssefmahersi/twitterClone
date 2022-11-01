import axios from "axios";
export async function signUp(username, email, password) {
  let response = axios.put(`${process.env.REACT_APP_SERVER_URL}auth/signup`, {
    username,
    email,
    password,
  });
  return response;
}

export async function login(email, password) {
  let response = axios.post(`${process.env.REACT_APP_SERVER_URL}auth/login`, {
    email,
    password,
  });

  return response;
}

export function logout(context) {
  context.setUser(null);
  localStorage.removeItem("currentUser");
}
