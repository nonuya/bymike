export const onRequestPost: PagesFunction<Env> = async (context) => {
  try {
    const data = await context.request.json<{
      email: string;
      available: "yes" | "no";
    }>();

    if (!data.email || !data.available) {
      return Response.json(
        {
          success: false,
          message: "Missing required fields.",
        },
        { status: 400 },
      );
    }

    if (data.available !== "yes" && data.available !== "no") {
      return Response.json(
        {
          success: false,
          message: "Invalid availability value.",
        },
        { status: 400 },
      );
    }

    await context.env.SETTINGS.put("email", data.email);
    await context.env.SETTINGS.put("available", data.available);

    return Response.json({
      success: true,
      message: "Settings saved successfully.",
    });
  } catch (error) {
    console.error(error);

    return Response.json(
      {
        success: false,
        message: "Failed to save settings.",
      },
      { status: 500 },
    );
  }
};
