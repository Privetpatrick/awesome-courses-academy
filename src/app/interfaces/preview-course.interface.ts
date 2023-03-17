import { IMeta } from './meta.interface';

export interface IPreviewCourse {
  id: string;
  title: string;
  launchDate: string;
  containsLockedLessons: boolean;
  description: string;
  duration: number;
  lessonsCount: number;
  meta: IMeta;
  rating: number;
  status: string;
  tags: string[];
  previewImageLink: string;
}
