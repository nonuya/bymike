import { type FormValues, OTHER } from "./form";

export function convert_form_data_to_email(data: FormValues): string {
  return `
Nombre: ${data.who}
Email: ${data.email}

Objetivos del video:
${data.goal.goal
  .map((x) => x === OTHER && data.goal.other ? data.goal.other : x)
  .map((v) => ` * ${v}`)
  .join("\n")}

Descripción del proyecto:
"${data.projectDescription}"

Formato: ${data.format.value === OTHER && data.format.other ? data.format.other : data.format.value}

Duración aproximada: ${data.videoLength.value}

Recursos disponibles:
"${data.resources}"

Estilo visual: ${data.visualStyle}

Referencias musicales:
"${data.musicReferences}"

Mood: ${data.mood || "No especificado"}

Presupuesto: ${data.budgetRange.value}

Método de pago: ${data.paymentMethod.value === OTHER && data.paymentMethod.other ? data.paymentMethod.other : data.paymentMethod.value}

Notas adicionales:
"${data.extraNotes || "Ninguna"}"
`;
}

function get_month_name(date: Date): string {
  return date.toLocaleString("en-US", {
    month: "long"
  });
}

export function get_status_message(is_available: boolean): string {
  function actual_month_date(): Date {
    return new Date();
  }

  function next_month_date(): Date {
    const date = actual_month_date();
    date.setMonth(date.getMonth() + 1);
    return date;
  }

  const month = get_month_name(actual_month_date());
  const next_month = get_month_name(next_month_date())

  return is_available ? `Slots available in ${month}` : `${month} is fully booked. You can book projects for ${next_month}`;
}
