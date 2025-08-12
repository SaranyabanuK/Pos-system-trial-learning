

export interface Product {
  id: number;
  name: string;
  price: number;
  image: string;
}

// Static product list (can later be fetched from API)
export const productsData: Product[] = [
  { id: 1, name: "Coca Cola", price: 150, image: "images/Coca Cola.jpg" },
  { id: 2, name: "Pepsi", price: 140, image: "images/Pepsi.jpg" },
  { id: 3, name: "Water Bottle", price: 100, image: "images/Water.jpg" },
];
