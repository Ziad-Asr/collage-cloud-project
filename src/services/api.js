import axios from "axios";

const API_URL = "http://localhost:5004";

// Create axios instance
const api = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Add request interceptor to add token to every request
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Auth Services
export const register = async (userData) => {
  return api.post("/register", userData);
};

export const login = async (credentials) => {
  return api.post("/login", credentials);
};

// Book Services
export const addBook = async (bookData) => {
  return api.post("/api/Book", bookData);
};

export const getBook = async (id) => {
  return api.get(`/api/Book/${id}`);
};

// User Library Services
export const getUserLibrary = async () => {
  return api.get("/api/UserLibrary/library");
};

export const addBookToLibrary = async (bookId) => {
  return api.post(`/api/UserLibrary/Add/Book?bookId=${bookId}`);
};

export const removeBookFromLibrary = async (bookId) => {
  return api.delete(`/api/UserLibrary/delete/Book?bookId=${bookId}`);
};
// Book Club Services
export const createBookClub = async (clubData) => {
  return api.post("/api/Bookclub", clubData);
};

export const getBookClub = async (id) => {
  return api.get(`/api/BookClub/${id}`);
};

export const deleteBookClub = async (id) => {
  return api.delete(`/api/BookClub/${id}`);
};

// Discussion Post Services
export const createDiscussionPost = async (postData) => {
  return api.post("/api/DiscussionPost", postData);
};

export const getDiscussionPost = async (id) => {
  return api.get(`/api/DiscussionPost/${id}`);
};

export const deleteDiscussionPost = async (id) => {
  return api.delete(`/api/DiscussionPost/${id}`);
};

// Reading Progress Services
export const updateReadingProgress = async (bookId, pagesRead, readingGoal) => {
  return api.post(
    `/api/Reading/progress?bookId=${bookId}&pagesRead=${pagesRead}&readingGoal=${readingGoal}`
  );
};

export const getReadingProgress = async (bookId) => {
  return api.get(`/api/Reading/progress/book?bookId=${bookId}`);
};

export default api;
