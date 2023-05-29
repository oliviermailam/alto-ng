import { Component, Inject, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialog } from '@angular/material/dialog';

import { AltoApiService } from '../providers/alto-api.service';

import { ICreateExpensePayload, IUpdateExpensePayload } from '../providers/payloads/users.payloads';

import { ECurrency, Expense } from '../domain/models/expense';
import { User } from '../domain/models/user';

export interface IExpensePopupComponentConfigData {
  currentUser: User;
  expenseToEdit?: Expense;
  categories: Set<string>;
}

@Component({
  selector: 'app-expense-popup',
  templateUrl: './expense-popup.html',
  styleUrls: ['../../app.component.scss']
})
export class ExpensePopupComponent implements OnInit {
  newExpenseForm = new FormGroup({
    name: new FormControl<string | null>(null, Validators.required),
    amount: new FormControl<number | null>(null, Validators.required),
    currency: new FormControl<string | null>(null, Validators.required),
    date: new FormControl<Date | null>(null),
    category: new FormControl<string | null>(null)
  });

  get currency(): FormControl {
    return this.newExpenseForm.get('currency') as FormControl;
  }

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: IExpensePopupComponentConfigData,
    private readonly altoApiService: AltoApiService,
    private readonly dialog: MatDialog
  ) {}

  ngOnInit(): void {
    if (this.data.expenseToEdit) {
      this.newExpenseForm.patchValue({
        name: this.data.expenseToEdit.name,
        amount: this.data.expenseToEdit.amount,
        currency: this.data.expenseToEdit.currency,
        date: this.data.expenseToEdit.date,
        category: this.data.expenseToEdit.category
      });
    }
  }

  save(event: any): void {
    event.preventDefault();
    if (this.data.expenseToEdit) {
      this.editExpense();
    } else {
      this.addNewExpense();
    }
  }

  private addNewExpense(): void {
    if (this.newExpenseForm.valid) {
      const payload: ICreateExpensePayload = {
        name: this.newExpenseForm.get('name')?.value as string,
        amount: this.newExpenseForm.get('amount')?.value as number,
        currency: this.newExpenseForm.get('currency')?.value as ECurrency,
        date: this.newExpenseForm.get('date')?.value?.toISOString() ?? undefined,
        category: this.newExpenseForm.get('category')?.value ?? undefined,
      };

      this.altoApiService
        .postUsersIdExpenses(this.data.currentUser.id, payload)
        .subscribe({
          next: () => {
            this.close();
          },
          error: (error: any) => {
            console.error(error);
          }
        });
    }
  }

  private editExpense(): void {
    if (this.newExpenseForm.valid && this.data.expenseToEdit) {
      const payload: IUpdateExpensePayload = {
        name: this.newExpenseForm.get('name')?.value as string,
        amount: this.newExpenseForm.get('amount')?.value as number,
        currency: this.newExpenseForm.get('currency')?.value as ECurrency,
        date: this.newExpenseForm.get('date')?.value?.toISOString() ?? undefined,
        category: this.newExpenseForm.get('category')?.value ?? undefined,
      };

      this.altoApiService
        .patchUsersIdExpensesId(this.data.currentUser.id, this.data.expenseToEdit.id, payload)
        .subscribe({
          next: () => {
            this.close();
          }
        });
    }
  }

  close(): void {
    this.dialog.closeAll();
  }
}