import React, { useState } from 'react';
import { CheckCircle, Send } from 'lucide-react';

export default function ContactForm() {
  const [form, setForm] = useState({
    fullName: '',
    email: '',
    phone: '',
    subject: '',
    message: '',
    website: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [status, setStatus] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  const updateField = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm((current) => ({ ...current, [event.target.name]: event.target.value }));
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setStatus(null);

    if (!form.fullName.trim() || !form.email.trim() || !form.subject.trim() || !form.message.trim()) {
      setStatus({ type: 'error', message: '必須項目をすべて入力してください。' });
      return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
      setStatus({ type: 'error', message: '正しいメールアドレスを入力してください。' });
      return;
    }

    setIsSubmitting(true);
    try {
      const response = await fetch('/api/forms/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ type: 'contact', ...form }),
      });
      const result = await response.json().catch(() => ({}));
      if (!response.ok) throw new Error(result.error || '送信に失敗しました。');

      setStatus({ type: 'success', message: 'お問い合わせを送信しました。' });
      setForm({ fullName: '', email: '', phone: '', subject: '', message: '', website: '' });
    } catch (error) {
      setStatus({
        type: 'error',
        message: error instanceof Error ? error.message : '送信に失敗しました。',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const inputClass =
    'w-full rounded-lg border border-stone-300 bg-white px-3 py-2.5 text-sm text-[#00204A] outline-none transition-colors focus:border-[#108A93] focus:ring-2 focus:ring-[#108A93]/10';

  return (
    <form onSubmit={handleSubmit} className="mt-6 space-y-4" id="contact-form">
      <div>
        <h3 className="font-serif text-xl font-bold text-[#00204A]">お問い合わせ</h3>
        <p className="mt-1 text-xs leading-relaxed text-stone-500">
          送信内容は同窓会事務局の担当者へ届きます。
        </p>
      </div>

      <div className="grid gap-3 sm:grid-cols-2">
        <label className="text-xs font-bold text-stone-600">
          お名前 <span className="text-red-600">必須</span>
          <input name="fullName" value={form.fullName} onChange={updateField} className={`${inputClass} mt-1.5`} autoComplete="name" />
        </label>
        <label className="text-xs font-bold text-stone-600">
          メールアドレス <span className="text-red-600">必須</span>
          <input name="email" type="email" value={form.email} onChange={updateField} className={`${inputClass} mt-1.5`} autoComplete="email" />
        </label>
      </div>

      <label className="block text-xs font-bold text-stone-600">
        電話番号
        <input name="phone" type="tel" value={form.phone} onChange={updateField} className={`${inputClass} mt-1.5`} autoComplete="tel" />
      </label>
      <label className="block text-xs font-bold text-stone-600">
        件名 <span className="text-red-600">必須</span>
        <input name="subject" value={form.subject} onChange={updateField} className={`${inputClass} mt-1.5`} />
      </label>
      <label className="block text-xs font-bold text-stone-600">
        お問い合わせ内容 <span className="text-red-600">必須</span>
        <textarea name="message" value={form.message} onChange={updateField} className={`${inputClass} mt-1.5 min-h-32 resize-y`} />
      </label>

      <label className="sr-only" aria-hidden="true">
        ウェブサイト
        <input name="website" value={form.website} onChange={updateField} tabIndex={-1} autoComplete="off" />
      </label>

      {status && (
        <div
          role={status.type === 'error' ? 'alert' : 'status'}
          className={`rounded-lg border px-3 py-2.5 text-xs ${
            status.type === 'success'
              ? 'border-emerald-200 bg-emerald-50 text-emerald-800'
              : 'border-red-200 bg-red-50 text-red-700'
          }`}
        >
          {status.type === 'success' && <CheckCircle className="mr-1.5 inline h-4 w-4" />}
          {status.message}
        </div>
      )}

      <button
        type="submit"
        disabled={isSubmitting}
        className="inline-flex min-h-11 w-full items-center justify-center gap-2 rounded-lg bg-[#00204A] px-5 py-3 text-xs font-bold tracking-widest text-white transition-colors hover:bg-[#108A93] disabled:cursor-wait disabled:opacity-60"
      >
        <Send className="h-4 w-4" />
        {isSubmitting ? '送信中...' : 'お問い合わせを送信'}
      </button>
    </form>
  );
}
