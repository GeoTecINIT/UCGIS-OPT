import { Component , NgZone} from '@angular/core';
import { Router } from '@angular/router';
import { AngularFireAuth } from '@angular/fire/auth';

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
    private afAuth: AngularFireAuth,
    private ngZone: NgZone,
    private router: Router
  ) {
    this.email = '';
    this.pwd = '';
    this.afAuth.auth.onAuthStateChanged(user => {
      if (user) {
        // User is signed in.
        console.log('login inside ' + this.afAuth.auth.currentUser);
     //   this.router.navigateByUrl('/list');
        this.ngZone.run(() => this.router.navigateByUrl('/list')).then();
      }
    });
  }

  login() {
    this.afAuth.auth.signInWithEmailAndPassword(this.email, this.pwd)
      .catch(error => {
        // Handle Errors here.
        const errorCode = error.code;
        const errorMessage = error.message;
        this.errorLogin = errorMessage;
        console.log(errorCode + ' - ' + errorMessage);
      });
  }

  logout() {
    this.afAuth.auth.signOut();
  }

  register() {
    if (this.pwdRegister === this.pwdRepRegister) {
      this.afAuth.auth.createUserWithEmailAndPassword(this.emailRegister, this.pwdRegister)
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

    this.afAuth.auth.sendPasswordResetEmail(this.email, actionCodeSettings)
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

