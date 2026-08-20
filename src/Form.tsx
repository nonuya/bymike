import { Field, FieldError, FieldGroup, FieldLabel, FieldLegend, FieldSeparator, FieldSet } from "./components/ui/field";
import { Input } from "./components/ui/input";
import { Checkbox } from "./components/ui/checkbox";
import { Section } from "./Section";
import { Controller, useForm, type FieldValues, type UseFormReturn } from "react-hook-form";
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "./components/ui/button";

const OTHER = "Other" as const;
const GOALS = [
  "Sell (High-Impact Ads / Social Media Ads)",
  "Educate or Position (Brand Awareness / Tutorials)",
  "Retain audience (Content for social media)",
  OTHER,
] as const;
const FORMATS = ["Vertical (9:16)", "Horizontal (16:9)", OTHER] as const;
const VIDEO_LENGTHS = ["< 15 Sec", "15-30 Sec", "30-60 Sec"] as const;
const BUDGET_RANGES = ["$400-$700", "$700-$1k", ">$1k"] as const;
const PAYMENT_METHODS = ["PayPal", OTHER] as const;

const formSchema = z
  .object({
    who: z
      .string({ error: "Please enter your name." })
      .trim()
      .min(1, "Please tell us your name."),

    goal: z
      .array(z.enum(GOALS))
      .min(1, "Please select at least one goal for your video."),

    goalOther: z
      .string()
      .trim()
      .optional(),

    projectDescription: z
      .string({ error: "Please describe your project." })
      .trim()
      .min(1, "Please tell us a little about your project.")
      .max(1000, "Please keep your project description under 1000 characters."),

    format: z.enum(
      FORMATS,
      { error: "Please choose a video format." },
    ),

    formatOther: z
      .string()
      .trim()
      .optional(),

    videoLength: z.enum(
      VIDEO_LENGTHS,
      { error: "Please choose an approximate video length." },
    ),

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

    budgetRange: z.enum(
      BUDGET_RANGES,
      { error: "Please choose a budget range." },
    ),

    paymentMethod: z.enum(
      PAYMENT_METHODS,
      { error: "Please choose a payment method." },
    ),

    paymentMethodOther: z
      .string()
      .trim()
      .optional(),

    extraNotes: z.string().trim().optional(),
  })
  .refine(
    (data) =>
      !data.goal.includes("Other") ||
      Boolean(data.goalOther),
    {
      path: ["goalOther"],
      message: "Please tell us what you'd like to achieve with this video.",
    },
  )
  .refine(
    (data) =>
      data.format !== "Other" ||
      Boolean(data.formatOther),
    {
      path: ["formatOther"],
      message: "Please describe the format you'd like to use.",
    },
  )
  .refine(
    (data) =>
      data.paymentMethod !== "Other" ||
      Boolean(data.paymentMethodOther),
    {
      path: ["paymentMethodOther"],
      message: "Please specify how you'd prefer to pay.",
    },
  );
type FormValues = z.infer<typeof formSchema>;

function FormInput({ form, name, title, required, placeholder }: {
  form: UseFormReturn<FormValues>,
  title: string,
  placeholder: string,
  required?: boolean,
  name: {
    [K in keyof FormValues]: [string] extends [FormValues[K]] ? K : never
  }[keyof FormValues]
}) {
  return (
    <Controller
      name={name}
      control={form.control}
      render={({ field, fieldState }) => (
        <Field data-invalid={fieldState.invalid}>
          <FieldLabel>{title} {required && <span className="text-card-accent">*</span>}</FieldLabel>
          <Input {...field} placeholder={placeholder} />
          {fieldState.invalid && (
            <FieldError errors={[fieldState.error]} />
          )}
        </Field>
      )}>
    </Controller>
  );
}

type IsUnion<T, U = T> = T extends any ? [U] extends [T] ? false : true : never;
type EnumProps<TFormValues extends FieldValues> = {
  [K in keyof TFormValues]-?: IsUnion<TFormValues[K]> extends true ? K : never
}[keyof TFormValues]; // Es lo mismo que FormValues[K] -> Obtiene los Keys

type GetOtherName<K extends keyof FormValues, OtherK = `${K & string}Other`> = OtherK extends keyof FormValues ? OtherK : never;

function FormRadioGroup<Name extends EnumProps<FormValues>>({ form, items, name, title, other, otherPlaceholder }: {
  form: UseFormReturn<FormValues>,
  name: Name,
  title: string,
  items: readonly string[],
} & (
    GetOtherName<Name> extends never ?
    {
      other?: never,
      otherPlaceholder?: never
    } :
    {
      other: GetOtherName<Name>,
      otherPlaceholder: string,
    }
  )) {
  return (
    <Controller name={name} control={form.control} render={({ field, fieldState }) => (
      <Field data-invalid={fieldState.invalid}>
        <FieldLabel>{title} <span className="text-card-accent">*</span></FieldLabel>
        <FieldGroup>
          <div className="flex gap-2">
            {items.map((item) => {
              const selected = field.value === item;

              return (
                <button
                  key={`form-radio-${name}-${item}`}
                  type="button"
                  onClick={() => field.onChange(item)}
                  className={
                    selected ? "form-project-radio border-card-border bg-card-accent" : "form-project-radio border-white/20"
                  }>
                  {item}
                </button>
              )
            })}
          </div>

          {fieldState.invalid && (
            <FieldError errors={[fieldState.error]} />
          )}

          {field.value === OTHER && other && (
            <Controller
              name={other}
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <Input
                    {...field}
                    placeholder={otherPlaceholder}
                  />

                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />
          )}
        </FieldGroup>
      </Field>
    )} />
  );
}

function StepOne({ form }: {
  form: UseFormReturn<FormValues>
}) {
  return (
    <FieldSet>
      <FieldLegend>SO ... WHO ARE YOU?</FieldLegend>
      <FieldSeparator />
      <FieldGroup>
        <FormInput
          form={form}
          name="who"
          title="What do you like to be called?"
          placeholder="e.g. John Doe"
          required
        />
      </FieldGroup>
    </FieldSet>
  );
}

function StepTwo({ form, who }: {
  form: UseFormReturn<FormValues>,
  who: string,
}) {
  return (
    <FieldSet>
      <FieldLegend>HI {who} :D! NICE TO MEET YOU</FieldLegend>
      <FieldSeparator />
      <Controller name="goal" control={form.control} render={({ field, fieldState }) => (
        <Field data-invalid={fieldState.invalid}>
          <FieldLabel>What is the goal of the video? <span className="text-card-accent">*</span></FieldLabel>
          <FieldGroup>
            {GOALS.map((goal, i, _) => (
              <Field key={`form-1-goal-${i}`} orientation="horizontal" className="transition-colors border p-2 border-white/20 rounded has-data-checked:border-card-border has-data-checked:bg-card-accent">
                <Checkbox id={`form-1-goal-checkbox-${i}`} name={field.name} checked={field.value.includes(goal)} onCheckedChange={(checked) => {
                  const newValue = checked ? [...field.value, goal] : field.value.filter((v) => v !== goal);
                  field.onChange(newValue);
                  field.onBlur();
                }} />
                <FieldLabel htmlFor={`form-1-goal-checkbox-${i}`} className="text-xs">
                  {goal}
                </FieldLabel>

              </Field>
            ))}

            {field.value.includes("Other") && (
              <Controller
                name="goalOther"
                control={form.control}
                render={({ field: goalOtherField, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <Input
                      {...goalOtherField}
                      placeholder="Tell us about your specific goal..."
                    />

                    {fieldState.invalid && (
                      <FieldError errors={[fieldState.error]} />
                    )}
                  </Field>
                )}
              />
            )}

            {fieldState.invalid && (
              <FieldError errors={[fieldState.error]} />
            )}
          </FieldGroup>
        </Field>
      )} />
      <FormInput
        name="projectDescription"
        title="Briefly describe your project"
        form={form}
        placeholder="Tell us what you're creating and what you'd like to achieve..."
        required
      />
    </FieldSet>
  );
}

function StepThree({ form }: {
  form: UseFormReturn<FormValues>
}) {
  return (
    <FieldSet>
      <FieldLegend>WOW THAT’S AN AMAZING IDEA</FieldLegend>
      <FieldSeparator />
      <FormRadioGroup
        form={form}
        name="format"
        title="Format"
        items={FORMATS}
        other="formatOther"
        otherPlaceholder="e.g. Square (1:1)"
      />
      <FormRadioGroup form={form} name="videoLength" title="Approximate video length" items={VIDEO_LENGTHS} />
      <FormInput
        form={form}
        name="resources"
        title="What resources are you providing?"
        placeholder="e.g. Drive link, footage, branding, script, references..."
        required
      />
      <FormInput
        form={form}
        name="visualStyle"
        title="Desired visual style"
        placeholder="e.g. Minimal, cinematic, energetic, playful..."
        required
      />
      <FormInput
        form={form}
        name="musicReferences"
        title="Music references"
        placeholder="Paste links to songs, playlists, or references..."
        required
      />
      <FormInput
        form={form}
        name="mood"
        title="Don't have any music references? What mood do you want to express?"
        placeholder="e.g. Energetic, calm, emotional, playful..."
      />
    </FieldSet >
  );
}

function StepFour({ form }: {
  form: UseFormReturn<FormValues>
}) {
  return (
    <FieldSet>
      <FieldLegend>IT’S GONNA BE VIRAL DUDE</FieldLegend>
      <FieldSeparator />
      <FormRadioGroup form={form} name="budgetRange" items={BUDGET_RANGES} title="What is your budget range?" />
      <FormRadioGroup
        form={form}
        name="paymentMethod"
        items={PAYMENT_METHODS}
        title="What is your preferred payment method?"
        other="paymentMethodOther"
        otherPlaceholder="e.g. Bank transfer, Wise, Stripe..."
      />
    </FieldSet>
  );
}

function StepFive({ form }: {
  form: UseFormReturn<FormValues>
}) {
  return (
    <FieldSet>
      <FieldLegend>FUH! THAT’S WAS TIRING</FieldLegend>
      <FieldSeparator />
      <p>Aquí va a ir tu metodo de contacto</p>
      <FormInput
        form={form}
        name="extraNotes"
        title="Wanna say something more? I'm all ears"
        placeholder="Anything else you'd like us to know?"
      />
    </FieldSet>
  );
}

function Form() {
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      who: "",
      goal: [],
      goalOther: "",
      projectDescription: "",
      formatOther: "",
    }
  });

  const who = form.watch("who");

  function onSubmit(data: FormValues) {
    console.log(data);
  }

  return (
    <Section title="Get in Touch" subtitle="Ready to discuss your next project? Fill out the form below and we'll get back to you within 24 hours.">
      <form className="border-2 border-card-border rounded rounded-[1rem] bg-card p-6 gap-4 flex flex-col w-full" onSubmit={form.handleSubmit(onSubmit)}>
        <StepOne form={form} />
        <div className="mt-5">
          <Button className="form-project-button bg-card-border" type="submit">Submit</Button>
        </div>
      </form>
    </Section>
  );
}

export {
  Form
};
