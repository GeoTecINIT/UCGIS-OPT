import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { User } from './user.service';

const collection = 'Organizations';

export class Organization extends Object {

  public _id: string;
  public name: string;
  public description: string;
  public admin: string[];
  public regular: string[];
  public adminUser: User[];
  public regularUser: User[];

  constructor(public org: Organization = null) {
    super();
    if (org) {
      this._id = org._id;
      this.name = org.name;
    } else {
      this._id = null;
      this.name = '';
    }
  }
}

export class UserPermission extends Object {

  public _id: string;
  public permission: string;

  constructor(public up: UserPermission = null) {
    super();
    if (up) {
      this._id = up._id;
      this.permission = up.permission;
    } else {
      this._id = null;
      this.permission = '';
    }
  }
}

@Injectable({
  providedIn: 'root'
})
export class OrganizationService {

  public currentOrganization = Organization;

  private db: AngularFirestore;
  constructor(db: AngularFirestore) {
    this.db = db;
  }

  subscribeToOrganizations(): Observable<Organization[]> {
    return this.db.collection<Organization>(collection).valueChanges();
  }

  getOrganizationById(organizationId: string): Observable<Organization> {
    return this.db
      .collection(collection)
      .doc<Organization>(organizationId)
      .valueChanges();

    // Collection group query
    /*  return this.db.collectionGroup('users', ref => ref.where('_id', '==', organizationId)).valueChanges(); */
  }

  updateOrganizationWithId(organizationId: string, updatedOrganization: Organization) {
    updatedOrganization.adminUser = null;
    updatedOrganization.regularUser = null;
    this.db
      .collection(collection)
      .doc<Organization>(organizationId)
      .update(updatedOrganization);
  }

  removeOrganization(org: Organization) {
    this.db
      .collection(collection)
      .doc<Organization>(org._id).delete();
  }

  addNewOrganization(org: Organization): string {
    org.name = 'New Organization';
    const idOrg = this.db.createId();
    org._id = idOrg;
    this.db.collection<Organization>(collection).doc(idOrg).set(org);
    return idOrg;
  }

}
