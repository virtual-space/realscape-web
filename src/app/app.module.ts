import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';
import {HTTP_INTERCEPTORS, HttpClientModule} from '@angular/common/http';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { AuthInterceptor } from './auth-interceptor';
import { MainComponent } from './main/main.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { CalendarModule, DateAdapter } from 'angular-calendar';
import { adapterFactory } from 'angular-calendar/date-adapters/date-fns';

import { FlexLayoutModule } from '@angular/flex-layout';

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

import { QRCodeModule } from 'angularx-qrcode';
import { CodemirrorModule } from '@ctrl/ngx-codemirror';

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
import { EditViewComponent } from './edit-view/edit-view.component';
import { LocationComponent } from './location/location.component';
import { MatSelectModule } from '@angular/material/select';
import { EditQueryComponent } from './edit-query/edit-query.component';
import { QrCodeComponent } from './qr-code/qr-code.component';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { RnCtrlViewComponent } from './rn-ctrl-view/rn-ctrl-view.component';
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
import { RnFunctionViewComponent } from './rn-function-view/rn-function-view.component';
import { RnCreateViewComponent } from './rn-create-view/rn-create-view.component';
import { RnEditItemViewComponent } from './rn-edit-item-view/rn-edit-item-view.component';
import { RnCreateItemViewComponent } from './rn-create-item-view/rn-create-item-view.component';
import { RnFormCtrlComponent } from './rn-form-ctrl/rn-form-ctrl.component';


@NgModule({
  declarations: [
    AppComponent,
    MainComponent,
    CallbackComponent,
    HomeComponent,
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
    EditViewComponent,
    LocationComponent,
    EditQueryComponent,
    QrCodeComponent,
    RnCtrlViewComponent,
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
    RnFunctionViewComponent,
    RnCreateViewComponent,
    RnEditItemViewComponent,
    RnCreateItemViewComponent,
    RnFormCtrlComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    FlexLayoutModule,
    ReactiveFormsModule,
    AppRoutingModule,
    HttpClientModule,
    BrowserAnimationsModule,
    CalendarModule.forRoot({
      provide: DateAdapter,
      useFactory: adapterFactory,
    }),
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
    QRCodeModule,
    CodemirrorModule
  ],
  providers: [
    { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi:true }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
