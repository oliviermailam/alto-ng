import { Expense, IExpense } from './expense';

export enum EUserRole {
  MANAGER = 'manager',
  MEMBER = 'member'
}

export interface IUser {
  id: number;
  firstName?: string;
  lastName?: string;
  email: string;
  expenses: IExpense[];
  role: EUserRole;
}

export class User {
  id: number;
  firstName?: string;
  lastName?: string;
  email: string;
  expenses: Expense[];
  role: EUserRole;

  constructor(user: IUser) {
    this.id = user.id;
    this.firstName = user.firstName;
    this.lastName = user.lastName;
    this.email = user.email;
    this.expenses = user.expenses.map(expense => new Expense(expense));
    this.role = user.role;
  }

  static compare(a: User, b: User): number {
    return a.email.localeCompare(b.email);
  }
}