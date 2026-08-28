import { formSchema } from '@/lib/form';
import { convert_form_data_to_email } from '@/lib/string';

export const onRequestGet: PagesFunction<Env> = async (context) => {
  const data = formSchema.safeParse(context.data);

  if (!data.success) {
    return Response.json({
      success: false,
      message: "Invalid input argument. Please fill the form correctly."
    });
  }

  const email_content = convert_form_data_to_email(data.data);

  return Response.json(email_content);
};
