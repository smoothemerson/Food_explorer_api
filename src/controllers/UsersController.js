const { hash, compare } = require("bcryptjs");
const AppError = require("../utils/AppError");

const UserRepository = require("../repositories/UserRepository");
const UserCreateService = require("../services/UserCreateService");
const sqliteConnection = require("../database/sqlite");

class UsersController {
  async create(request, response) {
    const { name, email, password } = request.body;

    const userRespository = new UserRepository();
    const userCreateService = new UserCreateService(userRespository);

    await userCreateService.execute({ name, email, password });

    return response.status(201).json();
  }

  async update(request, response) {
    const { name, email, password, old_password } = request.body;
    const user_id = request.user.id;

    const userRepository = new UserRepository();
    const userUpdateService = new userUpdateService(userRepository);

    await userUpdateService.execute({
      user_id,
      name,
      email,
      password,
      old_password,
    });

    return response.json();
  }
}

module.exports = UsersController;
