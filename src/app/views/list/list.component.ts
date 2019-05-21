import { Component, OnInit, OnDestroy, Input } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { NgForOf } from '@angular/common';
import { Observable, Subscription } from 'rxjs';

import { OcupationalProfile } from '../../ocupational-profile';
import { OcuprofilesService } from '../../services/ocuprofiles.service';
import { FormControl } from '@angular/forms';
@Component({
  selector: 'app-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.scss']
})
export class ListComponent implements OnInit {
  occupationalProfiles: OcupationalProfile[];
  advancedFilteredProfiles: OcupationalProfile[] = [];
  advancedSearch = false;
  filteredOccuProfiles: any[];
  searchText: string;
  knowledgeFilter: Boolean;
  skillFilter: Boolean;
  competencesFilter: Boolean;

  constructor(private occuprofilesService: OcuprofilesService) {}

  ngOnInit() {
    this.occuprofilesService
      .subscribeToOccupationalProfiles()
      .subscribe(occuProfiles => {
        this.occupationalProfiles = occuProfiles;
        this.filteredOccuProfiles = occuProfiles;
      });
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
  }

  applyFilters() {
    this.filteredOccuProfiles = [];
    if (this.knowledgeFilter) {
      this.occupationalProfiles.forEach(occ => {
        occ.knowledge.forEach(know => {
          if (know.toLowerCase().includes(this.searchText)) {
            if (this.advancedFilteredProfiles.indexOf(occ) === -1) {
              this.advancedFilteredProfiles.push(occ);
            }
          }
        });
      });
    }
    if (this.skillFilter) {
      this.occupationalProfiles.forEach(occ => {
        occ.skills.forEach(ski => {
          if (ski.toLowerCase().includes(this.searchText)) {
            if (this.advancedFilteredProfiles.indexOf(occ) === -1) {
              this.advancedFilteredProfiles.push(occ);
            }
          }
        });
      });
    }
    if (this.competencesFilter) {
      this.occupationalProfiles.forEach(occ => {
        occ.competences.forEach(comp => {
          if (comp.toLowerCase().includes(this.searchText)) {
            if (this.advancedFilteredProfiles.indexOf(occ) === -1) {
              this.advancedFilteredProfiles.push(occ);
            }
          }
        });
      });
    }
    this.filteredOccuProfiles = this.filteredOccuProfiles.concat(
      this.advancedFilteredProfiles
    );

    this.advancedFilteredProfiles = [];
  }
}
