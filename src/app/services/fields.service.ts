import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import * as fData from './fields.data';

const collection = 'Fields';

export interface Field { name: string; code: Number; parent: string; grandparent: string; greatgrandparent: string; }

@Injectable({
  providedIn: 'root'
})
export class FieldsService {

  private db: AngularFirestore;
  constructor(db: AngularFirestore) {
    this.db = db;
  }

  subscribeToFields(): Observable<Field[]> {
    return this.db.collection<Field>(collection).valueChanges();
  }

  addFields() {
    fData.allFields.forEach(f => {
      fData.parents.forEach(p => {
        if (f.code.substring(0, 2) === p.code) {
          f.greatgrandparent = p.name;
        } else if (f.code.substring(0, 3) === p.code) {
          f.grandparent = p.name;
        } else if (f.code === p.code) {
          f.parent = p.name;
        }
      });
      this.db.collection(collection).add(f);
    });
  }
}

