import "dotenv/config";
import { eq } from "drizzle-orm";
import { db } from "../src/db";
import { userProfile } from "../src/db/schema";

const userId = process.argv[2] ?? "kyD5y7dklBOQjcVaMsSsSygtltHAYrtM";
const rows = await db
  .select()
  .from(userProfile)
  .where(eq(userProfile.userId, userId));
console.log("Profils trouvés pour userId", userId, ":", JSON.stringify(rows, null, 2));
process.exit(0);
