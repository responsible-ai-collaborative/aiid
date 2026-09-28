import type { ApiUsageRecord } from '../../../server/apiUsage';

// Relative to "now" because the admin page asks for a window ending today.
const daysAgo = (days: number, hour = 12) => {
  const date = new Date();
  date.setUTCDate(date.getUTCDate() - days);
  date.setUTCHours(hour, 0, 0, 0);
  return date;
};

const dayKey = (date: Date) => date.toISOString().slice(0, 10);

const apiUsage: ApiUsageRecord[] = [
  // John Doe (not the logged-in test user, whose own requests during a test add to
  // its bucket): two days inside every window (today and yesterday)
  {
    userId: '619b47ea5eed5334edfa3bbc',
    date: dayKey(daysAgo(0)),
    count: 30,
    errorCount: 2,
    deniedCount: 0,
    firstRequestAt: daysAgo(0, 9),
    lastRequestAt: daysAgo(0, 12),
    operations: { FindIncidents: 30 },
  },
  {
    userId: '619b47ea5eed5334edfa3bbc',
    date: dayKey(daysAgo(1)),
    count: 12,
    errorCount: 0,
    deniedCount: 1,
    firstRequestAt: daysAgo(1, 8),
    lastRequestAt: daysAgo(1, 17),
    operations: { FindIncidents: 12 },
  },
  // The incident editor: one day 60 days ago, so it only shows in the 90-day window
  {
    userId: '67a371b3fc0f0b924a91f636',
    date: dayKey(daysAgo(60)),
    count: 5,
    errorCount: 0,
    deniedCount: 0,
    firstRequestAt: daysAgo(60, 10),
    lastRequestAt: daysAgo(60, 11),
    operations: { FindIncident: 5 },
  },
];

export default apiUsage;
