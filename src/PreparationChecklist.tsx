import { useId, type Dispatch, type SetStateAction } from "react";
import { consultationPreparation, practiceAreas } from "./data";
import { serviceGuidance } from "./serviceData";

export type PreparationState = Record<string, string[]>;
export function PreparationChecklist({
  practiceId,
  onPracticeChange,
  checkedByMatter,
  setCheckedByMatter,
  consultationHref,
}: {
  practiceId: string;
  onPracticeChange: (id: string) => void;
  checkedByMatter: PreparationState;
  setCheckedByMatter: Dispatch<SetStateAction<PreparationState>>;
  consultationHref: string;
}) {
  const selectId = useId();
  const area = practiceAreas.find((item) => item.id === practiceId);
  const guidance = area ? serviceGuidance[area.id] : null;
  const items = guidance?.preparation ?? consultationPreparation;
  const key = area?.id ?? "general";
  const checked = checkedByMatter[key] ?? [];
  return (
    <div className="preparation-checklist">
      <div className="preparation-heading">
        <h3>Consultation checklist</h3>
      </div>
      <label className="preparation-select" htmlFor={selectId}>
        Prepare for
        <select
          aria-label="Prepare for"
          id={selectId}
          value={practiceId}
          onChange={(event) => onPracticeChange(event.target.value)}
        >
          <option value="">A general first consultation</option>
          {practiceAreas.map((item) => (
            <option value={item.id} key={item.id}>
              {item.shortTitle}
            </option>
          ))}
        </select>
      </label>
      <p className="preparation-topic" aria-live="polite">
        {area
          ? `${area.shortTitle}: documents and details to have ready.`
          : "Start with these five essentials."}
      </p>
      <span className="preparation-count" aria-live="polite">
        {checked.length} / {items.length} prepared
      </span>
      <progress
        value={checked.length}
        max={items.length}
        aria-label="Consultation preparation progress"
      />
      <fieldset>
        <legend className="sr-only">
          {area
            ? `Prepare for ${area.shortTitle}`
            : "Prepare for your first consultation"}
        </legend>
        {items.map((item) => (
          <label key={item}>
            <input
              type="checkbox"
              checked={checked.includes(item)}
              onChange={(event) => {
                const selected = event.target.checked;
                setCheckedByMatter((previous) => ({
                  ...previous,
                  [key]: selected
                    ? [...(previous[key] ?? []), item]
                    : (previous[key] ?? []).filter((value) => value !== item),
                }));
              }}
            />
            <span>{item}</span>
          </label>
        ))}
      </fieldset>
      {guidance && (
        <details className="preparation-questions">
          <summary>Questions for your meeting</summary>
          <ul>
            {guidance.questions.map((question) => (
              <li key={question}>{question}</li>
            ))}
          </ul>
        </details>
      )}
      <p>
        Gather what is available; the firm will confirm what your matter needs.
        Keep sensitive documents for an agreed secure channel. Your checklist
        stays in this page and resets on reload.
      </p>
      <a className="button button-green" href={consultationHref}>
        Prepare a consultation enquiry
      </a>
    </div>
  );
}
