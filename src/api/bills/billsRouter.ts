import { OpenAPIRegistry } from "@asteasolutions/zod-to-openapi";
import express, { type Router } from "express";
import { z } from "zod";

import { createApiResponse } from "@/api-docs/openAPIResponseBuilders";
import { validateRequest } from "@/common/utils/httpHandlers";
import BillsController from "./billsController";
import { BillsSchema } from "./billsModel";

export const billsRegistry = new OpenAPIRegistry();
export const billsRouter: Router = express.Router();

billsRegistry.register("Bills", BillsSchema);

billsRegistry.registerPath({
  method: "get",
  path: "/bills",
  tags: ["Bills"],
  responses: createApiResponse(z.array(BillsSchema), "Success"),
});

billsRouter.get("/", BillsController.getAllExpenses);

billsRegistry.registerPath({
  method: "post",
  path: "/bills",
  tags: ["Bills"],
  responses: createApiResponse(z.null(), "Success"),
});

billsRouter.post("/", BillsController.uploadBills);