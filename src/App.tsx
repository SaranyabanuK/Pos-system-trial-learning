import React, { useState, useEffect, useRef } from "react"; 
import {
  Container,
  Typography,
  Grid,
  Button,
  Card,
  CardContent,
  CardMedia,
  TextField,
  IconButton,
  Stack,
  Paper
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import { Box } from "@mui/system";
import './App.css'

interface Product {
  id: number;
  name: string;
  price: number;
  image: string;
}

interface CartItem {
  product: Product;
  quantity: number;
}



const productsData: Product[] = [
  { id: 1, name: "Coca Cola", price: 150, image: "images/Coca Cola.jpg"},
  { id: 2, name: "Pepsi", price: 140, image: "images/Pepsi.jpg" },
  { id: 3, name: "Water Bottle", price: 100, image: "images/Water.jpg" },
];

export default function App() {
  // Initialize cart from localStorage if available
  const [cart, setCart] = useState<CartItem[]>(() => {
    const savedCart = localStorage.getItem("cart");
    return savedCart ? JSON.parse(savedCart) : [];
    
  });

  const [search, setSearch] = useState("");
  const [customerName, setCustomerName] = useState("");
  const [contact, setContact] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("Cash");
  const [checkoutMessage, setCheckoutMessage] = useState("");
  const [expiry, setExpiry] = useState("");
  const receiptRef = useRef<HTMLDivElement>(null);
  const [orderSummary, setOrderSummary] = useState<{
  orderNumber: string;
  customerName: string;
  contact: string;
  paymentMethod: string;
  items: CartItem[];
  total: number;
} | null>(null);

const printReceipt = () => {
  if (receiptRef.current) {
    const printContents = receiptRef.current.innerHTML;
    const originalContents = document.body.innerHTML;
    document.body.innerHTML = printContents;
    window.print();
    document.body.innerHTML = originalContents;
    window.location.reload(); // reload to restore event listeners
  }
};


  const validateExpiry = (value: string) => {
  const [monthStr, yearStr] = value.split("/");
  const month = parseInt(monthStr, 10);
  const year = parseInt(yearStr, 10);
  if (isNaN(month) || isNaN(year)) return false;
  if (month < 1 || month > 12) return false;
  if (year > 25 ) return false;
  return true;
};
    const handleExpiryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
  let val = e.target.value.replace(/\D/g, ""); // remove non-digits
  if (val.length > 2) {
    val = val.slice(0, 2) + "/" + val.slice(2, 4);
  }
  setExpiry(val);
};

  // Save cart to localStorage on any cart change
  useEffect(() => {
    localStorage.setItem("cart", JSON.stringify(cart));
  }, [cart]);

  const addToCart = (product: Product) => {
    setCart((prevCart) => {
      const existing = prevCart.find((item) => item.product.id === product.id);
      if (existing) {
        return prevCart.map((item) =>
          item.product.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      } else {
        return [...prevCart, { product, quantity: 1 }];
      }
    });
  };

  const increaseQuantity = (productId: number) => {
    setCart((prevCart) =>
      prevCart.map((item) =>
        item.product.id === productId
          ? { ...item, quantity: item.quantity + 1 }
          : item
      )
    );
  };

  const decreaseQuantity = (productId: number) => {
    setCart((prevCart) =>
      prevCart
        .map((item) =>
          item.product.id === productId
            ? { ...item, quantity: item.quantity - 1 }
            : item
        )
        .filter((item) => item.quantity > 0) // Remove if quantity 0
    );
  };

  const removeFromCart = (productId: number) => {
    setCart((prevCart) => prevCart.filter((item) => item.product.id !== productId));
  };

  const totalPrice = cart.reduce(
    (total, item) => total + item.product.price * item.quantity,
    0
  );

  const filteredProducts = productsData.filter((p) =>
    p.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <Container sx={{ mt: 4 }}>
      <Typography variant="h4" gutterBottom>
        POS System Trial
      </Typography>

      {/* Search Bar */}
      <TextField
        label="Search Products"
        variant="outlined"
        fullWidth
        sx={{ mb: 3 }}
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />

      <Grid container spacing={3}>
        {/* Products List */}
        <Stack spacing={2} sx={{ flex: 1 }}>
          <Grid container spacing={3}>
            {filteredProducts.map((product) => (
              <Box 
                  key={product.id}
                  sx={{
                  width: { xs: '100%', sm: '50%', md: '33.33%' },
                  p: 1
                       }}>
                <Card>
                  <CardMedia
                    component="img"
                    height="140"
                    image={product.image}
                    alt={product.name}
                  />
                  <CardContent>
                    <Typography variant="h6">{product.name}</Typography>
                    <Typography variant="body2">Rs. {product.price}</Typography>
                    <Button
                      variant="contained"
                      color="primary"
                      sx={{ mt: 1 }}
                      onClick={() => addToCart(product)}
                    >
                      Add to Cart
                    </Button>
                  </CardContent>
                </Card>
              </Box>
            ))}
          </Grid>
        </Stack>
        

        {/* Cart */}

          
   <Box
  sx={{
    width: { xs: '100%', sm: '50%', md: '33.33%' },
    p: 1
  }}
>
  <Typography variant="h5" gutterBottom>
    Cart
  </Typography>
  {cart.length === 0 ? (
    <Typography>No items in cart</Typography>
  ) : (
    cart.map((item) => (
      <Card key={item.product.id}>
        <CardContent sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <Box sx={{ display: "flex", alignItems: "center" }}>
                      <img
                        src={item.product.image}
                        alt={item.product.name}
                        style={{ width: 60, height: 60, objectFit: "cover", marginRight: 16 }}
                      />
                      <Box>
                        <Typography variant="subtitle1">{item.product.name}</Typography>
                        <Typography variant="body2">
                           Qty: 
                              <Button size="small" onClick={() => decreaseQuantity(item.product.id)}>-</Button>
                                {item.quantity}
                          <Button size="small" onClick={() => increaseQuantity(item.product.id)}>+</Button>
                           | Rs. {item.product.price * item.quantity}
                        </Typography>
                      </Box>
                    </Box>
                    <IconButton
                      color="error"
                      onClick={() => removeFromCart(item.product.id)}
                    >
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
{/* Checkout */}
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

  <Typography variant="h6" sx={{ mb: 2 }}>
    Total: Rs. {totalPrice}
  </Typography>

  <Box sx={{ display: "flex", justifyContent: "flex-end", mt: 2 }}>
  <Button
    variant="contained"
    color="success"
    disabled={cart.length === 0 || !customerName || !contact}
    onClick={() => {
  const orderNum = `ORD-${Math.floor(100000 + Math.random() * 900000)}`; // random 6-digit order number
  setOrderSummary({
    orderNumber: orderNum,
    customerName,
    contact,
    paymentMethod,
    items: cart,
    total: totalPrice,
  });
  setCheckoutMessage(`Thank you ${customerName}! Your payment of Rs. ${totalPrice} via ${paymentMethod} has been received.`);
  setCart([]); // clear cart
  setCustomerName("");
  setContact("");
  setPaymentMethod("Cash");
}}
  >
    Checkout
  </Button>
  </Box>

  {paymentMethod === "Card" && (
  <>
    <TextField
      label="Card Number"
      fullWidth
      sx={{ mb: 2 }}
      inputProps={{ maxLength: 16 }}
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
    />
  </>
)}

  {checkoutMessage && (
    <Typography variant="body1" color="green" sx={{ mt: 2 }}>
      {checkoutMessage}
    </Typography>
  )}

  {orderSummary && (
  <Paper id="receipt-print-area" sx={{ mt: 4, p: 3, backgroundColor: "#fff", color: "#000" }}>
    {/* Heading */}
    <Typography variant="h4" align="center" gutterBottom>
      POS System Trial 
    </Typography>
    <Typography variant="h4" align="center" gutterBottom>
      Thank you for choosing us! 
    </Typography>

    {/* Date & Time */}
    <Typography variant="body2" align="center" gutterBottom>
      {new Date().toLocaleString()}
    </Typography>

    {/* Order Number */}
    <Typography variant="subtitle1" gutterBottom>
      <strong>Order Number:</strong> {orderSummary.orderNumber}
    </Typography>

    {/* Receipt Table */}
    <Box component="table" sx={{ width: '100%', borderCollapse: 'collapse', mb: 2 }}>
      <Box component="thead" sx={{ borderBottom: '2px solid #000' }}>
        <Box component="tr">
          <Box component="th" sx={{ textAlign: 'left', padding: '8px' }}>Item</Box>
          <Box component="th" sx={{ textAlign: 'center', padding: '8px' }}>Quantity</Box>
          <Box component="th" sx={{ textAlign: 'right', padding: '8px' }}>Price</Box>
        </Box>
      </Box>
      <Box component="tbody">
        {orderSummary.items.map(({ product, quantity }) => (
          <Box component="tr" key={product.id} sx={{ borderBottom: '1px solid #ddd' }}>
            <Box component="td" sx={{ padding: '8px' }}>{product.name}</Box>
            <Box component="td" sx={{ textAlign: 'center', padding: '8px' }}>{quantity}</Box>
            <Box component="td" sx={{ textAlign: 'right', padding: '8px' }}>Rs. {product.price * quantity}</Box>
          </Box>
        ))}
      </Box>
      <Box component="tfoot" sx={{ borderTop: '2px solid #000' }}>
        <Box component="tr">
          <Box component="td" colSpan={2} sx={{ textAlign: 'right', padding: '8px', fontWeight: 'bold' }}>
            Total:
          </Box>
          <Box component="td" sx={{ textAlign: 'right', padding: '8px', fontWeight: 'bold' }}>
            Rs. {orderSummary.total}
          </Box>
        </Box>
      </Box>
    </Box>

    {/* Customer Details */}
    <Typography><strong>Customer Name:</strong> {orderSummary.customerName}</Typography>
    <Typography><strong>Contact:</strong> {orderSummary.contact}</Typography>
    <Typography><strong>Payment Method:</strong> {orderSummary.paymentMethod}</Typography>

    {/* Footer */}
    <Box sx={{ mt: 4, borderTop: '1px solid #000', pt: 1, textAlign: 'center', fontSize: '0.9rem', color: '#555' }}>
      <Typography>Thank You so much! </Typography>
      <Typography>This system was developed by Saranya!</Typography>
      <Typography>Contact: +94 123 456 789</Typography>
    </Box>

    {/* Buttons */}
    <Box sx={{ mt: 3, display: 'flex', justifyContent: 'center', gap: 2 }}>
      <Button variant="contained" onClick={() => window.print()}>
        Print Receipt
      </Button>
      <Button variant="outlined" onClick={() => setOrderSummary(null)}>
        New Order
      </Button>
    </Box>
  </Paper>
)}

</Box>
      </Grid>
    </Container>
  );
}
