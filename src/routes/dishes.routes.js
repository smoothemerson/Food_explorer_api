const { Router } = require("express")
const multer = require("multer")
const uploadConfig = require("../configs/upload")

const DishesController = require("../controllers/DishesController")
const DishesImageController = require("../controllers/DishesImageController")
const ensureAuthenticated = require("../middlewares/ensureAuthenticated")

const dishesRoutes = Router()
const upload = multer(uploadConfig.MULTER)

const dishesController = new DishesController()
const dishesImageController = new DishesImageController()

dishesRoutes.use(ensureAuthenticated)

dishesRoutes.post("/", dishesController.create)
dishesRoutes.patch("/avatar", ensureAuthenticated, upload.single("avatar"), dishesImageController.update)
dishesRoutes.get("/:id", dishesController.show)
dishesRoutes.delete("/:id", dishesController.delete)
dishesRoutes.get("/", dishesController.index)

module.exports = dishesRoutes
