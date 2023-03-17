import { ILesson } from './lesson.interface';
import { IMeta } from './meta.interface';

export interface ICourse {
  containsLockedLessons: boolean;
  description: string;
  duration: number;
  id: string;
  launchDate: string;
  lessons: ILesson[];
  meta: IMeta;
  previewImageLink: string;
  rating: number;
  status: string;
  tags: string[];
  title: string;
}
