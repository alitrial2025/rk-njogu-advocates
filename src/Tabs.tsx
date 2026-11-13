import { useRef, type ReactNode } from "react";

type Tab = { id: string; label: string; count?: number; content: ReactNode };

export function Tabs({
  id,
  label,
  tabs,
  selected,
  onSelect,
}: {
  id: string;
  label: string;
  tabs: Tab[];
  selected: string;
  onSelect: (id: string) => void;
}) {
  const list = useRef<HTMLDivElement>(null);
  const tabId = (value: string) =>
    value.toLowerCase().replace(/[^a-z0-9]+/g, "-");
  return (
    <div className="tabs">
      <div ref={list} className="tab-list" role="tablist" aria-label={label}>
        {tabs.map((tab, index) => (
          <button
            key={tab.id}
            id={`${id}-tab-${tabId(tab.id)}`}
            type="button"
            role="tab"
            aria-selected={selected === tab.id}
            aria-controls={`${id}-panel-${tabId(tab.id)}`}
            tabIndex={selected === tab.id ? 0 : -1}
            onClick={() => onSelect(tab.id)}
            onKeyDown={(event) => {
              let next: number;
              if (event.key === "ArrowRight") next = (index + 1) % tabs.length;
              else if (event.key === "ArrowLeft")
                next = (index + tabs.length - 1) % tabs.length;
              else if (event.key === "Home") next = 0;
              else if (event.key === "End") next = tabs.length - 1;
              else return;
              event.preventDefault();
              onSelect(tabs[next].id);
              list.current
                ?.querySelectorAll<HTMLButtonElement>('[role="tab"]')
                [next].focus({ preventScroll: true });
            }}
          >
            {tab.label}
            {tab.count !== undefined && (
              <span className="tab-count">{tab.count}</span>
            )}
          </button>
        ))}
      </div>
      {tabs.map((tab) => (
        <div
          key={tab.id}
          id={`${id}-panel-${tabId(tab.id)}`}
          role="tabpanel"
          aria-labelledby={`${id}-tab-${tabId(tab.id)}`}
          tabIndex={0}
          hidden={selected !== tab.id}
          className="tab-panel"
        >
          {selected === tab.id && tab.content}
        </div>
      ))}
    </div>
  );
}
