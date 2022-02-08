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

CREATE TABLE list_details (
  list_details_id SERIAL NOT NULL,
  name varchar(50),
  PRIMARY KEY ("list_details_id")
);

CREATE TABLE list_details (
  list_detail_id SERIAL NOT NULL,
  spring varchar(100),
  stem varchar(100),
  top varchar(100),
  bottom varchar(100),
  PRIMARY KEY ("list_detail_id")
);

CREATE TABLE images (
  image_id SERIAL NOT NULL,
  image_thumb varchar(100),
  image_1 varchar(100),
  image_2 varchar(100),
  PRIMARY KEY ("image_id")
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

category_id
1 - switches
2 - keycaps

inventory_id, image_id, list_detail_id
1 - Alpacas

INSERT INTO "public"."categories" ("category_id", "name", "description") VALUES (1, 'Switches', 'Switches for your keyboard!');

INSERT INTO "public"."inventories" ("inventory_id", "quantity") VALUES (1, 100);

INSERT INTO "public"."images" ("image_id", "image_thumb") VALUES (1, 'https://i.imgur.com/wQGxSTI.jpg');

INSERT INTO "public"."list_details" ("list_detail_id", "spring", "stem","top", "bottom", "pin") VALUES (1, '62g Weight Gold Plated Spring', 'POM Stem', 'PC top', 'Nylon Bottom', '5 pin');

INSERT INTO "public"."products" ("name", "description", "sku", "category_id", "inventory_id", "price", "image", "list_detail_id") VALUES
('Alpacas Linear', 'In collaboration with Primekeyboard, we are happy to bring one of the best linear switches to you: Alpaca Linear Switch! 
', 'Swi/Lin/62/Nyl', 1, 1,  8.00, 1, 1);

INSERT INTO "public"."carts" ("customer_id", "total") VALUES (15, 56);

INSERT INTO "public"."cart_items" ("cart_id", "product_id", "quantity") VALUES (1, 7, 7);