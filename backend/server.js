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
    expiresIn: "604800s",
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
          customer_id: userDetails.customer_id,
        };
        const accessToken = generateAccessToken(user);

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

    const userDetails = newUser.rows[0];

    res.json({
      loggedIn: true,
      admin: userDetails.admin,
      accessToken: accessToken,
      username: userDetails.username,
    });
  } catch (err) {
    res.json(err.message);
  }
});

//user details
app.get("/user", auth, async (req, res) => {
  try {
    const { username } = req.user;
    const user = await pool.query(
      "SELECT * FROM customers WHERE username = $1",
      [username]
    );
    res.json(user.rows[0]);
  } catch (err) {
    console.error(err.message);
  }
});

//update user details
app.patch("/user/update", auth, async (req, res) => {
  try {
    const { password } = req.user;

    const {
      customer_id,
      oldPassword,
      newPassword,
      first_name,
      last_name,
      mobile_number,
      email,
    } = req.body.userDetails;

    const validOldPass = await bcrypt.compare(oldPassword, password);

    if (validOldPass) {
      const validNewPass = await bcrypt.compare(newPassword, password);
      if (validNewPass) {
        res.json("New password is the same as current password");
      } else {
        const hash = await bcrypt.hash(newPassword, 10);
        await pool.query(
          "UPDATE customers SET userpassword = $1, first_name = $2, last_name = $3, mobile_number = $4, email = $5 WHERE customer_id = $6",
          [hash, first_name, last_name, mobile_number, email, customer_id]
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

//create address
app.post("/user/address", auth, async (req, res) => {
  const {
    customer_id,
    address_line1,
    address_line2,
    postal_code,
    country,
    address_type,
    name,
  } = req.body;

  try {
    const newAddress = await pool.query(
      "INSERT INTO addresses (customer_id, address_line1, address_line2, postal_code, country, address_type, name) VALUES($1, $2, $3, $4, $5, $6, $7) RETURNING *",
      [
        customer_id,
        address_line1,
        address_line2,
        postal_code,
        country,
        address_type,
        name,
      ]
    );

    res.json("Address added");
  } catch (err) {
    console.error(err.message);
  }
});

//get address
app.get("/user/address", auth, async (req, res) => {
  try {
    const { username } = req.user;

    const address = await pool.query(
      "SELECT * FROM addresses WHERE customer_id = (SELECT customer_id FROM customers WHERE username=$1)",
      [username]
    );
    res.json(address.rows);
  } catch (err) {
    console.error(err.message);
  }
});

//delete address
app.delete("/user/address/delete/:id", auth, async (req, res) => {
  try {
    const addressId = req.params.id;

    const deletedAddress = await pool.query(
      "DELETE FROM addresses WHERE address_id = $1 RETURNING *;",
      [addressId]
    );
  } catch (err) {
    console.error(err.message);
  }
});

//get product card details by category

app.get("/products/:category", async (req, res) => {
  try {
    const product = await pool.query(
      "SELECT prod.name, prod.product_id, prod.price, img.image_thumb FROM products prod INNER JOIN images img ON img.image_id = prod.image_id WHERE category_id=$1;",
      [req.params.category]
    );

    res.json(product.rows);
  } catch (err) {
    console.error(err.message);
  }
});

//get full product details by product id

app.get("/products/details/:id", async (req, res) => {
  try {
    const fullProdDetails = await pool.query(
      "SELECT prod.name, prod.product_id, prod.price, prod.description, img.image_thumb, inven.quantity, to_jsonb(ls.*) - 'list_detail_id' as specs FROM products prod INNER JOIN images img ON img.image_id = prod.image_id INNER JOIN inventories inven ON inven.inventory_id = prod.inventory_id INNER JOIN list_details ls ON ls.list_detail_id = prod.list_detail_id WHERE product_id = $1;",
      [req.params.id]
    );

    res.json(fullProdDetails.rows[0]);
  } catch (err) {
    console.error(err.message);
  }
});

//get cart

app.get("/cart", auth, async (req, res) => {
  const { customer_id } = req.user;

  try {
    const cartDetails = await pool.query(
      "SELECT carts.cart_id, carts.customer_id, cartitems.product_id, cartitems.quantity, carts.total FROM carts carts INNER JOIN cart_items cartitems ON cartitems.cart_id = carts.cart_id WHERE carts.customer_id = $1",
      [customer_id]
    );

    res.json(cartDetails.rows);
  } catch (err) {
    console.error(err.message);
  }
});

app.listen(5002, () => {
  console.log("server has started on port 5002");
});
