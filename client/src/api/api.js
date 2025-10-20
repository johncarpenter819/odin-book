const BASE_URL = "/api/auth";
const USER_BASE_URL = "/api/users";

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
  const response = await fetch(`${BASE_URL}/posts/feed`, {
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

export const logoutUser = async () => {
  const response = await fetch(`${BASE_URL}/logout`, {
    method: "POST",
    credentials: "include",
  });

  if (!response.ok) {
    console.error("Logout API failed with status:", response.status);
  }
};

/**
 * @param {object} postData
 * @returns {object}
 * @throws {Error}
 */

export async function createPost(postData) {
  const response = await fetch(`${BASE_URL}/posts`, {
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
/**
 * @param {number} postId
 * @param {string} content
 * @param {object}
 * @throws {Error}
 */

export const postComment = async (postId, content) => {
  const response = await fetch(`${BASE_URL}/posts/${postId}/comments`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ content }),
    credentials: "include",
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(
      data.error || `Failed to post comment (Status: ${response.status})`
    );
  }
  return data;
};

export const getPostComments = async (postId) => {
  try {
    const response = await fetch(`${BASE_URL}/posts/${postId}/comments`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
    });

    if (!response.ok) {
      throw new Error("Failed to fetch post comments.");
    }

    return await response.json();
  } catch (error) {
    console.error("API Error- getPostComments:", error);
    throw error;
  }
};

export async function togglePostLike(postId) {
  const response = await fetch(`${BASE_URL}/posts/${postId}/like`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
  });

  if (!response.ok) {
    const data = await response.json();
    throw new Error(data.error || "Failed to toggle like on post.");
  }

  return response.json();
}

/**
 * @param {number} userId
 * @returns {object}
 * @throws {Error}
 */

export async function getUserProfile(identifier) {
  const response = await fetch(`${USER_BASE_URL}/username/${identifier}`, {
    method: "GET",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(
      data.error || `Failed to fetch user profile for: ${identifier}.`
    );
  }
  return data;
}

/**
 * @returns {Array<object>}
 * @throws {Error}
 */

export async function getAllUsers() {
  const response = await fetch(USER_BASE_URL, {
    method: "GET",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.error || "Failed to fetch user list.");
  }
  return data;
}

/**
 * @param {number} userId
 * @returns {object}
 * @throws {Error}
 */

export async function toggleFollow(userId) {
  const response = await fetch(`${USER_BASE_URL}/${userId}/follow`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(
      data.error || `Failed to toggle follow status for user ID: ${userId}.`
    );
  }
  return data;
}
