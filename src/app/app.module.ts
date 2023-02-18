import { NgModule, SecurityContext } from '@angular/core';
import { environment } from '../environments/environment';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';
import {DragDropModule} from '@angular/cdk/drag-drop';
import {CdkTableModule} from '@angular/cdk/table';
import {HTTP_INTERCEPTORS, HttpClientModule, HttpClient} from '@angular/common/http';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { AuthInterceptor } from './auth-interceptor';
import { SecurePipe, SecurePipe1, DenulPipe, SecurePipe2, SecurePipe3, SecurePipe4, SecurePipe5, SecurePipe6 } from './secure-pipe';
import { MainComponent } from './main/main.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { CalendarModule, DateAdapter } from 'angular-calendar';
import { adapterFactory } from 'angular-calendar/date-adapters/date-fns';

import { FlexLayoutModule } from '@angular/flex-layout';

import { MatExpansionModule } from '@angular/material/expansion'
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatTableModule } from '@angular/material/table';
import { MatDialogModule } from '@angular/material/dialog';
import { MatChipsModule } from '@angular/material/chips';
import { MatMenuModule } from '@angular/material/menu';
import { MatTabsModule } from '@angular/material/tabs';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatNativeDateModule, MatOptionModule } from '@angular/material/core';
import { MatDividerModule} from '@angular/material/divider';
import { MatSliderModule } from '@angular/material/slider';
import { MatTreeModule } from '@angular/material/tree';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatStepperModule} from '@angular/material/stepper';
import {MatCardModule} from '@angular/material/card';
import {MatTooltipModule} from '@angular/material/tooltip';

import { QRCodeModule } from 'angularx-qrcode';
import { CodemirrorModule } from '@ctrl/ngx-codemirror';
import { PdfViewerModule } from 'ng2-pdf-viewer';
import { NgxMatTimepickerModule } from 'ngx-mat-timepicker';
import { MarkdownModule } from 'ngx-markdown';
import { VgCoreModule } from '@videogular/ngx-videogular/core';
import { VgControlsModule } from '@videogular/ngx-videogular/controls';
import { VgOverlayPlayModule } from '@videogular/ngx-videogular/overlay-play';
import { VgBufferingModule } from '@videogular/ngx-videogular/buffering';
import { NgxGoogleAnalyticsModule, NgxGoogleAnalyticsRouterModule } from 'ngx-google-analytics';

import { CallbackComponent } from './callback/callback.component';
import { HomeComponent } from './home/home.component';
import { RnItemViewComponent } from './rn-item-view/rn-item-view.component';
import { RnQueryViewComponent } from './rn-query-view/rn-query-view.component';
import { RnLoginViewComponent } from './rn-login-view/rn-login-view.component';
import { RnListViewComponent } from './rn-list-view/rn-list-view.component';
import { RnCalendarViewComponent } from './rn-calendar-view/rn-calendar-view.component';
import { RnViewComponent } from './rn-view/rn-view.component';
import { RnMapViewComponent } from './rn-map-view/rn-map-view.component';
import { RnPanelViewComponent } from './rn-panel-view/rn-panel-view.component';
import { RnBoardViewComponent } from './rn-board-view/rn-board-view.component';
import { RnDocumentViewComponent } from './rn-document-view/rn-document-view.component';
import { RnImageViewComponent } from './rn-image-view/rn-image-view.component';
import { RnVideoViewComponent } from './rn-video-view/rn-video-view.component';
import { RnPageViewComponent } from './rn-page-view/rn-page-view.component';
import { RnDrawingViewComponent } from './rn-drawing-view/rn-drawing-view.component';
import { RnSceneViewComponent } from './rn-scene-view/rn-scene-view.component';
import { RnPropertiesViewComponent } from './rn-properties-view/rn-properties-view.component';
import { RnCardsViewComponent } from './rn-cards-view/rn-cards-view.component';
import { RnTreeViewComponent } from './rn-tree-view/rn-tree-view.component';
import { RnButtonViewComponent } from './rn-button-view/rn-button-view.component';
import { RnLabelViewComponent } from './rn-label-view/rn-label-view.component';
import { MatSelectModule } from '@angular/material/select';
import { QrCodeComponent } from './qr-code/qr-code.component';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { RnEditCtrlComponent } from './rn-edit-ctrl/rn-edit-ctrl.component';
import { RnAttrsCtrlComponent } from './rn-attrs-ctrl/rn-attrs-ctrl.component';
import { RnLocationCtrlComponent } from './rn-location-ctrl/rn-location-ctrl.component';
import { RnTagsCtrlComponent } from './rn-tags-ctrl/rn-tags-ctrl.component';
import { RnDateCtrlComponent } from './rn-date-ctrl/rn-date-ctrl.component';
import { RnTreeCtrlComponent } from './rn-tree-ctrl/rn-tree-ctrl.component';
import { RnQueryCtrlComponent } from './rn-query-ctrl/rn-query-ctrl.component';
import { RnLinkCtrlComponent } from './rn-link-ctrl/rn-link-ctrl.component';
import { RnButtonCtrlComponent } from './rn-button-ctrl/rn-button-ctrl.component';
import { RnLabelCtrlComponent } from './rn-label-ctrl/rn-label-ctrl.component';
import { RnQrcodeCtrlComponent } from './rn-qrcode-ctrl/rn-qrcode-ctrl.component';
import { RnItemCtrlComponent } from './rn-item-ctrl/rn-item-ctrl.component';
import { RnCtrlComponent } from './rn-ctrl/rn-ctrl.component';
import { RnTypeSelectCtrlComponent } from './rn-type-select-ctrl/rn-type-select-ctrl.component';
import { RnItemSelectCtrlComponent } from './rn-item-select-ctrl/rn-item-select-ctrl.component';
import { RnFormCtrlComponent } from './rn-form-ctrl/rn-form-ctrl.component';
import { RnSelectCtrlComponent } from './rn-select-ctrl/rn-select-ctrl.component';
import { RnDialogComponent } from './rn-dialog/rn-dialog.component';
import { RnMsgBoxComponent } from './rn-msg-box/rn-msg-box.component';
import { RnCardViewComponent } from './rn-card-view/rn-card-view.component';
import { RnFuncCtrlComponent } from './rn-func-ctrl/rn-func-ctrl.component';
import { RnUploadCtrlComponent } from './rn-upload-ctrl/rn-upload-ctrl.component';
import { RnTabsCtrlComponent } from './rn-tabs-ctrl/rn-tabs-ctrl.component';
import { RnTabCtrlComponent } from './rn-tab-ctrl/rn-tab-ctrl.component';
import { RnTypesCtrlComponent } from './rn-types-ctrl/rn-types-ctrl.component';
import { RnCodeCtrlComponent } from './rn-code-ctrl/rn-code-ctrl.component';
import { RnExpCtrlComponent } from './rn-exp-ctrl/rn-exp-ctrl.component';
import { RnAccordionCtrlComponent } from './rn-accordion-ctrl/rn-accordion-ctrl.component';
import { RnStepsCtrlComponent } from './rn-steps-ctrl/rn-steps-ctrl.component';
import { RnStepCtrlComponent } from './rn-step-ctrl/rn-step-ctrl.component';
import { RnMediaCtrlComponent } from './rn-media-ctrl/rn-media-ctrl.component';
import { RnFormViewComponent } from './rn-form-view/rn-form-view.component';
import { OrderByPipe } from './order-by.pipe';
import { RnHiddenCtrlComponent } from './rn-hidden-ctrl/rn-hidden-ctrl.component';
import { RnCodeViewComponent } from './rn-code-view/rn-code-view.component';
import { RnAttributesViewComponent } from './rn-attributes-view/rn-attributes-view.component';


@NgModule({
  declarations: [
    AppComponent,
    MainComponent,
    CallbackComponent,
    HomeComponent,
    SecurePipe,
    SecurePipe1,
    SecurePipe2,
    SecurePipe3,
    SecurePipe4,
    SecurePipe5,
    DenulPipe,
    RnItemViewComponent,
    RnQueryViewComponent,
    RnLoginViewComponent,
    RnListViewComponent,
    RnCalendarViewComponent,
    RnViewComponent,
    RnMapViewComponent,
    RnPanelViewComponent,
    RnBoardViewComponent,
    RnDocumentViewComponent,
    RnImageViewComponent,
    RnVideoViewComponent,
    RnPageViewComponent,
    RnDrawingViewComponent,
    RnSceneViewComponent,
    RnPropertiesViewComponent,
    RnCardsViewComponent,
    RnTreeViewComponent,
    RnButtonViewComponent,
    RnLabelViewComponent,
    QrCodeComponent,
    RnEditCtrlComponent,
    RnAttrsCtrlComponent,
    RnLocationCtrlComponent,
    RnTagsCtrlComponent,
    RnDateCtrlComponent,
    RnTreeCtrlComponent,
    RnQueryCtrlComponent,
    RnLinkCtrlComponent,
    RnButtonCtrlComponent,
    RnLabelCtrlComponent,
    RnQrcodeCtrlComponent,
    RnItemCtrlComponent,
    RnCtrlComponent,
    RnTypeSelectCtrlComponent,
    RnItemSelectCtrlComponent,
    RnFormCtrlComponent,
    RnSelectCtrlComponent,
    RnDialogComponent,
    RnMsgBoxComponent,
    RnCardViewComponent,
    RnFuncCtrlComponent,
    RnUploadCtrlComponent,
    RnTabsCtrlComponent,
    RnTabCtrlComponent,
    RnTypesCtrlComponent,
    RnCodeCtrlComponent,
    RnExpCtrlComponent,
    RnAccordionCtrlComponent,
    RnStepsCtrlComponent,
    RnStepCtrlComponent,
    RnMediaCtrlComponent,
    RnFormViewComponent,
    OrderByPipe,
    RnHiddenCtrlComponent,
    RnCodeViewComponent,
    RnAttributesViewComponent
  ],
  imports: [
    BrowserModule,
    CdkTableModule,
    NgxGoogleAnalyticsModule.forRoot(environment.googleAnalytics),
    NgxGoogleAnalyticsRouterModule,
    FormsModule,
    FlexLayoutModule,
    ReactiveFormsModule,
    DragDropModule,
    AppRoutingModule,
    HttpClientModule,
    BrowserAnimationsModule,
    CalendarModule.forRoot({
      provide: DateAdapter,
      useFactory: adapterFactory,
    }),
    MatExpansionModule,
    MatToolbarModule,
    MatButtonModule,
    MatIconModule,
    MatTableModule,
    MatDialogModule,
    MatChipsModule,
    MatMenuModule,
    MatTabsModule,
    MatDatepickerModule,
    MatButtonToggleModule,
    MatSnackBarModule,
    MatSlideToggleModule,
    MatFormFieldModule,
    MatInputModule,
    MatOptionModule,
    MatSelectModule,
    MatNativeDateModule,
    MatDividerModule,
    MatAutocompleteModule,
    MatSliderModule,
    MatTreeModule,
    MatSidenavModule,
    MatProgressSpinnerModule,
    MatCardModule,
    MatTooltipModule,
    MatStepperModule,
    QRCodeModule,
    CodemirrorModule,
    PdfViewerModule,
    NgxMatTimepickerModule,
    MarkdownModule.forRoot(),
    VgCoreModule,
    VgControlsModule,
    VgOverlayPlayModule,
    VgBufferingModule
  ],
  providers: [
    { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi:true },
    SecurePipe6,
    SecurePipe2,
  ],
  bootstrap: [AppComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class AppModule { }
