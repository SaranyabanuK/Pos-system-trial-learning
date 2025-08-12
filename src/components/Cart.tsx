import React from "react";
import { Card, CardContent, Typography, Button, IconButton, Box } from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import { CartItem } from "../types";

interface CartProps {
  cart: CartItem[];
  onIncrease: (productId: number) => void;
  onDecrease: (productId: number) => void;
  onRemove: (productId: number) => void;
  totalPrice: number;
}

export default function Cart({ cart, onIncrease, onDecrease, onRemove, totalPrice }: CartProps) {
  return (
    <Box>
      <Typography variant="h5" gutterBottom>
        Cart
      </Typography>
      {cart.length === 0 ? (
        <Typography>No items in cart</Typography>
      ) : (
        cart.map(({ product, quantity }) => (
          <Card key={product.id} sx={{ mb: 1 }}>
            <CardContent sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <Box sx={{ display: "flex", alignItems: "center" }}>
                <img
                  src={product.image}
                  alt={product.name}
                  style={{ width: 60, height: 60, objectFit: "cover", marginRight: 16 }}
                />
                <Box>
                  <Typography variant="subtitle1">{product.name}</Typography>
                  <Typography variant="body2">
                    Qty: 
                    <Button size="small" onClick={() => onDecrease(product.id)}>-</Button>
                    {quantity}
                    <Button size="small" onClick={() => onIncrease(product.id)}>+</Button>
                    | Rs. {product.price * quantity}
                  </Typography>
                </Box>
              </Box>
              <IconButton color="error" onClick={() => onRemove(product.id)}>
                <DeleteIcon />
              </IconButton>
            </CardContent>
          </Card>
        ))
      )}
      <Typography variant="h6" sx={{ mt: 2 }}>
        Total: Rs. {totalPrice}
      </Typography>
    </Box>
  );
}
