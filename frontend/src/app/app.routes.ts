import { Routes } from '@angular/router';
import { LoginComponent } from './components/login/login';
import {  Register } from './components/regiser/register';
import { Home } from './components/home/home';
import { authGuard } from './guards/auth-guard';
import { Chat } from './components/chat/chat';
import { ChatList } from './components/chat-list/chat-list';

export const routes: Routes = [
  { path:'', redirectTo:'login', pathMatch:'full' },

  { path:'login', component: LoginComponent },
  { path:'register', component: Register },

  
  { path:'home', component: Home, canActivate:[authGuard] },

  
  { path:'chat-list', component: ChatList, canActivate:[authGuard] },

  
  { path:'chat/:id', component: Chat, canActivate:[authGuard] },
];

