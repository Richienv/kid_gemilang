export interface Part {
  id: string;
  name: string;
  category: string;
  part_number: string;
  compatible_vehicles: string[];
  price: number;
  image: string;
  stock_availability: number;
  description: string;
  specifications: { [key: string]: string };
  additional_images: string[];
}

export interface Vehicle {
  id: string;
  make: string;
  model: string;
  year: number;
}