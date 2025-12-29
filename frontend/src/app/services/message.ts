import { Injectable,Inject, inject } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';

@Injectable({
  providedIn: 'root',
})
export class Message {
  private snackBar = inject(MatSnackBar);

  success(message:string){
    this.open(message, 'success-snackbar');
  }
  error(message:string){
    this.open(message,'info-snackbar');
  }
  info(message:string){
    this.open(message,'info-snackbar');
  }
  private open(message:string, panelClass:string){
    this.snackBar.open(message,'Close',{
      duration:3000,
      horizontalPosition:'right',
      verticalPosition:'top',
      panelClass,
    })
  }

}
