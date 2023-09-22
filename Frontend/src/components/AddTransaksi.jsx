import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom"; // Menggunakan useNavigate
import "bootstrap/dist/css/bootstrap.min.css"; // Pastikan Bootstrap CSS tersedia dalam proyek Anda

function AddTransaksi() {
  const navigate = useNavigate(); // Menggunakan useNavigate
  const [barang, setBarang] = useState([]);
  const [users, setUsers] = useState([]);
  const [selectedBarang, setSelectedBarang] = useState("");
  const [selectedUser, setSelectedUser] = useState("");
  const [jumlah, setJumlah] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    // Mengambil daftar barang dari server
    fetch("http://localhost:8081/barang")
      .then((res) => res.json())
      .then((data) => setBarang(data))
      .catch((err) => console.log(err));

    // Mengambil daftar users dari server
    fetch("http://localhost:8081/users")
      .then((res) => res.json())
      .then((data) => setUsers(data))
      .catch((err) => console.log(err));
  }, []);

  const handleSubmit = () => {
    setIsLoading(true);

    if (!selectedBarang || !selectedUser || !jumlah) {
      console.error("Please fill in all fields.");
      setIsLoading(false);
      return;
    }

    // Mengirim data transaksi ke server
    fetch("http://localhost:8081/transaksi", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        id_barang: selectedBarang,
        id_user: selectedUser,
        jumlah: jumlah,
      }),
    })
      .then((res) => {
        if (!res.ok) {
          throw new Error("Network response was not ok");
        }
        return res.json();
      })
      .then((data) => {
        if (data && data.message === "Transaksi created successfully") {
          // Redirect ke halaman utama setelah berhasil menambahkan transaksi
          console.log("Transaksi berhasil ditambahkan.");
          navigate("/"); // Menggunakan useNavigate
        } else {
          console.error("Error creating transaksi:", data);
        }
      })
      .catch((err) => {
        console.error(err);
        // Handle the error here, you can display an error message to the user
      })
      .finally(() => setIsLoading(false));
  };

  return (
    <div className="container">
      <h2 className="my-4">Tambah Transaksi</h2>
      <div className="mb-3">
        <label htmlFor="barang" className="form-label">
          Barang:
        </label>
        <select
          id="barang"
          className="form-select"
          value={selectedBarang}
          onChange={(e) => setSelectedBarang(e.target.value)}
        >
          <option value="">Pilih Barang</option>
          {barang.map((item) => (
            <option key={item.id_barang} value={item.id_barang}>
              {item.nama_barang}
            </option>
          ))}
        </select>
      </div>
      <div className="mb-3">
        <label htmlFor="user" className="form-label">
          Pembeli:
        </label>
        <select
          id="user"
          className="form-select"
          value={selectedUser}
          onChange={(e) => setSelectedUser(e.target.value)}
        >
          <option value="">Pilih Pembeli</option>
          {users.map((user) => (
            <option key={user.id_user} value={user.id_user}>
              {user.nama_user}
            </option>
          ))}
        </select>
      </div>
      <div className="mb-3">
        <label htmlFor="jumlah" className="form-label">
          Jumlah:
        </label>
        <input
          type="number"
          id="jumlah"
          className="form-control"
          value={jumlah}
          onChange={(e) => setJumlah(e.target.value)}
        />
      </div>
      <button
        type="button"
        className="btn btn-primary"
        onClick={handleSubmit}
        disabled={isLoading}
      >
        {isLoading ? "Menambahkan Transaksi..." : "Simpan Transaksi"}
      </button>
    </div>
  );
}

export default AddTransaksi;
