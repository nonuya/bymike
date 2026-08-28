import { Field, FieldError, FieldGroup, FieldLabel, FieldLegend, FieldSeparator, FieldSet } from "./components/ui/field";
import { Input } from "./components/ui/input";
import { Checkbox } from "./components/ui/checkbox";
import { Section } from "./Section";
import { Controller, useForm, type FieldError as FormFieldError, type FieldPath, type FieldPathValue, type FieldValues, type UseFormReturn } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "./components/ui/button";
import { useRef, useState } from "react";
import { Progress } from "./components/ui/progress";
import { type FormValues, OTHER, GOALS, BUDGET_RANGES, FORMATS, PAYMENT_METHODS, VIDEO_LENGTHS, formSchema, convert_form_data_to_email } from "./lib/form";
import { Textarea } from "./components/ui/textarea";

type StringFormPathInternal<T extends FieldPath<FormValues>> = T extends any ? NonNullable<FieldPathValue<FormValues, T>> extends string ? T : never : never;
type StringFormPath = StringFormPathInternal<FieldPath<FormValues>>;

function FormInput({ form, name, title, required, placeholder, multiline }: {
  form: UseFormReturn<FormValues>,
  title?: string,
  placeholder: string,
  required?: boolean,
  name: StringFormPath,
  multiline?: boolean
}) {
  return (
    <Controller
      name={name}
      control={form.control}
      render={({ field, fieldState }) => (
        <Field data-invalid={fieldState.invalid}>
          {title && <FieldLabel htmlFor={`form-input-${field.name}`}>{title} {required && <span className="text-card-accent">*</span>}</FieldLabel>}

          {
            multiline ?
              <Textarea {...field} id={`form-input-${field.name}`} placeholder={placeholder} className="resize-y" /> :
              <Input {...field} id={`form-input-${field.name}`} placeholder={placeholder} />
          }

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
  [K in keyof TFormValues]-?: TFormValues[K] extends { value: infer V, other?: string } ? IsUnion<V> extends true ? K : never : never
}[keyof TFormValues]; // Es lo mismo que FormValues[K] -> Obtiene los Keys

function FormRadioGroup<Name extends EnumProps<FormValues>>({ form, items, name, title, other, placeholder }: {
  form: UseFormReturn<FormValues>,
  name: Name,
  title: string,
  items: readonly string[],
} & (`${Name}.other` extends FieldPath<FormValues> ? {
  other: `${Name}.other`,
  placeholder: string
} : {
  other?: never,
  placeholder?: never
})) {
  type GroupError = FormFieldError & {
    value?: FormFieldError,
    other?: FormFieldError
  };

  return (
    <Controller name={name} control={form.control} render={({ field, fieldState }) => {
      const error = fieldState.error as GroupError | undefined;

      return (
        <Field data-invalid={fieldState.invalid}>
          <FieldLabel>{title} <span className="text-card-accent">*</span></FieldLabel>
          <FieldGroup>
            <div className="flex gap-2">
              {items.map((item) => {
                const selected = field.value.value === item;

                return (
                  <button
                    key={`form-radio-${name}-${item}`}
                    type="button"
                    onClick={() => field.onChange({ ...field.value, value: item })}
                    className={
                      selected ? "form-project-radio border-card-border bg-card-accent" : "form-project-radio border-white/20"
                    }>
                    {item}
                  </button>
                )
              })}
            </div>

            {field.value.value === OTHER && other && <Controller
              name={other}
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <Input
                    {...field}
                    placeholder={placeholder}
                  />
                </Field>
              )}
            />
            }

            {fieldState.invalid && (
              <FieldError errors={[error, error?.value]} />
            )}
          </FieldGroup>
        </Field>
      )
    }} />
  );
}

function StepOne({ form, onNext }: {
  form: UseFormReturn<FormValues>,
  onNext: (isValid: boolean) => void,
}) {
  async function handleNext() {
    const valid = await form.trigger([
      "who"
    ]);

    onNext(valid);
  }

  return (
    <>
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
      <div className="mt-5 flex justify-center gap-5">
        <Button className="bg-card-border hover:bg-card-accent" onClick={handleNext} type="button">Next</Button>
      </div>
    </>
  );
}

function StepTwo({ form, who, onNext, onBack }: {
  form: UseFormReturn<FormValues>,
  who: string,
  onBack: () => void,
  onNext: (isValid: boolean) => void,
}) {
  async function handleNext() {
    const valid = await form.trigger([
      "goal",
      "projectDescription",
    ]);

    onNext(valid);
  }

  return (
    <>
      <FieldSet className="min-w-0">
        <FieldLegend>HI {who} :D! NICE TO MEET YOU</FieldLegend>
        <FieldSeparator />
        <Controller name="goal" control={form.control} render={({ field, fieldState }) => (
          <Field data-invalid={fieldState.invalid}>
            <FieldLabel>What is the goal of the video? <span className="text-card-accent">*</span></FieldLabel>
            <FieldGroup id="form-1-goal">
              {GOALS.map((goal, i, _) => (
                <Field
                  key={i}
                  orientation="horizontal"
                  className="
                    transition-colors
                    border
                    border-white/20
                    rounded
                    text-white
                    px-2
                    has-data-checked:border-card-border
                    has-data-checked:bg-card-accent">
                  <Checkbox id={`form-1-goal-checkbox-${i}`} name={field.name} checked={field.value.goal.includes(goal)} onCheckedChange={(checked) => {
                    const newGoal = checked ? [...field.value.goal, goal] : field.value.goal.filter((v) => v !== goal);
                    field.onChange({
                      ...field.value,
                      goal: newGoal
                    });
                    field.onBlur();
                  }}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        e.preventDefault();
                        e.currentTarget.click();
                      }
                    }}
                  />
                  <FieldLabel htmlFor={`form-1-goal-checkbox-${i}`} className="text-xs py-2">
                    {goal}
                  </FieldLabel>
                </Field>
              ))}

              {field.value.goal.includes("Other") && <FormInput form={form} name="goal.other" placeholder="Tell us about your specific goal..." />}

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
          multiline
          required
        />
      </FieldSet>
      <div className="mt-5 flex justify-center gap-5">
        <Button onClick={onBack} type="button">Back</Button>
        <Button className="bg-card-border hover:bg-card-accent" onClick={handleNext} type="button">Next</Button>
      </div>
    </>
  );
}

function StepThree({ form, onBack, onNext }: {
  form: UseFormReturn<FormValues>,
  onBack: () => void,
  onNext: (isValid: boolean) => void,
}) {
  async function handleNext() {
    const valid = await form.trigger([
      "format",
      "videoLength",
      "resources",
      "visualStyle",
      "musicReferences",
      "mood"
    ]);

    onNext(valid);
  }

  return (
    <>
      <FieldSet className="min-w-0">
        <FieldLegend>WOW THAT’S AN AMAZING IDEA</FieldLegend>
        <FieldSeparator />

        <FormRadioGroup
          form={form}
          name="format"
          title="Format"
          items={FORMATS}
          other="format.other"
          placeholder="e.g. Square (1:1)"
        />

        <FormRadioGroup form={form} name="videoLength" title="Approximate video length" items={VIDEO_LENGTHS} />

        <FormInput
          form={form}
          name="resources"
          title="What resources are you providing?"
          placeholder="e.g. Drive link, footage, branding, script, references..."
          multiline
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
          multiline
          required
        />
        <FormInput
          form={form}
          name="mood"
          title="Don't have any music references? What mood do you want to express?"
          placeholder="e.g. Energetic, calm, emotional, playful..."
        />
      </FieldSet >
      <div className="mt-5 flex justify-center gap-5">
        <Button onClick={onBack} type="button">Back</Button>
        <Button className="bg-card-border hover:bg-card-accent" onClick={handleNext} type="button">Next</Button>
      </div>
    </>
  );
}

function StepFour({ form, onBack, onNext }: {
  form: UseFormReturn<FormValues>,
  onBack: () => void,
  onNext: (isValid: boolean) => void,
}) {
  async function handleNext() {
    const valid = await form.trigger([
      "budgetRange",
      "paymentMethod",
    ]);

    onNext(valid);
  }

  return (
    <>
      <FieldSet>
        <FieldLegend>IT’S GONNA BE VIRAL DUDE</FieldLegend>
        <FieldSeparator />
        <FormRadioGroup form={form} name="budgetRange" items={BUDGET_RANGES} title="What is your budget range?" />
        <FormRadioGroup
          form={form}
          name="paymentMethod"
          items={PAYMENT_METHODS}
          title="What is your preferred payment method?"
          other="paymentMethod.other"
          placeholder="e.g. Bank transfer, Wise, Stripe..."
        />
      </FieldSet>
      <div className="mt-5 flex justify-center gap-5">
        <Button onClick={onBack} type="button">Back</Button>
        <Button className="bg-card-border hover:bg-card-accent" onClick={handleNext} type="button">Next</Button>
      </div>
    </>
  );
}

function StepFive({ form, onBack }: {
  form: UseFormReturn<FormValues>,
  onBack: () => void,
}) {
  return (
    <>
      <FieldSet className="min-w-0">
        <FieldLegend>FUH! THAT’S WAS TIRING</FieldLegend>
        <FieldSeparator />
        <FormInput form={form} name="email" title="Where can I contact you?" required placeholder="john.doe@example.com" />
        <FormInput
          form={form}
          name="extraNotes"
          title="Wanna say something more? I'm all ears"
          placeholder="Anything else you'd like us to know?"
          multiline
        />
      </FieldSet>
      <div className="mt-5 flex justify-center gap-5">
        <Button onClick={onBack} type="button">Back</Button>
        <Button className="bg-card-border hover:bg-card-accent" type="submit">Submit</Button>
      </div>
    </>
  );
}

function Form() {
  const [step, setStep] = useState(0);
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      who: "",
      goal: {
        goal: [],
        other: ""
      },
      format: {
        other: "",
      },
      mood: "",
      extraNotes: "",
      musicReferences: "",
      resources: "",
      visualStyle: "",
      email: "",
      paymentMethod: {
        other: "",
      },
      projectDescription: "",
      videoLength: {},
      budgetRange: {},
    }
  });
  const formRef = useRef<HTMLFormElement | null>(null);
  const who = form.watch("who");

  async function onSubmit(data: FormValues) {
    console.log(convert_form_data_to_email(data));
  }

  function focusForm() {
    requestAnimationFrame(() => {
      formRef.current?.scrollIntoView({
        behavior: "smooth",
        block: "nearest"
      });
    });
  }

  function onBack() {
    focusForm();
    setStep(step - 1);
  }

  function onNext(isValid: boolean) {
    if (!isValid) {
      return;
    }

    focusForm();
    setStep(step + 1);
  }

  return (
    <Section id="request-a-project" title="Get in Touch" subtitle="Ready to discuss your next project? Fill out the form below and we'll get back to you within 24 hours.">
      <form ref={formRef} className="border-2 border-card-border rounded rounded-[1rem] bg-card p-6 gap-4 flex flex-col w-full" onSubmit={form.handleSubmit(onSubmit)}>
        <Progress value={step * 100 / 4} />
        {step === 0 && <StepOne form={form} onNext={onNext} />}
        {step === 1 && <StepTwo who={who} form={form} onNext={onNext} onBack={onBack} />}
        {step === 2 && <StepThree form={form} onNext={onNext} onBack={onBack} />}
        {step === 3 && <StepFour form={form} onNext={onNext} onBack={onBack} />}
        {step === 4 && <StepFive form={form} onBack={onBack} />}
      </form>
    </Section>
  );
}

export {
  Form
};
