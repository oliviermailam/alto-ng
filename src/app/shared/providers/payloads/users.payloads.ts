import { ECurrency } from '../../domain/models/expense';

export interface ICreateExpensePayload {
  name: string;
  amount: number;
  currency: ECurrency;
  date?: string;
  category?: string;
}

export interface IUpdateExpensePayload {
  name?: string;
  amount?: number;
  currency?: ECurrency;
  date?: string;
  category?: string;
}