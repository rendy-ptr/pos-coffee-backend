export interface ICreateMenu {
  imageUrl: string;
  name: string;
  categoryId: string;
  stock: number;
  productionCapital: number;
  sellingPrice: number;
  profitMargin: number;
  isActive: boolean;
}

export interface UpdateMenuInput {
  imageUrl: string;
  name: string;
  categoryId: string;
  stock: number;
  productionCapital: number;
  sellingPrice: number;
  profitMargin: number;
  isActive: boolean;
}
