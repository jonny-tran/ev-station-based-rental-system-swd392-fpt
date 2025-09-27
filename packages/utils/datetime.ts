/**
 * Tiện ích xử lý thời gian và định dạng datetime
 */

/**
 * Chuyển đổi Date hoặc string thành chuỗi ISO 8601 chuẩn UTC
 * @param date - Date object hoặc string có thể parse thành Date
 * @returns Chuỗi ISO 8601 định dạng YYYY-MM-DDTHH:mm:ss.sssZ
 * @example
 * formatISO(new Date()) // "2024-01-15T10:30:45.123Z"
 * formatISO("2024-01-15T10:30:45") // "2024-01-15T10:30:45.000Z"
 */
export function formatISO(date: Date | string): string {
  const dateObj = typeof date === "string" ? new Date(date) : date;

  if (isNaN(dateObj.getTime())) {
    throw new Error("Invalid date provided");
  }

  return dateObj.toISOString();
}

/**
 * Chuyển đổi chuỗi ISO sang định dạng giờ local
 * @param date - Date object hoặc string ISO
 * @returns Chuỗi thời gian local định dạng YYYY-MM-DD HH:mm:ss
 * @example
 * toLocal("2024-01-15T10:30:45Z") // "2024-01-15 17:30:45" (nếu timezone +7)
 */
export function toLocal(date: Date | string): string {
  const dateObj = typeof date === "string" ? new Date(date) : date;

  if (isNaN(dateObj.getTime())) {
    throw new Error("Invalid date provided");
  }

  const year = dateObj.getFullYear();
  const month = String(dateObj.getMonth() + 1).padStart(2, "0");
  const day = String(dateObj.getDate()).padStart(2, "0");
  const hours = String(dateObj.getHours()).padStart(2, "0");
  const minutes = String(dateObj.getMinutes()).padStart(2, "0");
  const seconds = String(dateObj.getSeconds()).padStart(2, "0");

  return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
}

/**
 * Parse chuỗi ISO thành Date object
 * @param iso - Chuỗi ISO 8601
 * @returns Date object
 * @example
 * parseISO("2024-01-15T10:30:45Z") // Date object
 */
export function parseISO(iso: string): Date {
  const date = new Date(iso);

  if (isNaN(date.getTime())) {
    throw new Error("Invalid ISO string provided");
  }

  return date;
}

/**
 * Lấy thời gian hiện tại dạng ISO UTC
 * @returns Chuỗi ISO 8601 của thời gian hiện tại
 * @example
 * nowISO() // "2024-01-15T10:30:45.123Z"
 */
export function nowISO(): string {
  return new Date().toISOString();
}
