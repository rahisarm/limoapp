import { Component, ElementRef, OnInit,ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { trigger, transition, style, animate, AnimationEvent } from '@angular/animations';
import { environment } from 'src/environments/environment';
@Component({
  selector: 'app-onboarding',
  templateUrl: './onboarding.component.html',
  styleUrls: ['./onboarding.component.css'],
  animations: [
    trigger('slideAnimation', [
      transition(':enter', [
        style({ transform: 'translateX(-100%)' }),
        animate('300ms ease-in', style({ transform: 'translateX(0)' }))
      ]),
      transition(':leave', [
        animate('300ms ease-in', style({ transform: 'translateX(100%)' }))
      ])
    ])
  ]
})
export class OnboardingComponent implements OnInit {
  isLogoVisible:boolean=true;
  @ViewChild('slider') slider:ElementRef<HTMLDivElement>;
  @ViewChild('btnnext') btnNext:ElementRef<HTMLButtonElement>;
  imagedata:any=[
    {imgsrc:environment.imgpath+"undraw3.png",heading:"Hassle free Vehicle Movement",text:"Easy updation of vehicle movement including Replacement"},
    {imgsrc:environment.imgpath+"undraw2.png",heading:"Agreement Creation",text:"One click to create Rental Agreement"},
    {imgsrc:environment.imgpath+"undraw1.png",heading:"Inspection Checking",text:"Easy to access vehicle inspection"}
  ];
  slideIndex:number;
  autoLoopInterval:any;
  bgname:string=environment.imgpath+'screen1.jpg';
  bgpath:string=environment.imgpath;
  logoname:string=environment.logoname;
  constructor(private router:Router) {
    this.slideIndex=0;
  }

  onNext(){
    var buttonText=this.btnNext.nativeElement.textContent;
    if(buttonText=='Next'){
      this.slideToNext();
    }
    else if(buttonText=='Get Started'){
      this.onSignin();
    }
  }

  slideToPrevious() {
    //this.slideIndex = (this.slideIndex - 1 + this.slider.children.length) % this.slider.children.length;
    this.updateSlider();
  }

  slideToNext() {
    if (this.slideIndex < this.imagedata.length - 1) {
      console.log('Inside Next Slider');
      this.slideIndex++;
      this.updateSlider();
    }
  }

  updateSlider(){
    const slideWidth=this.slider.nativeElement.clientWidth;
    const transformX=this.slideIndex*slideWidth;
    this.slider.nativeElement.style.transform='translateX(${transformX}px)';
    

  }

  startAutoLoop(){
    this.stopAutoLoop();
    this.autoLoopInterval=setInterval(()=>{
      if(this.slideIndex<this.imagedata.length-1){
        this.slideToNext();
      }
    },3000);
  }

  stopAutoLoop(){
    clearInterval(this.autoLoopInterval);
  }
  ngOnInit(): void {
    
    setTimeout(() => {
      this.isLogoVisible = false;
      let loginstatus=localStorage.getItem("token");
      if(loginstatus!="" && loginstatus!=undefined && loginstatus!=null && loginstatus!='null' && typeof(loginstatus)!='undefined'){
        this.router.navigate(['/home']);
      }
      else{
        //this.router.navigate(['/login']);
        //this.startAutoLoop();
      }
      
    }, 2000);
  }

  onSignin(){
    this.router.navigate(['/login']);
  }
}
