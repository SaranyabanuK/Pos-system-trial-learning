import React, { useState } from "react";
import { Box, Typography, TextField, Button } from "@mui/material";

interface CheckoutProps {
  totalPrice: number;
  cartLength: number;
  onCheckout: (
    customerName: string,
    contact: string,
    paymentMethod: string,
    cardNumber?: string,
    expiry?: string,
    cvv?: string
  ) => void;
}

export default function Checkout({ totalPrice, cartLength, onCheckout }: CheckoutProps) {
  const [customerName, setCustomerName] = useState("");
  const [contact, setContact] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("Cash");
  const [cardNumber, setCardNumber] = useState("");
  const [expiry, setExpiry] = useState("");
  const [cvv, setCvv] = useState("");

  // Validate expiry date MM/YY format
  const validateExpiry = (value: string) => {
    const [monthStr, yearStr] = value.split("/");
    if (!monthStr || !yearStr) return false;
    const month = parseInt(monthStr, 10);
    const year = parseInt(yearStr, 10);
    if (isNaN(month) || isNaN(year)) return false;
    if (month < 1 || month > 12) return false;
    if (year < 0 || year > 99) return false;
    return true;
  };

  // Format expiry input and update state
  const handleExpiryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let val = e.target.value.replace(/\D/g, ""); // digits only
    if (val.length > 2) {
      val = val.slice(0, 2) + "/" + val.slice(2, 4);
    }
    setExpiry(val);
  };

  const handleCheckoutClick = () => {
    if (paymentMethod === "Card") {
      if (
        cardNumber.length !== 16 ||
        !validateExpiry(expiry) ||
        cvv.length !== 3
      ) {
        alert("Please enter valid card details");
        return;
      }
    }
    onCheckout(customerName, contact, paymentMethod, cardNumber, expiry, cvv);
  };

  return (
    <Box sx={{ mt: 4 }}>
      <Typography variant="h5" gutterBottom>
        Checkout
      </Typography>

      <TextField
        label="Customer Name"
        value={customerName}
        onChange={(e) => setCustomerName(e.target.value)}
        fullWidth
        sx={{ mb: 2 }}
      />

      <TextField
        label="Contact Number"
        value={contact}
        onChange={(e) => setContact(e.target.value)}
        fullWidth
        sx={{ mb: 2 }}
      />

      <TextField
        label="Payment Method"
        select
        SelectProps={{ native: true }}
        value={paymentMethod}
        onChange={(e) => setPaymentMethod(e.target.value)}
        fullWidth
        sx={{ mb: 2 }}
      >
        <option value="Cash">Cash</option>
        <option value="Card">Card</option>
        <option value="Mobile Payment">Mobile Payment</option>
      </TextField>

      {paymentMethod === "Card" && (
        <>
          <TextField
            label="Card Number"
            fullWidth
            sx={{ mb: 2 }}
            inputProps={{ maxLength: 16 }}
            value={cardNumber}
            onChange={(e) => setCardNumber(e.target.value.replace(/\D/g, ""))}
          />

          <TextField
            label="Expiry Date (MM/YY)"
            fullWidth
            sx={{ mb: 2 }}
            inputProps={{ maxLength: 5 }}
            value={expiry}
            onChange={handleExpiryChange}
          />

          <TextField
            label="CVV"
            type="password"
            fullWidth
            sx={{ mb: 2 }}
            inputProps={{ maxLength: 3 }}
            value={cvv}
            onChange={(e) => setCvv(e.target.value.replace(/\D/g, ""))}
          />
        </>
      )}

      <Typography variant="h6" sx={{ mb: 2 }}>
        Total: Rs. {totalPrice}
      </Typography>

      <Box sx={{ display: "flex", justifyContent: "flex-end", mt: 2 }}>
        <Button
          variant="contained"
          color="success"
          disabled={cartLength === 0 || !customerName || !contact}
          onClick={handleCheckoutClick}
        >
          Checkout
        </Button>
      </Box>
    </Box>
  );
}
