import { Product, Order, LearningModule, SupportTicket, Review, User } from '../types';
import { 
  INITIAL_PRODUCTS, 
  INITIAL_ORDERS, 
  INITIAL_LEARNING_MODULES, 
  INITIAL_REVIEWS, 
  INITIAL_TICKETS,
  INITIAL_USERS
} from './seedData';

// Helper to safely get from localStorage with fallback
function getLocal<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return fallback;
    const parsed = JSON.parse(raw);
    if (Array.isArray(fallback) && (!Array.isArray(parsed) || parsed.length === 0)) {
      return fallback;
    }
    return parsed;
  } catch {
    return fallback;
  }
}

function setLocal<T>(key: string, value: T): void {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (e) {
    console.warn(`Failed to persist ${key} in localStorage`, e);
  }
}

export const clientStore = {
  getProducts(): Product[] {
    return getLocal<Product[]>('gramai_db_products', INITIAL_PRODUCTS);
  },

  setProducts(prods: Product[]) {
    setLocal('gramai_db_products', prods);
  },

  addProduct(product: Product): Product {
    const prods = this.getProducts();
    const updated = [product, ...prods];
    this.setProducts(updated);
    return product;
  },

  getOrders(): Order[] {
    return getLocal<Order[]>('gramai_db_orders', INITIAL_ORDERS);
  },

  addOrder(order: Order): Order {
    const orders = this.getOrders();
    const updated = [order, ...orders];
    setLocal('gramai_db_orders', updated);
    return order;
  },

  updateOrderStatus(orderId: string, status: Order['orderStatus']) {
    const orders = this.getOrders();
    const updated = orders.map(o => o.id === orderId ? { ...o, orderStatus: status } : o);
    setLocal('gramai_db_orders', updated);
    return updated.find(o => o.id === orderId);
  },

  getLearningModules(): LearningModule[] {
    return INITIAL_LEARNING_MODULES;
  },

  getReviews(productId?: string): Review[] {
    const reviews = getLocal<Review[]>('gramai_db_reviews', INITIAL_REVIEWS);
    if (productId) {
      return reviews.filter(r => r.productId === productId);
    }
    return reviews;
  },

  addReview(review: Review): Review {
    const reviews = this.getReviews();
    const updated = [review, ...reviews];
    setLocal('gramai_db_reviews', updated);
    return review;
  },

  getTickets(): SupportTicket[] {
    return getLocal<SupportTicket[]>('gramai_db_tickets', INITIAL_TICKETS);
  },

  addTicket(ticket: SupportTicket): SupportTicket {
    const tickets = this.getTickets();
    const updated = [ticket, ...tickets];
    setLocal('gramai_db_tickets', updated);
    return ticket;
  },

  replyTicket(ticketId: string, text: string, sender: 'user' | 'support' = 'user') {
    const tickets = this.getTickets();
    const ticket = tickets.find(t => t.id === ticketId);
    if (ticket) {
      ticket.messages.push({
        sender,
        text,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      });
      setLocal('gramai_db_tickets', tickets);
    }
    return ticket;
  }
};
