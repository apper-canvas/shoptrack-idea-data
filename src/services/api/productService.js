import productsData from "@/services/mockData/products.json";

const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

let products = [...productsData];

const productService = {
  getAll: async () => {
    await delay(300);
    return [...products];
  },

  getById: async (id) => {
    await delay(200);
    const product = products.find((p) => p.Id === parseInt(id));
    if (!product) {
      throw new Error("Product not found");
    }
    return { ...product };
  },

  create: async (productData) => {
    await delay(400);
    const maxId = products.length > 0 ? Math.max(...products.map((p) => p.Id)) : 0;
    const newProduct = {
      ...productData,
      Id: maxId + 1,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    products.push(newProduct);
    return { ...newProduct };
  },

  update: async (id, productData) => {
    await delay(350);
    const index = products.findIndex((p) => p.Id === parseInt(id));
    if (index === -1) {
      throw new Error("Product not found");
    }
    products[index] = {
      ...products[index],
      ...productData,
      Id: products[index].Id,
      updatedAt: new Date().toISOString(),
    };
    return { ...products[index] };
  },

  delete: async (id) => {
    await delay(300);
    const index = products.findIndex((p) => p.Id === parseInt(id));
    if (index === -1) {
      throw new Error("Product not found");
    }
    products.splice(index, 1);
    return { success: true };
  },

  updateQuantity: async (id, quantity) => {
    await delay(250);
    const index = products.findIndex((p) => p.Id === parseInt(id));
    if (index === -1) {
      throw new Error("Product not found");
    }
    products[index].quantity = quantity;
    products[index].updatedAt = new Date().toISOString();
    return { ...products[index] };
  },

  getLowStockProducts: async () => {
    await delay(200);
    return products.filter((p) => p.quantity <= p.lowStockThreshold);
  },

  getCategories: async () => {
    await delay(150);
    const categories = [...new Set(products.map((p) => p.category))];
    return categories.sort();
  },
};

export default productService;