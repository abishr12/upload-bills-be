import { extendZodWithOpenApi } from "@asteasolutions/zod-to-openapi";
import { z } from "zod";

import { commonValidations } from "@/common/utils/commonValidation";

export type Expense = z.infer<typeof ExpenseSchema>;
export const ExpenseSchema = z.object({
  id: z.number(),
  amount: z.number(),
  date: z.string(),
  vendorName: z.string(),
});
