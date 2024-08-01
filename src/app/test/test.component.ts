import { Component,OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { NgxSpinnerService } from 'ngx-spinner';
import { Observable } from 'rxjs';
import { startWith, map } from 'rxjs/operators';

@Component({
  selector: 'app-test',
  templateUrl: './test.component.html',
  styleUrls: ['./test.component.css']
})
export class TestComponent implements OnInit {
  testdata=[{'text':'CDW','amount':500,'netamt':500,'maxdiscount':200},{'text':'PAI','amount':250,'netamt':250,'maxdiscount':200},{'text':'GPS','amount':500,'netamt':500,'maxdiscount':200}];
  panelOpenState:boolean=false;
  constructor(private spinner:NgxSpinnerService) { }

  ngOnInit(): void {
    this.spinner.hide();
  }

  onValueChange(value:any,item:any){
    console.log(value);
  }
}
