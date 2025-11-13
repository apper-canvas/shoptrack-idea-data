import ordersData from "@/services/mockData/orders.json";
import productService from "@/services/api/productService";

const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

let orders = [...ordersData];

const orderService = {
  getAll: async () => {
    await delay(300);
    return [...orders];
  },

  getById: async (id) => {
    await delay(200);
    const order = orders.find((o) => o.Id === parseInt(id));
    if (!order) {
      throw new Error("Order not found");
    }
    return { ...order };
  },

  create: async (orderData) => {
    await delay(400);
    const maxId = orders.length > 0 ? Math.max(...orders.map((o) => o.Id)) : 0;
    const newOrder = {
      ...orderData,
      Id: maxId + 1,
      status: "pending",
      createdAt: new Date().toISOString(),
      completedAt: null,
    };
    orders.push(newOrder);

    // Update product quantities
    for (const item of newOrder.items) {
      try {
        const product = await productService.getById(item.productId);
        await productService.updateQuantity(item.productId, product.quantity - item.quantity);
      } catch (error) {
        console.error("Error updating product quantity:", error);
      }
    }

    return { ...newOrder };
  },

  updateStatus: async (id, status) => {
    await delay(300);
    const index = orders.findIndex((o) => o.Id === parseInt(id));
    if (index === -1) {
      throw new Error("Order not found");
    }
    orders[index].status = status;
    if (status === "completed") {
      orders[index].completedAt = new Date().toISOString();
    }
    return { ...orders[index] };
  },

  delete: async (id) => {
    await delay(300);
    const index = orders.findIndex((o) => o.Id === parseInt(id));
    if (index === -1) {
      throw new Error("Order not found");
    }
    orders.splice(index, 1);
    return { success: true };
  },

  getByStatus: async (status) => {
    await delay(250);
    return orders.filter((o) => o.status === status);
  },

  getRecentOrders: async (limit = 5) => {
    await delay(200);
    return [...orders]
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
      .slice(0, limit);
  },
};

export default orderService;