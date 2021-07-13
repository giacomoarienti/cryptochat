import { backend } from "./info";

// check if user is authenticated with the jwt token
async function getUsername() {
  let resp = await fetch(backend + "/api/user/username", {
    method: "GET",
    credentials: "include",
  });

  //check response code
  if (resp.status === 200) {
    resp = await resp.json()
    return resp.username;
  }
  return null;
}

async function logoutUser() {
  await fetch(backend + "/api/user/logout", {
    method: "GET",
    credentials: "include",
  });
  return;
}

async function registerUser(username) {
  let resp = await fetch(backend + "/api/user/register", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({username: username}),
    credentials: "include",
  });

  if (resp.status === 200) {
    return {message: "Successfully registered!"};
  }

  return await resp.json();

}

async function checkUser(username) {
  let resp = await fetch(backend + "/api/user/" + username, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
  });

  if (resp.status === 200) {
    return true;
  }

  return false;
}

export { getUsername, logoutUser, registerUser, checkUser };
