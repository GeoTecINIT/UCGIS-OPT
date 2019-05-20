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
  advancedSearch = false;
  filteredOccuProfiles: any[];
  searchText: string;
  searchInKnowledges = false;

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
}
