import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { BehaviorSubject, catchError, Observable, tap, throwError } from 'rxjs';
import { Todo } from '../models/todo';
import { apiUrlToken } from '../tokens';

@Injectable({
  providedIn: 'root'
})
export class TodoApiService {
  private http = inject(HttpClient);
  private apiUrl = inject(apiUrlToken) + '/todos';

  private todosSubject = new BehaviorSubject<Todo[]>([]);
  todos$ = this.todosSubject.asObservable();

  // Charger tous les todos
  getTodos(): Observable<Todo[]> {
    return this.http.get<Todo[]>(this.apiUrl).pipe(
      tap(todos => {
        this.todosSubject.next(todos.slice(0, 10)); // Limiter à 10
      }),
      catchError(this.handleError)
    );
  }

  // Récupérer un todo
  getTodo(id: number): Observable<Todo> {
    return this.http.get<Todo>(`${this.apiUrl}/${id}`).pipe(
      catchError(this.handleError)
    );
  }

  // Créer un todo
  createTodo(todo: Omit<Todo, 'id'>): Observable<Todo> {
    return this.http.post<Todo>(this.apiUrl, todo).pipe(
      tap(newTodo => {
        const current = this.todosSubject.value;
        this.todosSubject.next([...current, newTodo]);
      }),
      catchError(this.handleError)
    );
  }

  // Mettre à jour un todo
  updateTodo(id: number, todo: Partial<Todo>): Observable<Todo> {
    return this.http.put<Todo>(`${this.apiUrl}/${id}`, todo).pipe(
      tap(updated => {
        const current = this.todosSubject.value;
        const index = current.findIndex(t => t.id === id);
        if (index !== -1) {
          current[index] = updated;
          this.todosSubject.next([...current]);
        }
      }),
      catchError(this.handleError)
    );
  }

  // Supprimer un todo
  deleteTodo(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`).pipe(
      tap(() => {
        const current = this.todosSubject.value;
        this.todosSubject.next(current.filter(t => t.id !== id));
      }),
      catchError(this.handleError)
    );
  }

  private handleError(error: any) {
    console.error('Erreur API:', error);
    return throwError(() => new Error('Erreur lors de la requête API'));
  }
}