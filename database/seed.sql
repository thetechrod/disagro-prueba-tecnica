SET NAMES utf8mb4;

USE disagro_event;

INSERT INTO events (
  name,
  event_date,
  is_active
)
VALUES (
  'Feria de Promociones - 2026',
  '2026-10-03',
  TRUE
);

INSERT INTO event_slots (
  event_id,
  start_time,
  is_active
)
VALUES
  (1, '08:00:00', TRUE),
  (1, '09:00:00', TRUE),
  (1, '10:00:00', TRUE),
  (1, '11:00:00', TRUE),
  (1, '12:00:00', TRUE),
  (1, '13:00:00', TRUE),
  (1, '14:00:00', TRUE),
  (1, '15:00:00', TRUE),
  (1, '16:00:00', TRUE),
  (1, '17:00:00', TRUE),
  (1, '18:00:00', TRUE),
  (1, '19:00:00', TRUE),
  (1, '20:00:00', TRUE);

INSERT INTO catalog_items (
  name,
  type,
  price,
  is_active
)
VALUES
  ('Fertilizante Premium', 'PRODUCT', 450.00, TRUE),
  ('Kit de Nutrición Vegetal', 'PRODUCT', 350.00, TRUE),
  ('Control de Plagas', 'PRODUCT', 275.00, TRUE),
  ('Semillas Mejoradas', 'PRODUCT', 525.00, TRUE),
  ('Bioestimulante Agrícola', 'PRODUCT', 225.00, TRUE),
  ('Análisis de Suelo', 'SERVICE', 900.00, TRUE),
  ('Asesoría Técnica', 'SERVICE', 750.00, TRUE),
  ('Plan de Nutrición de Cultivos', 'SERVICE', 850.00, TRUE),
  ('Diagnóstico Foliar', 'SERVICE', 500.00, TRUE);

  INSERT INTO users (
  name,
  email,
  password_hash,
  is_active
)
VALUES (
  'Usuario Demo',
  'demo@disagro.com',
  '80732166f17aac764d10de6769962404:3ffd65cdc6e806c7c9bb597236c376a2a71b988f63624970437a4730f0453c53afb728d7238d2cf33fc13f940a7947ecb61d8ccbf637afb54b152c6de423b447',
  TRUE
);