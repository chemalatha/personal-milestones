export interface Milestone {
  milestoneid: number;
  day: number;
  month: number;
  year: number;
  activitycodes?: string[];
  description: string;
  createdAt: string;
  updatedAt: string;
}
