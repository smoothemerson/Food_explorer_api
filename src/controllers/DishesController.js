const knex = require("../database/knex")
const AppError = require("../utils/AppError")

class DishesController {
  async create(request, response) {
    const { title, description, category, tags, price } = request.body
    const user_id = request.user.id

    if (!title || !description || !category || !tags || !price) {
      throw new AppError("Preencha os campos necessários.")
    }

    const [dish_id] = await knex("dishes").insert({
      title,
      description,
      category,
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
    const user_id = request.user.id

    let dishes

    const query = knex("dishes").select("dishes.*").where({ user_id });

    if (title) {
      query.whereLike("dishes.title", `%${title}%`);
    }

    if (tags) {
      const filterTags = tags.split(',').map(tag => tag.trim())

      dishes = await query
        .innerJoin("tags", "dishes.id", "tags.dish_id")
        .whereIn("tags.name", filterTags)
        .groupBy("dishes.id")
        .orderBy("dishes.title");
    } else {
      dishes = await query.orderBy("dishes.title");
    }

    const userTags = await knex("tags").where({ user_id })
    const dishesWithTags = dishes.map(dish => {
      const dishTags = userTags.filter(tag => tag.dish_id === dish.id)

      return {
        ...dish,
        tags: dishTags
      }
    })

    return response.json(dishesWithTags)
  }
}

module.exports = DishesController