import { Injectable } from '@angular/core';

import { ICourseSettings } from '../interfaces/course-settings.interface';
import { LOCAL_STORAGE_KEY } from '../shared/constants';

@Injectable({
  providedIn: 'root',
})
export class LocalStorageService {
  constructor() {}

  setCourseSettings(data: ICourseSettings) {
    if (this.getCourseSettings(data.id)) this.deleteCourseSetting(data.id);
    let storage = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (!storage)
      return localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify([data]));
    const coursesSettings = JSON.parse(storage) as ICourseSettings[];
    coursesSettings.push(data);
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(coursesSettings));
  }

  getCourseSettings(id: string): ICourseSettings | null {
    const storage = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (!storage) return null;
    const settingsArray = JSON.parse(storage) as ICourseSettings[];
    const courseSetting = settingsArray.filter((v) => v.id === id)[0];
    if (!courseSetting) return null;
    return courseSetting;
  }

  deleteCourseSetting(id: string) {
    const storage = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (!storage) return;
    const settingsArray = JSON.parse(storage) as ICourseSettings[];
    const newSettingsArray = settingsArray.filter((v) => v.id !== id);
    if (newSettingsArray.length === 0)
      return localStorage.removeItem(LOCAL_STORAGE_KEY);
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(newSettingsArray));
  }
}
