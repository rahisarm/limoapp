import { Component, OnInit,Input } from '@angular/core';
import { FaIconLibrary} from '@fortawesome/angular-fontawesome';
import { faHouse,faCar,faReceipt,faCarTunnel, faSackDollar, faMoneyBill1} from '@fortawesome/free-solid-svg-icons';
import { Router } from '@angular/router';
import { DataService } from '../data.service';
@Component({
  selector: 'app-bottomnav',
  templateUrl: './bottomnav.component.html',
  styleUrls: ['./bottomnav.component.css']
})
export class BottomnavComponent implements OnInit {
  @Input() selectedMenu:string='home';
  constructor(library:FaIconLibrary,
    private router:Router,
    private dataservice:DataService) {
    library.addIcons(faHouse,faCar,faReceipt,faCarTunnel,faMoneyBill1);
   }

  ngOnInit(): void {
  }
  onMenuClick(type:string){
    this.selectedMenu=type;
    this.dataservice.clearTaskData();
    if(type=='home'){
      this.router.navigate(['/home']);
    }
    else if(type=='movement'){
      this.router.navigate(['/movement']);
    }
    else if(type=='receipt'){
      this.router.navigate(['/reciept']);
    }
    else if(type=='inspection'){
      this.router.navigate(['/inspection']);
    }
  }
}
