import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { IUser } from '../domain/models/user';
import { Injectable } from '@angular/core';
import { ICreateExpensePayload, IUpdateExpensePayload } from './payloads/users.payloads';
import { IExpense } from '../domain/models/expense';

@Injectable()
export class AltoApiService {
  private static readonly apiUrl = 'http://localhost:3000/'

  constructor(private readonly http: HttpClient) { }

  protected usersUrl(): string {
    return AltoApiService.apiUrl + 'users';
  }

  protected usersIdUrl(id: number): string {
    return this.usersUrl() + '/' + id.toString();
  }

  protected usersIdExpensesUrl(id: number): string {
    return this.usersIdUrl(id) + '/expenses';
  }

  protected usersIdExpensesIdUrl(id: number, expenseId: number): string {
    return this.usersIdExpensesUrl(id) + '/' + expenseId.toString();
  }

  getUsers(): Observable<IUser[]> {
    return this.http.get<IUser[]>(this.usersUrl());
  }

  postUsersIdExpenses(id: number, expense: ICreateExpensePayload): Observable<IExpense> {
    return this.http.post<IExpense>(this.usersIdExpensesUrl(id), expense);
  }

  patchUsersIdExpensesId(id: number, expenseId: number, expense: IUpdateExpensePayload): Observable<IExpense> {
    return this.http.patch<IExpense>(this.usersIdExpensesIdUrl(id, expenseId), expense);
  }

  deleteUsersIdExpensesId(id: number, expenseId: number): Observable<void> {
    return this.http.delete<void>(this.usersIdExpensesIdUrl(id, expenseId));
  }
}