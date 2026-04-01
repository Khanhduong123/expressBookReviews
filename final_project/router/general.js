const express = require('express');
const axios = require('axios');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();

// Cấu hình URL của server local (thường là port 5000)
const BASE_URL = "http://localhost:5000";

// --- Endpoint nội bộ phục vụ dữ liệu cho Axios ---
public_users.get('/books/data', (req, res) => {
    res.status(200).json(books);
});

// 1. Đăng ký người dùng
public_users.post("/register", (req, res) => {
    const { username, password } = req.body;
    if (username && password) {
        if (!isValid(username)) {
            users.push({ "username": username, "password": password });
            return res.status(200).json({ message: "User successfully registered. Now you can login" });
        } else {
            return res.status(400).json({ message: "User already exists!" });
        }
    }
    return res.status(400).json({ message: "Unable to register user." });
});

// 2. Task 10: Lấy danh sách sách (Dùng Axios)
public_users.get('/', async function (req, res) {
    try {
        const response = await axios.get(`${BASE_URL}/books/data`);
        res.status(200).send(JSON.stringify(response.data, null, 4));
    } catch (error) {
        res.status(500).json({ message: "Error fetching book list", error: error.message });
    }
});

// 3. Task 11: Lấy chi tiết sách theo ISBN (Dùng Axios)
public_users.get('/isbn/:isbn', async function (req, res) {
    const isbn = req.params.isbn;
    try {
        const response = await axios.get(`${BASE_URL}/books/data`);
        const book = response.data[isbn];
        if (book) {
            res.status(200).json(book);
        } else {
            res.status(404).json({ message: "Book not found" });
        }
    } catch (error) {
        res.status(500).json({ message: "Error fetching book by ISBN", error: error.message });
    }
});

// 4. Task 12: Lấy sách theo Tác giả (Dùng Axios)
public_users.get('/author/:author', async function (req, res) {
    const author = req.params.author;
    try {
        const response = await axios.get(`${BASE_URL}/books/data`);
        const allBooks = Object.values(response.data);
        const filteredBooks = allBooks.filter(b => b.author === author);
        
        if (filteredBooks.length > 0) {
            res.status(200).json(filteredBooks);
        } else {
            res.status(404).json({ message: "No books found for this author" });
        }
    } catch (error) {
        res.status(500).json({ message: "Error fetching books by author", error: error.message });
    }
});

// 5. Task 13: Lấy sách theo Tiêu đề (Dùng Axios)
public_users.get('/title/:title', async function (req, res) {
    const title = req.params.title;
    try {
        const response = await axios.get(`${BASE_URL}/books/data`);
        const allBooks = Object.values(response.data);
        const filteredBooks = allBooks.filter(b => b.title === title);

        if (filteredBooks.length > 0) {
            res.status(200).json(filteredBooks);
        } else {
            res.status(404).json({ message: "No books found with this title" });
        }
    } catch (error) {
        res.status(500).json({ message: "Error fetching books by title", error: error.message });
    }
});

// 6. Lấy đánh giá sách (Review)
public_users.get('/review/:isbn', async function (req, res) {
    const isbn = req.params.isbn;
    try {
        const response = await axios.get(`${BASE_URL}/books/data`);
        const book = response.data[isbn];
        if (book) {
            res.status(200).json(book.reviews);
        } else {
            res.status(404).json({ message: "Reviews not found" });
        }
    } catch (error) {
        res.status(500).json({ message: "Error fetching reviews" });
    }
});

module.exports.general = public_users;