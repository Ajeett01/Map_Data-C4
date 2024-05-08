const express = require('express');
const { Pool } = require('pg');

const pool = new Pool({
  user: 'your_user',
  host: 'localhost',
  database: 'your_database',
  password: 'your_password',
  port: 5432,
});

const app = express();
app.use(express.json());

// Get all Mandis
app.get('/api/mandis', async (req, res) => {
  try {
    const { rows } = await pool.query('SELECT * FROM mandis');
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Get Mandi by ID
app.get('/api/mandis/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const { rows } = await pool.query('SELECT * FROM mandis WHERE id = $1', [id]);
    if (rows.length === 0) {
      return res.status(404).json({ error: 'Mandi not found' });
    }
    res.json(rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Add a new Mandi
app.post('/api/mandis', async (req, res) => {
  const { mandi_name, state, address, contact_email, contact_phone, commodities_traded, latitude, longitude } = req.body;
  const location = `POINT(${longitude} ${latitude})`;
  const query = 'INSERT INTO mandis (mandi_name, state, address, contact_email, contact_phone, commodities_traded, location) VALUES ($1, $2, $3, $4, $5, $6, ST_SetSRID(ST_MakePoint($7, $8), 4326)) RETURNING *';
  const values = [mandi_name, state, address, contact_email, contact_phone, commodities_traded, longitude, latitude];
  try {
    const { rows } = await pool.query(query, values);
    res.status(201).json(rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Update Mandi details
app.put('/api/mandis/:id', async (req, res) => {
  const { id } = req.params;
  const { mandi_name, state, address, contact_email, contact_phone, commodities_traded, latitude, longitude } = req.body;
  const location = `POINT(${longitude} ${latitude})`;
  const query = 'UPDATE mandis SET mandi_name = $1, state = $2, address = $3, contact_email = $4, contact_phone = $5, commodities_traded = $6, location = ST_SetSRID(ST_MakePoint($7, $8), 4326) WHERE id = $9 RETURNING *';
  const values = [mandi_name, state, address, contact_email];
});
