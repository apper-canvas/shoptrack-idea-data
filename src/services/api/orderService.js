import productService from "@/services/api/productService";
// Database service for orders with RLS policies
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
      id: Date.now(),
      name: 'Anonymous User'
    };
    localStorage.setItem('currentUser', JSON.stringify(newUser));
    return newUser;
  }
  return JSON.parse(savedUser);
};

// Field mapping: mock data fields to database fields
const mapToDatabase = (order) => {
  return {
    Id_c: order.Id,
    status_c: order.status,
    totalAmount_c: order.totalAmount,
    createdAt_c: order.createdAt || new Date().toISOString(),
    completedAt_c: order.completedAt,
    items_c: JSON.stringify(order.items || [])
  };
};

// Field mapping: database fields to mock data format
const mapFromDatabase = (dbOrder) => {
  let items = [];
  try {
    items = JSON.parse(dbOrder.items_c || '[]');
  } catch (error) {
    console.error('Error parsing order items:', error);
    items = [];
  }

  return {
    Id: dbOrder.Id_c,
    status: dbOrder.status_c,
    totalAmount: dbOrder.totalAmount_c,
    createdAt: dbOrder.createdAt_c,
    completedAt: dbOrder.completedAt_c,
    items: items
  };
};

const orderService = {
  getAll: async () => {
    try {
      const currentUser = getCurrentUser();
      const response = await apperClient.table('order_c').select('*').eq('Owner', currentUser.id);
      return response.data?.map(mapFromDatabase) || [];
    } catch (error) {
      console.error('Error fetching orders:', error);
      throw new Error('Failed to load orders');
    }
  },

  getById: async (id) => {
    try {
      const currentUser = getCurrentUser();
      const response = await apperClient.table('order_c')
        .select('*')
        .eq('Id_c', parseInt(id))
        .eq('Owner', currentUser.id)
        .single();
      
      if (!response.data) {
        throw new Error("Order not found");
      }
      return mapFromDatabase(response.data);
    } catch (error) {
      console.error('Error fetching order:', error);
      throw new Error("Order not found");
    }
  },

  create: async (orderData) => {
    try {
      const currentUser = getCurrentUser();
      const dbOrder = mapToDatabase({
        ...orderData,
        Id: Date.now(),
        status: "pending",
        createdAt: new Date().toISOString(),
        completedAt: null
      });

      const response = await apperClient.table('order_c')
        .insert({
          ...dbOrder,
          Owner: currentUser.id,
          CreatedBy: currentUser.id,
          ModifiedBy: currentUser.id
        });

      if (!response.data) {
        throw new Error('Failed to create order');
      }

      const newOrder = mapFromDatabase(response.data[0]);

      // Update product quantities
      for (const item of newOrder.items) {
        try {
          const product = await productService.getById(item.productId);
          await productService.updateQuantity(item.productId, product.quantity - item.quantity);
        } catch (error) {
          console.error("Error updating product quantity:", error);
        }
      }

      return newOrder;
    } catch (error) {
      console.error('Error creating order:', error);
      throw new Error('Failed to create order');
    }
  },

  updateStatus: async (id, status) => {
    try {
      const currentUser = getCurrentUser();
      const updates = {
        status_c: status,
        ModifiedBy: currentUser.id
      };
      
      if (status === "completed") {
        updates.completedAt_c = new Date().toISOString();
      }

      const response = await apperClient.table('order_c')
        .update(updates)
        .eq('Id_c', parseInt(id))
        .eq('Owner', currentUser.id);

      if (!response.data || response.data.length === 0) {
        throw new Error("Order not found");
      }
      return mapFromDatabase(response.data[0]);
    } catch (error) {
      console.error('Error updating order status:', error);
      throw new Error('Failed to update order status');
    }
  },

  delete: async (id) => {
    try {
      const currentUser = getCurrentUser();
      const response = await apperClient.table('order_c')
        .delete()
        .eq('Id_c', parseInt(id))
        .eq('Owner', currentUser.id);

      if (!response.data || response.data.length === 0) {
        throw new Error("Order not found");
      }
      return { success: true };
    } catch (error) {
      console.error('Error deleting order:', error);
      throw new Error('Failed to delete order');
    }
  },

  getByStatus: async (status) => {
    try {
      const currentUser = getCurrentUser();
      const response = await apperClient.table('order_c')
        .select('*')
        .eq('status_c', status)
        .eq('Owner', currentUser.id);
      
      return response.data?.map(mapFromDatabase) || [];
    } catch (error) {
      console.error('Error fetching orders by status:', error);
      return [];
    }
  },

  getRecentOrders: async (limit = 5) => {
    try {
      const currentUser = getCurrentUser();
      const response = await apperClient.table('order_c')
        .select('*')
        .eq('Owner', currentUser.id)
        .order('createdAt_c', { ascending: false })
        .limit(limit);
      
      return response.data?.map(mapFromDatabase) || [];
    } catch (error) {
      console.error('Error fetching recent orders:', error);
      return [];
return [];
  }
};

export default orderService;