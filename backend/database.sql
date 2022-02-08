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
2 - Tangerines

INSERT INTO "public"."categories" ("category_id", "category_name", "category_description") VALUES (2, 'Switches', 'Switches for your keyboard!');

INSERT INTO "public"."inventories" ("inventory_id", ) VALUES (2, 0, );

INSERT INTO "public"."images" ("image_id", "image_thumb") VALUES (2, 'https://i.imgur.com/UI5M7hJ.png');

INSERT INTO "public"."list_details" ("list_detail_id", "spring", "stem","top", "bottom", "pin") VALUES (2, '62g gold spring.', 'Housing is UHMWPE.', 'Pre-lubed ', 'Designed by C3.', 'Linear MX Switch.');

INSERT INTO "public"."products" ("name", "description", "sku", "category_id", "inventory_id", "price", "image_id", "list_detail_id") VALUES
('Tangerine Switch', 'Please note that this product is in stock.
（This is the latest batch from JWK/Equalz June 2021） 
', 'Swi/Lin/62/UHW', 1, 2,  9.00, 2, 2);

INSERT INTO "public"."carts" ("customer_id", "total") VALUES (15, 9);

INSERT INTO "public"."cart_items" ("cart_id", "product_id", "quantity") VALUES (1, 8 , 1);

UPDATE "public"."carts" SET total = 18 WHERE cart_id = 1 WHERE customer_id = 15
UPDATE "public"."cart_items" SET quantity = 2 WHERE cart_id = 1 AND product_id = 8;