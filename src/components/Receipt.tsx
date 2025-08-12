import React from "react";
import { Box, Typography, Table, TableBody, TableCell, TableHead, TableRow, Divider } from "@mui/material";

interface ReceiptProps {
  order: {
    orderNumber: string;
    customerName: string;
    contact: string;
    paymentMethod: string;
    items: { product: { id: number; name: string; price: number }; quantity: number }[];
    total: number;
    date: Date;
  };
}

export default function Receipt({ order }: ReceiptProps) {
  const formatDate = (date: Date) => {
    return date.toLocaleString(undefined, {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    });
  };

  return (
    <Box
      sx={{
        maxWidth: 480,
        margin: "auto",
        padding: 3,
        border: "1px solid #000",
        bgcolor: "#fff",
        color: "#000",
        fontFamily: "'Courier New', Courier, monospace",
        fontSize: 14,
      }}
    >
      {/* Heading */}
      <Typography variant="h5" align="center" gutterBottom sx={{ fontWeight: "bold" }}>
        POS System Trial
      </Typography>

      {/* Date & Time */}
      <Typography align="center" gutterBottom>
        {formatDate(order.date)}
      </Typography>

      {/* Order Number */}
      <Typography align="center" gutterBottom sx={{ fontWeight: "bold" }}>
        Order No: {order.orderNumber}
      </Typography>

      <Divider sx={{ my: 1 }} />

      {/* Items Table */}
      <Table size="small" aria-label="receipt table">
        <TableHead>
          <TableRow>
            <TableCell>Item</TableCell>
            <TableCell align="right">Qty</TableCell>
            <TableCell align="right">Price</TableCell>
            <TableCell align="right">Total</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {order.items.map(({ product, quantity }) => (
            <TableRow key={product.id}>
              <TableCell>{product.name}</TableCell>
              <TableCell align="right">{quantity}</TableCell>
              <TableCell align="right">Rs. {product.price}</TableCell>
              <TableCell align="right">Rs. {product.price * quantity}</TableCell>
            </TableRow>
          ))}

          {/* Total Row */}
          <TableRow>
            <TableCell colSpan={3} align="right" sx={{ fontWeight: "bold" }}>
              TOTAL
            </TableCell>
            <TableCell align="right" sx={{ fontWeight: "bold" }}>
              Rs. {order.total}
            </TableCell>
          </TableRow>
        </TableBody>
      </Table>

      <Divider sx={{ my: 1 }} />

      {/* Customer Info */}
      <Typography>
        <strong>Customer:</strong> {order.customerName}
      </Typography>
      <Typography>
        <strong>Contact:</strong> {order.contact}
      </Typography>
      <Typography>
        <strong>Payment Method:</strong> {order.paymentMethod}
      </Typography>

      <Divider sx={{ my: 2 }} />

      {/* Footer */}
      <Typography align="center" sx={{ fontStyle: "italic", fontSize: 12 }}>
        This system was developed by Saranya! <br />
        Contact: +94 77 123 4567
      </Typography>
    </Box>
  );
}
