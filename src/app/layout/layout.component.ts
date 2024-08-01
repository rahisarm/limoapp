import { Component, OnInit, SimpleChanges } from '@angular/core';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { ToolbarService } from '../services/toolbar.service';

@Component({
  selector: 'app-layout',
  templateUrl: './layout.component.html',
  styleUrls: ['./layout.component.css']
})
export class LayoutComponent implements OnInit {
  isLoginPage: boolean=false;
  pageTitle:any='';
  constructor(private activeroute:ActivatedRoute, private router: Router,private toolbarservice:ToolbarService) {
    //console.log(this.router);
    this.isLoginPage = this.router.url.includes('login') || this.router.url=='/';
    /*this.toolbarservice.data$.subscribe((data)=>{
      console.log(data);
      this.pageTitle=data;
    });*/
  }
  ngOnInit(): void {
    
    this.router.events.subscribe((event)=>{
      if(event instanceof NavigationEnd){

        this.isLoginPage = this.router.url.includes('login') || this.router.url=='/';
        const activeroute=this.router.url.replace('/','')
        this.router.config.forEach((value)=>{
          
          if(activeroute==value.path){
            this.pageTitle=value.title;  
            return false;
          }
        })
      }
    });
  }

}
