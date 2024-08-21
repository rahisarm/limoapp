import { Component, Input, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { PostService } from '../services/post.service';
import { ToolbarService } from '../services/toolbar.service';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {
  drivername:string='';
  driverdetail:string='';
  recievedtitle:string;
  agmthidden:boolean=false;
  @Input() pagetitle:string='';
  constructor(private authService:AuthService,private toolbarservice:ToolbarService,private router:Router,private SpinnerService: NgxSpinnerService,private service:PostService) { }

  ngOnInit(): void {
    this.SpinnerService.show();
    this.service.getConfigData("appHideCreateAgmt").subscribe(resp=>{
      if(resp.length>0){
        var hideconfig=resp[0].docno;
        if(hideconfig=="1" || hideconfig==1){
          this.agmthidden=true;
        }
      }
    });
    this.service.getDriver().subscribe(response=>{
      console.log(response);
      this.drivername=response[0].drivername;
      this.driverdetail=response[0].driverdetail;
    });
  }
  onLogOut(){
    this.authService.logout();
    this.router.navigate(['\login']);
  }
  
  onRefreshTasks(){
    //this.toolbarservice.onTaskRefresh();
    const currentUrl = this.router.url;
    this.router.navigateByUrl('/', { skipLocationChange: true }).then(() => {
      this.router.navigateByUrl('\home');
    });
  }

  onPrintInspection(){
    var inspdocno=43;
    var refdocno=24617;
    var reftype='RAG';
    var printwindow=window.open(this.toolbarservice.getErpData()+'/com/operations/vehicletransactions/vehicleinspection/inspectionMobilePrint.action?insp='+inspdocno+'&agmtno='+refdocno+'&agmtype='+reftype,'_blank');
    printwindow.focus();
  }
}
