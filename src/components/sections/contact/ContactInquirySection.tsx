"use client";

import { useState } from "react";
import type { z } from "zod";
import type { contactInquiryDataSchema } from "@/schemas/sections";
import SimpleIcon from "../SimpleIcon";

type ContactInquiryContent = z.infer<typeof contactInquiryDataSchema>;

export default function ContactInquirySection({ content }: { content: ContactInquiryContent }) {
  const [status, setStatus] = useState<"idle" | "loading" | "ok" | "err">("idle");
  const [message, setMessage] = useState("");
  const officeAddress =
    content.officeItems.find((item) => item.icon === "location")?.lines.join(", ") ??
    content.officeItems[0]?.lines.join(", ") ??
    "Nad Al Sheba, Dubai, United Arab Emirates";
  const mapEmbedUrl =
    content.mapImage.includes("google.com/maps") || content.mapImage.includes("google.com/maps/embed")
      ? content.mapImage
      : `https://www.google.com/maps?q=${encodeURIComponent(officeAddress)}&output=embed`;

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus("loading");
    const form = e.currentTarget;
    const fd = new FormData(form);
    const body = {
      name: String(fd.get("name") ?? ""),
      email: String(fd.get("email") ?? ""),
      phone: "",
      company: String(fd.get("company") ?? ""),
      inquiryType: String(fd.get("inquiryType") ?? ""),
      message: String(fd.get("message") ?? ""),
    };
    try {
      const res = await fetch("/api/v1/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      const json = await res.json().catch(() => ({}));
      if (!res.ok) {
        setStatus("err");
        setMessage(json?.error?.message ?? "Something went wrong");
        return;
      }
      setStatus("ok");
      setMessage("Thank you — our consultants will be in touch shortly.");
      form.reset();
    } catch {
      setStatus("err");
      setMessage("Network error");
    }
  }

  return (
    <section className="contact-inquiry">
      <div className="section-shell contact-inquiry__grid">
        <div className="contact-inquiry__card">
          <h2 className="contact-inquiry__form-title">{content.formTitle}</h2>
          {content.formDescription ? (
            <p className="contact-inquiry__form-description">{content.formDescription}</p>
          ) : null}

          <form className="contact-inquiry__form" onSubmit={onSubmit}>
            <div className="contact-inquiry__row">
              <label className="contact-inquiry__field">
                <span>Full Name</span>
                <input
                  name="name"
                  type="text"
                  required
                  className="contact-inquiry__input"
                  placeholder="John Doe"
                />
              </label>
              <label className="contact-inquiry__field">
                <span>Email Address</span>
                <input
                  name="email"
                  type="email"
                  required
                  className="contact-inquiry__input"
                  placeholder="john@company.com"
                />
              </label>
            </div>

            <div className="contact-inquiry__row">
              <label className="contact-inquiry__field">
                <span>Company / Institution</span>
                <input
                  name="company"
                  type="text"
                  className="contact-inquiry__input"
                  placeholder="Global Capital Partners"
                />
              </label>
              <label className="contact-inquiry__field">
                <span>Subject</span>
                <select name="inquiryType" required className="contact-inquiry__input contact-inquiry__select">
                  {content.inquiryOptions.map((option) => (
                    <option key={option} value={option}>
                      {option}
                    </option>
                  ))}
                </select>
              </label>
            </div>

            <label className="contact-inquiry__field">
              <span>Message</span>
              <textarea
                name="message"
                required
                rows={7}
                className="contact-inquiry__input contact-inquiry__textarea"
                placeholder="How can we asist you?"
              />
            </label>

            <button type="submit" className="contact-inquiry__submit" disabled={status === "loading"}>
              <span>{status === "loading" ? "SENDING..." : content.submitLabel.toUpperCase()}</span>
            </button>

            {message ? (
              <p className={status === "ok" ? "contact-form__ok" : "contact-form__err"}>{message}</p>
            ) : null}
          </form>
        </div>

        <div className="contact-inquiry__details">
          <h2 className="contact-inquiry__office-title">{content.officeHeading}</h2>

          <div className="contact-inquiry__details-list">
            {content.officeItems.map((item) => (
              <article key={item.title} className="contact-inquiry__detail-item">
                <div className="contact-inquiry__detail-icon">
                  <SimpleIcon name={item.icon} className="contact-inquiry__detail-icon-svg" />
                </div>
                <div className="contact-inquiry__detail-copy">
                  <h3>{item.title.toUpperCase()}</h3>
                  {item.lines.map((line) => (
                    <p key={line}>{line}</p>
                  ))}
                </div>
              </article>
            ))}
          </div>

          <div className="contact-inquiry__map">
            <iframe
              title="Office location map"
              src={mapEmbedUrl}
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              className="contact-inquiry__map-frame"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
