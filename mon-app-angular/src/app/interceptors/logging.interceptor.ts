import { HttpInterceptorFn } from "@angular/common/http";
import { finalize } from "rxjs";

// Intercepteur de logging
export const loggingInterceptor: HttpInterceptorFn = (req, next) => {
  const startTime = Date.now();

  console.log(`Requête [${req.method}] ${req.url}`);

  return next(req).pipe(
    finalize(() => {
      const elapsed = Date.now() - startTime;
      console.log(`Réponse en ${elapsed}ms`);
    })
  );
};