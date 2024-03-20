import { UserEntity } from '../entity/user'
import { IUserRepository } from '../repository'

export class CreateUserUseCase {
  constructor(private readonly userRepository: IUserRepository) {}

  async execute(input: any): Promise<any> {
    const entity = new UserEntity(input)

    const userExists = await this.userRepository.findOne({
      username: entity.username,
      email: entity.email
    })

    if (userExists) {
      throw new Error('User already exists')
    }

    try {
      return await this.userRepository.create(entity)
    } catch (err) {
      throw err
    }
  }
}
