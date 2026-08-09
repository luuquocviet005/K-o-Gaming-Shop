"use client";

import { useState } from "react";
import { site } from "@/lib/site";
import { CheckIcon, MailIcon } from "@/components/icons";

type Fields = { name: string; contact: string; message: string };
type Errors = Partial<Record<keyof Fields, string>>;

/**
 * Trang tĩnh nên không có server nhận form. Thay vì giả vờ "đã gửi", form này
 * mở sẵn ứng dụng email của khách với nội dung đã điền — khách chỉ cần bấm Gửi.
 *
 * Muốn form gửi thẳng vào hộp thư? Xem mục "Nâng cấp form liên hệ" trong README
 * (Formspree / Web3Forms — dán một URL là xong, không cần backend).
 */
export function ContactForm() {
  const [fields, setFields] = useState<Fields>({
    name: "",
    contact: "",
    message: "",
  });
  const [errors, setErrors] = useState<Errors>({});
  const [sent, setSent] = useState(false);

  function validate(values: Fields): Errors {
    const next: Errors = {};
    if (values.name.trim().length < 2)
      next.name = "Cho tụi mình xin tên với ạ (ít nhất 2 ký tự).";
    if (values.contact.trim().length < 6)
      next.contact = "Nhập số điện thoại hoặc email để tụi mình liên hệ lại.";
    if (values.message.trim().length < 10)
      next.message = "Mô tả rõ hơn một chút giúp tụi mình tư vấn đúng hơn.";
    return next;
  }

  function update(key: keyof Fields, value: string) {
    setFields((f) => ({ ...f, [key]: value }));
    // Lỗi biến mất ngay khi người dùng sửa, không bắt chờ tới lúc bấm gửi
    if (errors[key]) setErrors((e) => ({ ...e, [key]: undefined }));
  }

  function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    const found = validate(fields);
    setErrors(found);
    if (Object.keys(found).length > 0) {
      document.getElementById(`field-${Object.keys(found)[0]}`)?.focus();
      return;
    }

    const subject = `[Website] Tư vấn cho ${fields.name.trim()}`;
    const body = [
      `Tên: ${fields.name.trim()}`,
      `Liên hệ: ${fields.contact.trim()}`,
      "",
      fields.message.trim(),
    ].join("\n");

    window.location.href = `mailto:${site.contact.email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    setSent(true);
  }

  return (
    <form
      onSubmit={onSubmit}
      noValidate
      className="rounded-[1.75rem] border border-border bg-surface p-6 sm:p-8"
    >
      <h2 className="font-display text-xl font-extrabold text-fg">
        Gửi câu hỏi
      </h2>
      <p className="mt-1.5 text-sm text-fg-muted">
        Điền vào đây rồi bấm gửi — ứng dụng email của bạn sẽ mở sẵn nội dung.
      </p>

      <div className="mt-6 space-y-5">
        <Field
          id="field-name"
          label="Tên của bạn"
          error={errors.name}
          value={fields.name}
          onChange={(v) => update("name", v)}
          placeholder="Nguyễn Văn A"
          autoComplete="name"
        />

        <Field
          id="field-contact"
          label="Số điện thoại hoặc email"
          error={errors.contact}
          value={fields.contact}
          onChange={(v) => update("contact", v)}
          placeholder="0912 345 678"
          autoComplete="tel"
          hint="Tụi mình dùng thông tin này chỉ để trả lời bạn."
        />

        <div>
          <label
            htmlFor="field-message"
            className="block text-sm font-semibold text-fg"
          >
            Nội dung
          </label>
          <textarea
            id="field-message"
            rows={5}
            value={fields.message}
            onChange={(e) => update("message", e.target.value)}
            placeholder="Ví dụ: mình có 5 triệu, muốn mua chuột + bàn phím chơi Valorant…"
            aria-invalid={!!errors.message}
            aria-describedby={errors.message ? "err-message" : undefined}
            className={`mt-2 w-full resize-y rounded-2xl border bg-surface-2 p-4 text-sm text-fg placeholder:text-fg-subtle focus:bg-surface focus:outline-none ${
              errors.message
                ? "border-danger focus:border-danger"
                : "border-border focus:border-primary"
            }`}
          />
          {errors.message && (
            <p id="err-message" role="alert" className="mt-1.5 text-sm text-danger">
              {errors.message}
            </p>
          )}
        </div>
      </div>

      <button
        type="submit"
        className="mt-7 inline-flex h-14 w-full cursor-pointer items-center justify-center gap-2.5 rounded-full bg-primary px-8 text-base font-semibold text-on-primary transition-all duration-200 hover:bg-primary-hover active:scale-[0.98] sm:w-auto"
      >
        <MailIcon width={20} height={20} />
        Soạn email gửi đi
      </button>

      {sent && (
        <p
          role="status"
          className="mt-4 inline-flex items-center gap-2 rounded-2xl bg-primary-soft px-4 py-3 text-sm font-medium text-primary-ink"
        >
          <CheckIcon width={17} height={17} />
          Đã mở ứng dụng email. Nếu không thấy, gửi trực tiếp tới {site.contact.email}.
        </p>
      )}
    </form>
  );
}

function Field({
  id,
  label,
  value,
  onChange,
  error,
  hint,
  placeholder,
  autoComplete,
}: {
  id: string;
  label: string;
  value: string;
  onChange: (v: string) => void;
  error?: string;
  hint?: string;
  placeholder?: string;
  autoComplete?: string;
}) {
  const hintId = hint ? `${id}-hint` : undefined;
  const errId = error ? `${id}-err` : undefined;

  return (
    <div>
      {/* Nhãn luôn hiển thị — không dùng placeholder thay nhãn */}
      <label htmlFor={id} className="block text-sm font-semibold text-fg">
        {label}
      </label>
      <input
        id={id}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        autoComplete={autoComplete}
        aria-invalid={!!error}
        aria-describedby={[errId, hintId].filter(Boolean).join(" ") || undefined}
        className={`mt-2 h-13 w-full rounded-2xl border bg-surface-2 px-4 text-sm text-fg placeholder:text-fg-subtle focus:bg-surface focus:outline-none ${
          error ? "border-danger focus:border-danger" : "border-border focus:border-primary"
        }`}
      />
      {error ? (
        <p id={errId} role="alert" className="mt-1.5 text-sm text-danger">
          {error}
        </p>
      ) : hint ? (
        <p id={hintId} className="mt-1.5 text-xs text-fg-subtle">
          {hint}
        </p>
      ) : null}
    </div>
  );
}
