import {
  Component,
  ElementRef,
  HostListener,
  OnDestroy,
  OnInit,
  ViewChild,
} from '@angular/core';
import { map, Observable, shareReplay, switchMap, tap } from 'rxjs';

import Hls from 'hls.js';
import { CoursesService } from 'src/app/services/courses.service';
import { ActivatedRoute } from '@angular/router';
import { ICourse } from 'src/app/interfaces/course.interface';
import { LocalStorageService } from 'src/app/services/local-storage.service';
import { ILesson } from 'src/app/interfaces/lesson.interface';

@Component({
  selector: 'app-one-course-page',
  templateUrl: './one-course-page.component.html',
  styleUrls: ['./one-course-page.component.scss'],
})
export class OneCoursePageComponent implements OnInit, OnDestroy {
  @HostListener('window:beforeunload')
  onBeforeUnload() {
    if (this.videoElement) {
      if (this.videoElement.currentTime > 0) {
        this.localStorageService.setCourseSettings({
          id: this.idCourse,
          lesson: this.activeLesson,
          videoTime: this.videoElement.currentTime,
        });
      } else {
        this.localStorageService.deleteCourseSetting(this.idCourse);
      }
    }
  }
  @ViewChild('video') video!: ElementRef;
  course$!: Observable<ICourse>;
  idCourse!: string;
  videoURL!: string;
  activeLesson = 1;

  noVideo = false;

  videoElement!: HTMLVideoElement;

  constructor(
    private coursesService: CoursesService,
    private route: ActivatedRoute,
    private localStorageService: LocalStorageService
  ) {}

  identify(index: number, lesson: ILesson) {
    return lesson.id;
  }

  pickLesson(lesson: ILesson) {
    if (lesson.order === this.activeLesson) return;
    this.activeLesson = lesson.order;
    this.videoURL = lesson.link;
    this.videoElement = this.video?.nativeElement;
    this.createVideo();
    window.scroll(0, 0);
  }

  createVideo(videoTime = 0) {
    if (!this.videoURL) {
      this.noVideo = true;
      return;
    }
    this.videoElement = this.video?.nativeElement;
    const hls = new Hls();
    hls.loadSource(this.videoURL);
    hls.attachMedia(this.videoElement);
    hls.on(Hls.Events.MANIFEST_PARSED, () => {
      this.videoElement.controls = true;
      this.videoElement.currentTime = videoTime;
    });
  }

  ngOnInit(): void {
    this.course$ = this.route.paramMap.pipe(
      switchMap((params) => {
        return this.coursesService.getCourse(params.get('id')!).pipe(
          map((course) => {
            course.lessons.sort((a, b) => a.order - b.order);
            return course;
          }),
          tap((course) => {
            if (this.idCourse) return;
            this.idCourse = course.id;
            const settings = this.localStorageService.getCourseSettings(
              course.id
            );
            if (!settings) {
              this.videoURL = course.lessons[0].link;
              this.createVideo();
            } else {
              this.activeLesson = settings.lesson;
              this.videoURL = course.lessons[settings.lesson - 1].link;
              this.createVideo(settings.videoTime);
            }
          })
        );
      }),
      shareReplay({ refCount: true })
    );
  }

  ngOnDestroy(): void {
    if (this.videoElement) {
      if (this.videoElement.currentTime > 0) {
        this.localStorageService.setCourseSettings({
          id: this.idCourse,
          lesson: this.activeLesson,
          videoTime: this.videoElement.currentTime,
        });
      } else {
        this.localStorageService.deleteCourseSetting(this.idCourse);
      }
    }
  }
}
