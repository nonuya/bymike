export const onRequestGet: PagesFunction<Env> = async (context) => {
  const value = await context.env.SETTINGS.get("available");

  return new Response(value === "yes" ? "yes" : "no");
};
