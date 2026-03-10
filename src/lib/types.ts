export type UserRole = 'admin' | 'user';

export interface UserProfile {
    id: string;
    email: string;
    role: UserRole;
    created_at: string;
}

export interface Product {
    id: string;
    name: string;
    description: string;
    price: number;
    inventory: number;
    image_url: string | null;
    created_at: string;
    category: string;
}

export interface Order {
    id: string;
    user_id: string;
    status: 'pending' | 'paid' | 'shipped' | 'cancelled';
    total: number;
    shipping_address: ShippingAddress;
    created_at: string;
}

export interface OrderItem {
    id: string;
    order_id: string;
    product_id: string;
    quantity: number;
    price_at_purchase: number;
    product?: Product;
}

export interface Review {
    id: string;
    user_id: string;
    product_id: string;
    rating: number;
    comment: string | null;
    created_at: string;
    user?: { email: string };
}

export interface ShippingAddress {
    name: string;
    address: string;
    city: string;
    postal_code: string;
    country: string;
}

export interface CartItem {
    product: Product;
    quantity: number;
}
