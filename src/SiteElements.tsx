import { useEffect, useRef, type ReactNode } from "react";
import { X } from "lucide-react";

export function Wordmark({
  footer = false,
  href = "#home",
}: {
  footer?: boolean;
  href?: string;
}) {
  return (
    <a
      className={`wordmark ${footer ? "wordmark-footer" : ""}`}
      href={href}
      aria-label="R. K. Njogu & Company Advocates — home"
    >
      <img
        className="brand-logo"
        src={`${import.meta.env.BASE_URL}firm-logo.jpg`}
        alt=""
        width="291"
        height="290"
      />
      <span>
        <span className="brand-name">R. K. NJOGU</span>
        <span className="brand-subtitle">& COMPANY ADVOCATES</span>
      </span>
    </a>
  );
}

export function Modal({
  children,
  title,
  onClose,
}: {
  children: ReactNode;
  title: string;
  onClose: () => void;
}) {
  const ref = useRef<HTMLDialogElement>(null);
  useEffect(() => {
    const dialog = ref.current!;
    const previous = document.activeElement as HTMLElement | null;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    dialog.showModal();
    return () => {
      dialog.close();
      document.body.style.overflow = previousOverflow;
      previous?.focus({ preventScroll: true });
    };
  }, []);
  return (
    <dialog
      ref={ref}
      className="content-dialog"
      aria-labelledby="dialog-title"
      onCancel={(event) => {
        event.preventDefault();
        onClose();
      }}
      onClick={(event) => {
        if (event.target === ref.current) onClose();
      }}
    >
      <div className="dialog-body">
        <button
          className="close-dialog icon-button"
          aria-label="Close dialog"
          onClick={onClose}
        >
          <X size={22} />
        </button>
        <p className="eyebrow">R. K. NJOGU & COMPANY ADVOCATES</p>
        <h2 id="dialog-title">{title}</h2>
        {children}
      </div>
    </dialog>
  );
}
