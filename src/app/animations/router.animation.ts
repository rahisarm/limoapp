import{transition,trigger,group,query,style,animate} from '@angular/animations'
export class RouterAnimation {
    static routeSlide =
    trigger('routeSlide', [
      transition('* <=> *', [
        group([
          query(':enter', [
            style({transform: 'translateX({{offsetEnter}}%)'}),
            animate('0.4s ease-in-out', style({transform: 'translateX(0%)'}))
          ], {optional: true}),
          query(':leave', [
            style({transform: 'translateX(0%)'}),
            animate('0.4s ease-in-out', style({transform: 'translateX({{offsetLeave}}%)'}))
          ], {optional: true}),
        ])
      ]),
    ]);
}
