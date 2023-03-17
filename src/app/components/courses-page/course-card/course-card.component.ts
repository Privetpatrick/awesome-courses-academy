import {
  Component,
  ElementRef,
  HostListener,
  Input,
  ViewChild,
} from '@angular/core';

import Hls from 'hls.js';
import { Observable, of } from 'rxjs';
import { IPreviewCourse } from 'src/app/interfaces/preview-course.interface';

@Component({
  selector: 'app-course-card',
  templateUrl: './course-card.component.html',
  styleUrls: ['./course-card.component.scss'],
})
export class CourseCardComponent {
  @Input() course!: IPreviewCourse;
  @ViewChild('video') video!: ElementRef;
  @HostListener('mouseover') mouseover(e: Event) {
    if (!this.mouseOver) {
      this.mouseOver = true;
      this.createVideo();
    }
    return;
  }
  @HostListener('mouseleave') mouseleave(e: Event) {
    this.mouseOver = false;
    if (!this.videoElement || this.noVideo) return;
    this.videoElement.pause();
    this.videoElement.src = '';
  }

  mouseOver = false;
  noVideo = false;
  noVideo$: Observable<boolean> = of(false);

  videoElement!: HTMLVideoElement;

  createVideo() {
    if (this.noVideo) return;
    if (!this.course.meta.courseVideoPreview.link) return;
    this.videoElement = this.video?.nativeElement;
    var hls = new Hls();
    hls.loadSource(this.course.meta.courseVideoPreview.link);
    hls.attachMedia(this.videoElement);
    hls.on(Hls.Events.ERROR, (event, data) => {
      if (data.type === 'networkError') {
        this.noVideo = true;
        this.noVideo$ = of(true);
      }
    });
    hls.on(Hls.Events.MANIFEST_PARSED, () => {
      this.videoElement.muted = true;
      this.videoElement
        .play()
        .catch((err) => console.log('Video download aborted.'));
    });
  }
}
