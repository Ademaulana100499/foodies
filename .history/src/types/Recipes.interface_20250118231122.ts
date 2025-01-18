export interface Food {
  id: string;
  name: string;
  imageUrl: string;
  description?: string; // Optional property
  ingredients?: string[]; // Optional property
  price?: number; // Optional property
  priceDiscount?: number; // Optional property
}

export interface FoodArr {
  data: Food[];
}

export interface FoodDetail {
  food: Food;
}
