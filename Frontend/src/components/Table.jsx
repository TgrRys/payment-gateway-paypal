import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

function Table() {
  const [data, setData] = useState([]);
  const [total, setTotal] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    fetch("http://localhost:8081/transaksi-details")
      .then((res) => res.json())
      .then((data) => {
        setData(data);
        let sum = 0;
        data.forEach((item) => {
          const subtotal = item.jumlah * parseFloat(item.harga);
          sum += subtotal;
        });
        setTotal(sum);
      })
      .catch((err) => console.log(err));
  }, []);

  const handleBayarClick = (id_transaksi) => {
    // Directly navigate to the payment page with the transaction ID as a URL parameter
    navigate(`/transaksi/${id_transaksi}/payment`);
  };

  return (
    <div>
      <table className="table table-bordered table-striped">
        <thead className="table-dark">
          <tr>
            <th scope="col">ID Transaksi</th>
            <th scope="col">Nama Barang</th>
            <th scope="col">Jumlah</th>
            <th scope="col">Harga</th>
            <th scope="col">Subtotal</th>
            <th scope="col">Aksi</th>
          </tr>
        </thead>
        <tbody>
          {data.map((item) => (
            <tr key={item.id_transaksi}>
              <td>{item.id_transaksi}</td>
              <td>{item.nama_barang}</td>
              <td>{item.jumlah}</td>
              <td>Rp {item.harga}</td>
              <td>Rp {item.jumlah * parseFloat(item.harga)}</td>
              <td>
                <button
                  className="btn btn-success"
                  onClick={() => handleBayarClick(item.id_transaksi)}
                >
                  Bayar
                </button>
              </td>
            </tr>
          ))}
        </tbody>
        <tfoot>
          <tr>
            <th colSpan="4">Total</th>
            <th>Rp {total}</th>
          </tr>
        </tfoot>
      </table>
    </div>
  );
}

export default Table;
