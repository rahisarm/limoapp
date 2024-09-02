import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CollectionComponent } from './collection/collection.component';
import { DeliveryChildComponent } from './delivery-child/delivery-child.component';
import { HomeComponent } from './home/home.component';
import { ImagemarkerComponent } from './imagemarker/imagemarker.component';
import { InspectionComponent } from './inspection/inspection.component';
import { InspectrecieptComponent } from './inspectreciept/inspectreciept.component';
import { LoginComponent } from './login/login.component';
import { MovementComponent } from './movement/movement.component';
import { OnboardingComponent } from './onboarding/onboarding.component';
import { RecieptComponent } from './reciept/reciept.component';
import { ReplacementComponent } from './replacement/replacement.component';
import { ClientComponent } from './client/client.component';
import { AgreementComponent } from './agreement/agreement.component';
import { CheckboxlistComponent } from './checkboxlist/checkboxlist.component';
import { TestComponent } from './test/test.component';
import { AuthGuard } from './auth.guard';
import { StarttripComponent } from './starttrip/starttrip.component';
import { EndtripComponent } from './endtrip/endtrip.component';
import { ExpenseComponent } from './expense/expense.component';
import { TaskComponent } from './task/task.component';

const routes: Routes = [
  {path:'',component:OnboardingComponent,title:'Welcome'},
  {path:'home',component:HomeComponent,title:'Home',canActivate:[AuthGuard],
    children:[
      {path:'delivery-child',component:DeliveryChildComponent,title:'Delivery Update',canActivate:[AuthGuard]}
    ]
  },
  {path:'login',component:LoginComponent,title:'Login'},
  {path:'delivery-child',component:DeliveryChildComponent,title:'Delivery Update',canActivate:[AuthGuard]},
  {path:'replacement',component:ReplacementComponent,title:'Replacement Update',canActivate:[AuthGuard]},
  {path:'movement',component:MovementComponent,title:'Movement Update',canActivate:[AuthGuard]},
  {path:'reciept',component:RecieptComponent,title:'Rental Reciept',canActivate:[AuthGuard]},
  {path:'inspection',component:InspectionComponent,title:'Vehicle Inspection',canActivate:[AuthGuard]},
  {path:'imagemarker',component:ImagemarkerComponent,title:'Image Marking',canActivate:[AuthGuard]},
  {path:'collection',component:CollectionComponent,title:'Collection Update',canActivate:[AuthGuard]},
  {path:'inspectreciept',component:InspectrecieptComponent,title:'Inspection Reciept',canActivate:[AuthGuard]},
  {path:'client',component:ClientComponent,title:'Create Client',canActivate:[AuthGuard]},
  {path:'agreement',component:AgreementComponent,title:'Create Agreement',canActivate:[AuthGuard]},
  {path:'checkboxlist',component:CheckboxlistComponent,title:'Checkbox List',canActivate:[AuthGuard]},
  {path:'test',component:TestComponent,title:'Testing Component',canActivate:[AuthGuard]},
  {path:'starttrip',component:StarttripComponent,title:'Start Trip',canActivate:[AuthGuard]},
  {path:'endtrip',component:EndtripComponent,title:'End Trip',canActivate:[AuthGuard]},
  {path:'expense',component:ExpenseComponent,title:'Expense',canActivate:[AuthGuard]},
  {path:'task',component:TaskComponent,title:'Task',canActivate:[AuthGuard]},
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
