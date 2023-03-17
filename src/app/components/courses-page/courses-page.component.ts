import { Component, OnInit } from '@angular/core';
import { map, Observable, shareReplay, tap } from 'rxjs';

import { IPreviewCourse } from 'src/app/interfaces/preview-course.interface';
import { CoursesService } from 'src/app/services/courses.service';

@Component({
  selector: 'app-courses-page',
  templateUrl: './courses-page.component.html',
  styleUrls: ['./courses-page.component.scss'],
})
export class CoursesPageComponent implements OnInit {
  allCourses$!: Observable<IPreviewCourse[]>;
  paginateCourses$!: Observable<IPreviewCourse[]>;
  page: number = 1;
  pagesCount!: number;
  tableSize: number = 10;

  constructor(private coursesService: CoursesService) {}

  identify(index: number, course: IPreviewCourse) {
    return course.id;
  }

  ngOnInit(): void {
    this.allCourses$ = this.coursesService.getCourses().pipe(
      tap((courses) => {
        this.pagesCount = Math.ceil(courses.length / this.tableSize);
      })
    );

    this.paginateCourses$ = this.allCourses$.pipe(
      map((courses) => courses.slice(0, 10))
    );
  }

  changePage(page: number) {
    this.page = page;
    this.paginateCourses$ = this.allCourses$.pipe(
      map((courses) => {
        const start = page * 10 - 10;
        const end = start + 10;
        return courses.slice(start, end);
      }),
      shareReplay({ refCount: true })
    );
  }
}
