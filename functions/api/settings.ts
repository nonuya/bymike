export const onRequestGet: PagesFunction<Env> = async (context) => {
  const url = new URL(context.request.url);
  const token = url.searchParams.get("token");

  const email = await context.env.SETTINGS.get("email");
  const available = await context.env.SETTINGS.get("available");

  if (!(email && available)) {
    return Response.json({
      success: false,
      message: "Failed to get settings. Contact with support."
    });
  }

  return Response.json({
    success: true,
    email,
    available
  });
};
