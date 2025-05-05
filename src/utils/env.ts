import { z } from "zod";

const schema = z.object({
  REDIS_URI: z.string().url({ message: "Redis uri must be a valid url!" }),

  PORT: z
    .string()
    .default("3000")
    .transform((val) => parseInt(val, 10)),

  PAYLOAD_LIMIT: z.string().default("1mb"),

  NODE_ENV: z.enum(["development", "production"]).default("development"),

  DEBUG_MODE: z
    .string()
    .optional()
    .transform((val) => val === "true"),
});

const parsed = schema.safeParse(process.env);

if (!parsed.success) {
  console.error("Invalid environment variables:", parsed.error.format());
  process.exit(1);
}

export default parsed.data;
