


export type TEnvironment = `${EEnvironment}`;

export enum EEnvironment {
  Development = "DEVELOPMENT",
  Production = "PRODUCTION",
}

export interface PaginationOptions {
  page?: string | number;
  limit?: number;
  sortBy?: string | undefined;
  sortOrder?: string;
}
