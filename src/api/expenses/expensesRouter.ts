import { OpenAPIRegistry } from "@asteasolutions/zod-to-openapi";
import express, { type Router } from "express";
import { z } from "zod";

import { createApiResponse } from "@/api-docs/openAPIResponseBuilders";
import { validateRequest } from "@/common/utils/httpHandlers";
import expensesController from "./expensesController";
import { ExpenseSchema } from "./expensesModel";

export const userRegistry = new OpenAPIRegistry();
export const expensesRouter: Router = express.Router();

userRegistry.register("Bills", ExpenseSchema);

userRegistry.registerPath({
  method: "get",
  path: "/",
  tags: ["Bills"],
  responses: createApiResponse(z.array(ExpenseSchema), "Success"),
});

expensesRouter.get("/", expensesController.getAllExpenses);
