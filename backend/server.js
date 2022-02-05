require("dotenv").config();

const express = require("express");
const app = express();
const bcrypt = require("bcrypt");
let cors = require("cors");
const pool = require("./db");
const jwt = require("jsonwebtoken");
const auth = require("./middleware/auth");

//middleware
app.use(express.json());
app.use(cors());
app.use(express.urlencoded({ extended: false }));

//routes

//login

//generate jwt token
function generateAccessToken(user) {
  return jwt.sign(user, process.env.ACCESS_TOKEN_SECRET, {
    expiresIn: "1800s",
  });
}

app.post("/login", async (req, res) => {
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
        const user = {
          username: username,
          password: userDetails.userpassword,
          isAdmin: userDetails.admin,
        };
        const accessToken = generateAccessToken(user);

        res.cookie("token", accessToken, { httpOnly: true });

        res.json({
          loggedIn: true,
          admin: userDetails.admin,
          accessToken: accessToken,
          username: userDetails.username,
        });
      } else {
        res.json("Incorrect Password");
      }
    } else {
      res.status(404).json("Username not found");
    }
  } catch (err) {
    console.error(err.message);
  }
});

//register
app.post("/register", async (req, res) => {
  try {
    console.log(req.body);
    const {
      username,
      password,
      first_name,
      last_name,
      mobile_number,
      email,
      admin,
    } = req.body;
    const hash = await bcrypt.hash(password, 10);

    const newUser = await pool.query(
      "INSERT INTO customers (username, userpassword, first_name, last_name, mobile_number, email, admin) VALUES($1, $2, $3, $4, $5, $6, $7) RETURNING *",
      [username, hash, first_name, last_name, mobile_number, email, admin]
    );

    res.json(newUser.rows[0]);
  } catch (err) {
    console.error(err.message);
  }
});

//user details
app.get("/user", auth, async (req, res) => {
  try {
    const { username, password } = req.user;
    console.log(req.user);
    const user = await pool.query(
      "SELECT * FROM customers WHERE username = $1",
      [username]
    );
    res.json(user.rows);
  } catch (err) {
    console.error(err.message);
  }
});

//update user details
app.patch("/user/update", auth, async (req, res) => {
  try {
    const { username, password } = req.user;

    const {
      oldPassword,
      newPassword,
      first_name,
      last_name,
      mobile_number,
      email,
    } = req.body;

    const validOldPass = await bcrypt.compare(oldPassword, password);

    if (validOldPass) {
      const validNewPass = await bcrypt.compare(newPassword, password);
      if (validNewPass) {
        res.json("New password is the same as current password");
      } else {
        const hash = await bcrypt.hash(newPassword, 10);
        await pool.query(
          "UPDATE customers SET userpassword = $1, first_name = $2, last_name = $3, mobile_number = $4, email = $5 WHERE username = $6",
          [hash, first_name, last_name, mobile_number, email, username]
        );
        res.json("Update successful");
      }
    } else {
      res.json("Old password is incorrect");
    }
  } catch (err) {
    console.error(err.message);
  }
});

app.listen(5002, () => {
  console.log("server has started on port 5002");
});