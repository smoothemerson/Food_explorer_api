const knex = require("../database/knex")

class DishesController {
  async create(request, response) {
    const { title, description, tags, price } = request.body
    const user_id = request.user.id

    const [dish_id] = await knex("dishes").insert({
      title,
      description,
      user_id,
      price,
    })

    const tagsInsert = tags.map(name => {
      return {
        dish_id,
        name,
        user_id
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

  async index(request, response) {
    const { title, tags } = request.query
  
    let dishesQuery = knex("dishes")
  
    if (title) {
      dishesQuery = dishesQuery.where("title", "like", `%${title}%`)
    }
  
    if (tags) {
      const filteredDishes = await knex("tags")
        .select("dish_id")
        .whereIn("name", tags.split(","))
      dishesQuery = dishesQuery.whereIn("id", filteredDishes.map(tag => tag.dish_id))
    }
  
    const dishes = await dishesQuery
    return response.json(dishes)
  }
}

module.exports = DishesController