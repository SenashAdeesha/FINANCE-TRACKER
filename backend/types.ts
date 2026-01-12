// Database models and types
export interface User {
    id: number;
    username: string;
    email: string;
    password_hash: string;
    created_at: Date;
    updated_at: Date;
}

export interface Category {
    id: number;
    user_id: number | null;
    name: string;
    type: 'income' | 'expense';
    color?: string;
    icon?: string;
    created_at: Date;
}

export interface Transaction {
    id: number;
    user_id: number;
    category_id: number | null;
    amount: number;
    type: 'income' | 'expense';
    description?: string;
    date: Date;
    created_at: Date;
    updated_at: Date;
}

export interface Budget {
    id: number;
    user_id: number;
    category_id: number;
    amount: number;
    period: 'daily' | 'weekly' | 'monthly' | 'yearly';
    start_date: Date;
    end_date?: Date;
    created_at: Date;
    updated_at: Date;
}

export interface SavingsGoal {
    id: number;
    user_id: number;
    name: string;
    target_amount: number;
    current_amount: number;
    deadline?: Date;
    created_at: Date;
    updated_at: Date;
}
