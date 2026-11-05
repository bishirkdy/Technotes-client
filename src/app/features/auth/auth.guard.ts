import { inject } from '@angular/core';
import { CanActivateFn, Router, UrlTree } from '@angular/router';
import { map } from 'rxjs';
import { AuthService } from './services/auth.service';

function loginTree(router: Router, returnUrl: string): UrlTree {
  return router.createUrlTree(['/login'], {
    queryParams: { returnUrl }
  });
}

export const authGuard: CanActivateFn = (_route, state) => {
  const auth = inject(AuthService);
  const router = inject(Router);

  if (auth.isUserLoggedIn()) {
    return true;
  }

  return auth.restoreSession().pipe(
    map(restored => restored ? true : loginTree(router, state.url))
  );
};

export const adminGuard: CanActivateFn = (_route, state) => {
  const auth = inject(AuthService);
  const router = inject(Router);
  const requireAdmin = () =>
    auth.isAdmin ? true : router.createUrlTree(['/app/dashboard']);

  if (auth.isUserLoggedIn()) {
    return requireAdmin();
  }

  return auth.restoreSession().pipe(
    map(restored => restored ? requireAdmin() : loginTree(router, state.url))
  );
};
