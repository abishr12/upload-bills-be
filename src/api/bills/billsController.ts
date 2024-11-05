import type { Request, Response } from "express";
import { billsService } from "./billsService";

class BillsController {
  public async getAllExpenses(req: Request, res: Response): Promise<void> {
    try {
      const expenses = await billsService.findAll();
      res.status(200).json(expenses);
    } catch (error) {
      res.status(500).json({ message: "Error fetching expenses", error });
    }
  }

  public async uploadBills(req: Request, res: Response): Promise<void> {
    try {
      await billsService.uploadBills(req);
      res.status(200).json({ message: "Bills uploaded successfully" });
    } catch (error) {
      res.status(500).json({ message: "Error uploading bills", error });
    }
  }
}

export default new BillsController();
