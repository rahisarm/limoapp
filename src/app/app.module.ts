import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import {ReactiveFormsModule,FormsModule} from '@angular/forms';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { MatTabsModule } from '@angular/material/tabs';
import { HTTP_INTERCEPTORS, HttpClient, HttpClientModule } from '@angular/common/http';
import { HomeComponent } from './home/home.component';
import { LoginComponent } from './login/login.component';
import { MatSidenavModule} from '@angular/material/sidenav';
import {MatToolbarModule} from '@angular/material/toolbar';
import {MatIconModule} from '@angular/material/icon';
import {MatListModule} from '@angular/material/list';
import {MatButtonModule} from '@angular/material/button';
import {MatInputModule} from '@angular/material/input';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {MatDialogModule} from '@angular/material/dialog';
import {MatMenuModule} from '@angular/material/menu';
import {MatCardModule} from '@angular/material/card';
import {MatChipsModule} from '@angular/material/chips';
import {MatProgressSpinnerModule} from '@angular/material/progress-spinner';
import { DeliveryChildComponent } from './delivery-child/delivery-child.component';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule,MatRippleModule } from '@angular/material/core';
import { MatSelectModule} from '@angular/material/select';
import { DatepickerComponent } from './datepicker/datepicker.component';
import { TimepickerComponent } from './timepicker/timepicker.component';
import { NgxMaterialTimepickerModule} from 'ngx-material-timepicker';
import { DropdownComponent } from './dropdown/dropdown.component';
import { NumericinputComponent } from './numericinput/numericinput.component';
import { MatSnackBarModule} from '@angular/material/snack-bar';
import { NotificationComponent } from './notification/notification.component';
import { CollectionComponent } from './collection/collection.component';
import { ReplacementComponent } from './replacement/replacement.component';
import { MatStepperModule } from '@angular/material/stepper';
import { TextinputComponent } from './textinput/textinput.component';
import { BottomnavComponent } from './bottomnav/bottomnav.component';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { MovementComponent } from './movement/movement.component';
import { AutocompleteComponent } from './autocomplete/autocomplete.component';
import { MatAutocompleteModule} from '@angular/material/autocomplete';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { RecieptComponent } from './reciept/reciept.component';
import { ImageDrawingModule} from 'ngx-image-drawing';
import { InspectionComponent} from './inspection/inspection.component';
import { ImagemarkerComponent } from './imagemarker/imagemarker.component';
import { OnboardingComponent } from './onboarding/onboarding.component';
import { NgxSpinnerModule } from "ngx-spinner";
import { SearchFilterPipe } from './search-filter.pipe';
import { InspectrecieptComponent } from './inspectreciept/inspectreciept.component'; 
import { AngularSignaturePadModule } from '@almothafar/angular-signature-pad';
import { HashLocationStrategy,LocationStrategy } from '@angular/common';
import { ConfirmdialogComponent } from './confirmdialog/confirmdialog.component';
import { ClientComponent } from './client/client.component';
import { NavbarComponent } from './navbar/navbar.component';
import { LayoutComponent } from './layout/layout.component';
import { AgreementComponent } from './agreement/agreement.component';
import { CheckboxlistComponent } from './checkboxlist/checkboxlist.component';
import { MatBottomSheetModule} from '@angular/material/bottom-sheet';
import { MatCheckboxModule} from '@angular/material/checkbox';
import {MatExpansionModule} from '@angular/material/expansion';
import { TestComponent } from './test/test.component';
import { TextWidgetComponent } from './text-widget/text-widget.component';
import { environment } from 'src/environments/environment';
import { tap } from 'rxjs/operators';
import { ToolbarService } from './services/toolbar.service';
import { JwtInterceptor } from './jwt.interceptor';
import { StarttripComponent } from './starttrip/starttrip.component';
import { EndtripComponent } from './endtrip/endtrip.component';
import { ExpenseComponent } from './expense/expense.component';
@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    LoginComponent,
    DeliveryChildComponent,
    DatepickerComponent,
    TimepickerComponent,
    DropdownComponent,
    NumericinputComponent,
    NotificationComponent,
    CollectionComponent,
    ReplacementComponent,
    TextinputComponent,
    BottomnavComponent,
    MovementComponent,
    AutocompleteComponent,
    RecieptComponent,
    InspectionComponent,
    ImagemarkerComponent,
    OnboardingComponent,
    SearchFilterPipe,
    InspectrecieptComponent,
    ConfirmdialogComponent,
    ClientComponent,
    NavbarComponent,
    LayoutComponent,
    AgreementComponent,
    CheckboxlistComponent,
    TestComponent,
    TextWidgetComponent,
    StarttripComponent,
    EndtripComponent,
    ExpenseComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    MatSidenavModule,
    MatToolbarModule,
    MatTabsModule,
    MatIconModule,
    MatListModule,
    MatButtonModule,
    MatInputModule,
    BrowserAnimationsModule,
    MatDialogModule,
    MatMenuModule,
    FormsModule,
    ReactiveFormsModule,
    MatCardModule,
    MatChipsModule,
    MatProgressSpinnerModule,
    MatDatepickerModule,
    MatNativeDateModule,
    NgxMaterialTimepickerModule,
    MatSelectModule,
    MatSnackBarModule,
    MatStepperModule,
    FontAwesomeModule,
    MatAutocompleteModule,
    MatSlideToggleModule,
    ImageDrawingModule,
    NgxSpinnerModule,
    AngularSignaturePadModule,
    MatBottomSheetModule,
    MatCheckboxModule,
    MatExpansionModule,
    MatRippleModule
  ],
  providers: [{provide:LocationStrategy,useClass:HashLocationStrategy},
    { provide: HTTP_INTERCEPTORS, useClass: JwtInterceptor, multi: true }
  ],
  bootstrap: [AppComponent]
})
export class AppModule {
  constructor(private http:HttpClient,private toolbarservice:ToolbarService){
    //this.loadConfig();
  }

  loadConfig(){
    this.http.get<any>('assets/config.json').pipe(
      tap((config) => {
        this.toolbarservice.setAPIURLData(config.apiurl);
        this.toolbarservice.setLogonameData(config.logoname);
        console.log('Config loaded:', config);
      })
    ).subscribe();
  }
 }
