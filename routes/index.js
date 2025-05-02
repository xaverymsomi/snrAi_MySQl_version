import express from "express";
import path from "path";
import { getSplashData } from "../controllers/splashController.js";
import saveSuggestions from "../controllers/suggestionController.js";
import saveComplaint from "../controllers/complaintController.js";
import checkComplaintStatus from "../controllers/complaintStatusController.js";

const router = express.Router();


router.get("/", (req, res) => {
    res.sendFile(path.join(process.cwd(), "public", "index.html"));
  });
router.post("/test", (req, res) => {
    res.json({ ok: true });
});
router.post("/splash", getSplashData);
router.post("/submit-suggestion", saveSuggestions);
router.post("/submit-complaint", saveComplaint);
router.post('/check-complaint-status', checkComplaintStatus);

export default router;