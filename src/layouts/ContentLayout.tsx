import React, { useEffect, useState } from "react";

const ContentLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [activeId, setActiveId] = useState<string | null>(null);
  const [headings, setHeadings] = useState<{ id: string; text: string; level: number }[]>([]);

  useEffect(() => {
    // Get all h2 & h3 elements
    const headingElements = Array.from(document.querySelectorAll("h2, h3"));

    const newHeadings = headingElements.map((el) => {
      const id = el.id || el.textContent?.toLowerCase().replace(/\s+/g, "-") || "";
      if (!el.id) el.id = id; // Ensure the heading has an ID

      return { id, text: el.textContent || "", level: el.tagName === "H2" ? 2 : 3 };
    });

    setHeadings(newHeadings);

    // Observe sections for active state
    const observer = new IntersectionObserver(
      (entries) => {
        let visibleEntry = entries.find((entry) => entry.isIntersecting);

        if (visibleEntry) {
          setActiveId(visibleEntry.target.id);
        }
      },
      { rootMargin: "20% 0px -50% 0px", threshold: 0.2 }
    );

    headingElements.forEach((el) => observer.observe(el));

    return () => observer.disconnect();
  }, []);

  return (
  <div className="grid sm:grid-cols-[1fr_250px] gap-8 max-w-6xl mx-auto p-6">
  {/* Main Content */}
  <div className="prose max-w-none">{children}</div>

  {/* Table of Contents (Hidden on mobile) */}
  <nav className="hidden sm:block sticky top-20 max-h-screen overflow-auto">
    <h2 className="text-lg font-semibold mb-4">Table of Contents</h2>
    <ul className="space-y-2 text-sm">
      {headings
        .filter(({ text }) => text !== "Table of Contents")
        .map(({ id, text, level }) => (
          <li key={id} className={`pl-${level === 3 ? "4" : "0"}`}>
            <a
              href={`#${id}`}
              className={`block py-1 px-2 rounded-md ${
                activeId === id ? "bg-gray-200 text-blue-600 font-semibold" : "text-gray-700 hover:text-blue-500"
              }`}
            >
              {text}
            </a>
          </li>
        ))}
    </ul>
  </nav>
</div>

  );
};

export default ContentLayout;

