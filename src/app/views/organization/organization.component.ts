import { Component, NgZone, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { AngularFireAuth } from '@angular/fire/auth';
import { Organization, OrganizationService } from '../../services/organization.service';
import { User, UserService } from '../../services/user.service';

@Component({
  selector: 'app-organization',
  templateUrl: 'organization.component.html'
})
export class OrganizationComponent implements OnInit {

  public msgSaved: string;
  public msgUsrSaved: string;
  public msgUsrError: string;

  public name: string;

  public orgs: Organization[];
  public user: User;

  public currentOrg = null;

  return = '';

  constructor(
    private afAuth: AngularFireAuth,
    private organizationService: OrganizationService,
    private userService: UserService,
    private ngZone: NgZone,
    private router: Router
  ) {
    this.afAuth.auth.onAuthStateChanged(user => {
      console.log('************* LOAD USER:');
      if (user) {
        this.userService.getUserById(user.uid).subscribe(userDB => {
          if (userDB) {
            console.log('id userDB:' + userDB._id + 'orgs length: ' + userDB.organizations.length);
            this.user = userDB;
            this.loadOrgs();
          }
        });
      }
    });
  }

  ngOnInit() {
  }

  loadOrgs() {
    console.log('************* LOAD ORGS:');
    if (this.user) {
      console.log('id userDB:' + this.user._id + 'orgs length: ' + this.user.organizations.length);
      this.orgs = [];
      this.user.organizations.forEach(orgId => {
        console.log('id org:' + orgId + 'orgs length: ' + this.orgs.length);
        this.organizationService.getOrganizationById(orgId).subscribe(org => {
          if (org) {
           // this.orgs.push(org);
            this.orgs = [org].concat(this.orgs);
            this.setUsersToOrg();
          }
        });
      });
    }
  }

  /*
    this.userService.getUserById(this.afAuth.auth.currentUser.uid).subscribe(userDB => {
          if (userDB) {
            console.log('id userDB:' + userDB._id + 'orgs length: ' + userDB.organizations.length);
            this.user = userDB;
            this.orgs = [];
            userDB.organizations.forEach(orgId => {
              console.log('id org:' + orgId + 'orgs length: ' + this.orgs.length);
              this.organizationService.getOrganizationById(orgId).subscribe(org => {
                if (org) {
                  this.orgs.push(org);
                  this.setUsersToOrg();
                }
              });
            });
          }
        });
         */


  setUsersToOrg() {
   // const org = this.orgs[this.orgs.length - 1];
    const org = this.orgs[0];
    org.adminUser = [];
    if (org.admin) {
      org.admin.forEach(adminId => {
        this.userService.getUserById(adminId).subscribe(adminDB => {
          console.log('add user:' + adminDB._id + ' to ' + org._id + 'orgs length: ' + this.orgs.length);
          org.adminUser.push(adminDB);
        });
      });
    }
    if (org.regular) {
      org.regularUser = [];
      org.regular.forEach(regurlarId => {
        this.userService.getUserById(regurlarId).subscribe(regularDB => {
          console.log('add user:' + regularDB._id + ' to ' + org._id + 'orgs length: ' + this.orgs.length);
          org.regularUser.push(regularDB);
        });
      });
    }
  }

  save(orgIndex) {
    this.currentOrg = this.orgs[orgIndex];
    this.organizationService.updateOrganizationWithId(this.orgs[orgIndex]._id, this.currentOrg);
    this.msgSaved = 'Saved!';
    this.loadOrgs();
  }

  delete(orgIndex) {
    this.organizationService.removeOrganization(this.orgs[orgIndex]);
    this.loadOrgs();
  }

  makeRegularUser(orgIndex, userId) {
    this.currentOrg = this.orgs[orgIndex];

    const indexToRemove = this.orgs[orgIndex].admin.indexOf(userId);
    this.orgs[orgIndex].admin.splice(indexToRemove, 1);
    this.orgs[orgIndex].regular.push(userId);

    this.organizationService.updateOrganizationWithId(this.orgs[orgIndex]._id, this.currentOrg);
    this.msgUsrSaved = 'User made regular!';
    this.msgUsrError = null;
    this.loadOrgs();
  }

  makeAdminUser(orgIndex, userId) {
    this.currentOrg = this.orgs[orgIndex];

    const indexToRemove = this.currentOrg.regular.indexOf(userId);
    this.currentOrg.regular.splice(indexToRemove, 1);
    this.currentOrg.admin.push(userId);

    this.organizationService.updateOrganizationWithId(this.orgs[orgIndex]._id, this.currentOrg);
    this.msgUsrSaved = 'User made admin!';
    this.msgUsrError = null;
    this.loadOrgs();
  }

  addUserToOrg(orgIndex, userEmail) {
    this.currentOrg = this.orgs[orgIndex];

    this.userService.getUserByEmail(userEmail).subscribe(users => {
      if (users.length === 1) {
        const u = new User(users[0]);
        this.currentOrg.regular.push(u._id);
        this.organizationService.updateOrganizationWithId(this.orgs[orgIndex]._id, this.currentOrg);
        this.msgUsrSaved = 'Added regular user, change permission if needed.';
        this.msgUsrError = null;
      } else {
        this.msgUsrError = 'This user is not registered in the system. Check if the email address is correct.';
        this.msgUsrSaved = null;
      }
    });
  }

  removeUser(orgIndex, userId, type) {
    this.currentOrg = this.orgs[orgIndex];
    if (type === 'regular') {
      const indexToRemove = this.currentOrg.regular.indexOf(userId);
      this.currentOrg.regular.splice(indexToRemove, 1);
    } else if (type === 'admin') {
      const indexToRemove = this.currentOrg.admin.indexOf(userId);
      this.currentOrg.admin.splice(indexToRemove, 1);
    }
    this.organizationService.updateOrganizationWithId(this.orgs[orgIndex]._id, this.orgs[orgIndex]);
    this.msgUsrSaved = 'User removed!';
    this.msgUsrError = null;
    this.loadOrgs();
  }

  newOrg() {
    const newOrganization = new Organization();
    newOrganization.admin = [];
    newOrganization.admin.push(this.user._id);
    const idOrg = this.organizationService.addNewOrganization(newOrganization);
    this.user.organizations.push(idOrg);
    this.userService.updateUserWithId(this.user._id, this.user);
    // this.loadOrgs();
  }
}
