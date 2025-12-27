import {
  Component,
  OnInit,
  OnDestroy,
  inject,
  ChangeDetectionStrategy,
  ChangeDetectorRef
} from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Apollo, gql } from 'apollo-angular';
import { Socket, io } from 'socket.io-client';
import { Subscription } from 'rxjs';
import { FormsModule } from '@angular/forms';

import { MatCardModule } from '@angular/material/card';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDividerModule } from '@angular/material/divider';
import { MatFormFieldModule } from '@angular/material/form-field';
import { AuthState } from '../../store/auth-state';




const MESSAGES_QUERY = gql`
  query MessagesWith($userId: ID!) {
    messagesWith(userId: $userId) {
      id
      text
      sender
      receiver
      timestamp
    }
  }
`;
const SEND_MESSAGE_MUTATION = gql`
  mutation SendMessage($receiver: ID!, $text: String!) {
    sendMessage(receiver: $receiver, text: $text) {
      id
      text
      sender
      receiver
      timestamp
    }
  }
`;




@Component({
  selector: 'app-chat',
  standalone:true,
  imports: [  FormsModule,
    MatCardModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatDividerModule,
    MatFormFieldModule
    ],
  templateUrl: './chat.html',
  styleUrl: './chat.scss',
   changeDetection: ChangeDetectionStrategy.OnPush
})
export class Chat implements OnInit,OnDestroy {
  messages: any[] = [];
  messageText = '';

  socket!:Socket | null;

  private route = inject(ActivatedRoute);
  private apollo = inject(Apollo);
  private authState = inject(AuthState);
  private cd = inject(ChangeDetectorRef);
  private router = inject(Router)
  private msgSub?: Subscription;
  private authSub?: Subscription;

  receiverId!: string ;
  currentUser!: any;

ngOnInit() {
  this.authSub = this.authState.user$.subscribe(user => {
    if (!user) return;

    this.currentUser = user;

    this.route.paramMap.subscribe(params => {
      const newReceiverId = params.get('id');
      if (!newReceiverId) return;

      // 🔥 ONLY compare after both values exist
      if (newReceiverId === user.id) {
        console.warn('Self chat blocked');
        this.router.navigate(['/chat-list']);
        return;
      }

      // prevent unnecessary reloads
      if (this.receiverId === newReceiverId) return;

      this.receiverId = newReceiverId;
      this.messages = [];
      this.loadMessage();
      this.connectSocket();
    });
  });
}


  loadMessage(){
    if(this.msgSub)this.msgSub.unsubscribe();

    this.msgSub = this.apollo.watchQuery({
      query: MESSAGES_QUERY,
      variables:{userId: this.receiverId},
      fetchPolicy:'network-only'
    }).valueChanges.subscribe((res:any)=>{
      this.messages =[...(res.data?.messagesWith || [])];
      this.cd.detectChanges();
    })
  }

  connectSocket(){
    if(this.socket) return;

  this.socket = io('http://localhost:3000', {
      withCredentials: true,
      auth:{
        userId: this.currentUser.id
      }
    });

    this.socket.on('message:new',(message:any)=>{
        const exists = this.messages.some(m => m.id === message.id);
  if (exists) return; 
      this.messages = [...this.messages, message];
this.cd.detectChanges();

    })


  }

sendMessage() {
  const text = this.messageText.trim();
  if (!text) return;

  this.apollo.mutate({
    mutation: SEND_MESSAGE_MUTATION,
    variables: {
      receiver: this.receiverId,
      text: text
    }
  }).subscribe({
    error: err => console.error('Send message failed', err)
  });

  this.messageText = '';
}



  ngOnDestroy() {
      if(this.msgSub)this.msgSub.unsubscribe();
      if(this.authSub)this.authSub.unsubscribe();

      if(this.socket){
        this.socket.disconnect();
        this.socket = null;
      }
  }


























}
