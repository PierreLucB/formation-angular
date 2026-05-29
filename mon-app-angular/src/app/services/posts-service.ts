import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { catchError, forkJoin, map, mergeMap, Observable, of } from 'rxjs';
import { Comments, Post, Posts } from '../models/post';

@Injectable({
  providedIn: 'root',
})
export class PostsService {
  private readonly httpClient = inject(HttpClient);
  private static readonly baseUrl = "https://jsonplaceholder.typicode.com";

  getPosts(withComments?: boolean): Observable<Posts> {

    let allPosts: Posts;
    console.log('Juste avant dappeler le backend');
    
    return this.httpClient.get<Posts>(`${PostsService.baseUrl}/posts`).pipe(
      mergeMap((posts: Posts) => {
        allPosts = posts;
        console.log('posts reçus', allPosts);
        if (!withComments) {
          return of(null);
        }

        const tableau: Observable<Comments>[] = posts.map(p => this.getComments(p.id));

        // On transforme le tableau d'observable en un observable qui contient un tableau
        const resultat: Observable<Comments[]> = forkJoin(tableau);

        return resultat;
      }),
      map((comments: Comments[] | null) => {
        console.log('comments reçus', comments);

        if (comments) {
          // On récupère les commentaires des posts en se basant sur l'index
          allPosts.forEach((post: Post, index: number) => post.comments = comments[index]);
        }

        return allPosts;
      }),
      catchError(e => {
        console.error(e);
        return of([]);
      })
    )
  }

  getComments(postId: number): Observable<Comments> {
    return this.httpClient.get<Comments>(`${PostsService.baseUrl}/posts/${postId}/comments`);
  }
}
