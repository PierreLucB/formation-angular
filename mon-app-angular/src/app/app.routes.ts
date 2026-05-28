import { Routes } from '@angular/router';
import { CreateUpdateTodoComponent } from './composants/create-update-todo-component/create-update-todo-component';

export const routes: Routes = [
    {
        path: 'todo-list',
        loadComponent: () => import('./composants/todo-list-component/todo-list-component').then(f => f.TodoListComponent)
    },
    {
        path: 'nouveau',
        component: CreateUpdateTodoComponent
    },
    {
        path: '**',
        loadComponent: () => import('./composants/search-component/search-component').then(f => f.SearchComponent)
    }];
