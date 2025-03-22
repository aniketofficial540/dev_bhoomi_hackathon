import express from "express";
import bodyParser from "body-parser";
import mysql from "mysql2";

const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'Aniket@12#34',
    database: 'dev_bhoomi'
});

db.connect(err => {
    if (err) {
        console.error("Error connecting to the database:", err);
        return;
    }
    console.log("Connected to the MySQL database.");
});

const app = express();
const port = 5500;

app.set("view engine", "ejs");
app.use(express.static("public"));
app.use(bodyParser.urlencoded({ extended: true })); // Ensure this middleware is before routes

// Homepage
app.get("/", (req, res) => {
    res.render("index.ejs", { username: null });
});


app.get("/signup", (req, res) => {
    res.render("signup.ejs");
});

app.post("/signup", (req, res) => {
    const username1 = req.body.username; 
    const password1 = req.body.password; 
    const email = req.body.email;

    if (!username1 || !password1) {
        console.log("Username or password is undefined");
        return res.status(400).send("Username and Password are required");
    }

    console.log("Received Signup Data:", { username1, password1, email });

    const sql = "INSERT INTO users (username, password, Email) VALUES (?, ?, ?)";
    db.query(sql, [username1, password1, email], (err, result) => {
        if (err) {
            console.error("Error inserting user data:", err);
            return res.status(500).send("Database Error");
        }

        console.log("User registered successfully.");
        res.redirect("/login");
    });
});

app.get("/login", (req, res) => {
    res.render("login.ejs");
});

app.post("/login", (req, res) => {
    const username = req.body.username;
    const password = req.body.password;

    if (!username || !password) {
        console.log("Username or password is undefined");
        return res.status(400).send("Username and Password are required");
    }

    console.log("Received Login Data:", { username, password });

    const sql = "SELECT * FROM users WHERE username = ? AND password = ?";
    db.query(sql, [username, password], (err, results) => {
        if (err) {
            console.error("Database error:", err);
            return res.status(500).send("Database Error");
        }

        if (results.length > 0) {
            console.log("Login successful!");
            res.redirect("/quizes");
        } else {
            console.log("Invalid credentials");
            res.status(401).send("Invalid username or password.");
        }
    });
});

app.get("/quizes", (req, res) => {
    res.render("quizes.ejs", { username: null });
});

app.get("/data_science", (req, res) => {
    res.render("data_science.ejs", { username: null });
});

app.get("/indexin.ejs", (req, res) => {
    res.render("views/indexin.ejs", { username: null });
});

app.get("/quiz_section", (req, res) => {
    res.render("quiz_section.ejs", { username: null });
});

app.get("/dashboard", (req, res) => {
    res.render("dashboard.ejs", { username: null });
});


app.listen(port, () => {
    console.log("Server is running on port " + port);
});