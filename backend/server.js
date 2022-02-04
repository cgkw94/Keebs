const express = require("express");
const app = express();
const bcrypt = require("bcrypt");
let cors = require("cors");
const pool = require("./db");

//middleware
app.use(express.json());
app.use(cors());
app.use(express.urlencoded({ extended: false }));

//routes

//register
app.post("/register", async (req, res) => {
  try {
    console.log(req.body);
    const { username, password, first_name, last_name, mobile_number, email } =
      req.body;
    const hash = await bcrypt.hash(password, 10);

    const newUser = await pool.query(
      "INSERT INTO customers (username, userpassword, first_name, last_name, mobile_number, email) VALUES($1, $2, $3, $4, $5, $6) RETURNING *",
      [username, hash, first_name, last_name, mobile_number, email]
    );

    res.json(newUser);
  } catch (err) {
    console.error(err.message);
  }
});

//login
app.patch("/login", async (req, res) => {
  try {
    const { username, password } = req.body;
    const user = await pool.query(
      "SELECT * FROM customers WHERE username = $1",
      [username]
    );
    userDetails = user.rows[0];

    if (userDetails) {
      const validPass = await bcrypt.compare(
        password,
        userDetails.userpassword
      );

      if (validPass) {
        res.status(200).json("Valid Username and Password");
      } else {
        res.json(res.json("Incorrect Password"));
      }
    } else {
      res.status(404).json("Username not found");
    }
  } catch (err) {
    console.error(err.message);
  }
});

app.listen(5002, () => {
  console.log("server has started on port 5002");
});

//get products
