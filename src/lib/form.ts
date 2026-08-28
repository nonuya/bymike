import * as z from "zod";

export const OTHER = "Other" as const;
export const GOALS = [
  "Sell (High-Impact Ads / Social Media Ads)",
  "Educate or Position (Brand Awareness / Tutorials)",
  "Retain audience (Content for social media)",
  OTHER,
] as const;
export const FORMATS = ["Vertical (9:16)", "Horizontal (16:9)", OTHER] as const;
export const VIDEO_LENGTHS = ["< 15 Sec", "15-30 Sec", "30-60 Sec"] as const;
export const BUDGET_RANGES = ["$400-$700", "$700-$1k", ">$1k"] as const;
export const PAYMENT_METHODS = ["PayPal", OTHER] as const;

export const formSchema = z
  .object({
    who: z
      .string({ error: "Please enter your name." })
      .trim()
      .min(1, "Please tell us your name."),

    goal: z.object({
      goal: z.array(z.enum(GOALS)),
      other: z
        .string({ error: "Please tell us your goal." })
        .trim()
        .optional(),
    })
      .refine((data) => data.goal.length > 0, {
        message: "Please select at least one goal for your video."
      })
      .refine((data) => !data.goal.includes(OTHER) || !!data.other, {
        message: "Please tell us what you'd like to achieve with this video.",
      }),

    projectDescription: z
      .string({ error: "Please describe your project." })
      .trim()
      .min(1, "Please tell us a little about your project.")
      .max(1000, "Please keep your project description under 1000 characters."),

    format: z.object({
      value: z.enum(
        FORMATS,
        { error: "Please choose a video format." },
      ),
      other: z
        .string()
        .trim()
        .optional(),
    })
      .refine(
        (data) =>
          data.value !== OTHER ||
          Boolean(data.other),
        {
          message: "Please describe the format you'd like to use.",
        },
      ),

    videoLength: z.object({
      value: z.enum(
        VIDEO_LENGTHS,
        { error: "Please choose an approximate video length." },
      ),
    }),

    resources: z
      .string({ error: "Please tell us what resources you can provide." })
      .trim()
      .min(1, "Please tell us what resources you can provide."),

    visualStyle: z
      .string({ error: "Please describe the visual style you're looking for." })
      .trim()
      .min(1, "Please describe the visual style you're looking for."),

    musicReferences: z
      .string({ error: "Please provide your music references." })
      .trim()
      .min(1, "Please provide at least one music reference."),

    mood: z
      .string()
      .trim()
      .optional(),

    budgetRange: z.object({
      value: z.enum(
        BUDGET_RANGES,
        { error: "Please choose a budget range." },
      ),
    }),

    paymentMethod: z.object({
      value: z.enum(
        PAYMENT_METHODS,
        { error: "Please choose a payment method." },
      ),
      other: z
        .string()
        .trim()
        .optional(),
    }).refine(
      (data) =>
        data.value !== OTHER ||
        Boolean(data.other),
      {
        message: "Please specify how you'd prefer to pay.",
      },
    ),

    extraNotes: z.string().trim().optional(),
    email: z.email({ error: "Please type a valid email" }).trim(),
  });

export type FormValues = z.infer<typeof formSchema>;
