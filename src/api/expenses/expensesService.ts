import { StatusCodes } from "http-status-codes";

import type { Expense } from "@/api/expenses/expensesModel";
import { ServiceResponse } from "@/common/models/serviceResponse";
import { logger } from "@/server";
import { ExpensesRepository } from "./expensesRepository";

export class ExpensesService {
  private expensesRepository: ExpensesRepository;

  constructor(repository: ExpensesRepository = new ExpensesRepository()) {
    this.expensesRepository = repository;
  }

  // Retrieves all expenses from the database
  async findAll(): Promise<ServiceResponse<Expense[] | null>> {
    try {
      const expenses = await this.expensesRepository.findAllAsync();
      if (!expenses || expenses.length === 0) {
        return ServiceResponse.failure("No Expenses found", null, StatusCodes.NOT_FOUND);
      }
      return ServiceResponse.success<Expense[]>("Expenses found", expenses);
    } catch (ex) {
      const errorMessage = `Error finding all expenses: $${(ex as Error).message}`;
      logger.error(errorMessage);
      return ServiceResponse.failure(
        "An error occurred while retrieving expenses.",
        null,
        StatusCodes.INTERNAL_SERVER_ERROR,
      );
    }
  }
}

export const expensesService = new ExpensesService();
