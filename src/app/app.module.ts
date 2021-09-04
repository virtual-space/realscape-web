import { BrowserModule } from '@angular/platform-browser';
import { NgModule, APP_INITIALIZER  } from '@angular/core';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { initializer } from './app-init';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { CalendarModule, DateAdapter } from 'angular-calendar';
import { adapterFactory } from 'angular-calendar/date-adapters/date-fns';
import {
  MatButtonModule,
  MatButtonToggleModule, MatCardModule, MatCheckboxModule, MatChipsModule, MatDialogModule, MatFormFieldModule,
  MatIconModule,
  MatInputModule,
  MatMenuModule, MatPaginatorModule, MatSelectModule,
  MatSidenavModule,
  MatSlideToggleModule,
  MatSliderModule,
  MatProgressSpinnerModule,
  MatProgressBarModule,
  MatTabsModule,
  MatToolbarModule,
  MatTooltipModule,
  MatSnackBarModule
} from "@angular/material";
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {FlexLayoutModule} from "@angular/flex-layout";
import { ImageViewerModule } from "ngx-image-viewer";
import { MatVideoModule } from 'mat-video';
import {HTTP_INTERCEPTORS, HttpClientModule} from '@angular/common/http';
import {NgxMapboxGLModule} from "ngx-mapbox-gl";
import { MapViewComponent } from './map-view/map-view.component';
import { ListViewComponent } from './list-view/list-view.component';
import { ListItemComponent } from './list-item/list-item.component';
import { ItemComponent } from './item/item.component';
import { VisualViewComponent } from './visual-view/visual-view.component';
import { CreateItemComponent } from './create-item/create-item.component';
import {QRCodeComponent, QRCodeModule} from 'angularx-qrcode';
import { QrCodeViewComponent } from './qr-code/qr-code.component';
import { LocationComponent } from './location/location.component';
import { EditItemComponent } from './edit-item/edit-item.component';
import { DeleteItemComponent } from './delete-item/delete-item.component';
import { EngineComponent } from './engine/engine.component';
import { ContentViewComponent } from './content-view/content-view.component';
import { HomeViewComponent } from './home-view/home-view.component';
import { MainViewComponent } from './main-view/main-view.component';
import { SearchViewComponent } from './search-view/search-view.component';
import { AroundViewComponent } from './around-view/around-view.component';
import { RealScapeComponent } from './real-scape/real-scape.component';
import { UploadFileComponent } from './upload-file/upload-file.component';
import { ImageComponent } from './image/image.component';
import { VideoComponent } from './video/video.component';
import { QueryComponent } from './query/query.component';
import { EditQueryComponent } from './edit-query/edit-query.component';
import {MatAutocompleteModule} from "@angular/material/autocomplete";
import {MatExpansionModule} from "@angular/material/expansion";
import { ViewComponent } from './view/view.component';
import {NgxDocViewerModule} from "ngx-doc-viewer";
import { DocumentComponent } from './document/document.component';
import { EditViewComponent } from './edit-view/edit-view.component';
import {MatTableModule} from "@angular/material/table";
import { LayoutComponent } from './layout/layout.component';
import {NgxExtendedPdfViewerModule} from "ngx-extended-pdf-viewer";
import { ItemContentComponent } from './item-content/item-content.component';
import { ItemViewComponent } from './item-view/item-view.component';
import { CardViewComponent } from './card-view/card-view.component';
import { CalendarViewComponent } from './calendar-view/calendar-view.component';
import { BoardViewComponent } from './board-view/board-view.component';
import { SceneViewComponent } from './scene-view/scene-view.component';
import {DragDropModule} from "@angular/cdk/drag-drop";
import { ScheduleItemComponent } from './schedule-item/schedule-item.component';
import {NgxMaterialTimepickerModule} from "ngx-material-timepicker";
import {MatDatepickerModule} from "@angular/material/datepicker";
import {MatNativeDateModule} from "@angular/material/core";
import {MatDividerModule} from "@angular/material/divider";
import { BoardItemComponent } from './board-item/board-item.component';
import { AppViewComponent } from './app-view/app-view.component';
import { CallbackComponent } from './callback/callback.component';
import {AuthInterceptor} from "./auth-interceptor";
import { LoginComponent } from './login/login.component';

const EMBEDLY_KEY = 'EMBEDLY_KEY';

@NgModule({
  declarations: [
    AppComponent,
    MapViewComponent,
    ListViewComponent,
    ListItemComponent,
    ItemComponent,
    VisualViewComponent,
    CreateItemComponent,
    QrCodeViewComponent,
    LocationComponent,
    EditItemComponent,
    DeleteItemComponent,
    EngineComponent,
    ContentViewComponent,
    HomeViewComponent,
    MainViewComponent,
    SearchViewComponent,
    AroundViewComponent,
    RealScapeComponent,
    UploadFileComponent,
    ImageComponent,
    VideoComponent,
    QueryComponent,
    EditQueryComponent,
    ViewComponent,
    DocumentComponent,
    EditViewComponent,
    LayoutComponent,
    ItemContentComponent,
    ItemViewComponent,
    CardViewComponent,
    CalendarViewComponent,
    BoardViewComponent,
    SceneViewComponent,
    ScheduleItemComponent,
    BoardItemComponent,
    AppViewComponent,
    CallbackComponent,
    LoginComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    DragDropModule,
    FlexLayoutModule,
    FormsModule,
    MatAutocompleteModule,
    HttpClientModule,
    MatExpansionModule,
    MatButtonModule,
    MatButtonToggleModule,
    MatCardModule,
    MatChipsModule,
    MatDialogModule,
    MatDividerModule,
    MatDatepickerModule,
    MatFormFieldModule,
    MatNativeDateModule,
    MatMenuModule,
    MatPaginatorModule,
    MatSelectModule,
    MatSidenavModule,
    MatSliderModule,
    MatSlideToggleModule,
    MatTabsModule,
    MatTableModule,
    MatToolbarModule,
    MatIconModule,
    MatInputModule,
    MatCheckboxModule,
    MatTooltipModule,
    MatProgressSpinnerModule,
    MatProgressBarModule,
    MatSnackBarModule,
    ReactiveFormsModule,
    QRCodeModule,
    NgxMapboxGLModule.withConfig({
      accessToken: 'pk.eyJ1IjoidjFydHU0bHNwNGMzIiwiYSI6ImNqNHQ4ZzVrdTA0dDEzMnAwc28yZjk3eGsifQ.PSXsn_qF-GIK3kOrkgdIow', // Optionnal, can also be set per map (accessToken input of mgl-map)
      //geocoderAccessToken: 'TOKEN' // Optionnal, specify if different from the map access token, can also be set per mgl-geocoder (accessToken input of mgl-geocoder)
    }),
    ImageViewerModule.forRoot(),
    MatVideoModule,
    NgxDocViewerModule,
    NgxExtendedPdfViewerModule,
    NgxMaterialTimepickerModule,
    CalendarModule.forRoot({
      provide: DateAdapter,
      useFactory: adapterFactory,
    })
  ],
  entryComponents: [
    CreateItemComponent,
    EditQueryComponent,
    EditItemComponent,
    EditViewComponent,
    DeleteItemComponent,
    QrCodeViewComponent,
    QRCodeComponent,
    LocationComponent,
    LoginComponent,
    ListItemComponent,
    ScheduleItemComponent
  ],
  providers: [
    { provide: APP_INITIALIZER, useFactory: initializer, multi: true, deps: []},
    { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi:true }
  ],
  bootstrap: [AppComponent],
  schemas: [ CUSTOM_ELEMENTS_SCHEMA ]
})
export class AppModule { }
