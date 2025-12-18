import bcryptHelper from '../../helpers/bycrypt.helper';
import AppError from '../../lib/AppError';
import httpStatus from '../../lib/http-status';
import { AuthUser, PaginationOptions } from '../../types';
import {
  CreateUserPayload,
  UpdateUserProfilePayload,
  UsersFilterQuery,
} from './user.interface';

import { calculatePagination } from '../../helpers/pagination.helper';
import userRepository from './user.repository';

class UserService {
  async createUser(payload: CreateUserPayload) {
    const userExistByEmail = await userRepository.isExistByEmail(payload.email);

    if (userExistByEmail)
      throw new AppError(httpStatus.FORBIDDEN, 'This email already used');
    const userExistByUsername = await userRepository.isExistByUsername(
      payload.username,
    );

    if (userExistByUsername)
      throw new AppError(
        httpStatus.FORBIDDEN,
        'This username already used.Please try another one',
      );

    // Insert user
    const createdUser = await userRepository.create(
      {
        ...payload,
        password: bcryptHelper.hash(payload.password),
      },
      {
        select: {
          id: true,
          name: true,
          profilePhoto: true,
          gender: true,
          status: true,
          createdAt: true,
          updatedAt: true,
          isActive: true,
        },
      },
    );

    if (!createdUser) throw new Error();

    return createdUser;
  }

  async getCurrentUserFromDB(authUser: AuthUser) {
    const user = await userRepository.findById(authUser.id, {
      select: {
        id: true,
        name: true,
        username: true,
        profilePhoto: true,
        gender: true,
        status: true,
        createdAt: true,
        updatedAt: true,
        isActive: true,
      },
    });
    // Check user existence
    if (!user) throw new AppError(httpStatus.NOT_FOUND, 'User not found');
    return user;
  }

  async updateUserProfile(
    authUser: AuthUser,
    payload: UpdateUserProfilePayload,
  ) {
    return await userRepository.updateById(authUser.id, payload, {
      select: {
        id: true,
        name: true,
        profilePhoto: true,
        gender: true,
        status: true,
        createdAt: true,
        updatedAt: true,
        isActive: true,
      },
    });
  }

  async getVisibleUsersFromDB(
    authUser: AuthUser,
    filterQuery: UsersFilterQuery,
    paginationOptions: PaginationOptions,
  ) {
    return await userRepository.findVisibleUsers(
      authUser.id,
      filterQuery,
      calculatePagination(paginationOptions),
    );
  }
}

export default new UserService();
