import { upload } from "@/config/multer";
import { createHeroCarousel, deleteHeroCarousel, getHeroCarousel, getHeroCarouselById, updateHeroCarousel } from "@/controllers/heroCarousel.controller";
import { restrictTo } from "@/middlewares/authMiddleware";
import { Router } from "express";

const router = Router();

router.get('/carousel',getHeroCarousel);
router.get('/carousel/:id',getHeroCarouselById);

router.use(restrictTo("admin","super admin"));
router
    .post("/carousel/",upload.single("image") ,createHeroCarousel)
router
    .put("/carousel/:id",upload.single("image") ,updateHeroCarousel)
router.delete("/carousel/:id", deleteHeroCarousel)

export default router;