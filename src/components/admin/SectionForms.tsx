"use client";

import { useMemo } from "react";
import { Controller, useFieldArray, useForm, useWatch } from "react-hook-form";
import ImageUploadField from "@/components/admin/ImageUploadField";
import SectionSaveFooter from "@/components/admin/SectionSaveFooter";
import IconPicker from "./IconPicker";

type SectionRow = {
  id: string;
  type: string;
  order: number;
  data: Record<string, unknown>;
};

type SectionFormProps = {
  section: SectionRow;
  onSave: (data: Record<string, unknown>) => void;
  previewHref: string;
  saveMessage?: string | null;
  saveMessageTone?: "success" | "error";
};

function SectionHeading({ section }: { section: SectionRow }) {
  return (
    <h3>
      {section.type}{" "}
      <span className="admin-muted" style={{ fontWeight: 400 }}>
        (order {section.order}, id {section.id})
      </span>
    </h3>
  );
}

type IntroFormValues = {
  eyebrow: string;
  titleLines: string;
  description: string;
  highlightsLines: string;
  image: string;
};

function toIntroDefaultValues(data: Record<string, unknown>): IntroFormValues {
  return {
    eyebrow: (data.eyebrow as string) ?? "",
    titleLines: Array.isArray(data.title)
      ? (data.title as string[]).join("\n")
      : "",
    description: (data.description as string) ?? "",
    highlightsLines: Array.isArray(data.highlights)
      ? (data.highlights as string[]).join("\n")
      : "",
    image: (data.image as string) ?? "",
  };
}

export function IntroSectionForm({
  section,
  onSave,
  previewHref,
  saveMessage,
  saveMessageTone,
}: SectionFormProps) {
  const defaultValues = useMemo(
    () => toIntroDefaultValues(section.data),
    [section.data],
  );
  const {
    register,
    setValue,
    watch,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<IntroFormValues>({ defaultValues });
  const image = watch("image");

  function handleValid(values: IntroFormValues) {
    onSave({
      eyebrow: values.eyebrow,
      title: values.titleLines
        .split("\n")
        .map((line) => line.trim())
        .filter(Boolean),
      description: values.description,
      highlights: values.highlightsLines
        .split("\n")
        .map((line) => line.trim())
        .filter(Boolean),
      image: values.image,
    });
  }

  return (
    <form
      className="admin-form"
      onSubmit={handleSubmit(handleValid)}
      style={{
        marginBottom: 24,
        paddingBottom: 24,
        borderBottom: "1px solid #e2e8f0",
      }}
    >
      <SectionHeading section={section} />

      <label>
        Eyebrow
        <input {...register("eyebrow", { required: "Eyebrow is required" })} />
        {errors.eyebrow ? (
          <p className="admin-field-error">{errors.eyebrow.message}</p>
        ) : null}
      </label>

      <label>
        Title lines (one per line)
        <textarea
          rows={4}
          {...register("titleLines", { required: "Title is required" })}
        />
        {errors.titleLines ? (
          <p className="admin-field-error">{errors.titleLines.message}</p>
        ) : null}
      </label>

      <label>
        Description
        <textarea
          rows={4}
          {...register("description", { required: "Description is required" })}
        />
        {errors.description ? (
          <p className="admin-field-error">{errors.description.message}</p>
        ) : null}
      </label>

      <label>
        Highlights (one per line)
        <textarea
          rows={4}
          {...register("highlightsLines", {
            required: "At least one highlight is required",
          })}
        />
        {errors.highlightsLines ? (
          <p className="admin-field-error">{errors.highlightsLines.message}</p>
        ) : null}
      </label>

      <input
        type="hidden"
        {...register("image", { required: "Image path is required" })}
      />
      <ImageUploadField
        label="Image URL"
        value={image}
        onChange={(value) =>
          setValue("image", value, { shouldDirty: true, shouldValidate: true })
        }
        folder={`sections/${section.type}`}
      />
      {errors.image ? (
        <p className="admin-field-error">{errors.image.message}</p>
      ) : null}

      <SectionSaveFooter
        isSubmitting={isSubmitting}
        message={saveMessage}
        messageTone={saveMessageTone}
        previewHref={previewHref}
      />
    </form>
  );
}

type ServiceCardFormValue = {
  title: string;
  description: string;
  icon: string;
  iconImage: string;
};

type ServicesFormValues = {
  title: string;
  description: string;
  cards: ServiceCardFormValue[];
};

function toServicesDefaultValues(
  data: Record<string, unknown>,
): ServicesFormValues {
  const rawCards = Array.isArray(data.cards)
    ? (data.cards as Record<string, unknown>[])
    : [];

  return {
    title: (data.title as string) ?? "",
    description: (data.description as string) ?? "",
    cards:
      rawCards.length > 0
        ? rawCards.map((card) => ({
            title: (card.title as string) ?? "",
            description: (card.description as string) ?? "",
            icon: (card.icon as string) ?? "",
            iconImage: (card.iconImage as string) ?? "",
          }))
        : [{ title: "", description: "", icon: "", iconImage: "" }],
  };
}

export function ServicesSectionForm({
  section,
  onSave,
  previewHref,
  saveMessage,
  saveMessageTone,
}: SectionFormProps) {
  const defaultValues = useMemo(
    () => toServicesDefaultValues(section.data),
    [section.data],
  );
  const {
    register,
    control,
    setValue,
    watch,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ServicesFormValues>({ defaultValues });
  const { fields, append, remove } = useFieldArray({ control, name: "cards" });
  const cards = watch("cards");

  function handleValid(values: ServicesFormValues) {
    onSave({
      title: values.title,
      description: values.description,
      cards: values.cards.map((card) => ({
        title: card.title,
        description: card.description,
        icon: card.icon,
        iconImage: card.iconImage,
      })),
    });
  }

  return (
    <form
      className="admin-form"
      onSubmit={handleSubmit(handleValid)}
      style={{
        marginBottom: 24,
        paddingBottom: 24,
        borderBottom: "1px solid #e2e8f0",
      }}
    >
      <SectionHeading section={section} />

      <label>
        Title
        <input {...register("title", { required: "Title is required" })} />
        {errors.title ? (
          <p className="admin-field-error">{errors.title.message}</p>
        ) : null}
      </label>

      <label>
        Description
        <textarea
          rows={4}
          {...register("description", { required: "Description is required" })}
        />
        {errors.description ? (
          <p className="admin-field-error">{errors.description.message}</p>
        ) : null}
      </label>

      <div>
        <h4>Service cards</h4>
        {fields.map((field, index) => (
          <div
            key={field.id}
            style={{
              marginBottom: 16,
              padding: 16,
              border: "1px solid #e2e8f0",
              borderRadius: 12,
            }}
          >
            <label>
              Card title
              <input
                {...register(`cards.${index}.title`, {
                  required: "Card title is required",
                })}
              />
            </label>
            <label>
              Card description
              <textarea
                rows={3}
                {...register(`cards.${index}.description`, {
                  required: "Card description is required",
                })}
              />
            </label>
            <label>
              Icon name
              <input
                {...register(`cards.${index}.icon`, {
                  required: "Icon is required",
                })}
              />
            </label>
            <input type="hidden" {...register(`cards.${index}.iconImage`)} />
            <ImageUploadField
              label="Custom icon image URL"
              value={cards?.[index]?.iconImage ?? ""}
              onChange={(value) =>
                setValue(`cards.${index}.iconImage`, value, {
                  shouldDirty: true,
                  shouldValidate: true,
                })
              }
              folder={`sections/${section.type}/icons`}
              placeholder="/icons/service-card-icon.webp"
            />
            <p className="admin-muted" style={{ margin: 0 }}>
              Upload an icon image to override the icon name on the website.
            </p>
            <button
              type="button"
              onClick={() => remove(index)}
              disabled={fields.length === 1}
            >
              Remove card
            </button>
          </div>
        ))}
        <button
          type="button"
          className="admin-button-secondary"
          onClick={() =>
            append({ title: "", description: "", icon: "", iconImage: "" })
          }
        >
          Add card
        </button>
      </div>

      <SectionSaveFooter
        isSubmitting={isSubmitting}
        message={saveMessage}
        messageTone={saveMessageTone}
        previewHref={previewHref}
      />
    </form>
  );
}

type WhyChooseItemFormValue = {
  title: string;
  icon: string;
  description: string;
};

type WhyChooseFormValues = {
  title:string,
  subheading:string;
  items: WhyChooseItemFormValue[];
};

function toWhyChooseDefaultValues(
  data: Record<string, unknown>,
): WhyChooseFormValues {
  const rawItems = Array.isArray(data.items)
    ? (data.items as Record<string, unknown>[])
    : [];

  return {
    title:(data.title as string)?? "",
    subheading:(data.subheading as string) ?? "",
    items:
     rawItems.length>0
     ? rawItems.map((item)=>({
     icon: typeof item.icon === "string" ? item.icon : "",
      title:(item.title as string)??"",
      description:(item.description as string)?? "",
     })):[{icon:"",title:"",description:""}]
  }
}

export function WhyChooseSectionForm({
  section,
  onSave,
  previewHref,
  saveMessage,
  saveMessageTone,
}: SectionFormProps) {
  const defaultValues = useMemo(
    () => toWhyChooseDefaultValues(section.data),
    [section.data],
  );
  const {
    register,
    control,
    handleSubmit,
    formState: { isSubmitting },
  } = useForm<WhyChooseFormValues>({ defaultValues });
  const { fields, append, remove } = useFieldArray({ control, name: "items" });

  function handleValid(values: WhyChooseFormValues) {
    onSave({
      title: values.title,
      subheading: values.subheading,
      items: values.items,
    });
  }

  return (
    <form
      className="admin-form"
      onSubmit={handleSubmit(handleValid)}
      style={{
        marginBottom: 24,
        paddingBottom: 24,
        borderBottom: "1px solid #e2e8f0",
      }}
    >
      <SectionHeading section={section} />
      <label>
        Title
        <input {...register("title", { required: true })} />
      </label>
      <label>
        Subheading
        <input {...register("subheading")} />
      </label>

      <div>
        <h4>Items</h4>
        {fields.map((field, index) => (
          <div
            key={field.id}
            style={{
              marginBottom: 16,
              padding: 16,
              border: "1px solid #e2e8f0",
              borderRadius: 12,
            }}
          >
            <label>
              Icon
              <Controller 
              control={control}
              name={`items.${index}.icon`}
              defaultValue=""
              rules={{required:true}}
              render={({field})=>(
                <IconPicker
                  value={typeof field.value === "string" ? field.value : ""}
                  onChange={(val) => field.onChange(typeof val === "string" ? val : "")}
                />
              )}
              /> 
              
            </label>
            <label>
              Title
              <input  {...register(`items.${index}.title`, { required: true })}/>
            </label>
            {/* <label>
              Icon
              <input
                {...register(`items.${index}.icon`, { required: true })}
                placeholder="star / rocket /etch"
              />
            </label> */}
            {/* <label>
              Description
              <textarea rows={3} {...register(`items.${index}.description`, { required: true })} />
            </label> */}
            <button
              type="button"
              onClick={() => remove(index)}
              disabled={fields.length === 1}
            >
              Remove item
            </button>
          </div>
        ))}
        <button
          type="button"
          className="admin-button-secondary"
          onClick={() => append({ icon: "", title: "", description: "" })}
        >
          Add item
        </button>
      </div>

      <SectionSaveFooter
        isSubmitting={isSubmitting}
        message={saveMessage}
        messageTone={saveMessageTone}
        previewHref={previewHref}
      />
    </form>
  );
}

type InvestmentItemFormValue = {
  icon: string;
  title: string;
  description: string;
};

type InvestmentFormValues = {
  id: string;
  headingLines: string;
  items: InvestmentItemFormValue[];
  quoteText: string;
  quoteAuthor: string;
  quoteRole: string;
};

function toInvestmentDefaultValues(
  data: Record<string, unknown>,
): InvestmentFormValues {
  const rawItems = Array.isArray(data.items)
    ? (data.items as Record<string, unknown>[])
    : [];
  const legacyStats = Array.isArray(data.stats)
    ? (data.stats as Record<string, unknown>[])
    : [];
  const legacyDescription = (data.description as string) ?? "";

  const items =
    rawItems.length > 0
      ? rawItems.map((item) => ({
          icon: (item.icon as string) ?? "",
          title: (item.title as string) ?? "",
          description: (item.description as string) ?? "",
        }))
      : legacyStats.length > 0
        ? legacyStats.map((stat) => ({
            icon: "✓",
            title: (stat.label as string) ?? "",
            description: legacyDescription,
          }))
        : [
            { icon: "✓", title: "Global Expertise", description: "" },
            { icon: "✓", title: "Strategic Advisory", description: "" },
            { icon: "✓", title: "Risk Management", description: "" },
          ];

  const headingLines = Array.isArray(data.heading)
    ? (data.heading as string[])
    : typeof data.title === "string"
      ? [data.title]
      : [];

  return {
    id: (data.id as string) ?? "",
    headingLines: headingLines.join("\n"),
    items,
    quoteText: (data.quoteText as string) ?? "",
    quoteAuthor: (data.quoteAuthor as string) ?? "",
    quoteRole: (data.quoteRole as string) ?? "",
  };
}

export function InvestmentSectionForm({
  section,
  onSave,
  previewHref,
  saveMessage,
  saveMessageTone,
}: SectionFormProps) {
  const defaultValues = useMemo(
    () => toInvestmentDefaultValues(section.data),
    [section.data],
  );
  const {
    register,
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<InvestmentFormValues>({ defaultValues });
  const { fields, append, remove } = useFieldArray({ control, name: "items" });

  function handleValid(values: InvestmentFormValues) {
    const heading = values.headingLines
      .split("\n")
      .map((line) => line.trim())
      .filter(Boolean);

    onSave({
      id: values.id || undefined,
      heading,
      items: values.items.map((item) => ({
        icon: item.icon,
        title: item.title,
        description: item.description,
      })),
      quoteText: values.quoteText,
      quoteAuthor: values.quoteAuthor,
      quoteRole: values.quoteRole,
    });
  }

  return (
    <form
      className="admin-form"
      onSubmit={handleSubmit(handleValid)}
      style={{
        marginBottom: 24,
        paddingBottom: 24,
        borderBottom: "1px solid #e2e8f0",
      }}
    >
      <SectionHeading section={section} />

      <label>
        Section anchor id
        <input {...register("id")} placeholder="investment" />
      </label>

      <label>
        Heading lines (one per line)
        <textarea
          rows={3}
          {...register("headingLines", { required: "Heading is required" })}
        />
        {errors.headingLines ? (
          <p className="admin-field-error">{errors.headingLines.message}</p>
        ) : null}
      </label>

      <div>
        <h4>Feature items</h4>
        {fields.map((field, index) => (
          <div
            key={field.id}
            style={{
              marginBottom: 16,
              padding: 16,
              border: "1px solid #e2e8f0",
              borderRadius: 12,
            }}
          >
             <label>
              Icon
              <Controller 
              control={control}
              name={`items.${index}.icon`}
              defaultValue=""
              rules={{required:true}}
              render={({field})=>(
                <IconPicker
                  value={typeof field.value === "string" ? field.value : ""}
                  onChange={(val) => field.onChange(typeof val === "string" ? val : "")}
                />
              )}
              /> 
              
            </label>
            <label>
              Title
              <input
                {...register(`items.${index}.title`, { required: true })}
                placeholder="Global Expertise"
              />
            </label>
            <label>
              Description
              <textarea
                rows={3}
                {...register(`items.${index}.description`, { required: true })}
                placeholder="Navigating international markets with deep-rooted regulatory and cultural knowledge."
              />
            </label>
            <button
              type="button"
              onClick={() => remove(index)}
              disabled={fields.length === 1}
            >
              Remove stat
            </button>
          </div>
        ))}
        <button
          type="button"
          className="admin-button-secondary"
          onClick={() => append({ icon: "✓", title: "", description: "" })}
        >
          Add item
        </button>
      </div>

      <div>
        <h4>Quote card</h4>
        <label>
          Quote text
          <textarea
            rows={4}
            {...register("quoteText", { required: "Quote text is required" })}
          />
          {errors.quoteText ? (
            <p className="admin-field-error">{errors.quoteText.message}</p>
          ) : null}
        </label>
        <label>
          Quote author
          <input
            {...register("quoteAuthor", { required: "Quote author is required" })}
          />
          {errors.quoteAuthor ? (
            <p className="admin-field-error">{errors.quoteAuthor.message}</p>
          ) : null}
        </label>
        <label>
          Quote role
          <input
            {...register("quoteRole", { required: "Quote role is required" })}
          />
          {errors.quoteRole ? (
            <p className="admin-field-error">{errors.quoteRole.message}</p>
          ) : null}
        </label>
      </div>

      <SectionSaveFooter
        isSubmitting={isSubmitting}
        message={saveMessage}
        messageTone={saveMessageTone}
        previewHref={previewHref}
      />
    </form>
  );
}

type ClientLogosFormValues = {
  title: string;
  subtitle: string;
  actionLabel: string;
  actionHref: string;
};

function toClientLogosDefaultValues(
  data: Record<string, unknown>,
): ClientLogosFormValues {
  const action = ((data.action as Record<string, unknown>) ?? {}) as Record<
    string,
    unknown
  >;

  return {
    title:
      (data.title as string) ??
      ((data.heading as string) || "Ready to scale your vision?"),
    subtitle:
      (data.subtitle as string) ??
      "Connect with our strategic advisors for a confidential consultation.",
    actionLabel: (action.label as string) ?? "PARTNER WITH US",
    actionHref: (action.href as string) ?? "/contact",
  };
}

export function ClientLogosSectionForm({
  section,
  onSave,
  previewHref,
  saveMessage,
  saveMessageTone,
}: SectionFormProps) {
  const defaultValues = useMemo(
    () => toClientLogosDefaultValues(section.data),
    [section.data],
  );
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ClientLogosFormValues>({ defaultValues });

  function handleValid(values: ClientLogosFormValues) {
    onSave({
      title: values.title,
      subtitle: values.subtitle,
      action: {
        label: values.actionLabel,
        href: values.actionHref,
      },
    });
  }

  return (
    <form
      className="admin-form"
      onSubmit={handleSubmit(handleValid)}
      style={{
        marginBottom: 24,
        paddingBottom: 24,
        borderBottom: "1px solid #e2e8f0",
      }}
    >
      <SectionHeading section={section} />

      <label>
        Title
        <input
          {...register("title", { required: "Title is required" })}
          placeholder="Ready to scale your vision?"
        />
        {errors.title ? (
          <p className="admin-field-error">{errors.title.message}</p>
        ) : null}
      </label>

      <label>
        Subtitle
        <textarea
          rows={3}
          {...register("subtitle", { required: "Subtitle is required" })}
          placeholder="Connect with our strategic advisors for a confidential consultation."
        />
        {errors.subtitle ? (
          <p className="admin-field-error">{errors.subtitle.message}</p>
        ) : null}
      </label>

      <div>
        <h4>Action</h4>
        <label>
          Label
          <input
            {...register("actionLabel", {
              required: "Action label is required",
            })}
            placeholder="PARTNER WITH US"
          />
          {errors.actionLabel ? (
            <p className="admin-field-error">{errors.actionLabel.message}</p>
          ) : null}
        </label>
        <label>
          Href
          <input
            {...register("actionHref", { required: "Action href is required" })}
            placeholder="/contact"
          />
          {errors.actionHref ? (
            <p className="admin-field-error">{errors.actionHref.message}</p>
          ) : null}
        </label>
      </div>

      <SectionSaveFooter
        isSubmitting={isSubmitting}
        message={saveMessage}
        messageTone={saveMessageTone}
        previewHref={previewHref}
      />
    </form>
  );
}

type CtaFormValues = {
  title: string;
  description: string;
  actionLabel: string;
  actionHref: string;
};

function toCtaDefaultValues(data: Record<string, unknown>): CtaFormValues {
  const action = ((data.action as Record<string, unknown>) ?? {}) as Record<
    string,
    unknown
  >;

  return {
    title: (data.title as string) ?? "",
    description: (data.description as string) ?? "",
    actionLabel: (action.label as string) ?? "",
    actionHref: (action.href as string) ?? "",
  };
}

export function CtaSectionForm({
  section,
  onSave,
  previewHref,
  saveMessage,
  saveMessageTone,
}: SectionFormProps) {
  const defaultValues = useMemo(
    () => toCtaDefaultValues(section.data),
    [section.data],
  );
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<CtaFormValues>({ defaultValues });

  function handleValid(values: CtaFormValues) {
    onSave({
      title: values.title,
      description: values.description,
      action: {
        label: values.actionLabel,
        href: values.actionHref,
      },
    });
  }

  return (
    <form
      className="admin-form"
      onSubmit={handleSubmit(handleValid)}
      style={{
        marginBottom: 24,
        paddingBottom: 24,
        borderBottom: "1px solid #e2e8f0",
      }}
    >
      <SectionHeading section={section} />

      <label>
        Title
        <textarea
          rows={3}
          {...register("title", { required: "Title is required" })}
        />
        {errors.title ? (
          <p className="admin-field-error">{errors.title.message}</p>
        ) : null}
      </label>

      <label>
        Description
        <textarea
          rows={4}
          {...register("description", { required: "Description is required" })}
        />
        {errors.description ? (
          <p className="admin-field-error">{errors.description.message}</p>
        ) : null}
      </label>

      <div>
        <h4>Action</h4>
        <label>
          Label
          <input
            {...register("actionLabel", {
              required: "Action label is required",
            })}
          />
          {errors.actionLabel ? (
            <p className="admin-field-error">{errors.actionLabel.message}</p>
          ) : null}
        </label>
        <label>
          Href
          <input
            {...register("actionHref", { required: "Action href is required" })}
          />
          {errors.actionHref ? (
            <p className="admin-field-error">{errors.actionHref.message}</p>
          ) : null}
        </label>
      </div>

      <SectionSaveFooter
        isSubmitting={isSubmitting}
        message={saveMessage}
        messageTone={saveMessageTone}
        previewHref={previewHref}
      />
    </form>
  );
}

type ContactFormValues = {
  headline: string;
  subtext: string;
};

function toContactDefaultValues(
  data: Record<string, unknown>,
): ContactFormValues {
  return {
    headline: (data.headline as string) ?? "",
    subtext: (data.subtext as string) ?? "",
  };
}

export function ContactSectionForm({
  section,
  onSave,
  previewHref,
  saveMessage,
  saveMessageTone,
}: SectionFormProps) {
  const defaultValues = useMemo(
    () => toContactDefaultValues(section.data),
    [section.data],
  );
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ContactFormValues>({ defaultValues });

  function handleValid(values: ContactFormValues) {
    onSave({
      headline: values.headline,
      subtext: values.subtext,
    });
  }

  return (
    <form
      className="admin-form"
      onSubmit={handleSubmit(handleValid)}
      style={{
        marginBottom: 24,
        paddingBottom: 24,
        borderBottom: "1px solid #e2e8f0",
      }}
    >
      <SectionHeading section={section} />

      <label>
        Headline
        <input
          {...register("headline", { required: "Headline is required" })}
        />
        {errors.headline ? (
          <p className="admin-field-error">{errors.headline.message}</p>
        ) : null}
      </label>

      <label>
        Subtext
        <textarea
          rows={4}
          {...register("subtext", { required: "Subtext is required" })}
        />
        {errors.subtext ? (
          <p className="admin-field-error">{errors.subtext.message}</p>
        ) : null}
      </label>

      <SectionSaveFooter
        isSubmitting={isSubmitting}
        message={saveMessage}
        messageTone={saveMessageTone}
        previewHref={previewHref}
      />
    </form>
  );
}

type ContactHeroFormValues = {
  titleLines: string;
  description: string;
  stat: string;
  backgroundImage: string;
};

function toContactHeroDefaultValues(
  data: Record<string, unknown>,
): ContactHeroFormValues {
  return {
    titleLines: Array.isArray(data.title)
      ? (data.title as string[]).join("\n")
      : "",
    description: (data.description as string) ?? "",
    stat: (data.stat as string) ?? "",
    backgroundImage: (data.backgroundImage as string) ?? "",
  };
}

export function ContactHeroSectionForm({
  section,
  onSave,
  previewHref,
  saveMessage,
  saveMessageTone,
}: SectionFormProps) {
  const defaultValues = useMemo(
    () => toContactHeroDefaultValues(section.data),
    [section.data],
  );
  const {
    register,
    control,
    setValue,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ContactHeroFormValues>({ defaultValues });
  const backgroundImage = useWatch({ control, name: "backgroundImage" });

  function handleValid(values: ContactHeroFormValues) {
    onSave({
      title: values.titleLines
        .split("\n")
        .map((line) => line.trim())
        .filter(Boolean),
      description: values.description,
      stat: values.stat,
      backgroundImage: values.backgroundImage,
    });
  }

  return (
    <form
      className="admin-form"
      onSubmit={handleSubmit(handleValid)}
      style={{
        marginBottom: 24,
        paddingBottom: 24,
        borderBottom: "1px solid #e2e8f0",
      }}
    >
      <SectionHeading section={section} />

      <label>
        Title lines (one per line)
        <textarea
          rows={4}
          {...register("titleLines", { required: "Title is required" })}
        />
        {errors.titleLines ? (
          <p className="admin-field-error">{errors.titleLines.message}</p>
        ) : null}
      </label>

      <label>
        Description
        <textarea
          rows={4}
          {...register("description", { required: "Description is required" })}
        />
        {errors.description ? (
          <p className="admin-field-error">{errors.description.message}</p>
        ) : null}
      </label>

      <label>
        Supporting stat
        <input {...register("stat", { required: "Stat is required" })} />
        {errors.stat ? (
          <p className="admin-field-error">{errors.stat.message}</p>
        ) : null}
      </label>

      <input
        type="hidden"
        {...register("backgroundImage", {
          required: "Background image is required",
        })}
      />
      <ImageUploadField
        label="Background image URL"
        value={backgroundImage}
        onChange={(value) =>
          setValue("backgroundImage", value, {
            shouldDirty: true,
            shouldValidate: true,
          })
        }
        folder={`sections/${section.type}`}
      />
      {errors.backgroundImage ? (
        <p className="admin-field-error">{errors.backgroundImage.message}</p>
      ) : null}

      <SectionSaveFooter
        isSubmitting={isSubmitting}
        message={saveMessage}
        messageTone={saveMessageTone}
        previewHref={previewHref}
      />
    </form>
  );
}

type ContactOfficeItemFormValue = {
  title: string;
  linesText: string;
  icon: string;
};

type ContactInquiryFormValues = {
  formTitle: string;
  formDescription: string;
  submitLabel: string;
  inquiryOptionsText: string;
  officeHeading: string;
  officeItems: ContactOfficeItemFormValue[];
  mapImage: string;
  mapLabelTitle: string;
  mapLabelSubtitle: string;
};

function toContactInquiryDefaultValues(
  data: Record<string, unknown>,
): ContactInquiryFormValues {
  const rawItems = Array.isArray(data.officeItems)
    ? (data.officeItems as Record<string, unknown>[])
    : [];

  return {
    formTitle: (data.formTitle as string) ?? "",
    formDescription: (data.formDescription as string) ?? "",
    submitLabel: (data.submitLabel as string) ?? "",
    inquiryOptionsText: Array.isArray(data.inquiryOptions)
      ? (data.inquiryOptions as string[]).join("\n")
      : "",
    officeHeading: (data.officeHeading as string) ?? "",
    officeItems:
      rawItems.length > 0
        ? rawItems.map((item) => ({
            title: (item.title as string) ?? "",
            linesText: Array.isArray(item.lines)
              ? (item.lines as string[]).join("\n")
              : "",
            icon: (item.icon as string) ?? "",
          }))
        : [{ title: "", linesText: "", icon: "location" }],
    mapImage: (data.mapImage as string) ?? "",
    mapLabelTitle: (data.mapLabelTitle as string) ?? "",
    mapLabelSubtitle: (data.mapLabelSubtitle as string) ?? "",
  };
}

export function ContactInquirySectionForm({
  section,
  onSave,
  previewHref,
  saveMessage,
  saveMessageTone,
}: SectionFormProps) {
  const defaultValues = useMemo(
    () => toContactInquiryDefaultValues(section.data),
    [section.data],
  );
  const {
    register,
    control,
    setValue,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ContactInquiryFormValues>({ defaultValues });
  const { fields, append, remove } = useFieldArray({
    control,
    name: "officeItems",
  });
  const mapImage = useWatch({ control, name: "mapImage" });

  function handleValid(values: ContactInquiryFormValues) {
    onSave({
      formTitle: values.formTitle,
      formDescription: values.formDescription,
      submitLabel: values.submitLabel,
      inquiryOptions: values.inquiryOptionsText
        .split("\n")
        .map((line) => line.trim())
        .filter(Boolean),
      officeHeading: values.officeHeading,
      officeItems: values.officeItems.map((item) => ({
        title: item.title,
        lines: item.linesText
          .split("\n")
          .map((line) => line.trim())
          .filter(Boolean),
        icon: item.icon,
      })),
      mapImage: values.mapImage,
      mapLabelTitle: values.mapLabelTitle,
      mapLabelSubtitle: values.mapLabelSubtitle,
    });
  }

  return (
    <form
      className="admin-form"
      onSubmit={handleSubmit(handleValid)}
      style={{
        marginBottom: 24,
        paddingBottom: 24,
        borderBottom: "1px solid #e2e8f0",
      }}
    >
      <SectionHeading section={section} />

      <label>
        Form title
        <input
          {...register("formTitle", { required: "Form title is required" })}
        />
        {errors.formTitle ? (
          <p className="admin-field-error">{errors.formTitle.message}</p>
        ) : null}
      </label>

      <label>
        Form description
        <textarea
          rows={3}
          {...register("formDescription", {
            required: "Description is required",
          })}
        />
        {errors.formDescription ? (
          <p className="admin-field-error">{errors.formDescription.message}</p>
        ) : null}
      </label>

      <label>
        Submit label
        <input
          {...register("submitLabel", { required: "Submit label is required" })}
        />
        {errors.submitLabel ? (
          <p className="admin-field-error">{errors.submitLabel.message}</p>
        ) : null}
      </label>

      <label>
        Inquiry options (one per line)
        <textarea
          rows={5}
          {...register("inquiryOptionsText", {
            required: "At least one option is required",
          })}
        />
        {errors.inquiryOptionsText ? (
          <p className="admin-field-error">
            {errors.inquiryOptionsText.message}
          </p>
        ) : null}
      </label>

      <label>
        Office section heading
        <input
          {...register("officeHeading", { required: "Heading is required" })}
        />
        {errors.officeHeading ? (
          <p className="admin-field-error">{errors.officeHeading.message}</p>
        ) : null}
      </label>

      <div>
        <h4>Office details</h4>
        {fields.map((field, index) => (
          <div
            key={field.id}
            style={{
              marginBottom: 16,
              padding: 16,
              border: "1px solid #e2e8f0",
              borderRadius: 12,
            }}
          >
            <label>
              Title
              <input
                {...register(`officeItems.${index}.title`, { required: true })}
              />
            </label>
            <label>
              Lines (one per line)
              <textarea
                rows={4}
                {...register(`officeItems.${index}.linesText`, {
                  required: true,
                })}
              />
            </label>
            <label>
              Icon name
              <input
                {...register(`officeItems.${index}.icon`, { required: true })}
                placeholder="location"
              />
            </label>
            <button
              type="button"
              onClick={() => remove(index)}
              disabled={fields.length === 1}
            >
              Remove item
            </button>
          </div>
        ))}
        <button
          type="button"
          className="admin-button-secondary"
          onClick={() => append({ title: "", linesText: "", icon: "location" })}
        >
          Add office item
        </button>
      </div>

      <input
        type="hidden"
        {...register("mapImage", { required: "Map image is required" })}
      />
      <ImageUploadField
        label="Map image URL"
        value={mapImage}
        onChange={(value) =>
          setValue("mapImage", value, {
            shouldDirty: true,
            shouldValidate: true,
          })
        }
        folder={`sections/${section.type}`}
      />
      {errors.mapImage ? (
        <p className="admin-field-error">{errors.mapImage.message}</p>
      ) : null}

      <label>
        Map label title
        <input
          {...register("mapLabelTitle", {
            required: "Map label title is required",
          })}
        />
        {errors.mapLabelTitle ? (
          <p className="admin-field-error">{errors.mapLabelTitle.message}</p>
        ) : null}
      </label>

      <label>
        Map label subtitle
        <input
          {...register("mapLabelSubtitle", {
            required: "Map label subtitle is required",
          })}
        />
        {errors.mapLabelSubtitle ? (
          <p className="admin-field-error">{errors.mapLabelSubtitle.message}</p>
        ) : null}
      </label>

      <SectionSaveFooter
        isSubmitting={isSubmitting}
        message={saveMessage}
        messageTone={saveMessageTone}
        previewHref={previewHref}
      />
    </form>
  );
}

type AboutHeroFormValues = {
  title: string;
  description: string;
  backgroundImage: string;
};

function toAboutHeroDefaultValues(
  data: Record<string, unknown>,
): AboutHeroFormValues {
  return {
    title: (data.title as string) ?? "",
    description: (data.description as string) ?? "",
    backgroundImage: (data.backgroundImage as string) ?? "",
  };
}

export function AboutHeroSectionForm({
  section,
  onSave,
  previewHref,
  saveMessage,
  saveMessageTone,
}: SectionFormProps) {
  const defaultValues = useMemo(
    () => toAboutHeroDefaultValues(section.data),
    [section.data],
  );
  const {
    register,
    control,
    setValue,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<AboutHeroFormValues>({ defaultValues });
  const backgroundImage = useWatch({ control, name: "backgroundImage" });

  function handleValid(values: AboutHeroFormValues) {
    onSave({
      title: values.title,
      description: values.description,
      backgroundImage: values.backgroundImage,
    });
  }

  return (
    <form
      className="admin-form"
      onSubmit={handleSubmit(handleValid)}
      style={{
        marginBottom: 24,
        paddingBottom: 24,
        borderBottom: "1px solid #e2e8f0",
      }}
    >
      <SectionHeading section={section} />

      <label>
        Title
        <input {...register("title", { required: "Title is required" })} />
        {errors.title ? (
          <p className="admin-field-error">{errors.title.message}</p>
        ) : null}
      </label>

      <label>
        Description
        <textarea
          rows={4}
          {...register("description", { required: "Description is required" })}
        />
        {errors.description ? (
          <p className="admin-field-error">{errors.description.message}</p>
        ) : null}
      </label>

      <input
        type="hidden"
        {...register("backgroundImage", {
          required: "Background image is required",
        })}
      />
      <ImageUploadField
        label="Background image URL"
        value={backgroundImage}
        onChange={(value) =>
          setValue("backgroundImage", value, {
            shouldDirty: true,
            shouldValidate: true,
          })
        }
        folder={`sections/${section.type}`}
      />
      {errors.backgroundImage ? (
        <p className="admin-field-error">{errors.backgroundImage.message}</p>
      ) : null}

      <SectionSaveFooter
        isSubmitting={isSubmitting}
        message={saveMessage}
        messageTone={saveMessageTone}
        previewHref={previewHref}
      />
    </form>
  );
}

type AboutVisionMissionCardFormValue = {
  title: string;
  description: string;
  icon: string;
  iconImage: string;
  accentColor: string;
};

type AboutVisionMissionFormValues = {
  cards: AboutVisionMissionCardFormValue[];
};

function toAboutVisionMissionDefaultValues(
  data: Record<string, unknown>,
): AboutVisionMissionFormValues {
  const rawCards = Array.isArray(data.cards)
    ? (data.cards as Record<string, unknown>[])
    : [];

  return {
    cards:
      rawCards.length > 0
        ? rawCards.map((card) => ({
            title: (card.title as string) ?? "",
            description: (card.description as string) ?? "",
            icon: (card.icon as string) ?? "",
            iconImage: (card.iconImage as string) ?? "",
            accentColor: (card.accentColor as string) ?? "#0b3d91",
          }))
        : [
            {
              title: "",
              description: "",
              icon: "",
              iconImage: "",
              accentColor: "#0b3d91",
            },
          ],
  };
}

export function AboutVisionMissionSectionForm({
  section,
  onSave,
  previewHref,
  saveMessage,
  saveMessageTone,
}: SectionFormProps) {
  const defaultValues = useMemo(
    () => toAboutVisionMissionDefaultValues(section.data),
    [section.data],
  );
  const {
    register,
    control,
    setValue,
    handleSubmit,
    formState: { isSubmitting },
  } = useForm<AboutVisionMissionFormValues>({ defaultValues });
  const { fields, append, remove } = useFieldArray({ control, name: "cards" });
  const cards = useWatch({ control, name: "cards" });

  function handleValid(values: AboutVisionMissionFormValues) {
    onSave({
      cards: values.cards.map((card) => ({
        title: card.title,
        description: card.description,
        icon: card.icon || undefined,
        iconImage: card.iconImage || undefined,
        accentColor: card.accentColor,
      })),
    });
  }

  return (
    <form
      className="admin-form"
      onSubmit={handleSubmit(handleValid)}
      style={{
        marginBottom: 24,
        paddingBottom: 24,
        borderBottom: "1px solid #e2e8f0",
      }}
    >
      <SectionHeading section={section} />

      <div>
        <h4>Cards</h4>
        {fields.map((field, index) => (
          <div
            key={field.id}
            style={{
              marginBottom: 16,
              padding: 16,
              border: "1px solid #e2e8f0",
              borderRadius: 12,
            }}
          >
            <label>
              Title
              <input
                {...register(`cards.${index}.title`, { required: true })}
              />
            </label>
            <label>
              Description
              <textarea
                rows={4}
                {...register(`cards.${index}.description`, { required: true })}
              />
            </label>
            <label>
              Icon name
              <input
                {...register(`cards.${index}.icon`)}
                placeholder="vision"
              />
            </label>
            <input type="hidden" {...register(`cards.${index}.iconImage`)} />
            <ImageUploadField
              label="Custom icon image URL"
              value={cards?.[index]?.iconImage ?? ""}
              onChange={(value) =>
                setValue(`cards.${index}.iconImage`, value, {
                  shouldDirty: true,
                  shouldValidate: true,
                })
              }
              folder={`sections/${section.type}/icons`}
            />
            <label>
              Accent color
              <input
                {...register(`cards.${index}.accentColor`, { required: true })}
                placeholder="#0b3d91"
              />
            </label>
            <button
              type="button"
              onClick={() => remove(index)}
              disabled={fields.length === 1}
            >
              Remove card
            </button>
          </div>
        ))}
        <button
          type="button"
          className="admin-button-secondary"
          onClick={() =>
            append({
              title: "",
              description: "",
              icon: "",
              iconImage: "",
              accentColor: "#0b3d91",
            })
          }
        >
          Add card
        </button>
      </div>

      <SectionSaveFooter
        isSubmitting={isSubmitting}
        message={saveMessage}
        messageTone={saveMessageTone}
        previewHref={previewHref}
      />
    </form>
  );
}

type AboutAdvantageFormValues = {
  eyebrow: string;
  titleLines: string;
  description: string;
  pointsLines: string;
  image: string;
};

function toAboutAdvantageDefaultValues(
  data: Record<string, unknown>,
): AboutAdvantageFormValues {
  return {
    eyebrow: (data.eyebrow as string) ?? "",
    titleLines: Array.isArray(data.title)
      ? (data.title as string[]).join("\n")
      : "",
    description: (data.description as string) ?? "",
    pointsLines: Array.isArray(data.points)
      ? (data.points as string[]).join("\n")
      : "",
    image: (data.image as string) ?? "",
  };
}

export function AboutAdvantageSectionForm({
  section,
  onSave,
  previewHref,
  saveMessage,
  saveMessageTone,
}: SectionFormProps) {
  const defaultValues = useMemo(
    () => toAboutAdvantageDefaultValues(section.data),
    [section.data],
  );
  const {
    register,
    control,
    setValue,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<AboutAdvantageFormValues>({ defaultValues });
  const image = useWatch({ control, name: "image" });

  function handleValid(values: AboutAdvantageFormValues) {
    onSave({
      eyebrow: values.eyebrow,
      title: values.titleLines
        .split("\n")
        .map((line) => line.trim())
        .filter(Boolean),
      description: values.description,
      points: values.pointsLines
        .split("\n")
        .map((line) => line.trim())
        .filter(Boolean),
      image: values.image,
    });
  }

  return (
    <form
      className="admin-form"
      onSubmit={handleSubmit(handleValid)}
      style={{
        marginBottom: 24,
        paddingBottom: 24,
        borderBottom: "1px solid #e2e8f0",
      }}
    >
      <SectionHeading section={section} />

      <label>
        Eyebrow
        <input {...register("eyebrow", { required: "Eyebrow is required" })} />
        {errors.eyebrow ? (
          <p className="admin-field-error">{errors.eyebrow.message}</p>
        ) : null}
      </label>

      <label>
        Title lines (one per line)
        <textarea
          rows={4}
          {...register("titleLines", { required: "Title is required" })}
        />
        {errors.titleLines ? (
          <p className="admin-field-error">{errors.titleLines.message}</p>
        ) : null}
      </label>

      <label>
        Description
        <textarea
          rows={4}
          {...register("description", { required: "Description is required" })}
        />
        {errors.description ? (
          <p className="admin-field-error">{errors.description.message}</p>
        ) : null}
      </label>

      <label>
        Bullet points (one per line)
        <textarea
          rows={4}
          {...register("pointsLines", {
            required: "At least one point is required",
          })}
        />
        {errors.pointsLines ? (
          <p className="admin-field-error">{errors.pointsLines.message}</p>
        ) : null}
      </label>

      <input
        type="hidden"
        {...register("image", { required: "Image is required" })}
      />
      <ImageUploadField
        label="Image URL"
        value={image}
        onChange={(value) =>
          setValue("image", value, { shouldDirty: true, shouldValidate: true })
        }
        folder={`sections/${section.type}`}
      />
      {errors.image ? (
        <p className="admin-field-error">{errors.image.message}</p>
      ) : null}

      <SectionSaveFooter
        isSubmitting={isSubmitting}
        message={saveMessage}
        messageTone={saveMessageTone}
        previewHref={previewHref}
      />
    </form>
  );
}

type AboutValueItemFormValue = {
  title: string;
  description: string;
  icon: string;
  iconImage: string;
};

type AboutValuesFormValues = {
  title: string;
  items: AboutValueItemFormValue[];
};

function toAboutValuesDefaultValues(
  data: Record<string, unknown>,
): AboutValuesFormValues {
  const rawItems = Array.isArray(data.items)
    ? (data.items as Record<string, unknown>[])
    : [];

  return {
    title: (data.title as string) ?? "",
    items:
      rawItems.length > 0
        ? rawItems.map((item) => ({
            title: (item.title as string) ?? "",
            description: (item.description as string) ?? "",
            icon: (item.icon as string) ?? "",
            iconImage: (item.iconImage as string) ?? "",
          }))
        : [{ title: "", description: "", icon: "", iconImage: "" }],
  };
}

export function AboutValuesSectionForm({
  section,
  onSave,
  previewHref,
  saveMessage,
  saveMessageTone,
}: SectionFormProps) {
  const defaultValues = useMemo(
    () => toAboutValuesDefaultValues(section.data),
    [section.data],
  );
  const {
    register,
    control,
    setValue,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<AboutValuesFormValues>({ defaultValues });
  const { fields, append, remove } = useFieldArray({ control, name: "items" });
  const items = useWatch({ control, name: "items" });

  function handleValid(values: AboutValuesFormValues) {
    onSave({
      title: values.title,
      items: values.items.map((item) => ({
        title: item.title,
        description: item.description,
        icon: item.icon || undefined,
        iconImage: item.iconImage || undefined,
      })),
    });
  }

  return (
    <form
      className="admin-form"
      onSubmit={handleSubmit(handleValid)}
      style={{
        marginBottom: 24,
        paddingBottom: 24,
        borderBottom: "1px solid #e2e8f0",
      }}
    >
      <SectionHeading section={section} />

      <label>
        Title
        <input {...register("title", { required: "Title is required" })} />
        {errors.title ? (
          <p className="admin-field-error">{errors.title.message}</p>
        ) : null}
      </label>

      <div>
        <h4>Value cards</h4>
        {fields.map((field, index) => (
          <div
            key={field.id}
            style={{
              marginBottom: 16,
              padding: 16,
              border: "1px solid #e2e8f0",
              borderRadius: 12,
            }}
          >
            <label>
              Title
              <input
                {...register(`items.${index}.title`, { required: true })}
              />
            </label>
            <label>
              Description
              <textarea
                rows={3}
                {...register(`items.${index}.description`, { required: true })}
              />
            </label>
            <label>
              Icon name
              <input
                {...register(`items.${index}.icon`)}
                placeholder="professionalism"
              />
            </label>
            <input type="hidden" {...register(`items.${index}.iconImage`)} />
            <ImageUploadField
              label="Custom icon image URL"
              value={items?.[index]?.iconImage ?? ""}
              onChange={(value) =>
                setValue(`items.${index}.iconImage`, value, {
                  shouldDirty: true,
                  shouldValidate: true,
                })
              }
              folder={`sections/${section.type}/icons`}
            />
            <button
              type="button"
              onClick={() => remove(index)}
              disabled={fields.length === 1}
            >
              Remove value
            </button>
          </div>
        ))}
        <button
          type="button"
          className="admin-button-secondary"
          onClick={() =>
            append({ title: "", description: "", icon: "", iconImage: "" })
          }
        >
          Add value
        </button>
      </div>

      <SectionSaveFooter
        isSubmitting={isSubmitting}
        message={saveMessage}
        messageTone={saveMessageTone}
        previewHref={previewHref}
      />
    </form>
  );
}
