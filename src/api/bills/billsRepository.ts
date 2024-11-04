import type { Bill } from "@/api/bills/billsModel";

export const bills: Bill[] = [
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

export class BillsRepository {
  async findAllAsync(): Promise<Bill[]> {
    return bills;
  }

  async findByIdAsync(id: number): Promise<Bill | null> {
    return bills.find((bill) => bill.id === id) || null;
  }
}
