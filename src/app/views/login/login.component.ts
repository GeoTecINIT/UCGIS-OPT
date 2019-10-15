import { Component } from '@angular/core';
import { Router } from '@angular/router';
import {
  FirestoreExtensionService,
  FirestoreAuthExtensionService,
} from '../../services/firestore-extension.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: 'login.component.html'
})
export class LoginComponent {

  public email: string;
  public pwd: string;
  public errorLogin: string;
  public errorRegister: string;
  public emailRegister: string;
  public pwdRegister: string;
  public pwdRepRegister: string;
  public isRegistering = false;

  constructor(
    private firebase: FirestoreExtensionService,
    private fbAuth: FirestoreAuthExtensionService,
    private router: Router
  ) {
    this.email = '';
    this.pwd = '';
    this.fbAuth.auth.onAuthStateChanged(user => {
      if (user) {
        // User is signed in.
        console.log('login inside ' + this.fbAuth.auth.currentUser);
        this.router.navigateByUrl('/list');
      }
    });
  }

  login() {
    this.fbAuth.auth.signInWithEmailAndPassword(this.email, this.pwd)
      .catch(error => {
        // Handle Errors here.
        const errorCode = error.code;
        const errorMessage = error.message;
        this.errorLogin = errorMessage;
        console.log(errorCode + ' - ' + errorMessage);
      });
  }

  logout() {
    this.fbAuth.auth.signOut();
  }

  register() {
    if (this.pwdRegister === this.pwdRepRegister) {
      this.fbAuth.auth.createUserWithEmailAndPassword(this.emailRegister, this.pwdRegister)
        .catch(error => {
          // Handle Errors here.
          const errorCode = error.code;
          const errorMessage = error.message;
          this.errorRegister = errorMessage;
          console.log(errorCode + ' - ' + errorMessage);
        });
    } else {
      this.errorRegister = 'Your passwords are not equal';
    }
  }

  forgotPwd() {
    const actionCodeSettings = {
      url: 'https://ocuprotool.web.app/#/login', // the domain has to be added to firebase console whitelist
      handleCodeInApp: false
    };

    this.fbAuth.auth.sendPasswordResetEmail(this.email, actionCodeSettings)
      .then(() => {
        // Password reset email sent.
        this.errorLogin = 'An email has been sent to your address. It contains a link to recover your password.';
      })
      .catch(error => {
        // Error occurred. Inspect error.code.
        // Handle Errors here.
        const errorCode = error.code;
        const errorMessage = error.message;
        this.errorLogin = errorMessage;
        console.log(errorCode + ' - ' + errorMessage);
      });
  }
}

