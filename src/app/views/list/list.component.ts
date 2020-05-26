import { Component, OnInit, OnDestroy, Input, ViewChild } from '@angular/core';
import { NgForOf } from '@angular/common';
import { Observable, Subscription } from 'rxjs';
import { OcupationalProfile } from '../../ocupational-profile';
import { OcuprofilesService } from '../../services/ocuprofiles.service';
import { FormControl } from '@angular/forms';
import { ModalDirective } from 'ngx-bootstrap/modal';
import { AngularFireAuth } from '@angular/fire/auth';
import { User, UserService } from '../../services/user.service';
import { OrganizationService } from '../../services/organization.service';

@Component({
  selector: 'app-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.scss']
})
export class ListComponent implements OnInit {
  occupationalProfiles: OcupationalProfile[];
  advancedSearch = false;
  filteredOccuProfiles: any[];
  searchText: string;
  knowledgeFilter: Boolean = true;
  skillFilter: Boolean = true;
  competencesFilter: Boolean = true;
  isAnonymous = null;
  currentUser: User = new User();
  sortNameAsc = true;
  sortOrgAsc = true;
  sortUpdAsc = true;
  sortedBy = 'lastUpdated';

  @ViewChild('dangerModal') public dangerModal: ModalDirective;

  constructor(private occuprofilesService: OcuprofilesService,
    private userService: UserService,
    public organizationService: OrganizationService,
    public afAuth: AngularFireAuth) {
    this.afAuth.auth.onAuthStateChanged(user => {
      if (user) {
        this.isAnonymous = user.isAnonymous;
        this.userService.getUserById(user.uid).subscribe(userDB => {
          this.currentUser = new User(userDB);
          this.occuprofilesService
            .subscribeToOccupationalProfiles()
            .subscribe(occuProfiles => {
              this.occupationalProfiles = [];
              occuProfiles.forEach(op => {
                if (op.isPublic) {
                  this.occupationalProfiles.push(op);
                } else if (this.currentUser && this.currentUser.organizations && this.currentUser.organizations.indexOf(op.orgId) > -1) {
                  this.occupationalProfiles.push(op);
                }
              });
              this.filteredOccuProfiles = this.occupationalProfiles;
            });
        });
      } else {
        this.isAnonymous = true;
      }
      this.occuprofilesService
        .subscribeToOccupationalProfiles()
        .subscribe(occuProfiles => {
          this.occupationalProfiles = [];
          occuProfiles.forEach(op => {
            if (op.isPublic) {
              this.occupationalProfiles.push(op);
            }
          });
          this.filteredOccuProfiles = this.occupationalProfiles;
        });
    });


  }

  ngOnInit() {
    /*  this.occuprofilesService
       .subscribeToOccupationalProfiles()
       .subscribe(occuProfiles => {
         this.occupationalProfiles = occuProfiles;
         this.filteredOccuProfiles = occuProfiles;
       }); */
  }

  removeOccuProfile(id: string) {
    this.occuprofilesService.removeOccuProfile(id);
  }

  filter() {
    const search = this.searchText.toLowerCase();
    this.filteredOccuProfiles = [];
    this.filteredOccuProfiles = this.occupationalProfiles.filter(
      it =>
        it.title.toLowerCase().includes(search) ||
        it.description.toLowerCase().includes(search)
    );
    if (this.advancedSearch) {
      this.applyFilters();
    }
  }

  applyFilters() {
    this.occupationalProfiles.forEach(occ => {
      if (this.knowledgeFilter) {
        occ.knowledge.forEach(know => {
          if (know.toLowerCase().includes(this.searchText.toLowerCase())) {
            if (this.filteredOccuProfiles.indexOf(occ) === -1) {
              this.filteredOccuProfiles.push(occ);
            }
          }
        });
      }
      if (this.skillFilter) {
        occ.skills.forEach(ski => {
          if (ski.toLowerCase().includes(this.searchText.toLowerCase())) {
            if (this.filteredOccuProfiles.indexOf(occ) === -1) {
              this.filteredOccuProfiles.push(occ);
            }
          }
        });
      }
      if (this.competencesFilter) {
        occ.competences.forEach(comp => {
          if (comp.preferredLabel.toLowerCase().includes(this.searchText.toLowerCase())) {
            if (this.filteredOccuProfiles.indexOf(occ) === -1) {
              this.filteredOccuProfiles.push(occ);
            }
          }
        });
      }
    });
  }
  sortBy(attr) {
  //  this.paginationLimitFrom = 0;
 //   this.paginationLimitTo = 6;
  //  this.currentPage = 0;
    switch (attr) {
      case 'name':
        console.log('Sort by: ' + attr + ' asc: ' + this.sortNameAsc);
        this.sortNameAsc = !this.sortNameAsc;
        this.sortedBy = 'name';
        // tslint:disable-next-line:max-line-length
        this.filteredOccuProfiles.sort((a, b) => (a.title.toLowerCase() > b.title.toLowerCase()) ? this.sortNameAsc ? 1 : -1 : this.sortNameAsc ? -1 : 1);
        break;
      case 'lastUpdated':
        console.log('Sort by: ' + attr + ' asc: ' + this.sortUpdAsc);
        this.sortUpdAsc = !this.sortUpdAsc;
        this.sortedBy = 'lastUpdated';
        this.filteredOccuProfiles.sort((a, b) => (a.updatedAt > b.updatedAt) ? this.sortUpdAsc ? 1 : -1 : this.sortUpdAsc ? -1 : 1);
        break;
      case 'organization':
        console.log('Sort by: ' + attr + ' asc: ' + this.sortOrgAsc);
        this.sortOrgAsc = !this.sortOrgAsc;
        this.sortedBy = 'organization';
        // tslint:disable-next-line:max-line-length
        this.filteredOccuProfiles.sort((a, b) => (a.orgName.toLowerCase() > b.orgName.toLowerCase()) ? this.sortOrgAsc ? 1 : -1 : this.sortOrgAsc ? -1 : 1);
        break;
    }
  }
}
