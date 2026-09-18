SET NAMES utf8mb4;

CREATE DATABASE IF NOT EXISTS disagro_event
  CHARACTER SET utf8mb4
  COLLATE utf8mb4_0900_ai_ci;

USE disagro_event;

CREATE TABLE events (
  id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(150) NOT NULL,
  event_date DATE NOT NULL,
  is_active BOOLEAN NOT NULL DEFAULT TRUE,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE event_slots (
  id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  event_id INT UNSIGNED NOT NULL,
  start_time TIME NOT NULL,
  is_active BOOLEAN NOT NULL DEFAULT TRUE,

  CONSTRAINT fk_event_slots_event
    FOREIGN KEY (event_id)
    REFERENCES events(id),

  CONSTRAINT uq_event_slot
    UNIQUE (event_id, start_time)
);

CREATE TABLE catalog_items (
  id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(150) NOT NULL,
  type ENUM('PRODUCT', 'SERVICE') NOT NULL,
  price DECIMAL(10, 2) NOT NULL,
  is_active BOOLEAN NOT NULL DEFAULT TRUE,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,

  CONSTRAINT chk_catalog_price
    CHECK (price >= 0)
);

-- Auth
CREATE TABLE users (
  id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  email VARCHAR(255) NOT NULL UNIQUE,
  password_hash VARCHAR(255) NOT NULL,
  is_active BOOLEAN NOT NULL DEFAULT TRUE,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);
-- Fin Auth

CREATE TABLE confirmations (
  id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  event_id INT UNSIGNED NOT NULL,
  event_slot_id INT UNSIGNED NOT NULL,

  first_name VARCHAR(100) NOT NULL,
  last_name VARCHAR(100) NOT NULL,
  email VARCHAR(255) NOT NULL,

  product_discount_percent DECIMAL(5, 2) NOT NULL DEFAULT 0,
  service_discount_percent DECIMAL(5, 2) NOT NULL DEFAULT 0,

  total_before_discount DECIMAL(10, 2) NOT NULL,
  total_discount DECIMAL(10, 2) NOT NULL,
  total_after_discount DECIMAL(10, 2) NOT NULL,

  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,

  CONSTRAINT fk_confirmations_event
    FOREIGN KEY (event_id)
    REFERENCES events(id),

  CONSTRAINT fk_confirmations_slot
    FOREIGN KEY (event_slot_id)
    REFERENCES event_slots(id),

  CONSTRAINT uq_confirmation_event_email
    UNIQUE (event_id, email)
);

CREATE TABLE confirmation_items (
  id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  confirmation_id INT UNSIGNED NOT NULL,
  catalog_item_id INT UNSIGNED NOT NULL,

  item_name VARCHAR(150) NOT NULL,
  item_type ENUM('PRODUCT', 'SERVICE') NOT NULL,
  price_at_confirmation DECIMAL(10, 2) NOT NULL,

  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,

  CONSTRAINT fk_confirmation_items_confirmation
    FOREIGN KEY (confirmation_id)
    REFERENCES confirmations(id)
    ON DELETE CASCADE,

  CONSTRAINT fk_confirmation_items_catalog_item
    FOREIGN KEY (catalog_item_id)
    REFERENCES catalog_items(id),

  CONSTRAINT uq_confirmation_catalog_item
    UNIQUE (confirmation_id, catalog_item_id),

  CONSTRAINT chk_confirmation_item_price
    CHECK (price_at_confirmation >= 0)
);