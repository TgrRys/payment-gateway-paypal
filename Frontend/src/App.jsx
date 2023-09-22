import "./App.css";
import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Table from "./components/Table";
import AddTransaksi from "./components/AddTransaksi";
import PaymentPage from "./pages/PaymentPage";
// import ReactDOM from "react-dom";

// const PayPalButton = window.paypal.Buttons.driver("react", { React, ReactDOM });
function App() {
  // const createOrder = (data, actions) => {
  //   return actions.order.create({
  //     purchase_units: [
  //       {
  //         amount: {
  //           value: "10000",
  //         },
  //       },
  //     ],
  //   });
  // };

  // const onApprove = (data, actions) => {
  //   return actions.order.capture();
  // };

  return (
    <Router>
      <Routes>
        <Route path="/" element={<Table />} />
        <Route path="/transaksi" element={<AddTransaksi />} />
        <Route path="transaksi/:id/payment" element={<PaymentPage />} />
        {/* <Route path="/v2/inquiry-response" component={InquiryResponsePage} /> Tambahkan rute baru */}
        {/* <Route path="/addtransaksi" element={<AddTask />} /> */}
      </Routes>
    </Router>
    // <div className="app">
    // <div className="wrapper">
      // <PayPalButton
      //   createOrder={(data, actions) => createOrder(data, actions)}
      //   onApprove={(data, actions) => onApprove(data, actions)}
      // />
    //   </div>
    // </div>
  );
}

export default App;
