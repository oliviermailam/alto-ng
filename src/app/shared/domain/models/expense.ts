import { User } from './user';

export enum ECurrency {
  USD = 'USD',
  EUR = 'EUR',
  GBP = 'GBP'
}

export interface IExpense {
  id: number;
  name: string;
  amount: number;
  currency: ECurrency;
  createdAt: string;
  updatedAt: string;
  date?: string;
  category?: string;
  user: User;
}

export class Expense {
  id: number;
  name: string;
  amount: number;
  currency: ECurrency;
  createdAt: Date;
  updatedAt: Date;
  date?: Date;
  category?: string;
  user: User;

  constructor(data: IExpense) {
    this.id = data.id;
    this.name = data.name;
    this.amount = data.amount;
    this.currency = data.currency;
    this.createdAt = new Date(data.createdAt);
    this.updatedAt = new Date(data.updatedAt);
    this.date = data.date ? new Date(data.date) : undefined;
    this.category = data.category;
    this.user = data.user;
  }

  static sortByName(a: Expense, b: Expense): number {
    return a.name.localeCompare(b.name);
  }

  static sortByAmount(a: Expense, b: Expense): number {
    return a.amount - b.amount;
  }

  static sortByDate(a: Expense, b: Expense): number {
    return a.date!.getTime() - b.date!.getTime();
  }

  static sortByCategory(a: Expense, b: Expense): number {
    return a.category!.localeCompare(b.category!);
  }

  static sortByUser(a: string, b: string): number {
    return a.localeCompare(b);
  }
}
