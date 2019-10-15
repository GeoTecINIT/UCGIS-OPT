import { Injectable, NgZone } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { AngularFireAuth } from '@angular/fire/auth';
import { FirebaseOptions } from '@angular/fire';
import { environment } from '../../environments/environment';

// @Injectable({
//   providedIn: 'root'
// })

@Injectable()
export class FirestoreExtensionService extends AngularFirestore {}

export function AngularFirestoreFactory(platformId: Object, zone: NgZone) {
  return new AngularFirestore(environment.firebase, 'firebase', false, null, platformId, zone, null);
}

export class FirestoreAuthExtensionService extends AngularFireAuth {}

export function AngularAuthFactory(platformId: Object, zone: NgZone) {
  return new AngularFireAuth(environment.firebaseAuth, 'firebaseAuth', platformId, zone);
}
