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
  public msgNoOrg: string;

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
    // Load users
    this.afAuth.auth.onAuthStateChanged(user => {
      if (user) {
        this.userService.getUserById(user.uid).subscribe(userDB => {
          if (userDB) {
            this.user = userDB;
          }
        });
      }
    });
    // Load organizations
    this.organizationService.subscribeToOrganizations()
      .subscribe(res => {
        this.orgs = res;
        this.setUsersToOrg();
      });
  }

  ngOnInit() {
  }

  setUsersToOrg() {
    this.orgs.forEach(org => {
      if (org.admin) {
        if (!org.adminUser) {
          org.adminUser = [];
        }
        org.admin.forEach(adminId => {
          const userSubAdmin = this.userService.getUserById(adminId).subscribe(adminDB => {
            if (adminDB) {
              console.log('add user admin:' + adminDB.name + ' to ' + org.name + 'orgs length: ' + this.orgs.length);
              org.adminUser.push(adminDB);
            }
            userSubAdmin.unsubscribe();
          });
        });
      }
      if (org.regular) {
        if (!org.regularUser) {
          org.regularUser = [];
        }
        org.regular.forEach(regurlarId => {
          const userSubReg = this.userService.getUserById(regurlarId).subscribe(regularDB => {
            if (regularDB) {
              console.log('add user regular:' + regularDB.name + ' to ' + org.name + 'orgs length: ' + this.orgs.length);
              org.regularUser.push(regularDB);
            }
            userSubReg.unsubscribe();
          });
        });
      }
    });
  }

  save(orgIndex) {
    this.currentOrg = this.orgs[orgIndex];
    this.organizationService.updateOrganizationWithId(this.orgs[orgIndex]._id, this.currentOrg);
    this.msgSaved = 'Saved!';
  }

  delete(orgIndex) {
    this.currentOrg = this.orgs[orgIndex];

    this.deleteUserFromOrg(this.user, this.currentOrg);

    if (this.currentOrg.admin) {
      this.currentOrg.admin.forEach(adminId => {
        const userSubAdmin = this.userService.getUserById(adminId).subscribe(adminDB => {
          if (adminDB) {
            this.deleteUserFromOrg(adminDB, this.currentOrg);
          }
          userSubAdmin.unsubscribe();
        });
      });
    }
    if (this.currentOrg.regular) {
      this.currentOrg.regular.forEach(regularId => {
        const userSubReg = this.userService.getUserById(regularId).subscribe(regularDB => {
          if (regularDB) {
            this.deleteUserFromOrg(regularDB, this.currentOrg);
          }
          userSubReg.unsubscribe();
        });
      });
    }

    // Remove from organizations collection
    this.organizationService.removeOrganization(this.currentOrg);
  }

  deleteUserFromOrg(user, org) {
    console.log('deleteUserFromOrg ' + user.name + ' org ' + org.name);
    const indexToRemove = user.organizations.indexOf(org._id);
    user.organizations.splice(indexToRemove, 1);
    this.userService.updateUserWithId(user._id, user);

  }

  makeRegularUser(orgIndex, userId) {
    this.currentOrg = this.orgs[orgIndex];

    const indexToRemove = this.orgs[orgIndex].admin.indexOf(userId);
    this.orgs[orgIndex].admin.splice(indexToRemove, 1);
    this.orgs[orgIndex].regular.push(userId);

    this.organizationService.updateOrganizationWithId(this.orgs[orgIndex]._id, this.currentOrg);
    this.msgUsrSaved = 'User made regular!';
    this.msgUsrError = null;
  }

  makeAdminUser(orgIndex, userId) {
    this.currentOrg = this.orgs[orgIndex];

    const indexToRemove = this.currentOrg.regular.indexOf(userId);
    this.currentOrg.regular.splice(indexToRemove, 1);
    this.currentOrg.admin.push(userId);

    this.organizationService.updateOrganizationWithId(this.orgs[orgIndex]._id, this.currentOrg);
    this.msgUsrSaved = 'User made admin!';
    this.msgUsrError = null;
  }

  addUserToOrg(orgIndex, userEmail) {
    console.log('************* addUserToOrg:');

    this.currentOrg = this.orgs[orgIndex];

    const userSub = this.userService.getUserByEmail(userEmail).subscribe(users => {
      if (users && users.length === 1) {
        const u = new User(users[0]);
        // Add user id to org regular user
        if (!this.currentOrg.regular) {
          this.currentOrg.regular = [];
        }
        if (this.currentOrg.admin.indexOf(u._id) === -1 && this.currentOrg.regular.indexOf(u._id) === -1) {
          this.currentOrg.regular.push(u._id);
          this.organizationService.updateOrganizationWithId(this.currentOrg._id, this.currentOrg);
          this.msgUsrSaved = 'Added regular user, change permission if needed.';
          this.msgUsrError = null;

          // Add org id to user
          if (!u.organizations) {
            u.organizations = [];
          }
          u.organizations.push(this.currentOrg._id);
          this.userService.updateUserWithId(u._id, u);
        } else {
          this.msgUsrError = 'This user is already a member of this organization.';
          this.msgUsrSaved = null;
        }
      } else {
        this.msgUsrError = 'This user is not registered in the system. Check if the email address is correct.';
        this.msgUsrSaved = null;
      }
      userSub.unsubscribe();
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
    const userSub = this.userService.getUserById(userId).subscribe(userDB => {
      if (userDB) {
        this.deleteUserFromOrg(userDB, this.currentOrg);
      }
      userSub.unsubscribe();
    });
    this.msgUsrSaved = 'User removed!';
    this.msgUsrError = null;
  }

  newOrg() {
    console.log('************* newOrg:');
    const newOrganization = new Organization();
    newOrganization.admin = [];
    newOrganization.admin.push(this.user._id);
    const idOrg = this.organizationService.addNewOrganization(newOrganization);
    if (!this.user.organizations) {
      this.user.organizations = [];
    }
    this.user.organizations.push(idOrg);
    this.userService.updateUserWithId(this.user._id, this.user);
  }

}
