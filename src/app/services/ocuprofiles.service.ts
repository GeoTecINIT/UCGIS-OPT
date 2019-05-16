import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { OcupationalProfile } from '../ocupational-profile';

const collection = 'OcuProfiles';

@Injectable({
  providedIn: 'root'
})
export class OcuprofilesService {
  private db: AngularFirestore;
  constructor(db: AngularFirestore) {
    this.db = db;
  }

  subscribeToOccupationalProfiles(): Observable<OcupationalProfile[]> {
    return this.db.collection<OcupationalProfile>(collection).valueChanges();
  }

  getOccuProfileById(occuProfileId: string): Observable<OcupationalProfile> {
    return this.db
      .collection(collection)
      .doc<OcupationalProfile>(occuProfileId)
      .valueChanges();
  }

  addNewOccuProfile(newProfile: OcupationalProfile) {
    const id = this.db.createId();
    newProfile._id = id;
    const profileData = JSON.parse(JSON.stringify(newProfile));
    const newProfileref = this.db
      .collection(collection)
      .doc(id)
      .set(profileData);
  }

  removeOccuProfile(occuProfileId: string) {
    this.db
      .collection(collection)
      .doc(occuProfileId)
      .delete();
  }
}
