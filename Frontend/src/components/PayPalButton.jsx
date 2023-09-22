import React from "react";
import ReactDOM from "react-dom";

const PayPalButton = ({ orderValue, style }) => {
  const PayPalButton = window.paypal.Buttons.driver("react", { React, ReactDOM });

  const createOrder = (data, actions) => {
    if (orderValue === null || orderValue <= 0) {
      // Prevent creating an order with a value of 0 or less
      return null;
    }

    return actions.order.create({
      purchase_units: [
        {
          amount: {
            currency_code: "USD",
            value: orderValue.toString(), // Set the order value dynamically
          },
        },
      ],
    });
  };

  const onApprove = (data, actions) => {
    return actions.order.capture();
  };

  return (
    <PayPalButton
      createOrder={(data, actions) => createOrder(data, actions)}
      onApprove={(data, actions) => onApprove(data, actions)}
      style={style} // Apply the style prop
    />
  );
};

export default PayPalButton;
