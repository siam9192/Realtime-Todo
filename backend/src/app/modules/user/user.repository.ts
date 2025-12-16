import { Prisma } from '@prisma/client';
import { prisma } from '../../prisma';
import { UsersFilterQuery } from './user.interface';
import { FilterQuery, PaginationData } from '../../types';

class UserRepository {
  private userDefaultSelect = {
    id: true,
    name: true,
    profilePhoto: true,
    gender: true,
    email: true,
    createdAt: true,
    updatedAt: true,
  };

  private user = prisma.user;

  private buildUsersWhere(
    filterQuery: FilterQuery = {},
  ): Prisma.UserWhereInput {
    const { searchTerm, ...otherFilters } = filterQuery;

    const andConditions: Prisma.UserWhereInput[] = [];

    // Search
    if (searchTerm) {
      andConditions.push({
        OR: [
          {
            email: String(searchTerm),
          },
          {
            username: String(searchTerm),
          },
        ],
      });
    }

    // Keep only valid filter values
    const validOtherFilters = Object.fromEntries(
      Object.entries(otherFilters).filter(
        ([_, value]) => value !== undefined && value !== null && value,
      ),
    );

    if (Object.keys(validOtherFilters).length > 0) {
      andConditions.push(validOtherFilters);
    }

    return {
      ...(andConditions.length ? { AND: andConditions } : {}),
    };
  }

  async create(
    data: Prisma.UserCreateInput,
    options: { include?: Prisma.UserInclude; select?: Prisma.UserSelect } = {},
  ) {
    return await this.user.create({ data, ...options });
  }

  async updateById(
    id: string,
    data: Prisma.UserUpdateInput,
    options: { include?: Prisma.UserInclude; select?: Prisma.UserSelect } = {},
  ) {
    return await this.user.update({ where: { id }, data, ...options });
  }

  async isExistById(id: string) {
    const user = await this.user.findUnique({
      where: {
        id,
      },
      select: null,
    });
    return !!user;
  }

  async findById(
    id: string,
    options: { include?: Prisma.UserInclude; select?: Prisma.UserSelect } = {},
  ) {
    return this.user.findUnique({
      where: { id },
      ...options,
    });
  }

  async findVisibleUsers(
    currentUserId: string,
    filterQuery: UsersFilterQuery,
    paginationData: PaginationData,
  ) {
    const { page, limit, skip, sortBy, sortOrder } = paginationData;

    const whereConditions: Prisma.UserWhereInput = {
      id: {
        not: currentUserId,
      },
      ...this.buildUsersWhere(filterQuery),
    };

    const users = await this.user.findMany({
      where: whereConditions,
      orderBy: {
        [sortBy]: sortOrder,
      },
      take: limit,
      skip,
      select: this.userDefaultSelect,
    });

    const totalResults = this.user.count();

    const meta = {
      page,
      limit,
      totalResults,
    };

    return {
      data: users,
      meta,
    };
  }
}

export default new UserRepository();
