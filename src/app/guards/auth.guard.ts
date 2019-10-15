import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { Router } from '@angular/router';
import {
  FirestoreAuthExtensionService,
} from '../services/firestore-extension.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {

  constructor(private authService: FirestoreAuthExtensionService, private router: Router) { }

  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    if (!this.authService.auth.currentUser) {
      console.log('AuthGuard - not logged in ');
      this.router.navigateByUrl('/login');
      return false;
    } else {
      console.log('AuthGuard - logged in ' + this.authService.auth.currentUser.uid  );
      return true;
    }
  }
}
