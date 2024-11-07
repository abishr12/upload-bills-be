import { handleServiceResponse } from "@/common/utils/httpHandlers";
import type { Request, Response } from "express";
import { billsService } from "./billsService";
class BillsController {
  public async getAllExpenses(req: Request, res: Response) {
    console.info("Fetching all expenses");
    const serviceResponse = await billsService.findAll();
    return handleServiceResponse(serviceResponse, res);
  }

  public async uploadBills(req: Request, res: Response): Promise<void> {
    try {
      console.info("Uploading bills");
      await billsService.uploadBills(req);
      res.status(200).json({ message: "Bills uploaded successfully" });
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  }
}

export default new BillsController();
