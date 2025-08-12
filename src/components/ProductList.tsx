import React from "react";
import { Grid, Card, CardMedia, CardContent, Typography, Button, Box } from "@mui/material";
import { Product } from "../types";

interface ProductListProps {
  products: Product[];
  onAddToCart: (product: Product) => void;
}

export default function ProductList({ products, onAddToCart }: ProductListProps) {
  return (
    <Grid container spacing={2}>
      {products.map((product) => (
    <Box
  key={product.id}
  sx={{
    width: {
      xs: "100%",   // full width on extra small screens
      sm: "50%",    // half width on small screens
      md: "33.33%"  // one-third width on medium and up
    },
    p: 1,          // padding for spacing
    boxSizing: "border-box" // to include padding in width
  }}
>
  <Card>
    <CardMedia
      component="img"
      height="140"
      image={product.image}
      alt={product.name}
    />
    <CardContent>
      <Typography variant="h6">{product.name}</Typography>
      <Typography>Rs. {product.price}</Typography>
      <Button
        variant="contained"
        onClick={() => onAddToCart(product)}
        sx={{ mt: 1 }}
      >
        Add to Cart
      </Button>
    </CardContent>
  </Card>
</Box>
      ))}
    </Grid>
  );
}
