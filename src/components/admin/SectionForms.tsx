"use client";

import { useMemo } from "react";
import { useFieldArray, useForm, useWatch } from "react-hook-form";
import ImageUploadField from "@/components/admin/ImageUploadField";
import SectionSaveFooter from "@/components/admin/SectionSaveFooter";

type SectionRow = { id: string; type: string; order: number; data: Record<string, unknown> };

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
    titleLines: Array.isArray(data.title) ? (data.title as string[]).join("\n") : "",
    description: (data.description as string) ?? "",
    highlightsLines: Array.isArray(data.highlights) ? (data.highlights as string[]).join("\n") : "",
    image: (data.image as string) ?? "",
  };
}

export function IntroSectionForm({ section, onSave, previewHref, saveMessage, saveMessageTone }: SectionFormProps) {
  const defaultValues = useMemo(() => toIntroDefaultValues(section.data), [section.data]);
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
      style={{ marginBottom: 24, paddingBottom: 24, borderBottom: "1px solid #e2e8f0" }}
    >
      <SectionHeading section={section} />

      <label>
        Eyebrow
        <input {...register("eyebrow", { required: "Eyebrow is required" })} />
        {errors.eyebrow ? <p className="admin-field-error">{errors.eyebrow.message}</p> : null}
      </label>

      <label>
        Title lines (one per line)
        <textarea rows={4} {...register("titleLines", { required: "Title is required" })} />
        {errors.titleLines ? (
          <p className="admin-field-error">{errors.titleLines.message}</p>
        ) : null}
      </label>

      <label>
        Description
        <textarea rows={4} {...register("description", { required: "Description is required" })} />
        {errors.description ? (
          <p className="admin-field-error">{errors.description.message}</p>
        ) : null}
      </label>

      <label>
        Highlights (one per line)
        <textarea
          rows={4}
          {...register("highlightsLines", { required: "At least one highlight is required" })}
        />
        {errors.highlightsLines ? (
          <p className="admin-field-error">{errors.highlightsLines.message}</p>
        ) : null}
      </label>

      <input type="hidden" {...register("image", { required: "Image path is required" })} />
      <ImageUploadField
        label="Image URL"
        value={image}
        onChange={(value) => setValue("image", value, { shouldDirty: true, shouldValidate: true })}
        folder={`sections/${section.type}`}
      />
      {errors.image ? <p className="admin-field-error">{errors.image.message}</p> : null}

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

function toServicesDefaultValues(data: Record<string, unknown>): ServicesFormValues {
  const rawCards = Array.isArray(data.cards) ? (data.cards as Record<string, unknown>[]) : [];

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
  const defaultValues = useMemo(() => toServicesDefaultValues(section.data), [section.data]);
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
      style={{ marginBottom: 24, paddingBottom: 24, borderBottom: "1px solid #e2e8f0" }}
    >
      <SectionHeading section={section} />

      <label>
        Title
        <input {...register("title", { required: "Title is required" })} />
        {errors.title ? <p className="admin-field-error">{errors.title.message}</p> : null}
      </label>

      <label>
        Description
        <textarea rows={4} {...register("description", { required: "Description is required" })} />
        {errors.description ? (
          <p className="admin-field-error">{errors.description.message}</p>
        ) : null}
      </label>

      <div>
        <h4>Service cards</h4>
        {fields.map((field, index) => (
          <div
            key={field.id}
            style={{ marginBottom: 16, padding: 16, border: "1px solid #e2e8f0", borderRadius: 12 }}
          >
            <label>
              Card title
              <input {...register(`cards.${index}.title`, { required: "Card title is required" })} />
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
              <input {...register(`cards.${index}.icon`, { required: "Icon is required" })} />
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
            <button type="button" onClick={() => remove(index)} disabled={fields.length === 1}>
              Remove card
            </button>
          </div>
        ))}
        <button
          type="button"
          className="admin-button-secondary"
          onClick={() => append({ title: "", description: "", icon: "", iconImage: "" })}
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
  index: string;
  title: string;
  description: string;
};

type WhyChooseFormValues = {
  items: WhyChooseItemFormValue[];
};

function toWhyChooseDefaultValues(data: Record<string, unknown>): WhyChooseFormValues {
  const rawItems = Array.isArray(data.items) ? (data.items as Record<string, unknown>[]) : [];

  return {
    items:
      rawItems.length > 0
        ? rawItems.map((item) => ({
            index: (item.index as string) ?? "",
            title: (item.title as string) ?? "",
            description: (item.description as string) ?? "",
          }))
        : [{ index: "", title: "", description: "" }],
  };
}

export function WhyChooseSectionForm({
  section,
  onSave,
  previewHref,
  saveMessage,
  saveMessageTone,
}: SectionFormProps) {
  const defaultValues = useMemo(() => toWhyChooseDefaultValues(section.data), [section.data]);
  const {
    register,
    control,
    handleSubmit,
    formState: { isSubmitting },
  } = useForm<WhyChooseFormValues>({ defaultValues });
  const { fields, append, remove } = useFieldArray({ control, name: "items" });

  function handleValid(values: WhyChooseFormValues) {
    onSave({
      items: values.items.map((item) => ({
        index: item.index,
        title: item.title,
        description: item.description,
      })),
    });
  }

  return (
    <form
      className="admin-form"
      onSubmit={handleSubmit(handleValid)}
      style={{ marginBottom: 24, paddingBottom: 24, borderBottom: "1px solid #e2e8f0" }}
    >
      <SectionHeading section={section} />

      <div>
        <h4>Items</h4>
        {fields.map((field, index) => (
          <div
            key={field.id}
            style={{ marginBottom: 16, padding: 16, border: "1px solid #e2e8f0", borderRadius: 12 }}
          >
            <label>
              Index
              <input {...register(`items.${index}.index`, { required: true })} placeholder="01" />
            </label>
            <label>
              Title
              <input {...register(`items.${index}.title`, { required: true })} />
            </label>
            <label>
              Description
              <textarea rows={3} {...register(`items.${index}.description`, { required: true })} />
            </label>
            <button type="button" onClick={() => remove(index)} disabled={fields.length === 1}>
              Remove item
            </button>
          </div>
        ))}
        <button
          type="button"
          className="admin-button-secondary"
          onClick={() => append({ index: "", title: "", description: "" })}
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

type InvestmentStatFormValue = {
  value: string;
  label: string;
};

type InvestmentFormValues = {
  id: string;
  title: string;
  description: string;
  stats: InvestmentStatFormValue[];
  chartTitle: string;
  chartDelta: string;
  chartLabels: string;
  chartValues: string;
};

function toInvestmentDefaultValues(data: Record<string, unknown>): InvestmentFormValues {
  const rawStats = Array.isArray(data.stats) ? (data.stats as Record<string, unknown>[]) : [];
  const rawChart = ((data.chart as Record<string, unknown>) ?? {}) as Record<string, unknown>;
  const labels = Array.isArray(rawChart.labels) ? (rawChart.labels as string[]) : [];
  const values = Array.isArray(rawChart.values) ? (rawChart.values as number[]) : [];

  return {
    id: (data.id as string) ?? "",
    title: (data.title as string) ?? "",
    description: (data.description as string) ?? "",
    stats:
      rawStats.length > 0
        ? rawStats.map((stat) => ({
            value: (stat.value as string) ?? "",
            label: (stat.label as string) ?? "",
          }))
        : [{ value: "", label: "" }],
    chartTitle: (rawChart.title as string) ?? "",
    chartDelta: (rawChart.delta as string) ?? "",
    chartLabels: labels.join("\n"),
    chartValues: values.map(String).join("\n"),
  };
}

export function InvestmentSectionForm({
  section,
  onSave,
  previewHref,
  saveMessage,
  saveMessageTone,
}: SectionFormProps) {
  const defaultValues = useMemo(() => toInvestmentDefaultValues(section.data), [section.data]);
  const {
    register,
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<InvestmentFormValues>({ defaultValues });
  const { fields, append, remove } = useFieldArray({ control, name: "stats" });

  function handleValid(values: InvestmentFormValues) {
    const chartLabels = values.chartLabels
      .split("\n")
      .map((line) => line.trim())
      .filter(Boolean);
    const chartValues = values.chartValues
      .split("\n")
      .map((line) => Number(line.trim()))
      .filter((value) => !Number.isNaN(value));

    onSave({
      id: values.id || undefined,
      title: values.title,
      description: values.description,
      stats: values.stats.map((stat) => ({
        value: stat.value,
        label: stat.label,
      })),
      chart: {
        title: values.chartTitle,
        delta: values.chartDelta,
        labels: chartLabels,
        values: chartValues,
      },
    });
  }

  return (
    <form
      className="admin-form"
      onSubmit={handleSubmit(handleValid)}
      style={{ marginBottom: 24, paddingBottom: 24, borderBottom: "1px solid #e2e8f0" }}
    >
      <SectionHeading section={section} />

      <label>
        Section anchor id
        <input {...register("id")} placeholder="investment" />
      </label>

      <label>
        Title
        <input {...register("title", { required: "Title is required" })} />
        {errors.title ? <p className="admin-field-error">{errors.title.message}</p> : null}
      </label>

      <label>
        Description
        <textarea rows={4} {...register("description", { required: "Description is required" })} />
        {errors.description ? (
          <p className="admin-field-error">{errors.description.message}</p>
        ) : null}
      </label>

      <div>
        <h4>Stats</h4>
        {fields.map((field, index) => (
          <div
            key={field.id}
            style={{ marginBottom: 16, padding: 16, border: "1px solid #e2e8f0", borderRadius: 12 }}
          >
            <label>
              Value
              <input {...register(`stats.${index}.value`, { required: true })} placeholder="$500M+" />
            </label>
            <label>
              Label
              <input {...register(`stats.${index}.label`, { required: true })} placeholder="Assets Under Advisory" />
            </label>
            <button type="button" onClick={() => remove(index)} disabled={fields.length === 1}>
              Remove stat
            </button>
          </div>
        ))}
        <button
          type="button"
          className="admin-button-secondary"
          onClick={() => append({ value: "", label: "" })}
        >
          Add stat
        </button>
      </div>

      <div>
        <h4>Chart</h4>
        <label>
          Chart title
          <input {...register("chartTitle", { required: "Chart title is required" })} />
          {errors.chartTitle ? <p className="admin-field-error">{errors.chartTitle.message}</p> : null}
        </label>
        <label>
          Delta
          <input {...register("chartDelta", { required: "Chart delta is required" })} />
          {errors.chartDelta ? <p className="admin-field-error">{errors.chartDelta.message}</p> : null}
        </label>
        <label>
          Chart labels (one per line)
          <textarea rows={4} {...register("chartLabels", { required: "Chart labels are required" })} />
          {errors.chartLabels ? (
            <p className="admin-field-error">{errors.chartLabels.message}</p>
          ) : null}
        </label>
        <label>
          Chart values (one number per line)
          <textarea rows={4} {...register("chartValues", { required: "Chart values are required" })} />
          {errors.chartValues ? (
            <p className="admin-field-error">{errors.chartValues.message}</p>
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
  heading: string;
  logosLines: string;
};

function toClientLogosDefaultValues(data: Record<string, unknown>): ClientLogosFormValues {
  return {
    heading: (data.heading as string) ?? "",
    logosLines: Array.isArray(data.logos) ? (data.logos as string[]).join("\n") : "",
  };
}

export function ClientLogosSectionForm({
  section,
  onSave,
  previewHref,
  saveMessage,
  saveMessageTone,
}: SectionFormProps) {
  const defaultValues = useMemo(() => toClientLogosDefaultValues(section.data), [section.data]);
  const {
    register,
    handleSubmit,
    formState: { isSubmitting },
  } = useForm<ClientLogosFormValues>({ defaultValues });

  function handleValid(values: ClientLogosFormValues) {
    onSave({
      heading: values.heading || undefined,
      logos: values.logosLines
        .split("\n")
        .map((line) => line.trim())
        .filter(Boolean),
    });
  }

  return (
    <form
      className="admin-form"
      onSubmit={handleSubmit(handleValid)}
      style={{ marginBottom: 24, paddingBottom: 24, borderBottom: "1px solid #e2e8f0" }}
    >
      <SectionHeading section={section} />

      <label>
        Heading
        <input {...register("heading")} placeholder="Trusted partners" />
      </label>

      <label>
        Logos (one per line)
        <textarea rows={5} {...register("logosLines", { required: true })} />
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

type CtaFormValues = {
  title: string;
  description: string;
  actionLabel: string;
  actionHref: string;
};

function toCtaDefaultValues(data: Record<string, unknown>): CtaFormValues {
  const action = ((data.action as Record<string, unknown>) ?? {}) as Record<string, unknown>;

  return {
    title: (data.title as string) ?? "",
    description: (data.description as string) ?? "",
    actionLabel: (action.label as string) ?? "",
    actionHref: (action.href as string) ?? "",
  };
}

export function CtaSectionForm({ section, onSave, previewHref, saveMessage, saveMessageTone }: SectionFormProps) {
  const defaultValues = useMemo(() => toCtaDefaultValues(section.data), [section.data]);
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
      style={{ marginBottom: 24, paddingBottom: 24, borderBottom: "1px solid #e2e8f0" }}
    >
      <SectionHeading section={section} />

      <label>
        Title
        <textarea rows={3} {...register("title", { required: "Title is required" })} />
        {errors.title ? <p className="admin-field-error">{errors.title.message}</p> : null}
      </label>

      <label>
        Description
        <textarea rows={4} {...register("description", { required: "Description is required" })} />
        {errors.description ? (
          <p className="admin-field-error">{errors.description.message}</p>
        ) : null}
      </label>

      <div>
        <h4>Action</h4>
        <label>
          Label
          <input {...register("actionLabel", { required: "Action label is required" })} />
          {errors.actionLabel ? (
            <p className="admin-field-error">{errors.actionLabel.message}</p>
          ) : null}
        </label>
        <label>
          Href
          <input {...register("actionHref", { required: "Action href is required" })} />
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

function toContactDefaultValues(data: Record<string, unknown>): ContactFormValues {
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
  const defaultValues = useMemo(() => toContactDefaultValues(section.data), [section.data]);
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
      style={{ marginBottom: 24, paddingBottom: 24, borderBottom: "1px solid #e2e8f0" }}
    >
      <SectionHeading section={section} />

      <label>
        Headline
        <input {...register("headline", { required: "Headline is required" })} />
        {errors.headline ? <p className="admin-field-error">{errors.headline.message}</p> : null}
      </label>

      <label>
        Subtext
        <textarea rows={4} {...register("subtext", { required: "Subtext is required" })} />
        {errors.subtext ? <p className="admin-field-error">{errors.subtext.message}</p> : null}
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

function toContactHeroDefaultValues(data: Record<string, unknown>): ContactHeroFormValues {
  return {
    titleLines: Array.isArray(data.title) ? (data.title as string[]).join("\n") : "",
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
  const defaultValues = useMemo(() => toContactHeroDefaultValues(section.data), [section.data]);
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
      style={{ marginBottom: 24, paddingBottom: 24, borderBottom: "1px solid #e2e8f0" }}
    >
      <SectionHeading section={section} />

      <label>
        Title lines (one per line)
        <textarea rows={4} {...register("titleLines", { required: "Title is required" })} />
        {errors.titleLines ? <p className="admin-field-error">{errors.titleLines.message}</p> : null}
      </label>

      <label>
        Description
        <textarea rows={4} {...register("description", { required: "Description is required" })} />
        {errors.description ? <p className="admin-field-error">{errors.description.message}</p> : null}
      </label>

      <label>
        Supporting stat
        <input {...register("stat", { required: "Stat is required" })} />
        {errors.stat ? <p className="admin-field-error">{errors.stat.message}</p> : null}
      </label>

      <input
        type="hidden"
        {...register("backgroundImage", { required: "Background image is required" })}
      />
      <ImageUploadField
        label="Background image URL"
        value={backgroundImage}
        onChange={(value) =>
          setValue("backgroundImage", value, { shouldDirty: true, shouldValidate: true })
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

function toContactInquiryDefaultValues(data: Record<string, unknown>): ContactInquiryFormValues {
  const rawItems = Array.isArray(data.officeItems) ? (data.officeItems as Record<string, unknown>[]) : [];

  return {
    formTitle: (data.formTitle as string) ?? "",
    formDescription: (data.formDescription as string) ?? "",
    submitLabel: (data.submitLabel as string) ?? "",
    inquiryOptionsText: Array.isArray(data.inquiryOptions) ? (data.inquiryOptions as string[]).join("\n") : "",
    officeHeading: (data.officeHeading as string) ?? "",
    officeItems:
      rawItems.length > 0
        ? rawItems.map((item) => ({
            title: (item.title as string) ?? "",
            linesText: Array.isArray(item.lines) ? (item.lines as string[]).join("\n") : "",
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
  const defaultValues = useMemo(() => toContactInquiryDefaultValues(section.data), [section.data]);
  const {
    register,
    control,
    setValue,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ContactInquiryFormValues>({ defaultValues });
  const { fields, append, remove } = useFieldArray({ control, name: "officeItems" });
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
      style={{ marginBottom: 24, paddingBottom: 24, borderBottom: "1px solid #e2e8f0" }}
    >
      <SectionHeading section={section} />

      <label>
        Form title
        <input {...register("formTitle", { required: "Form title is required" })} />
        {errors.formTitle ? <p className="admin-field-error">{errors.formTitle.message}</p> : null}
      </label>

      <label>
        Form description
        <textarea rows={3} {...register("formDescription", { required: "Description is required" })} />
        {errors.formDescription ? <p className="admin-field-error">{errors.formDescription.message}</p> : null}
      </label>

      <label>
        Submit label
        <input {...register("submitLabel", { required: "Submit label is required" })} />
        {errors.submitLabel ? <p className="admin-field-error">{errors.submitLabel.message}</p> : null}
      </label>

      <label>
        Inquiry options (one per line)
        <textarea rows={5} {...register("inquiryOptionsText", { required: "At least one option is required" })} />
        {errors.inquiryOptionsText ? (
          <p className="admin-field-error">{errors.inquiryOptionsText.message}</p>
        ) : null}
      </label>

      <label>
        Office section heading
        <input {...register("officeHeading", { required: "Heading is required" })} />
        {errors.officeHeading ? <p className="admin-field-error">{errors.officeHeading.message}</p> : null}
      </label>

      <div>
        <h4>Office details</h4>
        {fields.map((field, index) => (
          <div
            key={field.id}
            style={{ marginBottom: 16, padding: 16, border: "1px solid #e2e8f0", borderRadius: 12 }}
          >
            <label>
              Title
              <input {...register(`officeItems.${index}.title`, { required: true })} />
            </label>
            <label>
              Lines (one per line)
              <textarea rows={4} {...register(`officeItems.${index}.linesText`, { required: true })} />
            </label>
            <label>
              Icon name
              <input {...register(`officeItems.${index}.icon`, { required: true })} placeholder="location" />
            </label>
            <button type="button" onClick={() => remove(index)} disabled={fields.length === 1}>
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

      <input type="hidden" {...register("mapImage", { required: "Map image is required" })} />
      <ImageUploadField
        label="Map image URL"
        value={mapImage}
        onChange={(value) => setValue("mapImage", value, { shouldDirty: true, shouldValidate: true })}
        folder={`sections/${section.type}`}
      />
      {errors.mapImage ? <p className="admin-field-error">{errors.mapImage.message}</p> : null}

      <label>
        Map label title
        <input {...register("mapLabelTitle", { required: "Map label title is required" })} />
        {errors.mapLabelTitle ? <p className="admin-field-error">{errors.mapLabelTitle.message}</p> : null}
      </label>

      <label>
        Map label subtitle
        <input {...register("mapLabelSubtitle", { required: "Map label subtitle is required" })} />
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

function toAboutHeroDefaultValues(data: Record<string, unknown>): AboutHeroFormValues {
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
  const defaultValues = useMemo(() => toAboutHeroDefaultValues(section.data), [section.data]);
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
      style={{ marginBottom: 24, paddingBottom: 24, borderBottom: "1px solid #e2e8f0" }}
    >
      <SectionHeading section={section} />

      <label>
        Title
        <input {...register("title", { required: "Title is required" })} />
        {errors.title ? <p className="admin-field-error">{errors.title.message}</p> : null}
      </label>

      <label>
        Description
        <textarea rows={4} {...register("description", { required: "Description is required" })} />
        {errors.description ? <p className="admin-field-error">{errors.description.message}</p> : null}
      </label>

      <input
        type="hidden"
        {...register("backgroundImage", { required: "Background image is required" })}
      />
      <ImageUploadField
        label="Background image URL"
        value={backgroundImage}
        onChange={(value) =>
          setValue("backgroundImage", value, { shouldDirty: true, shouldValidate: true })
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
  const rawCards = Array.isArray(data.cards) ? (data.cards as Record<string, unknown>[]) : [];

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
        : [{ title: "", description: "", icon: "", iconImage: "", accentColor: "#0b3d91" }],
  };
}

export function AboutVisionMissionSectionForm({
  section,
  onSave,
  previewHref,
  saveMessage,
  saveMessageTone,
}: SectionFormProps) {
  const defaultValues = useMemo(() => toAboutVisionMissionDefaultValues(section.data), [section.data]);
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
      style={{ marginBottom: 24, paddingBottom: 24, borderBottom: "1px solid #e2e8f0" }}
    >
      <SectionHeading section={section} />

      <div>
        <h4>Cards</h4>
        {fields.map((field, index) => (
          <div
            key={field.id}
            style={{ marginBottom: 16, padding: 16, border: "1px solid #e2e8f0", borderRadius: 12 }}
          >
            <label>
              Title
              <input {...register(`cards.${index}.title`, { required: true })} />
            </label>
            <label>
              Description
              <textarea rows={4} {...register(`cards.${index}.description`, { required: true })} />
            </label>
            <label>
              Icon name
              <input {...register(`cards.${index}.icon`)} placeholder="vision" />
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
              <input {...register(`cards.${index}.accentColor`, { required: true })} placeholder="#0b3d91" />
            </label>
            <button type="button" onClick={() => remove(index)} disabled={fields.length === 1}>
              Remove card
            </button>
          </div>
        ))}
        <button
          type="button"
          className="admin-button-secondary"
          onClick={() =>
            append({ title: "", description: "", icon: "", iconImage: "", accentColor: "#0b3d91" })
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

function toAboutAdvantageDefaultValues(data: Record<string, unknown>): AboutAdvantageFormValues {
  return {
    eyebrow: (data.eyebrow as string) ?? "",
    titleLines: Array.isArray(data.title) ? (data.title as string[]).join("\n") : "",
    description: (data.description as string) ?? "",
    pointsLines: Array.isArray(data.points) ? (data.points as string[]).join("\n") : "",
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
  const defaultValues = useMemo(() => toAboutAdvantageDefaultValues(section.data), [section.data]);
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
      style={{ marginBottom: 24, paddingBottom: 24, borderBottom: "1px solid #e2e8f0" }}
    >
      <SectionHeading section={section} />

      <label>
        Eyebrow
        <input {...register("eyebrow", { required: "Eyebrow is required" })} />
        {errors.eyebrow ? <p className="admin-field-error">{errors.eyebrow.message}</p> : null}
      </label>

      <label>
        Title lines (one per line)
        <textarea rows={4} {...register("titleLines", { required: "Title is required" })} />
        {errors.titleLines ? <p className="admin-field-error">{errors.titleLines.message}</p> : null}
      </label>

      <label>
        Description
        <textarea rows={4} {...register("description", { required: "Description is required" })} />
        {errors.description ? <p className="admin-field-error">{errors.description.message}</p> : null}
      </label>

      <label>
        Bullet points (one per line)
        <textarea rows={4} {...register("pointsLines", { required: "At least one point is required" })} />
        {errors.pointsLines ? <p className="admin-field-error">{errors.pointsLines.message}</p> : null}
      </label>

      <input type="hidden" {...register("image", { required: "Image is required" })} />
      <ImageUploadField
        label="Image URL"
        value={image}
        onChange={(value) => setValue("image", value, { shouldDirty: true, shouldValidate: true })}
        folder={`sections/${section.type}`}
      />
      {errors.image ? <p className="admin-field-error">{errors.image.message}</p> : null}

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

function toAboutValuesDefaultValues(data: Record<string, unknown>): AboutValuesFormValues {
  const rawItems = Array.isArray(data.items) ? (data.items as Record<string, unknown>[]) : [];

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
  const defaultValues = useMemo(() => toAboutValuesDefaultValues(section.data), [section.data]);
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
      style={{ marginBottom: 24, paddingBottom: 24, borderBottom: "1px solid #e2e8f0" }}
    >
      <SectionHeading section={section} />

      <label>
        Title
        <input {...register("title", { required: "Title is required" })} />
        {errors.title ? <p className="admin-field-error">{errors.title.message}</p> : null}
      </label>

      <div>
        <h4>Value cards</h4>
        {fields.map((field, index) => (
          <div
            key={field.id}
            style={{ marginBottom: 16, padding: 16, border: "1px solid #e2e8f0", borderRadius: 12 }}
          >
            <label>
              Title
              <input {...register(`items.${index}.title`, { required: true })} />
            </label>
            <label>
              Description
              <textarea rows={3} {...register(`items.${index}.description`, { required: true })} />
            </label>
            <label>
              Icon name
              <input {...register(`items.${index}.icon`)} placeholder="professionalism" />
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
            <button type="button" onClick={() => remove(index)} disabled={fields.length === 1}>
              Remove value
            </button>
          </div>
        ))}
        <button
          type="button"
          className="admin-button-secondary"
          onClick={() => append({ title: "", description: "", icon: "", iconImage: "" })}
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
