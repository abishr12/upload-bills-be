import type { Expense } from "@/api/expenses/expensesModel";

export const expenses: Expense[] = [
  {
    id: 1,
    amount: 1000,
    date: "2021-01-01",
    vendorName: "Amazon",
  },
  {
    id: 2,
    amount: 2000,
    date: "2021-01-02",
    vendorName: "Walmart",
  },
];

export class ExpensesRepository {
  async findAllAsync(): Promise<Expense[]> {
    return expenses;
  }

  async findByIdAsync(id: number): Promise<Expense | null> {
    return expenses.find((expense) => expense.id === id) || null;
  }
}
