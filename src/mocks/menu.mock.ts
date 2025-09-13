export interface CreateMenuInput {
  imageUrl: string;
  name: string;
  categoryId: string;
  stock: number;
  productionCapital: number;
  sellingPrice: number;
  profit: number;
  isActive: boolean;
}

export const MENU_MOCK: (Omit<CreateMenuInput, 'categoryId'> & {
  categoryName: string;
})[] = [
  // Minuman
  {
    imageUrl:
      'https://images.unsplash.com/photo-1510591509098-f4fdc6d0ff04?w=200&q=80&fit=crop&auto=format',
    name: 'Espresso',
    categoryName: 'Minuman',
    stock: 50,
    productionCapital: 15000,
    sellingPrice: 25000,
    profit: 10000,
    isActive: true,
  },
  {
    imageUrl:
      'https://images.unsplash.com/photo-1572442388796-11668a67e53d?w=200&q=80&fit=crop&auto=format',
    name: 'Cappuccino',
    categoryName: 'Minuman',
    stock: 40,
    productionCapital: 18000,
    sellingPrice: 35000,
    profit: 17000,
    isActive: true,
  },
  {
    imageUrl:
      'https://images.unsplash.com/photo-1509042239860-f550ce710b93?w=200&q=80&fit=crop&auto=format',
    name: 'Macchiato',
    categoryName: 'Minuman',
    stock: 35,
    productionCapital: 16000,
    sellingPrice: 30000,
    profit: 14000,
    isActive: true,
  },
  {
    imageUrl:
      'https://images.unsplash.com/photo-1461023058943-07fcbe16d735?w=200&q=80&fit=crop&auto=format',
    name: 'Kopi Susu Gula Aren',
    categoryName: 'Minuman',
    stock: 60,
    productionCapital: 12000,
    sellingPrice: 30000,
    profit: 18000,
    isActive: true,
  },
  {
    imageUrl:
      'https://images.unsplash.com/photo-1551030173-122aabc4489c?w=200&q=80&fit=crop&auto=format',
    name: 'Americano',
    categoryName: 'Minuman',
    stock: 70,
    productionCapital: 10000,
    sellingPrice: 28000,
    profit: 18000,
    isActive: true,
  },
  {
    imageUrl:
      'https://images.unsplash.com/photo-1561047029-3000c68339ca?w=200&q=80&fit=crop&auto=format',
    name: 'Latte',
    categoryName: 'Minuman',
    stock: 45,
    productionCapital: 20000,
    sellingPrice: 38000,
    profit: 18000,
    isActive: true,
  },
  {
    imageUrl:
      'https://images.unsplash.com/photo-1517701604599-bb29b565090c?w=200&q=80&fit=crop&auto=format',
    name: 'Chocolate Latte',
    categoryName: 'Minuman',
    stock: 25,
    productionCapital: 17000,
    sellingPrice: 32000,
    profit: 15000,
    isActive: true,
  },
  {
    imageUrl:
      'https://images.unsplash.com/photo-1515823064-d6e0c04616a7?w=200&q=80&fit=crop&auto=format',
    name: 'Matcha Latte',
    categoryName: 'Minuman',
    stock: 20,
    productionCapital: 18000,
    sellingPrice: 38000,
    profit: 20000,
    isActive: true,
  },
  {
    imageUrl:
      'https://images.unsplash.com/photo-1556679343-c7306c1976bc?w=200&q=80&fit=crop&auto=format',
    name: 'Teh Tarik',
    categoryName: 'Minuman',
    stock: 50,
    productionCapital: 10000,
    sellingPrice: 22000,
    profit: 12000,
    isActive: true,
  },
  {
    imageUrl:
      'https://images.unsplash.com/photo-1571934811356-5cc061b6821f?w=200&q=80&fit=crop&auto=format',
    name: 'Chai Latte',
    categoryName: 'Minuman',
    stock: 40,
    productionCapital: 15000,
    sellingPrice: 35000,
    profit: 20000,
    isActive: true,
  },

  // Makanan
  {
    imageUrl:
      'https://images.unsplash.com/photo-1509440159596-0249088772ff?w=200&q=80&fit=crop&auto=format',
    name: 'Croissant Butter',
    categoryName: 'Makanan',
    stock: 30,
    productionCapital: 12000,
    sellingPrice: 25000,
    profit: 13000,
    isActive: true,
  },
  {
    imageUrl:
      'https://images.unsplash.com/photo-1567234669003-dce7a7a88821?w=200&q=80&fit=crop&auto=format',
    name: 'Sandwich Club',
    categoryName: 'Makanan',
    stock: 20,
    productionCapital: 20000,
    sellingPrice: 45000,
    profit: 25000,
    isActive: true,
  },
  {
    imageUrl:
      'https://images.unsplash.com/photo-1551183053-bf91a1d81141?w=200&q=80&fit=crop&auto=format',
    name: 'Pasta Aglio Olio',
    categoryName: 'Makanan',
    stock: 15,
    productionCapital: 25000,
    sellingPrice: 42000,
    profit: 17000,
    isActive: true,
  },
  {
    imageUrl:
      'https://images.unsplash.com/photo-1512058564366-18510be2db19?w=200&q=80&fit=crop&auto=format',
    name: 'Nasi Goreng Kopi',
    categoryName: 'Makanan',
    stock: 25,
    productionCapital: 18000,
    sellingPrice: 38000,
    profit: 20000,
    isActive: true,
  },
  {
    imageUrl:
      'https://images.unsplash.com/photo-1482049016688-2d3e1b311543?w=200&q=80&fit=crop&auto=format',
    name: 'Roti Bakar Alpukat',
    categoryName: 'Makanan',
    stock: 10,
    productionCapital: 15000,
    sellingPrice: 32000,
    profit: 17000,
    isActive: true,
  },

  // Dessert
  {
    imageUrl:
      'https://images.unsplash.com/photo-1571877227200-a0d98ea607e9?w=200&q=80&fit=crop&auto=format',
    name: 'Tiramisu',
    categoryName: 'Dessert',
    stock: 20,
    productionCapital: 20000,
    sellingPrice: 35000,
    profit: 15000,
    isActive: true,
  },
  {
    imageUrl:
      'https://images.unsplash.com/photo-1533134242443-d4fd215305ad?w=200&q=80&fit=crop&auto=format',
    name: 'Cheesecake Blueberry',
    categoryName: 'Dessert',
    stock: 15,
    productionCapital: 22000,
    sellingPrice: 38000,
    profit: 16000,
    isActive: true,
  },
  {
    imageUrl:
      'https://images.unsplash.com/photo-1606313564200-e75d5e30476c?w=200&q=80&fit=crop&auto=format',
    name: 'Brownies Cokelat',
    categoryName: 'Dessert',
    stock: 10,
    productionCapital: 18000,
    sellingPrice: 32000,
    profit: 14000,
    isActive: true,
  },
  {
    imageUrl:
      'https://images.unsplash.com/photo-1488477181946-6428a0291777?w=200&q=80&fit=crop&auto=format',
    name: 'Panna Cotta',
    categoryName: 'Dessert',
    stock: 12,
    productionCapital: 25000,
    sellingPrice: 36000,
    profit: 11000,
    isActive: true,
  },
  {
    imageUrl:
      'https://images.unsplash.com/photo-1563805042-7684c019e1cb?w=200&q=80&fit=crop&auto=format',
    name: 'Es Krim Vanilla',
    categoryName: 'Dessert',
    stock: 18,
    productionCapital: 15000,
    sellingPrice: 30000,
    profit: 15000,
    isActive: true,
  },

  // Snack
  {
    imageUrl:
      'https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=200&q=80&fit=crop&auto=format',
    name: 'Donat Glazed',
    categoryName: 'Snack',
    stock: 40,
    productionCapital: 8000,
    sellingPrice: 18000,
    profit: 10000,
    isActive: true,
  },
  {
    imageUrl:
      'https://images.unsplash.com/photo-1486427944299-d1955d23e34d?w=200&q=80&fit=crop&auto=format',
    name: 'Muffin Blueberry',
    categoryName: 'Snack',
    stock: 25,
    productionCapital: 12000,
    sellingPrice: 22000,
    profit: 10000,
    isActive: true,
  },
  {
    imageUrl:
      'https://images.unsplash.com/photo-1603532648955-039310d9ed75?w=200&q=80&fit=crop&auto=format',
    name: 'Cookies Choco Chip',
    categoryName: 'Snack',
    stock: 50,
    productionCapital: 5000,
    sellingPrice: 15000,
    profit: 10000,
    isActive: true,
  },
  {
    imageUrl:
      'https://images.unsplash.com/photo-1540337706094-da10342c93d8?w=200&q=80&fit=crop&auto=format',
    name: 'Pretzel Asin',
    categoryName: 'Snack',
    stock: 30,
    productionCapital: 7000,
    sellingPrice: 16000,
    profit: 9000,
    isActive: true,
  },
  {
    imageUrl:
      'https://images.unsplash.com/photo-1599599810769-bcde5a160d32?w=200&q=80&fit=crop&auto=format',
    name: 'Churros',
    categoryName: 'Snack',
    stock: 25,
    productionCapital: 8000,
    sellingPrice: 20000,
    profit: 12000,
    isActive: true,
  },
];
