import { createClient } from "@libsql/client/web";

export const turso = createClient({
  url: process.env.TURSO_DATABASE_URL || "",
  authToken: process.env.TURSO_DATABASE_AUTH_TOKEN || "",
  // 强制读取一致性，确保数据同步
  intMode: "number",
  // 超时设置
  // timeout: 30000,
});
