"use client";

import { useState } from "react";
import ResourceCard from "./ResourceCard";
import type { ResourceItem } from "@/data/marketing-resources";

interface ResourcesListProps {
  resources: ResourceItem[];
  allTags: string[];
}

export default function ResourcesList({ resources, allTags }: ResourcesListProps) {
  const [selectedTag, setSelectedTag] = useState<string | null>(null);

  const filteredResources =
    selectedTag === null ? resources : resources.filter((r) => r.tags.includes(selectedTag));

  const chip = (active: boolean) =>
    active
      ? { background: 'var(--navy-700)', color: '#fff', borderColor: 'var(--navy-700)' }
      : { background: '#fff', color: 'var(--muted)', borderColor: 'var(--line)' };

  return (
    <div>
      <div className="mb-8 flex flex-wrap gap-2 border-b border-[var(--line)] pb-5">
        <button
          type="button"
          onClick={() => setSelectedTag(null)}
          className="min-h-[44px] rounded-full border px-4 py-2 text-[13.5px] font-semibold"
          style={chip(selectedTag === null)}
        >
          All
        </button>
        {allTags.map((tag) => (
          <button
            key={tag}
            type="button"
            onClick={() => setSelectedTag(tag)}
            className="min-h-[44px] rounded-full border px-4 py-2 text-[13.5px] font-semibold"
            style={chip(selectedTag === tag)}
          >
            {tag}
          </button>
        ))}
      </div>
      <div className="grid gap-[22px] sm:grid-cols-2 lg:grid-cols-3">
        {filteredResources.map((item) => (
          <ResourceCard key={item.slug} {...item} />
        ))}
      </div>
    </div>
  );
}
