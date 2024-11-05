import { extendZodWithOpenApi } from "@asteasolutions/zod-to-openapi";
import { z } from "zod";

extendZodWithOpenApi(z);

export type Bill = z.infer<typeof BillsSchema>;
export const BillsSchema = z.object({
  id: z.string(),
  amount: z.string(),
  date: z.string(),
  vendorName: z.string(),
});
