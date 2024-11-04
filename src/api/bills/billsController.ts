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
}

export default new BillsController();
