import { Component, OnInit, OnDestroy } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { NgForOf } from '@angular/common';
import { Observable, Subscription } from 'rxjs';

import { OcupationalProfile } from '../../ocupational-profile';
import { OcuprofilesService } from '../../services/ocuprofiles.service';
import { removeDebugNodeFromIndex } from '@angular/core/src/debug/debug_node';
@Component({
  selector: 'app-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.scss']
})
export class ListComponent implements OnInit {
  occupationalProfiles: Observable<OcupationalProfile[]>;

  constructor(private occuprofilesService: OcuprofilesService) {}

  ngOnInit() {
    this.occupationalProfiles = this.occuprofilesService.subscribeToOccupationalProfiles();
  }

  removeOccuProfile(id: string) {
    this.occuprofilesService.removeOccuProfile(id);
  }

}
