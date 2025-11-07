import React, { useState } from "react";

const API_URL = "https://vernanbackend.ezlab.in/api/contact-us/";

export default function App() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    message: "",
  });
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [toast, setToast] = useState(null);

  // validation helper
  const validate = (field, value) => {
    let msg = "";
    if (!value.trim()) {
      msg = `${field.charAt(0).toUpperCase() + field.slice(1)} is required`;
    } else if (field === "email") {
      const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!re.test(value)) msg = "Enter a valid email";
    }
    return msg;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((p) => ({ ...p, [name]: value }));
    setErrors((p) => ({ ...p, [name]: validate(name, value) }));
  };

  const handleSubmit = async (ev) => {
    ev.preventDefault();

    const newErrors = {};
    Object.keys(form).forEach((k) => {
      const err = validate(k, form[k]);
      if (err) newErrors[k] = err;
    });
    setErrors(newErrors);
    if (Object.keys(newErrors).length > 0) return;

    setSubmitting(true);
    setToast(null);

    try {
      const res = await fetch(API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      if (res.ok) {
        setToast({ type: "success", text: "Form submitted successfully!" });
        setForm({ name: "", email: "", phone: "", message: "" });
      } else {
        setToast({ type: "error", text: "Submission failed. Please try again." });
      }
    } catch (err) {
      setToast({
        type: "error",
        text: "Network error: " + (err.message || "unknown error"),
      });
    } finally {
      setSubmitting(false);
      setTimeout(() => setToast(null), 3000);
    }
  };

  return (
    <div className="page">
      <div className="card contact-card" role="region" aria-label="Contact section">
        {/* LEFT: Visual / Brand area */}
        <aside className="card-left" aria-hidden="false">
          <div className="left-decor">
            {/* Decorative SVG blob — purely visual */}
            <svg className="blob" viewBox="0 0 600 600" xmlns="http://www.w3.org/2000/svg" aria-hidden="true" focusable="false">
              <g transform="translate(300,300)">
                <path d="M120,-160C152,-128,169,-84,182,-36C195,12,204,64,184,102C164,140,114,164,66,181C18,198,-28,209,-76,197C-124,186,-173,152,-186,101C-199,50,-176,-16,-147,-74C-118,-133,-83,-184,-34,-202C15,-220,76,-205,120,-160Z" fill="rgba(241,93,43,0.12)"/>
              </g>
            </svg>
          </div>

          <div className="left-content">
            <h3 className="side-title">The Highlight Reel</h3>
            <p className="side-text">
              Watch the magic we've captured. Great stories start with a single conversation — let’s make your vision real.
            </p>

            <div className="contact-info">
              <div className="info-row"><span className="info-label">Email</span><span className="info-value">vernita@varnanfilms.co.in</span></div>
              <div className="info-row"><span className="info-label">Phone</span><span className="info-value">+91 98736 84567</span></div>
            </div>

            <p className="left-cta">Prefer coffee? We do too — we’ll meet, listen, and design a story that fits.</p>
          </div>
        </aside>

        {/* RIGHT: Form area */}
        <main className="card-right" aria-live="polite">
          <h1 className="title">Join the Story</h1>
          <p className="subtitle">Ready to bring your vision to life? Let’s talk.</p>

          <form className="contact-form" onSubmit={handleSubmit} noValidate>
            <div className="field-row">
              <label htmlFor="name">Your name*</label>
              <input
                id="name"
                name="name"
                value={form.name}
                onChange={handleChange}
                placeholder="Enter your name"
                autoComplete="name"
              />
              {errors.name && <div className="error">{errors.name}</div>}
            </div>

            <div className="field-row">
              <label htmlFor="email">Your email*</label>
              <input
                id="email"
                name="email"
                value={form.email}
                onChange={handleChange}
                placeholder="Enter your email"
                autoComplete="email"
                type="email"
              />
              {errors.email && <div className="error">{errors.email}</div>}
            </div>

            <div className="field-row">
              <label htmlFor="phone">Phone</label>
              <input
                id="phone"
                name="phone"
                value={form.phone}
                onChange={handleChange}
                placeholder="Enter your phone number"
                autoComplete="tel"
              />
              {errors.phone && <div className="error">{errors.phone}</div>}
            </div>

            <div className="field-row">
              <label htmlFor="message">Your message*</label>
              <textarea
                id="message"
                name="message"
                value={form.message}
                onChange={handleChange}
                placeholder="Write your message..."
                rows="5"
              />
              {errors.message && <div className="error">{errors.message}</div>}
            </div>

            <div className="actions">
              <button type="submit" disabled={submitting} aria-disabled={submitting}>
                {submitting ? <span className="spinner" aria-hidden="true"></span> : "Submit"}
              </button>
            </div>
          </form>
        </main>
      </div>

      {/* toast */}
      {toast && (
        <div className={`toast ${toast.type}`} role="status" aria-live="polite">
          {toast.text}
        </div>
      )}
    </div>
  );
}
