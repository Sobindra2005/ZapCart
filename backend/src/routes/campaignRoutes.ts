import { Router } from "express";
import { protect, restrictTo } from "@/middlewares/authMiddleware";
import { createCampaign, deleteCampaign, getCampaignById, getCampaigns, updateCampaign } from "@/controllers/campaign.controller";
import { upload } from "@/config/multer";


const router = Router();

router.get("/", getCampaigns);
router.get("/:id", getCampaignById);

router.use(protect);
router.use(restrictTo("admin"));

router.post("/",upload.single("image"), createCampaign);
router.patch("/:id",upload.single("image"), updateCampaign);
router.delete("/:id", deleteCampaign);

export default router;
