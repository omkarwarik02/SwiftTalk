import { Component,OnDestroy,OnInit,inject } from '@angular/core';
import {MatButtonModule} from '@angular/material/button';
import {MatCardModule} from '@angular/material/card';
import {MatIconModule} from '@angular/material/icon';
import {MatDividerModule} from '@angular/material/divider';
import {MatToolbarModule} from '@angular/material/toolbar';
import { Router } from '@angular/router';


@Component({
  selector: 'app-home',
  standalone:true,
  imports: [MatButtonModule,MatCardModule,MatIconModule,MatDividerModule,MatToolbarModule],
  templateUrl: './home.html',
  styleUrl: './home.scss',
})
export class Home implements OnInit,OnDestroy {
  private router = inject(Router)
   ngOnInit() {
    document.body.classList.add('no-scroll');
  }

  ngOnDestroy() {
    document.body.classList.remove('no-scroll');
  }
  chat(){
    this.router.navigate(['/chat-list'])

  }

}
