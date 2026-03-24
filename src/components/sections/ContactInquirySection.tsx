"use client";

import { useState } from "react";
import type { z } from "zod";
import type { contactInquiryDataSchema } from "@/schemas/sections";
import SimpleIcon from "./SimpleIcon";

type ContactInquiryContent = z.infer<typeof contactInquiryDataSchema>;

export default function ContactInquirySection({ content }: { content: ContactInquiryContent }) {
  const [status, setStatus] = useState<"idle" | "loading" | "ok" | "err">("idle");
  const [message, setMessage] = useState("");

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus("loading");
    const form = e.currentTarget;
    const fd = new FormData(form);
    const body = {
      name: String(fd.get("name") ?? ""),
      email: String(fd.get("email") ?? ""),
      phone: String(fd.get("phone") ?? ""),
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
          <p className="contact-inquiry__form-description">{content.formDescription}</p>

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
                <span>Phone Number</span>
                <input
                  name="phone"
                  type="text"
                  required
                  className="contact-inquiry__input"
                  placeholder="+971 50 000 0000"
                />
              </label>
              <label className="contact-inquiry__field">
                <span>Company Name</span>
                <input
                  name="company"
                  type="text"
                  className="contact-inquiry__input"
                  placeholder="Global Trade Inc."
                />
              </label>
            </div>

            <label className="contact-inquiry__field">
              <span>Inquiry Type</span>
              <select name="inquiryType" required className="contact-inquiry__input contact-inquiry__select">
                {content.inquiryOptions.map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </select>
            </label>

            <label className="contact-inquiry__field">
              <span>Message</span>
              <textarea
                name="message"
                required
                rows={6}
                className="contact-inquiry__input contact-inquiry__textarea"
                placeholder="How can we help your business today?"
              />
            </label>

            <button type="submit" className="contact-inquiry__submit" disabled={status === "loading"}>
              <span>{status === "loading" ? "Submitting..." : content.submitLabel}</span>
              <span className="contact-inquiry__submit-arrow" aria-hidden="true">
                &gt;
              </span>
            </button>

            {message ? (
              <p className={status === "ok" ? "contact-form__ok" : "contact-form__err"}>{message}</p>
            ) : null}
          </form>
        </div>

        <div className="contact-inquiry__details">
          <div className="contact-inquiry__details-heading">
            <div className="contact-inquiry__details-accent"></div>
            <h2>{content.officeHeading}</h2>
          </div>

          <div className="contact-inquiry__details-list">
            {content.officeItems.map((item) => (
              <article key={item.title} className="contact-inquiry__detail-item">
                <div className="contact-inquiry__detail-icon">
                  <SimpleIcon name={item.icon} className="contact-inquiry__detail-icon-svg" />
                </div>
                <div className="contact-inquiry__detail-copy">
                  <h3>{item.title}</h3>
                  {item.lines.map((line) => (
                    <p key={line}>{line}</p>
                  ))}
                </div>
              </article>
            ))}
          </div>

          <div className="contact-inquiry__map">
            <img
              src={content.mapImage}
              alt="Map showing the company location"
              width={1200}
              height={800}
              decoding="async"
              className="contact-inquiry__map-image"
            />
            <div className="contact-inquiry__map-label">
              <SimpleIcon name="location" className="contact-inquiry__map-label-icon" />
              <div>
                <strong>{content.mapLabelTitle}</strong>
                <span>{content.mapLabelSubtitle}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
