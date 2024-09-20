const { Router } = require("express")
const multer = require("multer")
const uploadConfig = require("../configs/upload")

const DishesController = require("../controllers/DishesController")
const DishesImageController = require("../controllers/DishesImageController")
const ensureAuthenticated = require("../middlewares/ensureAuthenticated")
const verifyUserAuthorization = require("../middlewares/verifyUserAuthorization")

const dishesRoutes = Router()
const upload = multer(uploadConfig.MULTER)

const dishesController = new DishesController()
const dishesImageController = new DishesImageController()

dishesRoutes.use(ensureAuthenticated)

dishesRoutes.get("/:id", dishesController.show)
dishesRoutes.get("/", dishesController.index)
dishesRoutes.post("/", verifyUserAuthorization(["admin"]), dishesController.create)
dishesRoutes.patch("/avatar", verifyUserAuthorization(["admin"]), upload.single("avatar"), dishesImageController.update)
dishesRoutes.delete("/:id", verifyUserAuthorization(["admin"]), dishesController.delete)

module.exports = dishesRoutes
