export type TransactionCategory = 'INCOME' | 'EXPENSE' | 'SAVING';

export interface BudgetItem {
  id: string;
  name: string;
  expected: number;
  actual: number;
  category: TransactionCategory;
  group: string; // e.g., 'Thu nhập vợ', 'Thu nhập chồng', 'Nhà cửa'
}

export interface MonthData {
  month: number; // 1 to 12
  items: BudgetItem[];
}

export interface FinanceData {
  year: number;
  months: MonthData[];
}
