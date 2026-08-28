export const onRequestGet: PagesFunction<Env> = async (context) => {
  const token = new URL(context.request.url).searchParams.get("token");

  if (!token || token !== context.env.ADMIN_TOKEN) {
    return Response.json(
      {
        success: false,
        message: "Invalid token.",
      },
      { status: 401 },
    );
  }

  const email = await context.env.SETTINGS.get("email") ?? "";
  const available = await context.env.SETTINGS.get("available") ?? "no";

  return Response.json({
    success: true,
    email,
    available
  }, {status: 200});
};
