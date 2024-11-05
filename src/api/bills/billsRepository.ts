import type { Bill } from "@/api/bills/billsModel";

export const bills: Bill[] = [
  {
    id: "0c93a57b-cf92-4980-9417-3d1903d493d7",
    amount: "1000",
    date: "2021-01-01",
    vendorName: "Amazon",
  },
  {
    id: "ad6ffb79-0a97-4e73-8b10-fc4cdf8fd24f",
    amount: "2000",
    date: "2021-01-02",
    vendorName: "Walmart",
  },
];

export class BillsRepository {
  async findAllAsync(): Promise<Bill[]> {
    return bills;
  }
}
