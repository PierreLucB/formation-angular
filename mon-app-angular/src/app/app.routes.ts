import { Routes } from '@angular/router';
import { CreateUpdateTodoComponent } from './composants/create-update-todo-component/create-update-todo-component';

export const routes: Routes = [
    {
        path: 'todo-list',
        loadComponent: () => import('./composants/todo-list-component/todo-list-component').then(f => f.TodoListComponent)
    },
    {
        path: 'todo-list/nouveau',
        component: CreateUpdateTodoComponent
    },
    {
        path: 'todo-list/modifier/:id',
        component: CreateUpdateTodoComponent        
    },
    {
        path: 'posts',
        loadComponent: () => import('./composants/posts-component/posts-component').then(f => f.PostsComponent)
    },
    {
        path: '**',
        loadComponent: () => import('./composants/search-component/search-component').then(f => f.SearchComponent)
    }];
