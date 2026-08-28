export const onRequestGet: PagesFunction<Env> = async (context) => {
  const email = await context.env.SETTINGS.get("email") ?? "";
  const available = await context.env.SETTINGS.get("available") ?? "no";

  return Response.json({
    success: true,
    email,
    available
  }, { status: 200 });
};
