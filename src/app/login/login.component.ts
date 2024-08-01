import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup,Validators,AbstractControl } from '@angular/forms';
import { AuthService } from '../services/auth.service';
import { Router} from '@angular/router';
import {MatSnackBar} from '@angular/material/snack-bar';
import { NgxSpinnerService } from 'ngx-spinner';
@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  loginForm=new FormGroup({
    username: new FormControl(''),
    password:new FormControl('')
  });
  submitted=false;
  constructor(
    private formBuilder:FormBuilder,
    private authService:AuthService,
    private router:Router,
    private _snackbar:MatSnackBar,
    private SpinnerService:NgxSpinnerService
    ) { 
  }
  
  ngOnInit(): void {
    /*let loginstatus=localStorage.getItem("token");
    if(loginstatus!=""|| loginstatus!=undefined){
      this.router.navigate(['/home']);
    }*/
    this.loginForm=this.formBuilder.group({
      username:['',Validators.required],
      password:['',Validators.required]
    })
    this.SpinnerService.hide();
  }
  onSubmit(){
    this.submitted=true;
    if(this.loginForm.invalid){
      return;
    }
    if(this.loginForm.valid){
      const formdata={
        username:this.loginForm.value.username,
        password:this.loginForm.value.password
      };
      this.authService.loginUser(formdata).subscribe({
        next:(result)=>{
          if(result.length==0){
            this._snackbar.open('No User Found','Dismiss',{duration:2000});
            this.submitted=false;
          }
          else{
            //console.log('Result1');
           // console.log(result.userdata);
          //console.log('Result2');
            //console.log(result.authresponse);
            
            this.authService.login(result.userdata[0].driverdocno,result.userdata[0].docno,result.authresponse.accessToken);
            //localStorage.setItem('token',result[0].driverdocno);
            //localStorage.setItem('userid',result[0].docno);
            this.router.navigate(['/home']);
          }
          
        },
        error:(e)=>{
          this._snackbar.open('No User Found','Dismiss',{duration:2000});
          //console.error('User Error'+e);
          this.submitted=false;
        }
      });
    }
  }  
  
  onReset(){
    this.submitted=false;
    this.loginForm.reset();
  }

  get f(): { [key: string]: AbstractControl } {
    return this.loginForm.controls;
  }

}
