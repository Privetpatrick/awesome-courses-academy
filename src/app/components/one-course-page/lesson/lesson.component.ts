import { Component, Input, Output } from '@angular/core';
import { Subject } from 'rxjs';

import { ILesson } from 'src/app/interfaces/lesson.interface';

@Component({
  selector: 'app-lesson',
  templateUrl: './lesson.component.html',
  styleUrls: ['./lesson.component.scss'],
})
export class LessonComponent {
  @Input() lesson!: ILesson;
  @Input() activeLesson!: number;
  @Output() pickLessonSubject = new Subject<ILesson>();

  pickLesson(lesson: ILesson) {
    this.pickLessonSubject.next(lesson);
  }
}
