import { upload } from "@/config/multer";
import { createCampaign, deleteCampaign, getCampaignById, getCampaigns, updateCampaign } from "@/controllers/campaign.controller";
import { createHeroCarousel, deleteHeroCarousel, getHeroCarousel, getHeroCarouselById, updateHeroCarousel } from "@/controllers/heroCarousel.controller";
import { protect, restrictTo } from "@/middlewares/authMiddleware";
import { Router } from "express";

const router = Router();

// Public routes for Hero Carousel
//get routes for hero carousel
router.get('/carousel', getHeroCarousel);
router.get('/carousel/:id', getHeroCarouselById);

// Protected routes for Hero Carousel
router.use(protect);
router.use(restrictTo("admin"));

router
    .post("/carousel/", upload.single("image"), createHeroCarousel)
router
    .patch("/carousel/:id", upload.single("image"), updateHeroCarousel)
router.delete("/carousel/:id", deleteHeroCarousel)

// Campaign routes
// Public routes for Campaign
router.get("/campaign/", getCampaigns);
router.get("/campaign/:id", getCampaignById);

// Protected routes for Campaign
router.use(protect);
router.use(restrictTo("admin"));

router.post("/campaign/", upload.single("image"), createCampaign);
router.patch("/campaign/:id", upload.single("imageFile"), updateCampaign);
router.delete("/campaign/:id", deleteCampaign);

export default router;