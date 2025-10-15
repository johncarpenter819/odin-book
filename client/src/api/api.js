const BASE_URL = "/api/auth";

/**
@param {object} userData
@return {object}
@throws {Error}
*/

export async function registerUser(userData) {
  const response = await fetch(`${BASE_URL}/register`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(userData),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(
      data.error || "Registration failed due to an unknown error"
    );
  }
  return data;
}

/**
 @returns {object}
 @throws {Error}
 */

export async function getCurrentUser() {
  const response = await fetch(`${BASE_URL}/loginSuccess`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.error || "Failed to fetch current user.");
  }

  return data.user;
}

/**
 @returns {Array<object>}
 @throws {Error}
 */

export async function getNewsFeed() {
  const response = await fetch("/api/posts/feed", {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.error || "Failed to fetch news feed.");
  }

  return data;
}

/**
 * @returns {Array<object>}
 * @throws {Error}
 */

export async function getStories() {
  const response = await fetch("/api/stories", {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.error || "Failed to fetch stories.");
  }

  return data;
}

/**
 * @param {object} credentials
 * @returns {object}
 * @throws {Error}
 */

export async function loginUser(credentials) {
  const response = await fetch(`${BASE_URL}/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(credentials),
    credentials: "include",
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(
      data.error || "Login failed. Check your email and password."
    );
  }

  return data.user;
}

/**
 * @param {object} postData
 * @returns {object}
 * @throws {Error}
 */

export async function createPost(postData) {
  const response = await fetch("/api/posts", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(postData),
    credentials: "include",
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.error || "Failed to create post.");
  }
  return data;
}
