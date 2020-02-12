import { Injectable } from '@angular/core';
import { AngularFireDatabase } from '@angular/fire/database';
import { Observable } from 'rxjs';
import 'firebase/database';

@Injectable({
  providedIn: 'root'
})
export class BokService {
  bok_version: Observable<any>;
  bok: Observable<any>;
  constructor(db: AngularFireDatabase) {
    // retrieve v1.0 of Bok
    this.bok = db.object('v1-0').valueChanges();
    console.log('BOK SERVICE VERSION');
    // retrieve current version of BOK
    this.bok_version = db.object('bok-version').valueChanges();
    this.bok_version.subscribe(v => {
      console.log('BOK SERVICE BOK v: ' + v);
      // update bok with current version
      this.bok = db.object(v).valueChanges();
    });
  }
}
