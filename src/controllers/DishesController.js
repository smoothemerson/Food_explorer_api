const knex = require("../database/knex")

class DishesController {
  async create(request, response) {
    const { title, description, tags, price } = request.body
    const user_id = request.user.id

    const [dish_id] = await knex("dishes").insert({
      title,
      description,
      tags,
      price,
    })

    const tagsInsert = tags.map(name => {
      return {
        dish_id,
        name,
        user_id,
      }
    })

    await knex("tags").insert(tagsInsert)

    return response.json()
  }

  async show(request, response) {
    const { id } = request.params

    const dish = await knex("dishes").where({ id }).first()
    const tags = await knex("tags").where({ dish_id: id }).orderBy("name")

    return response.json({
      ...dish,
      tags,
    })
  }

  async delete(request, response) {
    const { id } = request.params

    await knex("dishes").where({ id }).delete()

    return response.json()
  }
}

module.exports = DishesController