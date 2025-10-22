import { 
  collection, 
  doc, 
  getDocs, 
  getDoc, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  query, 
  where, 
  orderBy, 
  limit,
  serverTimestamp,
  Timestamp
} from 'firebase/firestore'
import { db } from './firebase-config'

// Collection names
export const COLLECTIONS = {
  PRODUCTS: 'products',
  CATEGORIES: 'categories',
  USERS: 'users',
  ORDERS: 'orders',
  ORDER_ITEMS: 'order_items',
  WISHLIST: 'wishlist',
  CART: 'cart',
  NOTIFICATIONS: 'notifications',
  EMAIL_VERIFICATIONS: 'email_verifications',
  PASSWORD_RESET_TOKENS: 'password_reset_tokens',
  SYNC_LOGS: 'sync_logs'
} as const

// Product interface
export interface Product {
  id?: string
  product_id: string
  product_name: string
  category: string
  website_section?: string
  price: number
  original_price?: number
  discount_percent?: number
  main_image: string
  image_2?: string
  image_3?: string
  image_4?: string
  images?: string[]
  description: string
  material: string
  weight_grams?: number
  length_size?: string
  colors_available?: string
  sizes_available?: string
  style?: string
  occasion?: string
  features?: string
  rating?: number
  reviews_count?: number
  in_stock: boolean
  is_new?: boolean
  is_sale?: boolean
  care_instructions?: string
  sku?: string
  brand?: string
  collection?: string
  tags?: string
  seo_title?: string
  seo_description?: string
  stock_quantity?: number
  minimum_stock?: number
  cost_price?: number
  uniqueness_factor?: string
  anti_tarnish?: boolean
  social_media_tags?: string
  instagram_hashtags?: string
  created_at?: Timestamp
  updated_at?: Timestamp
}

// User interface
export interface User {
  id?: string
  email: string
  name: string
  password_hash?: string
  avatar?: string
  is_email_verified: boolean
  is_admin?: boolean
  phone?: string
  created_at?: Timestamp
  updated_at?: Timestamp
}

// Order interface
export interface Order {
  id?: string
  order_id: string
  user_id?: string
  customer_email: string
  customer_name: string
  customer_phone?: string
  total_amount: number
  discount_amount?: number
  shipping_amount?: number
  tax_amount?: number
  payment_status: 'pending' | 'paid' | 'failed' | 'refunded'
  order_status: 'processing' | 'shipped' | 'delivered' | 'cancelled'
  payment_method?: string
  payment_id?: string
  shipping_address?: string
  billing_address?: string
  notes?: string
  created_at?: Timestamp
  updated_at?: Timestamp
}

// Order Item interface
export interface OrderItem {
  id?: string
  order_id: string
  product_id: string
  product_name: string
  quantity: number
  unit_price: number
  total_price: number
  product_details?: string
  created_at?: Timestamp
}

// Email Verification interface
export interface EmailVerification {
  id?: string
  email: string
  otp: string
  type: 'registration' | 'login' | 'password_reset'
  expires_at: Timestamp
  is_used: boolean
  created_at?: Timestamp
}

// Database functions
export class FirebaseDatabase {
  // Products
  static async getProducts(): Promise<Product[]> {
    try {
      const productsRef = collection(db, COLLECTIONS.PRODUCTS)
      const snapshot = await getDocs(productsRef)
      return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Product))
    } catch (error) {
      console.error('Error getting products:', error)
      return []
    }
  }

  static async getProductById(productId: string): Promise<Product | null> {
    try {
      const productRef = doc(db, COLLECTIONS.PRODUCTS, productId)
      const snapshot = await getDoc(productRef)
      if (snapshot.exists()) {
        return { id: snapshot.id, ...snapshot.data() } as Product
      }
      return null
    } catch (error) {
      console.error('Error getting product:', error)
      return null
    }
  }

  static async getProductsByCategory(category: string): Promise<Product[]> {
    try {
      const productsRef = collection(db, COLLECTIONS.PRODUCTS)
      const q = query(productsRef, where('category', '==', category))
      const snapshot = await getDocs(q)
      return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Product))
    } catch (error) {
      console.error('Error getting products by category:', error)
      return []
    }
  }

  static async addProduct(product: Omit<Product, 'id' | 'created_at' | 'updated_at'>): Promise<string> {
    try {
      const productsRef = collection(db, COLLECTIONS.PRODUCTS)
      const docRef = await addDoc(productsRef, {
        ...product,
        created_at: serverTimestamp(),
        updated_at: serverTimestamp()
      })
      return docRef.id
    } catch (error) {
      console.error('Error adding product:', error)
      throw error
    }
  }

  static async updateProduct(productId: string, updates: Partial<Product>): Promise<void> {
    try {
      const productRef = doc(db, COLLECTIONS.PRODUCTS, productId)
      await updateDoc(productRef, {
        ...updates,
        updated_at: serverTimestamp()
      })
    } catch (error) {
      console.error('Error updating product:', error)
      throw error
    }
  }

  static async deleteProduct(productId: string): Promise<void> {
    try {
      const productRef = doc(db, COLLECTIONS.PRODUCTS, productId)
      await deleteDoc(productRef)
    } catch (error) {
      console.error('Error deleting product:', error)
      throw error
    }
  }

  // Users
  static async getUserByEmail(email: string): Promise<User | null> {
    try {
      const usersRef = collection(db, COLLECTIONS.USERS)
      const q = query(usersRef, where('email', '==', email))
      const snapshot = await getDocs(q)
      if (!snapshot.empty) {
        const doc = snapshot.docs[0]
        return { id: doc.id, ...doc.data() } as User
      }
      return null
    } catch (error) {
      console.error('Error getting user by email:', error)
      return null
    }
  }

  static async addUser(user: Omit<User, 'id' | 'created_at' | 'updated_at'>): Promise<string> {
    try {
      const usersRef = collection(db, COLLECTIONS.USERS)
      const docRef = await addDoc(usersRef, {
        ...user,
        created_at: serverTimestamp(),
        updated_at: serverTimestamp()
      })
      return docRef.id
    } catch (error) {
      console.error('Error adding user:', error)
      throw error
    }
  }

  static async updateUser(userId: string, updates: Partial<User>): Promise<void> {
    try {
      const userRef = doc(db, COLLECTIONS.USERS, userId)
      await updateDoc(userRef, {
        ...updates,
        updated_at: serverTimestamp()
      })
    } catch (error) {
      console.error('Error updating user:', error)
      throw error
    }
  }

  // Orders
  static async getOrders(): Promise<Order[]> {
    try {
      const ordersRef = collection(db, COLLECTIONS.ORDERS)
      const q = query(ordersRef, orderBy('created_at', 'desc'))
      const snapshot = await getDocs(q)
      return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Order))
    } catch (error) {
      console.error('Error getting orders:', error)
      return []
    }
  }

  static async addOrder(order: Omit<Order, 'id' | 'created_at' | 'updated_at'>): Promise<string> {
    try {
      const ordersRef = collection(db, COLLECTIONS.ORDERS)
      const docRef = await addDoc(ordersRef, {
        ...order,
        created_at: serverTimestamp(),
        updated_at: serverTimestamp()
      })
      return docRef.id
    } catch (error) {
      console.error('Error adding order:', error)
      throw error
    }
  }

  // Email Verifications
  static async addEmailVerification(verification: Omit<EmailVerification, 'id' | 'created_at'>): Promise<string> {
    try {
      const verificationsRef = collection(db, COLLECTIONS.EMAIL_VERIFICATIONS)
      const docRef = await addDoc(verificationsRef, {
        ...verification,
        created_at: serverTimestamp()
      })
      return docRef.id
    } catch (error) {
      console.error('Error adding email verification:', error)
      throw error
    }
  }

  static async getEmailVerification(email: string, otp: string): Promise<EmailVerification | null> {
    try {
      const verificationsRef = collection(db, COLLECTIONS.EMAIL_VERIFICATIONS)
      const q = query(
        verificationsRef, 
        where('email', '==', email),
        where('otp', '==', otp),
        where('is_used', '==', false)
      )
      const snapshot = await getDocs(q)
      if (!snapshot.empty) {
        const doc = snapshot.docs[0]
        return { id: doc.id, ...doc.data() } as EmailVerification
      }
      return null
    } catch (error) {
      console.error('Error getting email verification:', error)
      return null
    }
  }

  static async markEmailVerificationAsUsed(verificationId: string): Promise<void> {
    try {
      const verificationRef = doc(db, COLLECTIONS.EMAIL_VERIFICATIONS, verificationId)
      await updateDoc(verificationRef, { is_used: true })
    } catch (error) {
      console.error('Error marking email verification as used:', error)
      throw error
    }
  }

  // Inventory management
  static async getInventory() {
    try {
      const products = await this.getProducts()
      return {
        all: products,
        featured: products.filter(p => p.website_section === 'Featured Products').slice(0, 6),
        collections: products.filter(p => p.website_section === 'Collections Page').slice(0, 20),
        categories: {
          necklaces: products.filter(p => p.category?.toLowerCase().includes('necklace')),
          rings: products.filter(p => p.category?.toLowerCase().includes('ring')),
          earrings: products.filter(p => p.category?.toLowerCase().includes('earring')),
          bracelets: products.filter(p => p.category?.toLowerCase().includes('bracelet')),
          anklets: products.filter(p => p.category?.toLowerCase().includes('anklet'))
        }
      }
    } catch (error) {
      console.error('Error getting inventory:', error)
      return { all: [], featured: [], collections: [], categories: {} }
    }
  }
}
