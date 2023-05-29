import { AfterViewInit, ChangeDetectorRef, Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { MatSort } from '@angular/material/sort';

import { Subscription } from 'rxjs';

import { ExpensePopupComponent } from './shared/components/expense-popup';

import { AltoApiService } from './shared/providers/alto-api.service';

import { EUserRole, IUser, User } from './shared/domain/models/user';
import { Expense } from './shared/domain/models/expense';
import { MatPaginator, MatPaginatorIntl } from '@angular/material/paginator';

interface IExpenseTableData {
  expenseRef: Expense;
  name: string;
  amount: number;
  currency: string;
  date?: Date;
  category?: string;
  userName: string;
}

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit, AfterViewInit, OnDestroy {
  users: User[] = [];
  userById = new Map<number, User>();
  selectedUserControl: FormControl<number | null> = new FormControl(null);

  isManager = false;
  subscription: Subscription = new Subscription();

  filterControl = new FormControl<string | null>(null);
  displayedColumns = ['name', 'amount', 'date', 'category', 'userName', 'edit', 'delete'];
  allExpenses: IExpenseTableData[] = [];
  dataSource = new MatTableDataSource<IExpenseTableData>([]);
  matPaginatorIntl = new MatPaginatorIntl();

  constructor(
    private readonly altoApiService: AltoApiService,
    private readonly dialog: MatDialog,
    private readonly cdr: ChangeDetectorRef
    ) {}

  @ViewChild(MatPaginator) paginator: MatPaginator = new MatPaginator(this.matPaginatorIntl, this.cdr);
  @ViewChild(MatSort) sort: MatSort = new MatSort();

  ngOnInit() {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
    this.altoApiService
      .getUsers()
      .subscribe({
        next: (users: IUser[]) => {
          this.users = [];
          this.userById.clear();
          this.allExpenses = [];

          users.forEach((user: IUser) => {
            const newUser = new User(user);
            this.users.push(newUser);
            this.userById.set(newUser.id, newUser);
            this.allExpenses.push(
              ...newUser.expenses.map((expense: Expense) => {
                return {
                  expenseRef: expense,
                  name: expense.name,
                  amount: expense.amount,
                  currency: expense.currency,
                  date: expense.date,
                  category: expense.category,
                  userName: newUser.email
                };
              })
            )
          });

          this.resetDataSource();
        },
        error: (error: any) => {
          console.error(error);
        }
      });

    this.subscription.unsubscribe();
    this.subscription = new Subscription();
    this.subscription.add(
      this.selectedUserControl.valueChanges.subscribe({
        next: (value: number | null) => {
          if (value) {
            this.isManager = (this.userById.get(value) as User).role === EUserRole.MANAGER;
            this.resetDataSource();
          }
        }
      })
    );
    this.subscription.add(
      this.filterControl.valueChanges.subscribe({
        next: () => {
          this.resetDataSource();
        }
      })
    );
  }

  ngAfterViewInit(): void {
    this.dataSource.sort = this.sort;
    if (this.dataSource && this.paginator) {
      this.dataSource.paginator = this.paginator;
    }
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  resetDataSource(event?: any): void {
    const userId = this.selectedUserControl.value;

    if (userId) {
      let data = this.allExpenses.slice();

      if (typeof userId === 'number' && this.userById.get(userId)?.role !== EUserRole.MANAGER) {
        data = data.filter((expense: IExpenseTableData) => {
          return expense.userName === (this.userById.get(userId) as User).email;
        });
      }

      if (event) {
        data.sort((a, b) => {
          const isAsc = event.direction === 'asc';
          switch (event.active) {
            case 'name':
              return isAsc
                ? Expense.sortByName(a.expenseRef, b.expenseRef)
                : -Expense.sortByName(a.expenseRef, b.expenseRef);
            case 'amount':
              return isAsc
                ? Expense.sortByAmount(a.expenseRef, b.expenseRef)
                : -Expense.sortByAmount(a.expenseRef, b.expenseRef);
            case 'date':
              return isAsc
                ? Expense.sortByDate(a.expenseRef, b.expenseRef)
                : -Expense.sortByDate(a.expenseRef, b.expenseRef);
            case 'category':
              return isAsc
                ? Expense.sortByCategory(a.expenseRef, b.expenseRef)
                : -Expense.sortByCategory(a.expenseRef, b.expenseRef);
            case 'userName':
              return isAsc
                ? Expense.sortByUser(a.userName, b.userName)
                : -Expense.sortByUser(a.userName, b.userName);
            default: return 0;
          }
        });
      }

      this.dataSource.data = data;
      if (this.filterControl.value) {
        this.dataSource.filter = (this.filterControl.value ?? '').trim().toLowerCase();
      }
      this.dataSource.sort = this.sort;
      this.dataSource.paginator = this.paginator;
      this.dataSource.paginator.firstPage();
    } else {
      this.dataSource.data = [];
    }
  }

  openExpensePopup(expense?: Expense): void {
    const categories = new Set<string>();
    this.users.forEach(user => {
      user.expenses.forEach(({category}) => {
        if (category) {
          categories.add(category);
        }
      });
    });

    const dialogRef = this.dialog.open(
      ExpensePopupComponent,
      {
        data: {
          currentUser: this.userById.get(this.selectedUserControl.value as number) as User,
          categories,
          expenseToEdit: expense
        }
      }
    );

    dialogRef.afterClosed().subscribe({
      next: () => {
        this.ngOnInit();
      }
    });
  }

  deleteExpense(expense: Expense): void {
    this.altoApiService
      .deleteUsersIdExpensesId(
        this.selectedUserControl.value as number,
        expense.id
      )
      .subscribe({
        next: () => {
          this.ngOnInit();
        }
      });
  }
}
