// src/services/splashService.js
import fs from "fs";
import path from "path";
import {
  fetchInstitutions,
  fetchCategories,
  fetchFaq,
  fetchMonthlyComplaint,
  fetchComplaints
} from "../models/splashModel.js";

export const getSplashDataService = async () => {
  const splash = {};

  splash.institutions = await fetchInstitutions();
  splash.categories = await fetchCategories();
  splash.faq = await fetchFaq();
  splash.monthly_complaint = await fetchMonthlyComplaint();
  splash.complaints = await fetchComplaints();

  // Load JSON config
  const configPath = path.join(process.cwd(), "src", "config", "api_pref.json");
  if (fs.existsSync(configPath)) {
    const fileData = fs.readFileSync(configPath, "utf8");
    const jsonConfig = JSON.parse(fileData);
    Object.assign(splash, jsonConfig);
  }

  return splash;
};