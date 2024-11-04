import { extendZodWithOpenApi } from "@asteasolutions/zod-to-openapi";
import { z } from "zod";

import { commonValidations } from "@/common/utils/commonValidation";

export type Bill = z.infer<typeof BillsSchema>;
export const BillsSchema = z.object({
  id: z.number(),
  amount: z.number(),
  date: z.string(),
  vendorName: z.string(),
});
