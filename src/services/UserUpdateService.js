const { hash } = require("bcryptjs");
const AppError = require("../utils/AppError");

class UserUpdateService {
  constructor(userRepository) {
    this.userRepository = userRepository;
  }

  async execute({ user_id, name, email, password, old_password }) {
    const updateUser = await this.userRepository.findByIdAndVerifications(
      user_id,
      name,
      email,
      password,
      old_password
    );

    if (updateUser) {
      throw new AppError("Erro ao verificar as informações do usuário.");
    }

    if (password && !old_password) {
      throw new AppError(
        "Você precisa informar a senha antiga para definir a nova senha"
      );
    }

    if (password && old_password) {
      const checkOldPassword = await compare(old_password, user.password);

      if (!checkOldPassword) {
        throw new AppError("A senha antiga não confere");
      }

      user.password = await hash(password, parseInt(8, 10));

      const userUpdated = await this.userRepository.update({
        name,
        email,
        password: hashedPassword,
      });

      return userUpdated;
    }
  }
}

module.exports = UserUpdateService;
