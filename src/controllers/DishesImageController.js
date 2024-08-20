const knex = require("../database/knex")
const AppError = require("../utils/AppError")
const DiskStorage = require("../providers/DiskStorage")

class DishesImageController {
  async update(request, response) {
    const user_id = request.user.id
    const imageFilename = request.file.filename

    const diskStorage = new DiskStorage()

    const user = await knex("users")
      .where({ id: user_id }).first()
    
    if(!user) {
      throw new AppError("Somente usuários autenticados podem mudar o avatar", 401)
    }

    const dish = await knex("dishes")
      .where({ id: dish_id }).first()

    if(dish.image) {
      await diskStorage.deleteFile(dish.image)
    }

    const filename = await diskStorage.saveFile(imageFilename)
    dish.image = filename

    await knex("dishes").update(dish)
      .where({ id: dish_id})

    return response.json(dish)
  }
}

module.exports = DishesImageController