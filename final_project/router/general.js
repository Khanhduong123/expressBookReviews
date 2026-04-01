const express = require('express');
const axios = require('axios'); // 1. Import Axios
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();

// Giả sử server của bạn chạy ở localhost:5000
const BASE_URL = "http://localhost:5000"; 

// --- Đăng ký người dùng (Giữ nguyên logic local) ---
public_users.post("/register", (req,res) => {
  const { username, password } = req.body;
  if (username && password) {
    if (!isValid(username)) { 
      users.push({"username":username,"password":password});
      return res.status(200).json({message: "User successfully registred. Now you can login"});
    } else {
      return res.status(400).json({message: "User already exists!"});    
    }
  } 
  return res.status(400).json({message: "Unable to register user."});
});

// --- Task 10: Lấy danh sách sách bằng Axios ---
public_users.get('/', async function (req, res) {
  try {
    // Thay vì đọc trực tiếp biến books, ta dùng axios gọi tới chính server
    // (Hoặc giả lập gọi một API bên ngoài)
    const response = await axios.get(`${BASE_URL}/internal/books`);
    res.status(200).send(JSON.stringify(response.data, null, 4));
  } catch (error) {
    res.status(500).json({ message: "Error fetching books via Axios", error: error.message });
  }
});

// --- Task 11: Lấy chi tiết sách qua ISBN bằng Axios ---
public_users.get('/isbn/:isbn', async function (req, res) {
  const isbn = req.params.isbn;
  try {
    const response = await axios.get(`${BASE_URL}/internal/books`);
    const book = response.data[isbn];
    if (book) {
      res.status(200).json(book);
    } else {
      res.status(404).send("Book not found");
    }
  } catch (error) {
    res.status(500).send("Error fetching book details");
  }
});

// --- Task 12: Tìm sách theo Tác giả bằng Axios ---
public_users.get('/author/:author', async function (req, res) {
  const author = req.params.author;
  try {
    const response = await axios.get(`${BASE_URL}/internal/books`);
    const allBooks = Object.values(response.data);
    const filtered = allBooks.filter(b => b.author === author);
    res.status(200).json(filtered);
  } catch (error) {
    res.status(500).send("Error");
  }
});

// --- Task 13: Tìm sách theo Tiêu đề bằng Axios ---
public_users.get('/title/:title', async function (req, res) {
  const title = req.params.title;
  try {
    const response = await axios.get(`${BASE_URL}/internal/books`);
    const allBooks = Object.values(response.data);
    const filtered = allBooks.filter(b => b.title === title);
    res.status(200).json(filtered);
  } catch (error) {
    res.status(500).send("Error");
  }
});

// Lấy review sách
public_users.get('/review/:isbn', async function (req, res) {
  const isbn = req.params.isbn;
  try {
    const response = await axios.get(`${BASE_URL}/internal/books`);
    const book = response.data[isbn];
    if (book) {
      res.send(book.reviews);
    } else {
      res.status(404).send("Book not found");
    }
  } catch (error) {
    res.status(500).send("Error");
  }
});

/**
 * Endpoint phụ trợ để Axios có chỗ gọi vào lấy dữ liệu
 * Trong thực tế, đây có thể là một database API riêng biệt.
 */
public_users.get('/internal/books', (req, res) => {
    res.json(books);
});

module.exports.general = public_users;