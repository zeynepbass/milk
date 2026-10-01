import * as organic from "../controllers/organic.controller.js";
import { uploadDocument } from "../middleware/upload.js";
import {
  applicationIdSchema,
  listApplicationsSchema,
  reviewApplicationSchema,
} from "../validators/organic.validators.js";
import { defineRoutes } from "./defineRoutes.js";

const routes = defineRoutes("/api/organic-applications", "Organik sertifika");

routes.post(
  "/",
  {
    summary: "Organik sertifika başvurusu yap (PDF)",
    before: uploadDocument("document"),
    files: { field: "document" },
    status: 201,
  },
  organic.submitApplication
);
routes.get("/mine", { summary: "Son başvurumun durumu" }, organic.getMyApplication);
routes.get(
  "/",
  { summary: "Başvuruları listele", auth: "admin", schemas: listApplicationsSchema },
  organic.listApplications
);
routes.patch(
  "/:id",
  { summary: "Başvuruyu onayla veya reddet", auth: "admin", schemas: reviewApplicationSchema },
  organic.reviewApplication
);
routes.get(
  "/:id/document",
  { summary: "Başvuru belgesini indir (sahibi veya admin)", schemas: applicationIdSchema },
  organic.downloadDocument
);

export default routes.router;
