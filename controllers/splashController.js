import { getSplashDataService } from "../services/splashService.js";

export const getSplashData = async (req, res) => {
  try {
    const splashData = await getSplashDataService();
    res.json({
      status: true,
      message: "Splash data retrieved",
      data: splashData
    });
  } catch (error) {
    console.error("SplashController Error:", error);
    res.status(500).json({ status: false, message: "Server error" });
  }
};