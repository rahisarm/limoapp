import { Component, OnInit,Input } from '@angular/core';

@Component({
  selector: 'app-text-widget',
  templateUrl: './text-widget.component.html',
  styleUrls: ['./text-widget.component.css']
})
export class TextWidgetComponent implements OnInit {

  @Input() widgetheaderfirst:string='Last In Km';
  @Input() widgetheadersecond:string='Total Used Km'
  @Input() widgetvaluefirst:number=0.0;
  @Input() widgetvaluesecond:number=0.0;
  @Input() widgeticonfirst:string='vertical_align_bottom';
  @Input() widgeticonsecond:string='compare_arrows';
  constructor() { }

  ngOnInit(): void {
  }

}
