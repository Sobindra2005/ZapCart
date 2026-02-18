import { upload } from "@/config/multer";
import { createHeroCarousel, deleteHeroCarousel, getHeroCarousel, getHeroCarouselById, updateHeroCarousel } from "@/controllers/heroCarousel.controller";
import { restrictTo } from "@/middlewares/authMiddleware";
import { Router } from "express";

const router = Router();

router.get('/',getHeroCarousel);
router.get('/:id',getHeroCarouselById);

router.use(restrictTo("admin","super admin"));
router
    .post("/",upload.single("image") ,createHeroCarousel)
router
    .put("/:id",upload.single("image") ,updateHeroCarousel)
router.delete("/:id", deleteHeroCarousel)