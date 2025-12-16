import { Socket } from 'socket.io';
import jwt, { JwtPayload } from 'jsonwebtoken';
import cookie from 'cookie';
import AppError from '../lib/AppError';
import httpStatus from '../lib/http-status';
import jwtHelper from '../helpers/jwt.helper';
import envConfig from '../config/env.config';
import { AuthUser } from '../types';
import userRepository from '../modules/user/user.repository';

import { UserAccountStatus } from '@prisma/client';

export default function socketAuth() {
  return async (socket: Socket, next: (err?: Error) => void) => {
    try {
      const cookieHeader = socket.handshake.headers.cookie;

      if (!cookieHeader) {
        return next(
          new AppError(httpStatus.UNAUTHORIZED, 'Authentication required'),
        );
      }

      const cookies = cookie.parse(cookieHeader);
      const token = cookies.accessToken; // your cookie name

      if (!token) {
        return next(
          new AppError(httpStatus.UNAUTHORIZED, 'Invalid authentication token'),
        );
      }

      // checking if the given token is valid
      let decoded;

      try {
        decoded = jwtHelper.verifyToken(
          token,
          envConfig.jwt.access_token_secret as string,
        ) as AuthUser & JwtPayload;
      } catch (error) {
        throw new AppError(httpStatus.UNAUTHORIZED, 'Unauthorized');
      }

      // checking if the user is exist
      const user = await userRepository.findById(decoded.id);

      if (!user) {
        throw new AppError(httpStatus.NOT_FOUND, 'This user is not found !');
      }

      // checking if the user is already deleted
      // if (user.isDeleted) {
      //   throw new AppError(httpStatus.FORBIDDEN, "This user is deleted ! !");
      // }

      // checking if the user is blocked

      if (user.status === UserAccountStatus.Blocked) {
        throw new AppError(httpStatus.FORBIDDEN, 'This user is blocked ! !');
      }

      // Attach user info to socket
      socket.data.user = decoded as AuthUser;
      next();
    } catch (error) {
      next(
        new Error(
          JSON.stringify({
            statusCode: httpStatus.UNAUTHORIZED,
            message: 'Authentication failed',
          }),
        ),
      );
    }
  };
}
