import type { ItemType } from "./types/types";

export const formatRelativeTime = (dateString: Date | undefined): string => {
  if (!dateString) return ""
  const date = new Date(dateString);
  const now = new Date();

  const diff = now.getTime() - date.getTime(); // difference in milliseconds

  const seconds = Math.floor(diff / 1000);
  const minutes = Math.floor(diff / (1000 * 60));
  const hours = Math.floor(diff / (1000 * 60 * 60));
  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  const months = Math.floor(days / 30);
  const years = Math.floor(days / 365);

  if (seconds < 5) return 'just now';
  if (seconds < 60) return `${seconds} seconds ago`;
  if (minutes < 60) return `${minutes} minute${minutes !== 1 ? 's' : ''} ago`;
  if (hours < 24) return `${hours} hour${hours !== 1 ? 's' : ''} ago`;
  if (days < 30) return `${days} day${days !== 1 ? 's' : ''} ago`;
  if (months < 12) return `${months} month${months !== 1 ? 's' : ''} ago`;
  return `${years} year${years !== 1 ? 's' : ''} ago`;
};

export const formatSize = (bytes: number | undefined, decimals = 2): string => {
  if (!bytes) return ""
  if (bytes === 0) return '0 Bytes';

  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB'];

  const i = Math.floor(Math.log(bytes) / Math.log(k));

  const size = parseFloat((bytes / Math.pow(k, i)).toFixed(dm));

  return `${size} ${sizes[i]}`;
};

export const formatTime = (time: number): string => {
  const hours = Math.floor(time / 3600);
  const minutes = Math.floor((time % 3600) / 60);
  const seconds = Math.floor(time % 60);

  const paddedMinutes = hours > 0 ? `${minutes}`.padStart(2, '0') : `${minutes}`;
  const paddedSeconds = `${seconds}`.padStart(2, '0');

  return hours > 0
    ? `${hours}:${paddedMinutes}:${paddedSeconds}`
    : `${minutes}:${paddedSeconds}`;
};

export const getLimit = () => {
    if (window.innerWidth < 600) return { initialLimit: 3, limit: 2}
    else if (window.innerWidth < 767) return { initialLimit: 10, limit: 2}
    // else if (window.innerWidth < 1279) return { initialLimit: 15, limit: 3}
    else if (window.innerWidth < 1920) return { initialLimit: 20, limit: 5}
    else return { initialLimit: 30, limit: 6}
}

function getGroupLabel(modified: string | Date): string {
  const date = typeof modified === "string" ? new Date(modified) : modified;

  if (!(date instanceof Date) || isNaN(date.getTime())) {
    // invalid date, fallback label
    return "Unknown";
  }

  const now = new Date();

  const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const startOfModified = new Date(date.getFullYear(), date.getMonth(), date.getDate());

  const diffTime = startOfToday.getTime() - startOfModified.getTime();
  const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

  if (diffDays === 0) return "Today";
  if (diffDays === 1) return "Yesterday";
  if (diffDays === 2) return "2 days ago";

  const nowDay = now.getDay();
  const startOfThisWeek = new Date(now);
  startOfThisWeek.setDate(now.getDate() - nowDay);

  const startOfLastWeek = new Date(startOfThisWeek);
  startOfLastWeek.setDate(startOfThisWeek.getDate() - 7);

  const endOfLastWeek = new Date(startOfThisWeek);
  endOfLastWeek.setDate(startOfThisWeek.getDate() - 1);

  if (date >= startOfThisWeek) return "This Week";
  if (date >= startOfLastWeek && date <= endOfLastWeek) return "Last Week";

  const thisMonth = now.getMonth();
  const thisYear = now.getFullYear();

  const modifiedMonth = date.getMonth();
  const modifiedYear = date.getFullYear();

  if (modifiedYear === thisYear && modifiedMonth === thisMonth) return "This Month";

  const lastMonthDate = new Date(now);
  lastMonthDate.setMonth(thisMonth - 1);

  if (
    modifiedYear === lastMonthDate.getFullYear() &&
    modifiedMonth === lastMonthDate.getMonth()
  ) {
    return "Last Month";
  }

  if (modifiedYear === thisYear) return "Earlier This Year";
  if (modifiedYear === thisYear - 1) return "Last Year";

  return "Years Ago";
}


export function groupByDate(data: ItemType[]) {
  const groups: Record<string, ItemType[]> = {};

  for (const item of data) {
    if ('modifiedAt' in item && item.modifiedAt) {
      const label = getGroupLabel(item.modifiedAt);
      if (!groups[label]) groups[label] = [];
      groups[label].push(item);
    } else {
      if (!groups["Uncategorized"]) groups["Uncategorized"] = [];
      groups["Uncategorized"].push(item);
    }
  }

  return groups;
}

export const groupOrder = [
  "Today",
  "Yesterday",
  "2 days ago",
  "This Week",
  "Last Week",
  "This Month",
  "Last Month",
  "Earlier This Year",
  "Last Year",
  "Years Ago",
  "Uncategorized" // Optional
];
