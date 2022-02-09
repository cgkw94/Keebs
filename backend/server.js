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
    expiresIn: "30d",
  });
}

app.post("/login", async (req, res) => {
  try {
    const { username, password } = req.body;
    const user = await pool.query(
      "SELECT * FROM customers WHERE username = $1",
      [username]
    );
    const userDetails = user.rows[0];

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
      `
      INSERT INTO customers (username, userpassword, first_name, last_name, mobile_number, email, admin) 
      VALUES($1, $2, $3, $4, $5, $6, $7) 
      RETURNING *
      `,
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
    const { customer_id } = req.user;
    console.log(customer_id);
    const user = await pool.query(
      "SELECT * FROM customers WHERE customer_id = $1",
      [customer_id]
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
          `
          UPDATE customers 
          SET userpassword = $1, first_name = $2, last_name = $3, mobile_number = $4, email = $5 
          WHERE customer_id = $6
          `,
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
      `
      INSERT INTO addresses (customer_id, address_line1, address_line2, postal_code, country, address_type, name) 
      VALUES($1, $2, $3, $4, $5, $6, $7) 
      RETURNING *
      `,
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
      `
      SELECT * FROM addresses 
      WHERE customer_id = (
        SELECT customer_id 
        FROM customers 
        WHERE username=$1
        )
      `,
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
      `
      SELECT 
        prod.name, 
        prod.product_id, 
        prod.price, 
        img.image_thumb 
      FROM 
        products prod 
      INNER JOIN 
        images img ON img.image_id = prod.image_id 
      WHERE 
        category_id=$1;
      `,
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
      `
      SELECT 
        prod.name, 
        prod.product_id, 
        prod.price, prod.description, 
        img.image_thumb, 
        inven.quantity, 
        to_jsonb(ls.*) - 'list_detail_id' as specs 
      FROM 
        products prod 
      INNER JOIN 
        images img ON img.image_id = prod.image_id 
      INNER JOIN 
        inventories inven ON inven.inventory_id = prod.inventory_id
      INNER JOIN 
        list_details ls ON ls.list_detail_id = prod.list_detail_id 
      WHERE 
        product_id = $1;
      `,
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
      `
      SELECT 
        carts.cart_id, 
        carts.customer_id, 
		    cartitems.product_id, 
		    img.image_thumb,
  		  prod.name,
		    prod.price,
        cartitems.quantity, 
        carts.total,
        inven.quantity AS inven_quantity
      FROM 
        carts carts 
      INNER JOIN 
        cart_items cartitems ON cartitems.cart_id = carts.cart_id 
		  INNER JOIN 
        products prod ON prod.product_id = cartitems.product_id
		  INNER JOIN 
        images img ON img.image_id = prod.image_id 
      INNER JOIN 
        inventories inven ON inven.inventory_id = prod.inventory_id
      WHERE 
        carts.customer_id = $1
      ORDER BY 
        cartitems.product_id;
      `,
      [customer_id]
    );

    res.json(cartDetails.rows);
  } catch (err) {
    console.error(err.message);
  }
});

//add to cart
app.put("/addtocart", auth, async (req, res) => {
  try {
    const { customer_id } = req.user;
    const { product_id, price, quantity } = req.body;

    //check if user have a cart
    const checkIfUserHavCart = await pool.query(
      `
      SELECT customer_id
      FROM carts
      WHERE customer_id = $1
      `,
      [customer_id]
    );

    const foundCart = checkIfUserHavCart.rows.some(
      (check) => check.customer_id === customer_id
    );

    if (foundCart) {
      //find subtotal of cart
      const cart = await pool.query(
        `
        SELECT
          carts.cart_id,
          carts.total,
          (
            SELECT
              json_agg(products) AS products
            FROM
              ( SELECT
                  cartitems.product_id AS product_id,
                  cartitems. quantity AS quantity
                FROM
                  cart_items cartitems
                WHERE
                  cartitems.cart_id = carts.cart_id
              ) products
          )
            FROM carts
              WHERE carts.customer_id = $1
        `,
        [customer_id]
      );

      const cart_id = cart.rows[0].cart_id;

      const currentTotal = parseInt(cart.rows[0].total);

      //check if product in cart
      // const products = await pool.query(
      //   `
      //   SELECT product_id, quantity
      //   FROM cart_items
      //   WHERE
      //     cart_id = (
      //       SELECT cart_id
      //       FROM carts
      //       WHERE customer_id = $1
      //       )
      //   `,
      //   [customer_id]
      // );

      const products = cart.rows[0].products;

      //check if newly added product already exist in cart
      const foundProdId = products.some(
        (check) => check.product_id === product_id
      );

      // if found, update cart
      // if not, put new item into cart
      if (foundProdId) {
        // find the exact product in cart by id

        const product = products.find((prod) => {
          return prod.product_id === product_id;
        });

        const currentQty = product.quantity;

        const newTotal = currentTotal + price * quantity;
        const newQty = currentQty + quantity;

        //check new quantity with database

        const productDB = await pool.query(
          `
          SELECT
            quantity
          FROM
            inventories
          WHERE
            inventory_id = (
              SELECT inventory_id
              FROM products
              WHERE product_id = $1
            )
          `,
          [product_id]
        );
        const dbQty = productDB.rows[0].quantity;

        if (newQty <= dbQty) {
          await pool.query(
            `
            UPDATE carts SET total = $1
            WHERE customer_id = $2
            `,
            [newTotal, customer_id]
          );
          await pool.query(
            `
            UPDATE cart_items SET quantity = $1
            WHERE cart_id = $2 AND product_id = $3
            `,
            [newQty, cart_id, product_id]
          );
        } else {
          res.json("Unable to add, reduce quantity!");
        }
      } else {
        //got cart but no item
        const newTotal = currentTotal + price * quantity;

        //update cart subtotal
        await pool.query(
          `
          UPDATE carts SET total = $1
          WHERE customer_id = $2
          `,
          [newTotal, customer_id]
        );

        //insert new cartitem
        await pool.query(
          `
          INSERT INTO cart_items (cart_id, product_id, quantity)
          VALUES ($1, $2, $3)
          `,
          [cart_id, product_id, quantity]
        );
      }
    } else {
      //insert into cart

      const total = price * quantity;
      await pool.query(
        "INSERT INTO carts (customer_id, total) VALUES ($1, $2)",
        [customer_id, total]
      );

      //find new cart id
      const cart = await pool.query(
        `
        SELECT cart_id FROM carts
        WHERE customer_id = $1
        `,
        [customer_id]
      );
      const cart_id = cart.rows[0].cart_id;

      //insert into cart items
      await pool.query(
        `
        INSERT INTO cart_items (cart_id, product_id, quantity)
        VALUES ($1, $2, $3)
        `,
        [cart_id, product_id, quantity]
      );
    }
  } catch (err) {
    console.error(err.message);
  }
});

//update cart
app.patch("/updatecart", auth, async (req, res) => {
  try {
    const { customer_id } = req.user;
    const { cart_id, product_id, price, quantity } = req.body;

    const cart = await pool.query(
      `
      SELECT 
        carts.total,
        cartitem.quantity as prod_quantity
      FROM carts
      INNER JOIN cart_items cartitem 
        ON cartitem.cart_id = carts.cart_id 
        AND cartitem.product_id = $1
      WHERE carts.cart_id = $2;
      `,
      [product_id, cart_id]
    );

    const currentTotal = parseInt(cart.rows[0].total);
    const currentQty = parseInt(cart.rows[0].prod_quantity);

    const newQty = quantity;
    const newTotal = currentTotal - currentQty * price + price * quantity;

    await pool.query(
      `
      UPDATE carts SET total = $1
      WHERE customer_id = $2
      `,
      [newTotal, customer_id]
    );

    await pool.query(
      `
      UPDATE cart_items SET quantity = $1
      WHERE cart_id = $2 AND product_id = $3
      `,
      [newQty, cart_id, product_id]
    );

    res.json("Update Successful");
  } catch (err) {
    console.error(err.message);
  }
});

app.listen(5002, () => {
  console.log("server has started on port 5002");
});
