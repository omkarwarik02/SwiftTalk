import { inject, Injectable } from '@angular/core';
import{Apollo, gql} from 'apollo-angular'
import { map } from 'rxjs';
import { from } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class Auth {
  private apollo = inject(Apollo);
   register(name: string, email: string, password: string) {
  const REGISTER = gql`
    mutation Register($name: String!, $email: String!, $password: String!) {
      registerUser(name: $name, email: $email, password: $password) {
      token 
      message
        user {
          id
          name
          email
        }
      }
    }
  `;

  return this.apollo.mutate({
    mutation: REGISTER,
    variables: { name, email, password },
    fetchPolicy: 'no-cache'
  });
}

    login(email:string, password:string){
      const LOGIN = gql`
     mutation Login($email: String!, $password: String!) {
     login(email: $email, password: $password){
     token
     message
      user{
      id
      name
      email
      }
      
      }
      }
      
      
      
      
      `;
      return this.apollo.mutate({
        mutation:LOGIN,
        variables:{email, password},
        fetchPolicy:'no-cache'

      })

    }
me() {
  const ME = gql`
    query Me {
      me {
        id
        name
        email
      }
    }
  `;

  return this.apollo.query({
    query: ME,
    fetchPolicy: 'no-cache'
  }).pipe(map((res: any) => res.data.me ?? null));
}





  }

