import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, Observable, shareReplay } from 'rxjs';
import { ICourse } from '../interfaces/course.interface';
import { IPreviewCourse } from '../interfaces/preview-course.interface';

import { GET_COURSES, GET_ONE_COURSE } from '../shared/constants';

@Injectable({
  providedIn: 'root',
})
export class CoursesService {
  constructor(private http: HttpClient) {}

  getCourses(): Observable<IPreviewCourse[]> {
    return this.http.get(GET_COURSES).pipe(
      map((response: any) => response.courses),
      shareReplay()
    );
  }

  getCourse(id: string): Observable<ICourse> {
    return this.http.get<ICourse>(GET_ONE_COURSE + id).pipe(shareReplay());
  }
}
