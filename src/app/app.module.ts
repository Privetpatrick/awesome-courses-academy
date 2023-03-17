import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { CoursesPageComponent } from './components/courses-page/courses-page.component';
import { OneCoursePageComponent } from './components/one-course-page/one-course-page.component';
import { TokenInterceptor } from './interceptors/token.interceptor';
import { CourseCardComponent } from './components/courses-page/course-card/course-card.component';
import { ErrorInterceptor } from './interceptors/error.interceptor';
import { LessonComponent } from './components/one-course-page/lesson/lesson.component';

@NgModule({
  declarations: [
    AppComponent,
    CoursesPageComponent,
    OneCoursePageComponent,
    CourseCardComponent,
    LessonComponent,
  ],
  imports: [BrowserModule, AppRoutingModule, HttpClientModule],
  providers: [
    {
      provide: HTTP_INTERCEPTORS,
      useClass: TokenInterceptor,
      multi: true,
    },
    {
      provide: HTTP_INTERCEPTORS,
      useClass: ErrorInterceptor,
      multi: true,
    },
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
