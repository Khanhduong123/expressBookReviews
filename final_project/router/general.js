const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();


public_users.post("/register", (req,res) => {
  const username = req.body.username;
  const password = req.body.password;

  if (username && password) {
    if (!isValid(username)) { 
      users.push({"username":username,"password":password});
      return res.status(200).json({message: "User successfully registred. Now you can login"});
    } else {
      return res.status(404).json({message: "User already exists!"});    
    }
  } 
  return res.status(404).json({message: "Unable to register user."});
});

// Get the book list available in the shop
public_users.get('/',async function (req, res) {
  try {
    const allBooks = await Promise.resolve(books);
    res.send(JSON.stringify(allBooks, null, 4));
  } catch (error) {
    res.status(500).send("Error fetching books");
  }
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn',async function (req, res) {
  const isbn = req.params.isbn;
  try {
    const book = await Promise.resolve(books[isbn]);
    if (book) {
      res.send(book);
    } else {
      res.status(404).send("Book not found");
    }
  } catch (error) {
    res.status(500).send("Error fetching book details");
  }
 });
  
// Get book details based on author
public_users.get('/author/:author',async function (req, res) {
    const author = req.params.author;
    try {
        const allBooks = await Promise.resolve(Object.values(books));
        let filtered_books = allBooks.filter((book) => book.author === author);
        res.send(filtered_books);
    } catch (error) {
        res.status(500).send("Error fetching books by author");
    }
});

// Get all books based on title
public_users.get('/title/:title',async function (req, res) {
    const title = req.params.title;
    try {
        const allBooks = await Promise.resolve(Object.values(books));
        let filtered_books = allBooks.filter((book) => book.title === title);
        res.send(filtered_books);
    } catch (error) {
        res.status(500).send("Error fetching books by title");
    }
});

//  Get book review
public_users.get('/review/:isbn',async function (req, res) {
  const isbn = req.params.isbn;
  try {
    const book = await Promise.resolve(books[isbn]);
    if (book) {
      res.send(book.reviews);
    } else {
      res.status(404).send("Book not found");
    }
  } catch (error) {
    res.status(500).send("Error fetching reviews");
  }
});

module.exports.general = public_users;
