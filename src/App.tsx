import React, { useState } from "react";
import { Container, Typography, Grid, Box, Button } from "@mui/material";

import ProductList from "./components/ProductList";
import Cart from "./components/Cart";
import Checkout from "./components/Checkout";
import Receipt from "./components/Receipt";
import "./App.css"

import { Product, CartItem } from "./types";

const productsData: Product[] = [
  { id: 1, name: "Coca Cola", price: 150, image: "images/Coca Cola.jpg" },
  { id: 2, name: "Pepsi", price: 140, image: "images/Pepsi.jpg" },
  { id: 3, name: "Water Bottle", price: 100, image: "images/Water.jpg" },
];

export default function App() {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [orderSummary, setOrderSummary] = useState<any | null>(null); // store receipt details

  const addToCart = (product: Product) => {
    setCart((prev) => {
      const existing = prev.find((item) => item.product.id === product.id);
      if (existing) {
        return prev.map((item) =>
          item.product.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }
      return [...prev, { product, quantity: 1 }];
    });
  };

  const increaseQuantity = (productId: number) => {
    setCart((prev) =>
      prev.map((item) =>
        item.product.id === productId
          ? { ...item, quantity: item.quantity + 1 }
          : item
      )
    );
  };

  const decreaseQuantity = (productId: number) => {
    setCart((prev) =>
      prev
        .map((item) =>
          item.product.id === productId
            ? { ...item, quantity: item.quantity - 1 }
            : item
        )
        .filter((item) => item.quantity > 0)
    );
  };

  const removeFromCart = (productId: number) => {
    setCart((prev) => prev.filter((item) => item.product.id !== productId));
  };

  const totalPrice = cart.reduce(
    (sum, item) => sum + item.product.price * item.quantity,
    0
  );

  const handleCheckout = (
    customerName: string,
    contact: string,
    paymentMethod: string,
    cardNumber?: string,
    expiry?: string,
    cvv?: string
  ) => {
    const orderNumber = `ORD-${Math.floor(100000 + Math.random() * 900000)}`;

    const orderDetails = {
      orderNumber,
      customerName,
      contact,
      paymentMethod,
      cardNumber,
      expiry,
      cvv,
      items: cart,
      total: totalPrice,
    };

    alert(
      `Thank you ${customerName}! Your payment of Rs. ${totalPrice} via ${paymentMethod} has been received.`
    );

    setOrderSummary(orderDetails);
    setCart([]);
  };

  return (
    <Container sx={{ mt: 4 }}>
      <Typography variant="h4" gutterBottom>
        POS System Trial
      </Typography>

      <Grid container spacing={3}>
        <Box
          sx={{
            display: "flex",
            flexDirection: { xs: "column", md: "row" },
            gap: 3,
          }}
        >
          <Box sx={{ flex: 2 }}>
            <ProductList products={productsData} onAddToCart={addToCart} />
          </Box>

          <Box sx={{ flex: 1 }}>
            <Cart
              cart={cart}
              onIncrease={increaseQuantity}
              onDecrease={decreaseQuantity}
              onRemove={removeFromCart}
              totalPrice={totalPrice}
            />
            <Checkout
              totalPrice={totalPrice}
              cartLength={cart.length}
              onCheckout={handleCheckout}
            />

            {orderSummary && (
  <>
    <div id="printable-receipt">
      <Receipt order={{ ...orderSummary, date: new Date() }} />
    </div>
    <Button onClick={() => window.print()} variant="contained" sx={{ mt: 2 }}>
      Print Receipt
    </Button>
    <Button variant="outlined" sx={{ mt: 2, ml: 2 }} onClick={() => setOrderSummary(null)}>
      New Order
    </Button>
  </>
)}
          </Box>
        </Box>
      </Grid>
    </Container>
  );
}
