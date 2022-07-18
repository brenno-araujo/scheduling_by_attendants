import { getRepository } from 'typeorm';
import path from 'path';

import uploadConfig from '../../../config/upload';
import User from '../infra/typeorm/entities/User';
import fs from 'fs';
import AppError from '../../../shared/errors/AppError';

interface Request {
  user_id: string;
  image: string;
}

class UpdateUserImageService {
  public async execute({ user_id, image }: Request): Promise<User> {
    const userRepository = getRepository(User);

    const user = await userRepository.findOne(user_id);

    if (!user) {
      throw new AppError('User not found');
    }

    if (user.image) {
      const userImagePath = path.join(uploadConfig.directory, user.image);
      const userImageExists = await fs.promises.stat(userImagePath);

      if (userImageExists) {
        await fs.promises.unlink(userImagePath);
      }
    }

    user.image = image;

    await userRepository.save(user);

    return user;
  }
}
export default UpdateUserImageService;