CREATE DATABASE project4_database;

--\c project4_database;

CREATE TABLE customers (
  customer_id serial NOT NULL,
  username varchar(20),
  userpassword varchar(100),
  first_name varchar(20),
  last_name varchar(20),
  mobile_number integer,
  PRIMARY KEY ("customer_id")
);

CREATE TABLE addresses (
  address_id serial NOT NULL,
  customer_id integer,
  address_line1 varchar(50),
  address_line2 varchar(50),
  postal_code char(6),
  country varchar(20),
  address_type varchar(20),
  default_address boolean,
  PRIMARY KEY ("address_id"),
  FOREIGN KEY (customer_id) REFERENCES customers (customer_id)
);

CREATE TABLE orders (
  order_id serial NOT NULL,
  customer_id integer,
  total decimal,
  PRIMARY KEY ("order_id"),
  FOREIGN KEY (customer_id) REFERENCES customers (customer_id)
);

CREATE TABLE categories (
  category_id serial NOT NULL,
  name varchar(50),
  description text,
  PRIMARY KEY ("category_id")
);

CREATE TABLE inventories (
  inventory_id SERIAL NOT NULL,
  quantity integer,
  PRIMARY KEY ("inventory_id")
);

CREATE TABLE discounts (
  discount_id serial NOT NULL,
  name varchar(50),
  description text,
  discount_percent decimal,
  active boolean,
  PRIMARY KEY ("discount_id")
);

CREATE TABLE products (
  product_id serial NOT NULL,
  name varchar(50),
  description text,
  SKU varchar(50),
  category_id integer,
  inventory_id integer,
  discount_id integer,
  price decimal,
  deleted boolean,
  PRIMARY KEY ("product_id"),
  FOREIGN KEY (category_id) REFERENCES categories (category_id),
  FOREIGN KEY (inventory_id) REFERENCES inventories (inventory_id),
  FOREIGN KEY (discount_id) REFERENCES discounts (discount_id)
);

CREATE TABLE order_items (
  order_item_id serial NOT NULL,
  order_id integer,
  product_id integer,
  PRIMARY KEY ("order_item_id"),
  FOREIGN KEY (order_id) REFERENCES orders (order_id),
  FOREIGN KEY (product_id) REFERENCES products (product_id)
);

CREATE TABLE carts (
  cart_id serial NOT NULL,
  customer_id integer,
  total decimal,
  PRIMARY KEY ("cart_id"),
  FOREIGN KEY (customer_id) REFERENCES customers (customer_id)
);

CREATE TABLE cart_items (
  cart_item_id serial NOT NULL,
  cart_id integer,
  product_id integer,
  PRIMARY KEY ("cart_item_id"),
  FOREIGN KEY (cart_id) REFERENCES carts (cart_id),
  FOREIGN KEY (product_id) REFERENCES products (product_id)
);


INSERT 