import { useEffect, useRef, useState, type RefObject } from "react";
import { ArrowUpRight, Check, Copy, X } from "lucide-react";
export function ContactDialog({
  dialogRef,
  topic,
}: {
  dialogRef: RefObject<HTMLDialogElement | null>;
  topic: string;
}) {
  const [prepared, setPrepared] = useState(false);
  const [copied, setCopied] = useState(false);
  const [copyFailed, setCopyFailed] = useState(false);
  const [brief, setBrief] = useState("");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [company, setCompany] = useState("");
  const [workload, setWorkload] = useState("");
  const statusRef = useRef<HTMLParagraphElement>(null);
  useEffect(() => {
    if (prepared) statusRef.current?.focus();
  }, [prepared]);
  useEffect(() => {
    const dialog = dialogRef.current;
    const reset = () => {
      setPrepared(false);
      setCopied(false);
      setCopyFailed(false);
    };
    dialog?.addEventListener("close", reset);
    return () => dialog?.removeEventListener("close", reset);
  }, [dialogRef]);
  const mailto = `mailto:iambruce0012@gmail.com?subject=${encodeURIComponent(`DeepInference — ${topic}`)}&body=${encodeURIComponent(brief)}`;
  return (
    <dialog
      ref={dialogRef}
      className="contact-dialog"
      aria-labelledby="dialog-title"
      aria-describedby="dialog-description"
      onClick={(event) => {
        if (event.target === event.currentTarget) {
          const rect = event.currentTarget.getBoundingClientRect();
          if (
            event.clientX < rect.left ||
            event.clientX > rect.right ||
            event.clientY < rect.top ||
            event.clientY > rect.bottom
          )
            dialogRef.current?.close();
        }
      }}
    >
      <div className="dialog__inner">
        <button
          className="icon-button dialog__close"
          aria-label="Close conversation form"
          onClick={() => dialogRef.current?.close()}
        >
          <X size={20} aria-hidden="true" />
        </button>
        <p className="eyebrow">Talk to DeepInference</p>
        <h2 id="dialog-title">
          Tell us about
          <br />
          <em>your deployment.</em>
        </h2>
        <p id="dialog-description">
          Share your workload and the performance goal you’re working toward.
        </p>
        {!prepared ? (
          <form
            onSubmit={(event) => {
              event.preventDefault();
              setBrief(
                `Hi DeepInference,\n\nI’d like to discuss ${topic.toLowerCase()}.\n\nName: ${name}\nWork email: ${email}\nCompany: ${company || "Not specified"}\n\nOur workload / challenge:\n${workload}\n\nThanks,\n${name}`,
              );
              setPrepared(true);
            }}
          >
            <div className="form-row">
              <label>
                Your name
                <input
                  name="name"
                  autoComplete="name"
                  required
                  maxLength={100}
                  placeholder="Alex Chen"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
              </label>
              <label>
                Work email
                <input
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  maxLength={254}
                  placeholder="alex@company.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </label>
            </div>
            <label>
              Company <span>(optional)</span>
              <input
                name="company"
                autoComplete="organization"
                maxLength={150}
                placeholder="Your company"
                value={company}
                onChange={(e) => setCompany(e.target.value)}
              />
            </label>
            <label>
              What would you like to improve?
              <textarea
                name="workload"
                required
                maxLength={1200}
                rows={3}
                placeholder="Models, GPUs, serving stack, or the bottleneck you’re running into…"
                value={workload}
                onChange={(e) => setWorkload(e.target.value)}
              />
            </label>
            <button className="button button--primary" type="submit">
              Prepare an introduction{" "}
              <ArrowUpRight size={17} aria-hidden="true" />
            </button>
            <p className="form-note">
              This prepares an email draft. Your details stay in this page until
              you choose to send them through your email app.
            </p>
          </form>
        ) : (
          <div className="email-handoff">
            <p role="status" tabIndex={-1} ref={statusRef}>
              <Check size={18} aria-hidden="true" /> Your introduction is ready.
            </p>
            <pre tabIndex={0} aria-label="Your introduction">
              {brief}
            </pre>
            <a href={mailto} className="button button--primary">
              Open email draft <ArrowUpRight size={17} aria-hidden="true" />
            </a>
            <button
              className="text-link"
              onClick={async () => {
                try {
                  await navigator.clipboard.writeText(brief);
                  setCopied(true);
                  setCopyFailed(false);
                } catch {
                  setCopyFailed(true);
                }
              }}
            >
              <Copy size={15} aria-hidden="true" />
              {copied ? "Copied" : "Copy introduction"}
            </button>
            <p className="form-note" aria-live="polite">
              {copyFailed
                ? "Select and copy the introduction above, then email it to iambruce0012@gmail.com."
                : "Nothing has been sent. Review and send the draft in your email app, or copy it to iambruce0012@gmail.com."}
            </p>
            <button
              className="text-link"
              onClick={() => {
                setPrepared(false);
                setCopied(false);
              }}
            >
              Edit your details
            </button>
          </div>
        )}
      </div>
    </dialog>
  );
}
