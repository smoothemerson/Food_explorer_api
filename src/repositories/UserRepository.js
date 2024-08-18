const sqliteConnection = require("../database/sqlite");
const AppError = require("../utils/AppError");

class UserRepository {
  async findByEmail(email) {
    const database = await sqliteConnection();
    const user = await database.get("SELECT * FROM users WHERE email = (?)", [
      email,
    ]);

    return user;
  }

  async create({ name, email, password }) {
    const database = await sqliteConnection();

    const UserId = await database.run(
      "INSERT INTO users (name, email, password) VALUES (?, ?, ?)",
      [name, email, password]
    );

    return { id: UserId };
  }

  async findByIdAndVerifications(user_id, name, email, password, old_password) {
    const database = await sqliteConnection();
    const user = await database.get("SELECT * FROM users WHERE id = (?)", [
      user_id,
    ]);

    if (!user) {
      throw new AppError("Usuário não encontrado");
    }

    const userWithUpdatedEmail = await database.get(
      "SELECT * FROM users WHERE email = (?)",
      [email]
    );

    if (userWithUpdatedEmail && userWithUpdatedEmail.id !== user.id) {
      throw new AppError("Este e-mail já está em uso");
    }

    user.name = name ?? user.name;
    user.email = email ?? user.email;

    return user;
  }

  async update({ user_id }) {
    const database = await sqliteConnection();
    const user = await database.get("SELECT * FROM users WHERE id = (?)", [
      user_id,
    ]);

    await database.run(
      `
      UPDATE users SET 
      name = ?,
      email = ?,
      password = ?,
      updated_at = DATETIME('now')
      WHERE id = ?`,
      [user.name, user.email, user.password, user_id]
    );

    return;
  }
}

module.exports = UserRepository;
