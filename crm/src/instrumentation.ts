export async function register() {
  if (
    process.env.NEXT_RUNTIME === "nodejs" &&
    process.env.DATABASE_URL
  ) {
    const { ensureAppSchema } = await import("@/lib/schema");
    await ensureAppSchema();
  }
}
