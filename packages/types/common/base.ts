/**
 * Base Types
 * Các types cơ bản được sử dụng chung
 */

/**
 * Base Entity Interface
 * Interface cơ bản cho tất cả entities
 */
export interface BaseEntity {
  id: string;
  createdAt: string;
  updatedAt: string;
}

/**
 * Base Entity với UUID
 * Cho entities sử dụng uniqueidentifier trong DB
 */
export interface BaseEntityUUID {
  id: string; // uniqueidentifier
  createdAt: string;
  updatedAt: string;
}

/**
 * Base Entity với Auto Increment ID
 * Cho entities sử dụng IDENTITY trong DB
 */
export interface BaseEntityAutoId {
  id: number; // bigint IDENTITY
  createdAt: string;
  updatedAt: string;
}

/**
 * Timestamp Interface
 * Chỉ có timestamp fields
 */
export interface TimestampFields {
  createdAt: string;
  updatedAt: string;
}

/**
 * Soft Delete Interface
 * Cho entities có thể soft delete
 */
export interface SoftDeleteFields extends TimestampFields {
  deletedAt?: string;
}

/**
 * Status Interface
 * Cho entities có status field
 */
export interface StatusField<T = string> {
  status: T;
}

/**
 * Optional Timestamp Interface
 * Timestamp có thể null
 */
export interface OptionalTimestampFields {
  createdAt?: string;
  updatedAt?: string;
}

/**
 * Pagination Interface
 */
export interface PaginationParams {
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: "ASC" | "DESC";
}

/**
 * Pagination Response
 */
export interface PaginationResponse<T> {
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

/**
 * ID Parameter
 */
export interface IdParam {
  id: string;
}

/**
 * Numeric ID Parameter
 */
export interface NumericIdParam {
  id: number;
}
