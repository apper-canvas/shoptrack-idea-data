// Database service for products with RLS policies
const { ApperClient } = window.ApperSDK;

const apperClient = new ApperClient({
  apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
  apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
});

// Get current user for RLS (simulated user context)
const getCurrentUser = () => {
  const savedUser = localStorage.getItem('currentUser');
  if (!savedUser) {
    const newUser = {
      id: Date.now(), // Simple user ID generation
      name: 'Anonymous User'
    };
    localStorage.setItem('currentUser', JSON.stringify(newUser));
    return newUser;
  }
  return JSON.parse(savedUser);
};

// Field mapping: mock data fields to database fields
const mapToDatabase = (product) => {
  return {
    Id_c: product.Id,
    name_c: product.name,
    description_c: product.description,
    sku_c: product.sku,
    category_c: product.category,
    price_c: product.price,
    quantity_c: product.quantity,
    lowStockThreshold_c: product.lowStockThreshold,
    imageUrl_c: product.imageUrl,
    createdAt_c: product.createdAt || new Date().toISOString(),
    updatedAt_c: product.updatedAt || new Date().toISOString()
  };
};

// Field mapping: database fields to mock data format
const mapFromDatabase = (dbProduct) => {
  return {
    Id: dbProduct.Id_c,
    name: dbProduct.name_c,
    description: dbProduct.description_c,
    sku: dbProduct.sku_c,
    category: dbProduct.category_c,
    price: dbProduct.price_c,
    quantity: dbProduct.quantity_c,
    lowStockThreshold: dbProduct.lowStockThreshold_c,
    imageUrl: dbProduct.imageUrl_c,
    createdAt: dbProduct.createdAt_c,
    updatedAt: dbProduct.updatedAt_c
  };
};

const productService = {
  getAll: async () => {
    try {
      const currentUser = getCurrentUser();
      const response = await apperClient.table('product_c').select('*').eq('Owner', currentUser.id);
      return response.data?.map(mapFromDatabase) || [];
    } catch (error) {
      console.error('Error fetching products:', error);
      throw new Error('Failed to load products');
    }
  },

  getById: async (id) => {
    try {
      const currentUser = getCurrentUser();
      const response = await apperClient.table('product_c')
        .select('*')
        .eq('Id_c', parseInt(id))
        .eq('Owner', currentUser.id)
        .single();
      
      if (!response.data) {
        throw new Error("Product not found");
      }
      return mapFromDatabase(response.data);
    } catch (error) {
      console.error('Error fetching product:', error);
      throw new Error("Product not found");
    }
  },

  create: async (productData) => {
    try {
      const currentUser = getCurrentUser();
      const dbProduct = mapToDatabase({
        ...productData,
        Id: Date.now(), // Temporary ID, database will assign actual
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      });

      const response = await apperClient.table('product_c')
        .insert({
          ...dbProduct,
          Owner: currentUser.id,
          CreatedBy: currentUser.id,
          ModifiedBy: currentUser.id
        });

      if (!response.data) {
        throw new Error('Failed to create product');
      }
      return mapFromDatabase(response.data[0]);
    } catch (error) {
      console.error('Error creating product:', error);
      throw new Error('Failed to create product');
    }
  },

  update: async (id, productData) => {
    try {
      const currentUser = getCurrentUser();
      const updates = mapToDatabase({
        ...productData,
        updatedAt: new Date().toISOString()
      });
      
      const response = await apperClient.table('product_c')
        .update({
          ...updates,
          ModifiedBy: currentUser.id
        })
        .eq('Id_c', parseInt(id))
        .eq('Owner', currentUser.id);

      if (!response.data || response.data.length === 0) {
        throw new Error("Product not found");
      }
      return mapFromDatabase(response.data[0]);
    } catch (error) {
      console.error('Error updating product:', error);
      throw new Error('Failed to update product');
    }
  },

  delete: async (id) => {
    try {
      const currentUser = getCurrentUser();
      const response = await apperClient.table('product_c')
        .delete()
        .eq('Id_c', parseInt(id))
        .eq('Owner', currentUser.id);

      if (!response.data || response.data.length === 0) {
        throw new Error("Product not found");
      }
      return { success: true };
    } catch (error) {
      console.error('Error deleting product:', error);
      throw new Error('Failed to delete product');
    }
  },

  updateQuantity: async (id, quantity) => {
    try {
      const currentUser = getCurrentUser();
      const response = await apperClient.table('product_c')
        .update({
          quantity_c: quantity,
          updatedAt_c: new Date().toISOString(),
          ModifiedBy: currentUser.id
        })
        .eq('Id_c', parseInt(id))
        .eq('Owner', currentUser.id);

      if (!response.data || response.data.length === 0) {
        throw new Error("Product not found");
      }
      return mapFromDatabase(response.data[0]);
    } catch (error) {
      console.error('Error updating quantity:', error);
      throw new Error('Failed to update quantity');
    }
  },

  getLowStockProducts: async () => {
    try {
      const currentUser = getCurrentUser();
      const response = await apperClient.table('product_c')
        .select('*')
        .lte('quantity_c', 'lowStockThreshold_c')
        .eq('Owner', currentUser.id);
      
      return response.data?.map(mapFromDatabase) || [];
    } catch (error) {
      console.error('Error fetching low stock products:', error);
      return [];
    }
  },

  getCategories: async () => {
    try {
      const currentUser = getCurrentUser();
      const response = await apperClient.table('product_c')
        .select('category_c')
        .eq('Owner', currentUser.id);
      
      const categories = [...new Set(response.data?.map(p => p.category_c) || [])];
      return categories.sort();
    } catch (error) {
      console.error('Error fetching categories:', error);
      return [];
    }
  },
};

export default productService;