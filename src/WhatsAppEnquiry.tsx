import { useEffect, useId, useLayoutEffect, useRef, useState } from "react";
import { Check, MessageCircle } from "lucide-react";
import { firm, practiceAreas } from "./data";

type Enquiry = {
  name: string;
  message: string;
  preferredTime: string;
  practiceId: string;
};
export function WhatsAppEnquiry({
  practiceId,
  onPracticeChange,
  privacyHref,
  onPrivacy,
}: {
  practiceId: string;
  onPracticeChange: (id: string) => void;
  privacyHref: string;
  onPrivacy?: () => void;
}) {
  const id = useId();
  const [enquiry, setEnquiry] = useState<Enquiry | null>(null);
  const [copyStatus, setCopyStatus] = useState("");
  const [handoff, setHandoff] = useState(false);
  const preview = useRef<HTMLDivElement>(null);
  useEffect(() => {
    setEnquiry(null);
    setCopyStatus("");
    setHandoff(false);
  }, [practiceId]);
  useLayoutEffect(() => {
    if (enquiry) preview.current?.focus();
  }, [enquiry]);
  const area = practiceAreas.find((item) => item.id === enquiry?.practiceId);
  const text = enquiry
    ? `Hello R. K. Njogu & Company Advocates,\n\nI would like to arrange a consultation about ${area?.title ?? "a legal matter"}.\n\n${enquiry.message}\n\nName: ${enquiry.name}${enquiry.preferredTime ? `\nPreferred time: ${enquiry.preferredTime}` : ""}\n\nPlease confirm receipt, appointment availability and any consultation fee in this chat.`
    : "";
  const whatsapp = `${firm.whatsappLink}?text=${encodeURIComponent(text)}`;
  function invalidate() {
    setEnquiry(null);
    setCopyStatus("");
    setHandoff(false);
  }
  return (
    <div className="contact-form-wrap whatsapp-enquiry">
      <form
        onChange={invalidate}
        onSubmit={(event) => {
          event.preventDefault();
          const form = event.currentTarget;
          const data = new FormData(form);
          const name = String(data.get("name") ?? "").trim();
          const message = String(data.get("message") ?? "").trim();
          for (const field of ["name", "message"]) {
            const input = form.elements.namedItem(field) as
              | HTMLInputElement
              | HTMLTextAreaElement;
            input.setCustomValidity(
              input.value.trim() ? "" : "Please enter a brief response.",
            );
          }
          if (!form.reportValidity()) return;
          setEnquiry({
            name,
            message,
            practiceId,
            preferredTime: String(data.get("preferredTime") ?? "").trim(),
          });
        }}
        onInput={(event) => {
          const target = event.target;
          if (
            target instanceof HTMLInputElement ||
            target instanceof HTMLTextAreaElement
          )
            target.setCustomValidity("");
        }}
      >
        <h3>Request a consultation</h3>
        <p className="form-description">
          Tell us briefly what you need. Review your enquiry, then send it to
          the firm on WhatsApp.
        </p>
        <div className="form-row">
          <label>
            Your name <span>*</span>
            <input
              name="name"
              autoComplete="name"
              required
              maxLength={100}
              placeholder="Full name"
            />
          </label>
          <label>
            Practice area
            <select
              name="practice"
              aria-label="Practice area"
              value={practiceId}
              onChange={(event) => onPracticeChange(event.target.value)}
            >
              <option value="">I’m not sure yet</option>
              {practiceAreas.map((item) => (
                <option key={item.id} value={item.id}>
                  {item.title}
                </option>
              ))}
            </select>
          </label>
        </div>
        <label>
          Preferred consultation time{" "}
          <span className="optional">(optional)</span>
          <input
            name="preferredTime"
            placeholder="For example, Tuesday afternoon (Kenya time)"
            maxLength={100}
          />
        </label>
        <label>
          How can we help? <span>*</span>
          <textarea
            name="message"
            required
            rows={4}
            maxLength={1500}
            placeholder="A brief overview of your matter…"
          />
        </label>
        <p className="form-note">
          Keep your first message brief and avoid confidential details. An
          enquiry does not create an advocate–client relationship. Read our{" "}
          {onPrivacy ? (
            <button type="button" onClick={onPrivacy}>
              privacy notice
            </button>
          ) : (
            <a className="privacy-link" href={privacyHref}>
              privacy notice
            </a>
          )}
          .
        </p>
        <button className="button button-green" type="submit">
          Review WhatsApp enquiry
        </button>
        <p className="handoff-note">
          <MessageCircle size={15} aria-hidden="true" /> You send the message in
          WhatsApp. The firm confirms receipt and availability in the chat.
        </p>
      </form>
      {enquiry && (
        <div
          className="whatsapp-preview"
          ref={preview}
          tabIndex={-1}
          aria-labelledby={`${id}-title`}
        >
          <div className="draft-title">
            <Check size={20} aria-hidden="true" />
            <h4 id={`${id}-title`}>Your WhatsApp enquiry is ready</h4>
          </div>
          <p>
            Review your message below. It has not been sent. Continue to
            WhatsApp and tap Send.
          </p>
          <pre>{text}</pre>
          <div className="draft-actions">
            <a
              className="button button-green"
              href={whatsapp}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => setHandoff(true)}
            >
              Continue to WhatsApp
            </a>
            <button
              type="button"
              className="text-link"
              onClick={async () => {
                try {
                  await navigator.clipboard.writeText(text);
                  setCopyStatus(
                    "Enquiry copied. Paste it into your WhatsApp chat with " +
                      firm.phones.mobile +
                      ".",
                  );
                } catch {
                  setCopyStatus(
                    "Copy is unavailable. Select the message above and copy it manually.",
                  );
                }
              }}
            >
              Copy enquiry
            </button>
          </div>
          {handoff && (
            <p role="status" className="whatsapp-next-step">
              Next step: send your enquiry in WhatsApp. Wait for the firm’s
              reply to confirm receipt and appointment availability.
            </p>
          )}
          <p className="small-copy" aria-live="polite">
            {copyStatus ||
              `Chat with ${firm.phones.mobile}. If WhatsApp is unavailable, call the firm to arrange a consultation.`}
          </p>
        </div>
      )}
    </div>
  );
}
