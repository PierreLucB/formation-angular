import { Component, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { Posts } from '../../models/post';
import { PostsService } from '../../services/posts-service';
import { CardComponent } from "../card-component/card-component";
import { AsyncPipe } from '@angular/common';

@Component({
  selector: 'app-posts-component',
  imports: [CardComponent, AsyncPipe],
  templateUrl: './posts-component.html',
  styleUrl: './posts-component.css',
})
export class PostsComponent {
  private readonly postsService = inject(PostsService);

  posts$: Observable<Posts> = this.postsService.getPosts(true);
}
