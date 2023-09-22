import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import PayPalButton from "../components/PayPalButton";

function PaymentPage() {
  const { id } = useParams();
  const [transaction, setTransaction] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchTransaction = async () => {
      try {
        const response = await axios.get(`http://localhost:8081/transaksi/${id}`);
        if (response.status === 200) {
          setTransaction(response.data[0]);
        } else {
          console.error("Error fetching transaction details");
        }
      } catch (error) {
        console.error(error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchTransaction();
  }, [id]);

  // Calculate the order value based on the transaction's jumlah and harga
  const orderValue = transaction ? parseFloat(transaction.jumlah) * parseFloat(transaction.harga)/15000 : null;
  // Function to create the PayPal button with styles
  const renderPayPalButton = () => {
    if (orderValue !== null && orderValue > 0) {
      const paypalStyle = {
        layout: 'horizontal',
        color: 'gold',
        shape: 'rect',
        label: 'paypal',
        tagline: false,
      };

      return <PayPalButton orderValue={orderValue} style={paypalStyle} />;
    }
    return null;
  };

  return (
    <div className="container mt-4">
      <h2 className="text-center mb-4">Payment Details</h2>
      {transaction ? (
        <div className="card text-center">
          <div className="card-header">Transaction Details</div>
          <div className="card-body">
            <h5 className="card-title">
              ID Transaksi: {transaction.id_transaksi}
            </h5>
            <p className="card-text">
              Nama Barang: {transaction.nama_barang}
              <br />
              Jumlah: {transaction.jumlah}
              <br />
              Harga: Rp {transaction.harga}
              <br />
              Subtotal: Rp {parseFloat(transaction.jumlah) * parseFloat(transaction.harga)}
            </p>
          </div>
          <div className="card-footer text-center">
            {/* Center-align the PayPalButton */}
            <div className="d-flex justify-content-center">
              {renderPayPalButton()}
            </div>
          </div>
        </div>
      ) : isLoading ? (
        <p className="text-center">Loading...</p>
      ) : (
        <p className="text-center">Error fetching transaction details.</p>
      )}
    </div>
  );
}

export default PaymentPage;
