require("dotenv").config();

const express = require("express");
const app = express();
const jwt = require("jsonwebtoken");
let cors = require("cors");
const bcrypt = require("bcrypt");
const pool = require("./db");

app.use(express.json());
app.use(cors());
app.use(express.urlencoded({ extended: false }));

//generate jwt token
function generateAccessToken(user) {
  return jwt.sign(user, process.env.ACCESS_TOKEN_SECRET, {
    expiresIn: "1800s",
  });
}

//login
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
        const user = { username: username, password: userDetails.userpassword };
        const accessToken = generateAccessToken(user);

        res.json({ accessToken: accessToken });
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

app.listen(5003, () => {
  console.log("server has started on port 5003");
});
