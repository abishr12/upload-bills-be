import { StatusCodes } from "http-status-codes";

import type { Bill } from "@/api/bills/billsModel";
import { ServiceResponse } from "@/common/models/serviceResponse";
import { logger } from "@/server";
import { BillsRepository } from "./billsRepository";

export class BillsService {
  private billsRepository: BillsRepository;

  constructor(repository: BillsRepository = new BillsRepository()) {
    this.billsRepository = repository;
  }

  // Retrieves all bills from the database
  async findAll(): Promise<ServiceResponse<Bill[] | null>> {
    try {
      const bills = await this.billsRepository.findAllAsync();
      if (!bills || bills.length === 0) {
        return ServiceResponse.failure("No Bills found", null, StatusCodes.NOT_FOUND);
      }
      return ServiceResponse.success<Bill[]>("Bills found", bills);
    } catch (ex) {
      const errorMessage = `Error finding all bills: $${(ex as Error).message}`;
      logger.error(errorMessage);
      return ServiceResponse.failure(
        "An error occurred while retrieving bills.",
        null,
        StatusCodes.INTERNAL_SERVER_ERROR,
      );
    }
  }
}

export const billsService = new BillsService();
