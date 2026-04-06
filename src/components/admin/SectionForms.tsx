"use client";

import {
  useEffect,
  useMemo,
  useRef,
  type FormHTMLAttributes,
  type RefObject,
} from "react";
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

function FieldHint({ children }: { children: string }) {
  return <p className="admin-field-hint">{children}</p>;
}

function getFieldHintFromLabel(labelText: string) {
  const key = labelText.toLowerCase().replace(/\s+/g, " ").trim();
  if (!key) return null;

  if (key.includes("eyebrow"))
    return "Short intro text shown above the main heading.";
  if (key.includes("badge")) return "A compact tag line shown above the title.";
  if (key.includes("title lines") || key.includes("heading lines")) {
    return "Add one line per row. Each line renders as a separate heading line.";
  }
  if (key.includes("title")) return "Main title text shown for this block.";
  if (key.includes("description lines"))
    return "Use one line per row for multiple description points.";
  if (key.includes("description"))
    return "Write a concise supporting paragraph for this section.";
  if (
    key.includes("subheading") ||
    key.includes("subtitle") ||
    key.includes("subtext")
  ) {
    return "Supporting text shown under the main heading.";
  }
  if (
    key.includes("highlights") ||
    key.includes("points") ||
    key.includes("features")
  ) {
    return "Add one item per line for a clean bullet-style layout.";
  }
  if (key.includes("filter"))
    return "Add one filter label per line (include an All option if needed).";
  if (key.includes("category"))
    return "Use a category that matches one of your filter labels.";
  if (key.includes("stat"))
    return "Short metric text, like 120+ clients or 15 years.";
  if (key.includes("icon"))
    return "Choose an icon that best matches this content item.";
  if (key.includes("caption"))
    return "Small text shown near or under the image.";
  if (
    key.includes("action label") ||
    key.includes("cta label") ||
    key === "label"
  ) {
    return "Button text users will see and click.";
  }
  if (key.includes("href") || key.includes("url")) {
    return "Use a valid route like /contact or a full URL like https://example.com.";
  }
  if (key.includes("image"))
    return "Upload or paste a clear image URL for this section.";
  if (key.includes("form title"))
    return "Heading shown above the contact form.";
  if (key.includes("form description"))
    return "Short helper text shown before form fields.";
  if (key.includes("submit label")) return "Text shown on the submit button.";
  if (key.includes("office"))
    return "Office details shown in the contact information block.";
  if (key.includes("map"))
    return "Map image or label shown near the location details.";
  if (key.includes("quote")) return "Quote content shown as testimonial text.";

  return "Enter a clear value that matches this field's purpose.";
}

function useAutoFieldHints(formRef: RefObject<HTMLFormElement | null>) {
  useEffect(() => {
    const formEl = formRef.current;
    if (!formEl) return;

    const applyHints = () => {
      const labels = formEl.querySelectorAll("label");
      labels.forEach((label) => {
        if (label.querySelector(".admin-field-hint")) return;
        if (!label.querySelector("input, textarea, select, .admin-icon-picker"))
          return;

        const ownText = Array.from(label.childNodes)
          .filter((node) => node.nodeType === Node.TEXT_NODE)
          .map((node) => node.textContent ?? "")
          .join(" ")
          .trim();
        const normalizedLabel = (ownText || label.textContent || "")
          .replace(/\s+/g, " ")
          .trim();
        const hintText = getFieldHintFromLabel(normalizedLabel);
        if (!hintText) return;

        const hint = document.createElement("p");
        hint.className = "admin-field-hint";
        hint.dataset.autoHint = "true";
        hint.textContent = hintText;

        const error = label.querySelector(".admin-field-error");
        if (error) {
          label.insertBefore(hint, error);
          return;
        }
        label.appendChild(hint);
      });
    };

    applyHints();
    const observer = new MutationObserver(() => applyHints());
    observer.observe(formEl, { childList: true, subtree: true });
    return () => observer.disconnect();
  }, [formRef]);
}

function SectionForm(props: FormHTMLAttributes<HTMLFormElement>) {
  const formRef = useRef<HTMLFormElement>(null);
  useAutoFieldHints(formRef);
  return <form ref={formRef} {...props} />;
}

type IntroFormValues = {
  eyebrow: string;
  titleLines: string;
  description: string;
  highlightsLines: string;
  image: string;
  more: string;
  href:string;
  icon: string;
  expcount: number;
  // exptext: string;
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
    more: (data.more as string) ?? "",
    href: (data.href as string) ?? "",
    icon: (data.icon as string) ?? "",
    expcount: (data.expcount as number) ?? 0,
    // exptext: (data.exptext as string) ?? "",
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
    control,
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
      more: values.more,
      href:values.href,
      icon: values.icon,
      expcount: values.expcount,
      // exptext: values.exptext,
    });
  }

  return (
    <SectionForm
      className="admin-form admin-section-form"
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
        <input
          {...register("eyebrow", { required: "Eyebrow is required" })}
          placeholder="Small intro text above the main heading"
        />
        <FieldHint>Use 2-6 words to introduce this section.</FieldHint>
        {errors.eyebrow ? (
          <p className="admin-field-error">{errors.eyebrow.message}</p>
        ) : null}
      </label>

      <label>
        Title lines (one per line)
        <textarea
          rows={4}
          {...register("titleLines", { required: "Title is required" })}
          placeholder={"Trusted Growth Partner\nAcross Borders"}
        />
        <FieldHint>
          Each line becomes a separate heading line on the page.
        </FieldHint>
        {errors.titleLines ? (
          <p className="admin-field-error">{errors.titleLines.message}</p>
        ) : null}
      </label>

      <label>
        Description
        <textarea
          rows={4}
          {...register("description", { required: "Description is required" })}
          placeholder="Short paragraph that explains what this section is about."
        />
        <FieldHint>Keep this concise, around 1-3 sentences.</FieldHint>
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
          placeholder={
            "Strategic advisory\nRegulatory guidance\nMarket expansion support"
          }
        />
        <FieldHint>
          Add one benefit per line. These are shown as highlight points.
        </FieldHint>
        {errors.highlightsLines ? (
          <p className="admin-field-error">{errors.highlightsLines.message}</p>
        ) : null}
      </label>
      <label>
        More Info
        <input
          {...register("more", { required: "More info is required" })}
          placeholder="Additional information about this section."
        />
        <Controller
          name="icon"
          control={control}
          render={({ field }) => (
            <IconPicker
              value={typeof field.value === "string" ? field.value : ""}
              onChange={(val) =>
                field.onChange(typeof val === "string" ? val : "")
              }
            />
          )}
        />
      </label>
      <label>
        Link URl 
        <input {...register("href",{required:"Link URL is required"})} placeholder="/about" />
      </label>
      <div>
        <label>
          Years of Experience
          <input
            {...register("expcount", {
              required: "Experience count is required",
              valueAsNumber: true,
            })}
            type="number"
            placeholder="Number of years of experience"
          />
        </label>
        {/* <label>
          Experience Text
          <input
            {...register("exptext", { required: "Experience text is required" })}
            placeholder="Description of your experience"
          />
        </label> */}
      </div>

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
        placeholder="/sections/intro/cover-image.webp"
      />
      <FieldHint>Upload or paste a clear section image URL.</FieldHint>
      {errors.image ? (
        <p className="admin-field-error">{errors.image.message}</p>
      ) : null}

      <SectionSaveFooter
        isSubmitting={isSubmitting}
        message={saveMessage}
        messageTone={saveMessageTone}
        previewHref={previewHref}
      />
    </SectionForm>
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
    <SectionForm
      className="admin-form admin-section-form"
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
          placeholder="Services built for global businesses"
        />
        <FieldHint>Main heading for this services block.</FieldHint>
        {errors.title ? (
          <p className="admin-field-error">{errors.title.message}</p>
        ) : null}
      </label>

      <label>
        Description
        <textarea
          rows={4}
          {...register("description", { required: "Description is required" })}
          placeholder="Briefly describe your service offering and value."
        />
        <FieldHint>Use a short summary that supports the heading.</FieldHint>
        {errors.description ? (
          <p className="admin-field-error">{errors.description.message}</p>
        ) : null}
      </label>

      <div className="admin-section-group">
        <h4>Service cards</h4>
        {fields.map((field, index) => (
          <div key={field.id} className="admin-section-card">
            <label>
              Card title
              <input
                {...register(`cards.${index}.title`, {
                  required: "Card title is required",
                })}
                placeholder="Business Setup"
              />
              <FieldHint>Short name of this service card.</FieldHint>
            </label>
            <label>
              Card description
              <textarea
                rows={3}
                {...register(`cards.${index}.description`, {
                  required: "Card description is required",
                })}
                placeholder="Describe what this service includes."
              />
              <FieldHint>1-2 lines explaining this service.</FieldHint>
            </label>
            <label>
              Icon
              <Controller
                control={control}
                name={`cards.${index}.icon`}
                defaultValue=""
                rules={{ required: true }}
                render={({ field }) => (
                  <IconPicker
                    value={typeof field.value === "string" ? field.value : ""}
                    onChange={(val) => field.onChange(val)}
                  />
                )}
              />
              <FieldHint>
                Pick a simple icon that visually matches this card.
              </FieldHint>
              {/* Icon name
              <input
                {...register(`cards.${index}.icon`, {
                  required: "Icon is required",
                })}
              /> */}
            </label>
            {/* <input type="hidden" {...register(`cards.${index}.iconImage`)} />
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
            </p> */}
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
    </SectionForm>
  );
}

type ServicesGridCardFormValue = {
  category: string;
  title: string;
  icon: string;
  description: string;
  featuresLines: string;
  cta: string;
};

type ServicesGridFormValues = {
  title: string;
  description: string;
  filtersLines: string;
  cards: ServicesGridCardFormValue[];
};

function toServicesGridDefaultValues(
  data: Record<string, unknown>,
): ServicesGridFormValues {
  const rawCards = Array.isArray(data.cards)
    ? (data.cards as Record<string, unknown>[])
    : [];

  return {
    title: (data.title as string) ?? "",
    description: (data.description as string) ?? "",
    filtersLines: Array.isArray(data.filters)
      ? (data.filters as string[]).join("\n")
      : "",
    cards:
      rawCards.length > 0
        ? rawCards.map((card) => ({
            category: (card.category as string) ?? "",
            title: (card.title as string) ?? "",
            icon: (card.icon as string) ?? "SquareCode",
            description: (card.description as string) ?? "",
            featuresLines: Array.isArray(card.features)
              ? (card.features as string[]).join("\n")
              : "",
            cta: (card.cta as string) ?? "",
          }))
        : [
            {
              category: "",
              title: "",
              icon: "SquareCode",
              description: "",
              featuresLines: "",
              cta: "Learn More",
            },
          ],
  };
}

export function ServicesGridSectionForm({
  section,
  onSave,
  previewHref,
  saveMessage,
  saveMessageTone,
}: SectionFormProps) {
  const defaultValues = useMemo(
    () => toServicesGridDefaultValues(section.data),
    [section.data],
  );

  const {
    register,
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ServicesGridFormValues>({ defaultValues });
  const { fields, append, remove } = useFieldArray({ control, name: "cards" });

  function handleValid(values: ServicesGridFormValues) {
    onSave({
      title: values.title,
      description: values.description,
      filters: values.filtersLines
        .split("\n")
        .map((line) => line.trim())
        .filter(Boolean),
      cards: values.cards.map((card) => ({
        category: card.category,
        title: card.title,
        icon: card.icon,
        description: card.description,
        features: card.featuresLines
          .split("\n")
          .map((line) => line.trim())
          .filter(Boolean),
        cta: card.cta,
      })),
    });
  }

  return (
    <SectionForm
      className="admin-form admin-section-form"
      onSubmit={handleSubmit(handleValid)}
      style={{
        marginBottom: 24,
        paddingBottom: 24,
        borderBottom: "1px solid #e2e8f0",
      }}
    >
      <SectionHeading section={section} />

      <label>
        Section title
        <input
          {...register("title", { required: "Title is required" })}
          placeholder="Explore Our Core Services"
        />
        <FieldHint>Primary heading shown above the service filters.</FieldHint>
        {errors.title ? (
          <p className="admin-field-error">{errors.title.message}</p>
        ) : null}
      </label>

      <label>
        Section description
        <textarea
          rows={3}
          {...register("description", { required: "Description is required" })}
          placeholder="Introduce the full list of service categories."
        />
        <FieldHint>Keep this as a short supporting paragraph.</FieldHint>
        {errors.description ? (
          <p className="admin-field-error">{errors.description.message}</p>
        ) : null}
      </label>

      <label>
        Filter labels (one per line)
        <textarea
          rows={4}
          {...register("filtersLines", {
            required: "At least one filter is required",
          })}
          placeholder={"All\nAdvisory\nIncorporation\nCompliance"}
        />
        <FieldHint>
          One filter label per line (first line is usually All).
        </FieldHint>
        {errors.filtersLines ? (
          <p className="admin-field-error">{errors.filtersLines.message}</p>
        ) : null}
      </label>

      <div className="admin-section-group">
        <h4>Service cards</h4>
        {fields.map((field, index) => (
          <div key={field.id} className="admin-section-card">
            <label>
              Category
              <input
                {...register(`cards.${index}.category`, {
                  required: "Category is required",
                })}
                placeholder="Advisory"
              />
              <FieldHint>Must match one of your filter labels.</FieldHint>
            </label>
            <label>
              Title
              <input
                {...register(`cards.${index}.title`, {
                  required: "Title is required",
                })}
                placeholder="Market Entry Strategy"
              />
              <FieldHint>Service card title shown in the grid.</FieldHint>
            </label>
            <label>
              Icon
              <Controller
                control={control}
                name={`cards.${index}.icon`}
                defaultValue=""
                rules={{ required: true }}
                render={({ field }) => (
                  <IconPicker
                    value={typeof field.value === "string" ? field.value : ""}
                    onChange={(val) => field.onChange(val)}
                  />
                )}
              />
              <FieldHint>
                Choose an icon that reflects this service type.
              </FieldHint>
            </label>
            <label>
              Description
              <textarea
                rows={4}
                {...register(`cards.${index}.description`, {
                  required: "Description is required",
                })}
                placeholder="Brief overview of this service card."
              />
              <FieldHint>
                Use a compact summary for better readability.
              </FieldHint>
            </label>
            <label>
              Features (one per line)
              <textarea
                rows={4}
                {...register(`cards.${index}.featuresLines`, {
                  required: "At least one feature is required",
                })}
                placeholder={"Feature one\nFeature two\nFeature three"}
              />
              <FieldHint>Enter one feature per line.</FieldHint>
            </label>
            <label>
              CTA label
              <input
                {...register(`cards.${index}.cta`, {
                  required: "CTA label is required",
                })}
                placeholder="Learn More"
              />
              <FieldHint>Button text users will click on this card.</FieldHint>
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
              category: "",
              title: "",
              icon: "SquareCode",
              description: "",
              featuresLines: "",
              cta: "Learn More",
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
    </SectionForm>
  );
}

type WhyChooseItemFormValue = {
  title: string;
  icon: string;
  description: string;
};

type WhyChooseFormValues = {
  title: string;
  subheading: string;
  items: WhyChooseItemFormValue[];
};

function toWhyChooseDefaultValues(
  data: Record<string, unknown>,
): WhyChooseFormValues {
  const rawItems = Array.isArray(data.items)
    ? (data.items as Record<string, unknown>[])
    : [];

  return {
    title: (data.title as string) ?? "",
    subheading: (data.subheading as string) ?? "",
    items:
      rawItems.length > 0
        ? rawItems.map((item) => ({
            icon: typeof item.icon === "string" ? item.icon : "",
            title: (item.title as string) ?? "",
            description: (item.description as string) ?? "",
          }))
        : [{ icon: "", title: "", description: "" }],
  };
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
    <SectionForm
      className="admin-form admin-section-form"
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
                rules={{ required: true }}
                render={({ field }) => (
                  <IconPicker
                    value={typeof field.value === "string" ? field.value : ""}
                    onChange={(val) =>
                      field.onChange(typeof val === "string" ? val : "")
                    }
                  />
                )}
              />
            </label>
            <label>
              Title
              <input
                {...register(`items.${index}.title`, { required: true })}
              />
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
    </SectionForm>
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
    <SectionForm
      className="admin-form admin-section-form"
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
                rules={{ required: true }}
                render={({ field }) => (
                  <IconPicker
                    value={typeof field.value === "string" ? field.value : ""}
                    onChange={(val) =>
                      field.onChange(typeof val === "string" ? val : "")
                    }
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
            {...register("quoteAuthor", {
              required: "Quote author is required",
            })}
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
    </SectionForm>
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
    <SectionForm
      className="admin-form admin-section-form"
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
    </SectionForm>
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
    <SectionForm
      className="admin-form admin-section-form"
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
    </SectionForm>
  );
}

type AboutCtaFormValues = {
  titleLines: string;
  description: string;
  primaryActionLabel: string;
  primaryActionHref: string;
  secondaryActionLabel: string;
  secondaryActionHref: string;
};

function toAboutCtaDefaultValues(
  data: Record<string, unknown>,
): AboutCtaFormValues {
  const primaryAction = ((data.primaryAction as Record<string, unknown>) ??
    {}) as Record<string, unknown>;
  const secondaryAction = ((data.secondaryAction as Record<string, unknown>) ??
    {}) as Record<string, unknown>;

  return {
    titleLines: Array.isArray(data.title)
      ? (data.title as string[]).join("\n")
      : "",
    description: (data.description as string) ?? "",
    primaryActionLabel: (primaryAction.label as string) ?? "",
    primaryActionHref: (primaryAction.href as string) ?? "",
    secondaryActionLabel: (secondaryAction.label as string) ?? "",
    secondaryActionHref: (secondaryAction.href as string) ?? "",
  };
}

export function AboutCtaSectionForm({
  section,
  onSave,
  previewHref,
  saveMessage,
  saveMessageTone,
}: SectionFormProps) {
  const defaultValues = useMemo(
    () => toAboutCtaDefaultValues(section.data),
    [section.data],
  );
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<AboutCtaFormValues>({ defaultValues });

  function handleValid(values: AboutCtaFormValues) {
    onSave({
      title: values.titleLines
        .split("\n")
        .map((line) => line.trim())
        .filter(Boolean),
      description: values.description,
      primaryAction: {
        label: values.primaryActionLabel,
        href: values.primaryActionHref,
      },
      secondaryAction: {
        label: values.secondaryActionLabel,
        href: values.secondaryActionHref,
      },
    });
  }

  return (
    <SectionForm
      className="admin-form admin-section-form"
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
          rows={3}
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

      <div>
        <h4>Primary action</h4>
        <label>
          Label
          <input
            {...register("primaryActionLabel", {
              required: "Primary action label is required",
            })}
          />
          {errors.primaryActionLabel ? (
            <p className="admin-field-error">
              {errors.primaryActionLabel.message}
            </p>
          ) : null}
        </label>
        <label>
          Href
          <input
            {...register("primaryActionHref", {
              required: "Primary action href is required",
            })}
          />
          {errors.primaryActionHref ? (
            <p className="admin-field-error">
              {errors.primaryActionHref.message}
            </p>
          ) : null}
        </label>
      </div>

      <div>
        <h4>Secondary action</h4>
        <label>
          Label
          <input
            {...register("secondaryActionLabel", {
              required: "Secondary action label is required",
            })}
          />
          {errors.secondaryActionLabel ? (
            <p className="admin-field-error">
              {errors.secondaryActionLabel.message}
            </p>
          ) : null}
        </label>
        <label>
          Href
          <input
            {...register("secondaryActionHref", {
              required: "Secondary action href is required",
            })}
          />
          {errors.secondaryActionHref ? (
            <p className="admin-field-error">
              {errors.secondaryActionHref.message}
            </p>
          ) : null}
        </label>
      </div>

      <SectionSaveFooter
        isSubmitting={isSubmitting}
        message={saveMessage}
        messageTone={saveMessageTone}
        previewHref={previewHref}
      />
    </SectionForm>
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
    <SectionForm
      className="admin-form admin-section-form"
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
    </SectionForm>
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
    <SectionForm
      className="admin-form admin-section-form"
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

      {/* <label>
        Supporting stat
        <input {...register("stat", { required: "Stat is required" })} />
        {errors.stat ? (
          <p className="admin-field-error">{errors.stat.message}</p>
        ) : null}
      </label> */}

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
    </SectionForm>
  );
}

type ContactOfficeItemFormValue = {
  title: string;
  linesText: string;
  icon: string;
};

type IndustriesHeroFormValues = {
  badge: string;
  titleLines: string;
  description: string;
  primaryLabel: string;
  primaryHref: string;
  secondaryLabel: string;
  secondaryHref: string;
};

function toIndustriesHeroDefaultValues(
  data: Record<string, unknown>,
): IndustriesHeroFormValues {
  const primaryAction = ((data.primaryAction as Record<string, unknown>) ??
    {}) as Record<string, unknown>;
  const secondaryAction = ((data.secondaryAction as Record<string, unknown>) ??
    {}) as Record<string, unknown>;

  return {
    badge: (data.badge as string) ?? "",
    titleLines: Array.isArray(data.title)
      ? (data.title as string[]).join("\n")
      : "",
    description: (data.description as string) ?? "",
    primaryLabel: (primaryAction.label as string) ?? "",
    primaryHref: (primaryAction.href as string) ?? "",
    secondaryLabel: (secondaryAction.label as string) ?? "",
    secondaryHref: (secondaryAction.href as string) ?? "",
  };
}
type ServicesHeroFormValues = {
  titleLines: string;
  description: string;
  backgroundImage: string;
};
function toServicesHeroDefaultValues(
  data: Record<string, unknown>,
): ServicesHeroFormValues {
  return {
    titleLines: Array.isArray(data.title)
      ? (data.title as string[]).join("\n")
      : "",
    description: (data.description as string) ?? "",
    backgroundImage: (data.backgroundImage as string) ?? "",
  };
}
export function ServicesHeroSectionForm({
  section,
  onSave,
  previewHref,
  saveMessage,
  saveMessageTone,
}: SectionFormProps) {
  const defaultValues = useMemo(
    () => toServicesHeroDefaultValues(section.data),
    [section.data],
  );
  const {
    register,
    control,
    setValue,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ServicesHeroFormValues>({ defaultValues });
  const backgroundImage = useWatch({ control, name: "backgroundImage" });

  function handleValid(values: ServicesHeroFormValues) {
    onSave({
      title: values.titleLines
        .split("\n")
        .map((line) => line.trim())
        .filter(Boolean),
      description: values.description,
      backgroundImage: values.backgroundImage,
    });
  }
  return (
    <SectionForm
      className="admin-form admin-section-form"
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

      {/* <label>
        Supporting stat
        <input {...register("stat", { required: "Stat is required" })} />
        {errors.stat ? (
          <p className="admin-field-error">{errors.stat.message}</p>
        ) : null}
      </label> */}

      {/* <input
        type="hidden"
        {...register("backgroundImage")}
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
      ) : null} */}

      <SectionSaveFooter
        isSubmitting={isSubmitting}
        message={saveMessage}
        messageTone={saveMessageTone}
        previewHref={previewHref}
      />
    </SectionForm>
  );
}

export function IndustriesHeroSectionForm({
  section,
  onSave,
  previewHref,
  saveMessage,
  saveMessageTone,
}: SectionFormProps) {
  const defaultValues = useMemo(
    () => toIndustriesHeroDefaultValues(section.data),
    [section.data],
  );
  const {
    register,
    reset,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<IndustriesHeroFormValues>({ defaultValues });

  useEffect(() => {
    reset(defaultValues);
  }, [defaultValues, reset]);

  function handleValid(values: IndustriesHeroFormValues) {
    onSave({
      badge: values.badge,
      title: values.titleLines
        .split("\n")
        .map((line) => line.trim())
        .filter(Boolean),
      description: values.description,
      primaryAction: {
        label: values.primaryLabel,
        href: values.primaryHref,
      },
      secondaryAction: {
        label: values.secondaryLabel,
        href: values.secondaryHref,
      },
    });
  }

  return (
    <SectionForm
      className="admin-form admin-section-form"
      onSubmit={handleSubmit(handleValid)}
      style={{
        marginBottom: 24,
        paddingBottom: 24,
        borderBottom: "1px solid #e2e8f0",
      }}
    >
      <SectionHeading section={section} />

      <label>
        Badge
        <input {...register("badge", { required: "Badge is required" })} />
        {errors.badge ? (
          <p className="admin-field-error">{errors.badge.message}</p>
        ) : null}
      </label>

      <label>
        Title lines (one per line)
        <textarea
          rows={4}
          {...register("titleLines", {
            required: "At least one title line is required",
          })}
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

      <div>
        <h4>Primary action</h4>
        <label>
          Label
          <input
            {...register("primaryLabel", {
              required: "Primary label is required",
            })}
          />
          {errors.primaryLabel ? (
            <p className="admin-field-error">{errors.primaryLabel.message}</p>
          ) : null}
        </label>
        <label>
          Href
          <input
            {...register("primaryHref", {
              required: "Primary href is required",
            })}
          />
          {errors.primaryHref ? (
            <p className="admin-field-error">{errors.primaryHref.message}</p>
          ) : null}
        </label>
      </div>

      <div>
        <h4>Secondary action</h4>
        <label>
          Label
          <input
            {...register("secondaryLabel", {
              required: "Secondary label is required",
            })}
          />
          {errors.secondaryLabel ? (
            <p className="admin-field-error">{errors.secondaryLabel.message}</p>
          ) : null}
        </label>
        <label>
          Href
          <input
            {...register("secondaryHref", {
              required: "Secondary href is required",
            })}
          />
          {errors.secondaryHref ? (
            <p className="admin-field-error">{errors.secondaryHref.message}</p>
          ) : null}
        </label>
      </div>

      <SectionSaveFooter
        isSubmitting={isSubmitting}
        message={saveMessage}
        messageTone={saveMessageTone}
        previewHref={previewHref}
      />
    </SectionForm>
  );
}

type IndustriesGridItemFormValue = {
  icon: string;
  title: string;
  description: string;
};

type IndustriesGridFormValues = {
  title: string;
  description: string;
  items: IndustriesGridItemFormValue[];
  partnerTitle: string;
  partnerDescription: string;
  partnerHref: string;
};

function toIndustriesGridDefaultValues(
  data: Record<string, unknown>,
): IndustriesGridFormValues {
  const rawItems = Array.isArray(data.items)
    ? (data.items as Record<string, unknown>[])
    : [];
  const partnerCard = ((data.partnerCard as Record<string, unknown>) ??
    {}) as Record<string, unknown>;

  return {
    title: (data.title as string) ?? "",
    description: (data.description as string) ?? "",
    items:
      rawItems.length > 0
        ? rawItems.map((item) => ({
            icon: (item.icon as string) ?? "SquareCode",
            title: (item.title as string) ?? "",
            description: (item.description as string) ?? "",
          }))
        : [
            {
              icon: "SquareCode",
              title: "",
              description: "",
            },
          ],
    partnerTitle: (partnerCard.title as string) ?? "",
    partnerDescription: (partnerCard.description as string) ?? "",
    partnerHref: (partnerCard.href as string) ?? "/contact",
  };
}

export function IndustriesGridSectionForm({
  section,
  onSave,
  previewHref,
  saveMessage,
  saveMessageTone,
}: SectionFormProps) {
  const defaultValues = useMemo(
    () => toIndustriesGridDefaultValues(section.data),
    [section.data],
  );
  const {
    register,
    control,
    reset,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<IndustriesGridFormValues>({ defaultValues });
  const { fields, append, remove } = useFieldArray({ control, name: "items" });

  useEffect(() => {
    reset(defaultValues);
  }, [defaultValues, reset]);

  function handleValid(values: IndustriesGridFormValues) {
    onSave({
      title: values.title,
      description: values.description,
      items: values.items.map((item) => ({
        icon: item.icon,
        title: item.title,
        description: item.description,
      })),
      partnerCard: {
        title: values.partnerTitle,
        description: values.partnerDescription,
        href: values.partnerHref,
      },
    });
  }

  return (
    <SectionForm
      className="admin-form admin-section-form"
      onSubmit={handleSubmit(handleValid)}
      style={{
        marginBottom: 24,
        paddingBottom: 24,
        borderBottom: "1px solid #e2e8f0",
      }}
    >
      <SectionHeading section={section} />

      <label>
        Section title
        <input {...register("title", { required: "Title is required" })} />
        {errors.title ? (
          <p className="admin-field-error">{errors.title.message}</p>
        ) : null}
      </label>

      <label>
        Section description
        <textarea
          rows={3}
          {...register("description", { required: "Description is required" })}
        />
        {errors.description ? (
          <p className="admin-field-error">{errors.description.message}</p>
        ) : null}
      </label>

      <div>
        <h4>Industry cards</h4>
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
                rules={{ required: true }}
                render={({ field }) => (
                  <IconPicker
                    value={typeof field.value === "string" ? field.value : ""}
                    onChange={(val) =>
                      field.onChange(typeof val === "string" ? val : "")
                    }
                  />
                )}
              />
            </label>
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
            append({ icon: "SquareCode", title: "", description: "" })
          }
        >
          Add card
        </button>
      </div>

      <div>
        <h4>Partner card</h4>
        <label>
          Title
          <input
            {...register("partnerTitle", {
              required: "Partner title is required",
            })}
          />
          {errors.partnerTitle ? (
            <p className="admin-field-error">{errors.partnerTitle.message}</p>
          ) : null}
        </label>
        <label>
          Description
          <textarea
            rows={3}
            {...register("partnerDescription", {
              required: "Partner description is required",
            })}
          />
          {errors.partnerDescription ? (
            <p className="admin-field-error">
              {errors.partnerDescription.message}
            </p>
          ) : null}
        </label>
        <label>
          Href
          <input
            {...register("partnerHref", {
              required: "Partner href is required",
            })}
          />
          {errors.partnerHref ? (
            <p className="admin-field-error">{errors.partnerHref.message}</p>
          ) : null}
        </label>
      </div>

      <SectionSaveFooter
        isSubmitting={isSubmitting}
        message={saveMessage}
        messageTone={saveMessageTone}
        previewHref={previewHref}
      />
    </SectionForm>
  );
}

type IndustriesCtaFormValues = {
  titleLines: string;
  description: string;
  primaryLabel: string;
  primaryHref: string;
  secondaryLabel: string;
  secondaryHref: string;
};

type ServicesCtaFormValues = {
  title: string;
  description: string;
  primaryLabel: string;
  primaryHref: string;
  secondaryLabel: string;
  secondaryHref: string;
};

function toServicesCtaDefaultValues(
  data: Record<string, unknown>,
): ServicesCtaFormValues {
  const primaryAction = ((data.primaryAction as Record<string, unknown>) ??
    {}) as Record<string, unknown>;
  const secondaryAction = ((data.secondaryAction as Record<string, unknown>) ??
    {}) as Record<string, unknown>;

  return {
    title: (data.title as string) ?? "",
    description: (data.description as string) ?? "",
    primaryLabel: (primaryAction.label as string) ?? "",
    primaryHref: (primaryAction.href as string) ?? "",
    secondaryLabel: (secondaryAction.label as string) ?? "",
    secondaryHref: (secondaryAction.href as string) ?? "",
  };
}

export function ServicesCtaSectionForm({
  section,
  onSave,
  previewHref,
  saveMessage,
  saveMessageTone,
}: SectionFormProps) {
  const defaultValues = useMemo(
    () => toServicesCtaDefaultValues(section.data),
    [section.data],
  );
  const {
    register,
    reset,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ServicesCtaFormValues>({ defaultValues });

  useEffect(() => {
    reset(defaultValues);
  }, [defaultValues, reset]);

  function handleValid(values: ServicesCtaFormValues) {
    onSave({
      title: values.title,
      description: values.description,
      primaryAction: {
        label: values.primaryLabel,
        href: values.primaryHref,
      },
      secondaryAction: {
        label: values.secondaryLabel,
        href: values.secondaryHref,
      },
    });
  }

  return (
    <SectionForm
      className="admin-form admin-section-form"
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
          rows={3}
          {...register("description", { required: "Description is required" })}
        />
        {errors.description ? (
          <p className="admin-field-error">{errors.description.message}</p>
        ) : null}
      </label>

      <div>
        <h4>Primary action</h4>
        <label>
          Label
          <input
            {...register("primaryLabel", {
              required: "Primary label is required",
            })}
          />
          {errors.primaryLabel ? (
            <p className="admin-field-error">{errors.primaryLabel.message}</p>
          ) : null}
        </label>
        <label>
          Href
          <input
            {...register("primaryHref", {
              required: "Primary href is required",
            })}
          />
          {errors.primaryHref ? (
            <p className="admin-field-error">{errors.primaryHref.message}</p>
          ) : null}
        </label>
      </div>

      <div>
        <h4>Secondary action</h4>
        <label>
          Label
          <input
            {...register("secondaryLabel", {
              required: "Secondary label is required",
            })}
          />
          {errors.secondaryLabel ? (
            <p className="admin-field-error">{errors.secondaryLabel.message}</p>
          ) : null}
        </label>
        <label>
          Href
          <input
            {...register("secondaryHref", {
              required: "Secondary href is required",
            })}
          />
          {errors.secondaryHref ? (
            <p className="admin-field-error">{errors.secondaryHref.message}</p>
          ) : null}
        </label>
      </div>

      <SectionSaveFooter
        isSubmitting={isSubmitting}
        message={saveMessage}
        messageTone={saveMessageTone}
        previewHref={previewHref}
      />
    </SectionForm>
  );
}

function toIndustriesCtaDefaultValues(
  data: Record<string, unknown>,
): IndustriesCtaFormValues {
  const primaryAction = ((data.primaryAction as Record<string, unknown>) ??
    {}) as Record<string, unknown>;
  const secondaryAction = ((data.secondaryAction as Record<string, unknown>) ??
    {}) as Record<string, unknown>;

  return {
    titleLines: Array.isArray(data.title)
      ? (data.title as string[]).join("\n")
      : "",
    description: (data.description as string) ?? "",
    primaryLabel: (primaryAction.label as string) ?? "",
    primaryHref: (primaryAction.href as string) ?? "",
    secondaryLabel: (secondaryAction.label as string) ?? "",
    secondaryHref: (secondaryAction.href as string) ?? "",
  };
}

export function IndustriesCtaSectionForm({
  section,
  onSave,
  previewHref,
  saveMessage,
  saveMessageTone,
}: SectionFormProps) {
  const defaultValues = useMemo(
    () => toIndustriesCtaDefaultValues(section.data),
    [section.data],
  );
  const {
    register,
    reset,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<IndustriesCtaFormValues>({ defaultValues });

  useEffect(() => {
    reset(defaultValues);
  }, [defaultValues, reset]);

  function handleValid(values: IndustriesCtaFormValues) {
    onSave({
      title: values.titleLines
        .split("\n")
        .map((line) => line.trim())
        .filter(Boolean),
      description: values.description,
      primaryAction: {
        label: values.primaryLabel,
        href: values.primaryHref,
      },
      secondaryAction: {
        label: values.secondaryLabel,
        href: values.secondaryHref,
      },
    });
  }

  return (
    <SectionForm
      className="admin-form admin-section-form"
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
          rows={3}
          {...register("titleLines", {
            required: "At least one title line is required",
          })}
        />
        {errors.titleLines ? (
          <p className="admin-field-error">{errors.titleLines.message}</p>
        ) : null}
      </label>

      <label>
        Description
        <textarea
          rows={3}
          {...register("description", { required: "Description is required" })}
        />
        {errors.description ? (
          <p className="admin-field-error">{errors.description.message}</p>
        ) : null}
      </label>

      <div>
        <h4>Primary action</h4>
        <label>
          Label
          <input
            {...register("primaryLabel", {
              required: "Primary label is required",
            })}
          />
          {errors.primaryLabel ? (
            <p className="admin-field-error">{errors.primaryLabel.message}</p>
          ) : null}
        </label>
        <label>
          Href
          <input
            {...register("primaryHref", {
              required: "Primary href is required",
            })}
          />
          {errors.primaryHref ? (
            <p className="admin-field-error">{errors.primaryHref.message}</p>
          ) : null}
        </label>
      </div>

      <div>
        <h4>Secondary action</h4>
        <label>
          Label
          <input
            {...register("secondaryLabel", {
              required: "Secondary label is required",
            })}
          />
          {errors.secondaryLabel ? (
            <p className="admin-field-error">{errors.secondaryLabel.message}</p>
          ) : null}
        </label>
        <label>
          Href
          <input
            {...register("secondaryHref", {
              required: "Secondary href is required",
            })}
          />
          {errors.secondaryHref ? (
            <p className="admin-field-error">{errors.secondaryHref.message}</p>
          ) : null}
        </label>
      </div>

      <SectionSaveFooter
        isSubmitting={isSubmitting}
        message={saveMessage}
        messageTone={saveMessageTone}
        previewHref={previewHref}
      />
    </SectionForm>
  );
}

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
    <SectionForm
      className="admin-form admin-section-form"
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
              choose an Icon
              <Controller
                control={control}
                name={`officeItems.${index}.icon`}
                render={({ field }) => (
                  <IconPicker
                    value={typeof field.value === "string" ? field.value : ""}
                    onChange={(val) => field.onChange(val)}
                  />
                )}
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
    </SectionForm>
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
    <SectionForm
      className="admin-form admin-section-form"
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
    </SectionForm>
  );
}

type AboutIntroFormValues = {
  badge: string;
  titleLines: string;
  descriptionLines: string;
  imageCaption: string;
  image: string;
  imageAlt: string;
};

function toAboutIntroDefaultValues(
  data: Record<string, unknown>,
): AboutIntroFormValues {
  return {
    badge: (data.badge as string) ?? "",
    titleLines: Array.isArray(data.title)
      ? (data.title as string[]).join("\n")
      : "",
    descriptionLines: Array.isArray(data.description)
      ? (data.description as string[]).join("\n\n")
      : "",
    imageCaption: (data.imageCaption as string) ?? "",
    image: (data.image as string) ?? "",
    imageAlt: (data.imageAlt as string) ?? "",
  };
}

export function AboutIntroSectionForm({
  section,
  onSave,
  previewHref,
  saveMessage,
  saveMessageTone,
}: SectionFormProps) {
  const defaultValues = useMemo(
    () => toAboutIntroDefaultValues(section.data),
    [section.data],
  );
  const {
    register,
    control,
    setValue,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<AboutIntroFormValues>({ defaultValues });
  const image = useWatch({ control, name: "image" });

  function handleValid(values: AboutIntroFormValues) {
    onSave({
      badge: values.badge,
      title: values.titleLines
        .split("\n")
        .map((line) => line.trim())
        .filter(Boolean),
      description: values.descriptionLines
        .split(/\n\s*\n/)
        .map((paragraph) => paragraph.trim())
        .filter(Boolean),
      imageCaption: values.imageCaption,
      image: values.image,
      imageAlt: values.imageAlt || undefined,
    });
  }

  return (
    <SectionForm
      className="admin-form admin-section-form"
      onSubmit={handleSubmit(handleValid)}
      style={{
        marginBottom: 24,
        paddingBottom: 24,
        borderBottom: "1px solid #e2e8f0",
      }}
    >
      <SectionHeading section={section} />

      <label>
        Badge
        <input {...register("badge", { required: "Badge is required" })} />
        {errors.badge ? (
          <p className="admin-field-error">{errors.badge.message}</p>
        ) : null}
      </label>

      <label>
        Title lines (one per line)
        <textarea
          rows={3}
          {...register("titleLines", { required: "Title is required" })}
        />
        {errors.titleLines ? (
          <p className="admin-field-error">{errors.titleLines.message}</p>
        ) : null}
      </label>

      <label>
        Description lines (one per line)
        <textarea
          rows={10}
          {...register("descriptionLines", {
            required: "Description is required",
          })}
        />
        {errors.descriptionLines ? (
          <p className="admin-field-error">{errors.descriptionLines.message}</p>
        ) : null}
      </label>

      <label>
        Image Caption
        <input
          {...register("imageCaption", {
            required: "Image caption is required",
          })}
        />
        {errors.imageCaption ? (
          <p className="admin-field-error">{errors.imageCaption.message}</p>
        ) : null}
      </label>

      <label>
        Image alt text
        <input {...register("imageAlt")} />
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
    </SectionForm>
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
  items: AboutVisionMissionCardFormValue[];
};

function toAboutVisionMissionDefaultValues(
  data: Record<string, unknown>,
): AboutVisionMissionFormValues {
  const rawItems = Array.isArray(data.items)
    ? (data.items as Record<string, unknown>[])
    : [];

  return {
    items:
      rawItems.length > 0
        ? rawItems.map((item) => ({
            title: (item.title as string) ?? "",
            description: (item.description as string) ?? "",
            icon: (item.icon as string) ?? "",
            iconImage: (item.iconImage as string) ?? "",
            accentColor: (item.accentColor as string) ?? "#0b3d91",
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
  const { fields, append, remove } = useFieldArray({ control, name: "items" });
  const items = useWatch({ control, name: "items" });

  function handleValid(values: AboutVisionMissionFormValues) {
    onSave({
      items: values.items.map((item) => ({
        title: item.title,
        description: item.description,
        icon: item.icon || undefined,
        iconImage: item.iconImage || undefined,
        accentColor: item.accentColor,
      })),
    });
  }

  return (
    <SectionForm
      className="admin-form admin-section-form"
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
                {...register(`items.${index}.title`, { required: true })}
              />
            </label>
            <label>
              Description
              <textarea
                rows={4}
                {...register(`items.${index}.description`, { required: true })}
              />
            </label>
            <label>
              Choose Icon
              <Controller
                control={control}
                name={`items.${index}.icon`}
                render={({ field }) => (
                  <IconPicker
                    value={typeof field.value === "string" ? field.value : ""}
                    onChange={(val) =>
                      field.onChange(typeof val === "string" ? val : "")
                    }
                  />
                )}
              />
            </label>
            {/* <input type="hidden" {...register(`cards.${index}.iconImage`)} />
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
            /> */}
            <label>
              Accent color
              <input
                {...register(`items.${index}.accentColor`, { required: true })}
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
    </SectionForm>
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
    <SectionForm
      className="admin-form admin-section-form"
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
    </SectionForm>
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
    <SectionForm
      className="admin-form admin-section-form"
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
              Icon
              <Controller
                name={`items.${index}.icon`}
                control={control}
                render={({ field }) => (
                  <IconPicker
                    value={typeof field.value === "string" ? field.value : ""}
                    onChange={(val) =>
                      field.onChange(typeof val === "string" ? val : "")
                    }
                  />
                )}
              />
            </label>
            {/* <input type="hidden" {...register(`items.${index}.iconImage`)} />
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
            /> */}
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
    </SectionForm>
  );
}
