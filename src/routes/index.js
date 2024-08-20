const { Router } = require("express")

const usersRoutes = require("./users.routes")
const dishesRoutes = require("./dishes.routes")
const tagsRoutes = require("./tags.routes")
const sessionRoutes = require("./sessions.routes")

const routes = Router()
routes.use("/users", usersRoutes)
routes.use("/sessions", sessionRoutes)
routes.use("/notes", dishesRoutes)
routes.use("/tags", tagsRoutes)

module.exports = routes
