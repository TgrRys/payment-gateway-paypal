const express = require('express');
const mysql = require('mysql');
const cors = require('cors');
const bodyParser = require('body-parser');
const axios = require('axios');
// const CryptoJS = require('crypto-js');
// const path = require('path');

const app = express();
app.use(function (req, res, next) {
    res.header('Access-Control-Allow-Origin', '*'); // Menambahkan header CORS
    res.header(
      'Access-Control-Allow-Headers',
      'Origin, X-Requested-With, Content-Type, Accept'
    );
    next();
  });
app.use(cors());

const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'transaksimetafora',
});

db.connect((err) => {
    if (err) {
        console.error('Koneksi database gagal: ' + err.stack);
        return;
    }
    console.log('Terhubung ke database');
});

app.use(bodyParser.json());

// Endpoint untuk mendapatkan data dari tabel 'barang'
app.get('/barang', (req, res) => {
    const sql = 'SELECT * FROM barang';

    db.query(sql, (err, results) => {
        if (err) {
            console.error('Error saat mengambil data barang: ' + err.stack);
            res.status(500).json({ error: 'Error saat mengambil data barang' });
            return;
        }

        res.json(results);
    });
});

// Endpoint untuk mendapatkan data dari tabel 'transaksi'
app.get('/transaksi', (req, res) => {
    const sql = 'SELECT * FROM transaksi';

    db.query(sql, (err, results) => {
        if (err) {
            console.error('Error saat mengambil data transaksi: ' + err.stack);
            res.status(500).json({ error: 'Error saat mengambil data transaksi' });
            return;
        }

        res.json(results);
    });
});

// Endpoint untuk mendapatkan data users
app.get('/users', (req, res) => {
    const sql = 'SELECT * FROM users';

    db.query(sql, (err, results) => {
        if (err) {
            console.error('Error saat mengambil data users: ' + err.stack);
            res.status(500).json({ error: 'Error saat mengambil data users' });
            return;
        }

        res.json(results);
    });
});

// Endpoint untuk menambahkan data transaksi
app.post('/transaksi', (req, res) => {
    const { id_barang, id_user, jumlah } = req.body;

    const createdAt = new Date(); // Mendapatkan tanggal dan waktu saat ini
    const sql = 'INSERT INTO transaksi (id_barang, id_user, jumlah, created_at) VALUES (?, ?, ?, ?)';
    db.query(sql, [id_barang, id_user, jumlah, createdAt], (err, result) => {
        if (err) {
            console.error('Error creating transaksi: ' + err.stack);
            res.status(500).json({ error: 'Error creating transaksi' });
            return;
        }
        res.status(201).json({ message: 'Transaksi created successfully', id: result.insertId });
    });
});

// Endpoint untuk mendapatkan data transaksi dengan detail barang
app.get('/transaksi-details', (req, res) => {
    const sql = `
      SELECT
        transaksi.id_transaksi,
        barang.nama_barang,
        transaksi.jumlah AS jumlah,
        barang.harga AS harga
      FROM transaksi
      JOIN barang ON transaksi.id_barang = barang.id_barang
    `;

    db.query(sql, (err, results) => {
        if (err) {
            console.error('Error saat mengambil data transaksi dengan detail barang: ' + err.stack);
            res.status(500).json({ error: 'Error saat mengambil data transaksi dengan detail barang' });
            return;
        }

        res.json(results);
    });
});

// Endpoint for getting transaction details by ID
app.get('/transaksi/:id', (req, res) => {
    const { id } = req.params;
    const sql = 'SELECT transaksi.*, barang.nama_barang, barang.harga FROM transaksi JOIN barang ON transaksi.id_barang = barang.id_barang WHERE transaksi.id_transaksi = ?';

    db.query(sql, [id], (err, results) => {
        if (err) {
            console.error('Error saat mengambil data transaksi: ' + err.stack);
            res.status(500).json({ error: 'Error saat mengambil data transaksi' });
            return;
        }

        res.json(results);
    });
});

app.post('/paymentproxy', async (req, res) => {
    const { merchantcode, amount, datetime } = req.body;
    const apiKey = "6c90cc84ec280d7a0c59e5da846ada94"; // Gantilah dengan API key Anda
  
    // Hitung tanda tangan
    // const signature = shaSignature(merchantcode, amount, datetime, apiKey);
  
    try {
      const response = await axios.post("https://sandbox.duitku.com/webapi/api/merchant/paymentmethod/getpaymentmethod", {
        merchantcode: merchantcode,
        amount: amount,
        datetime: datetime,
        signature: signature,
      });
  
      // Handle response di sini, misalnya tampilkan pesan sukses
      console.log("Response:", response.data);
  
      res.json(response.data);
    } catch (error) {
      // Handle error di sini, misalnya tampilkan pesan error
      console.error("Error:", error);
      res.status(500).json({ error: "Error saat mengirim permintaan pembayaran" });
    }
  });
  
  // Fungsi untuk menghitung signature
//   const shaSignature = (merchantcode, paymentAmount, datetime, apiKey) => {
//     const dataToHash = merchantcode + paymentAmount + datetime + apiKey;
//     return CryptoJS.SHA256(dataToHash).toString(CryptoJS.enc.Hex);
//   };

  app.post('/inquiry', async (req, res) => {
    try {
      const {
        paymentMethod,
        paymentAmount,
        signature,
      } = req.body;
  
      // Buat permintaan POST ke endpoint Duitku
      const response = await axios.post(
        'https://sandbox.duitku.com/webapi/api/merchant/v2/inquiry',
        {
          merchantCode: 'DS16784',
          paymentAmount,
          paymentMethod,
          merchantOrderId: '1',
          productDetails: 'Pembayaran untuk Toko Contoh',
          customerVaName: 'Tegar',
          email: 'tegarrizky237@gmail.com',
          phoneNumber: '0895322728059',
          callbackUrl: 'https://github.com/TgrRys',
          returnUrl: 'https://github.com/TgrRys',
          signature,
        }
      );
  
      // Kirim respons dari Duitku ke klien Anda
      res.json(response.data);
    } catch (error) {
      console.error('Error during inquiry:', error);
      res.status(500).json({ error: 'Error during inquiry' });
    }
  });

const port = 8081;

app.listen(port, () => {
    console.log(`Server berjalan di http://localhost:${port}`);
});
