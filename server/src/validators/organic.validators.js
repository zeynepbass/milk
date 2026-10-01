import { APPLICATION_STATUSES } from "../models/OrganicApplication.js";
import { z, idParams, optionalText, paginationQuery } from "./common.js";

export const listApplicationsSchema = {
  query: paginationQuery.extend({ status: z.enum(APPLICATION_STATUSES).optional() }),
};

export const reviewApplicationSchema = {
  params: idParams,
  body: z
    .strictObject({
      decision: z.enum(["approved", "rejected"]),
      note: optionalText(500),
    })
    .refine((body) => body.decision === "approved" || Boolean(body.note), {
      path: ["note"],
      message: "Reddetme gerekçesi zorunludur",
    }),
};

export const applicationIdSchema = { params: idParams };
