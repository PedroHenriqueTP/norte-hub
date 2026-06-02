import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface CartItem {
  id: string;
  productId: string;
  name: string;
  price: number;
  quantity: number;
  image?: string;
}

export interface Discount {
  code: string;
  amount: number;
}

interface CartState {
  cart: CartItem[];
  discount: Discount | null;
  addToCart: (item: CartItem) => void;
  removeFromCart: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  applyDiscount: (discount: Discount) => void;
  removeDiscount: () => void;
  calculateTotals: () => void;
  total: number;
  finalTotal: number;
}

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      cart: [],
      discount: null,
      total: 0,
      finalTotal: 0,

      addToCart: (item: CartItem) => {
        const currentCart = get().cart;
        const existingItem = currentCart.find((i) => i.productId === item.productId);

        if (existingItem) {
          set({
            cart: currentCart.map((i) =>
              i.productId === item.productId
                ? { ...i, quantity: i.quantity + item.quantity }
                : i
            ),
          });
        } else {
          set({ cart: [...currentCart, item] });
        }
        get().calculateTotals();
      },

      removeFromCart: (productId: string) => {
        set({ cart: get().cart.filter((i) => i.productId !== productId) });
        get().calculateTotals();
      },

      updateQuantity: (productId: string, quantity: number) => {
        if (quantity <= 0) {
          get().removeFromCart(productId);
          return;
        }
        set({
          cart: get().cart.map((i) =>
            i.productId === productId ? { ...i, quantity } : i
          ),
        });
        get().calculateTotals();
      },

      clearCart: () => set({ cart: [], discount: null, total: 0, finalTotal: 0 }),

      applyDiscount: (discount: Discount) => {
        set({ discount });
        get().calculateTotals();
      },

      removeDiscount: () => {
        set({ discount: null });
        get().calculateTotals();
      },

      calculateTotals: () => {
        const { cart, discount } = get();
        const total = cart.reduce((acc: number, item: CartItem) => acc + (item.price * item.quantity), 0);
        let finalTotal = total;

        if (discount) {
          finalTotal = Math.max(0, total - discount.amount);
        }

        set({ total, finalTotal });
      }
    }),
    {
      name: 'delivery-cart-storage',
    }
  )
);
