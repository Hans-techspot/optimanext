import { type ChatHistoryItem } from "@/persistance";

interface Bin {
  category: string;
  items: ChatHistoryItem[];
}

export function binDates(_list: ChatHistoryItem[]) {
  const list = _list.slice().sort((a, b) => Date.parse(b.timestamp) - Date.parse(a.timestamp));

  const binLookup: Record<string, Bin> = {};
  const bins: Array<Bin> = [];

  for (const item of list) {
    const date = new Date(item.timestamp);
    const today = new Date();
    const yesterday = new Date();
    yesterday.setDate(today.getDate() - 1);

    let category: string;

    if (date.toDateString() === today.toDateString()) {
      category = "Today";
    } else if (date.toDateString() === yesterday.toDateString()) {
      category = "Yesterday";
    } else {
      category = date.toLocaleDateString(undefined, {
        month: "long",
        day: "numeric",
        year: "numeric",
      });
    }

    if (!binLookup[category]) {
      binLookup[category] = { category, items: [] };
      bins.push(binLookup[category]);
    }

    binLookup[category].items.push(item);
  }

  return bins;
}