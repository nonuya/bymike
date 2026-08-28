export const onRequest: PagesFunction<Env> = async (context) => {
  const url = new URL(context.request.url);
  const token = url.searchParams.get("token");

  if (token !== context.env.ADMIN_TOKEN) {
    return new Response("Unauthorized", {
      status: 401,
    });
  }

  return context.next();
};
