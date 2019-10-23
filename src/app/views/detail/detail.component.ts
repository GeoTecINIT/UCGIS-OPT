import { Component, OnInit, Input, ViewChild } from '@angular/core';
import { OcuprofilesService } from '../../services/ocuprofiles.service';
import { Observable, Subscription } from 'rxjs';
import { OcupationalProfile } from '../../ocupational-profile';
import { ActivatedRoute } from '@angular/router';
import { ModalDirective } from 'ngx-bootstrap/modal';
import { AngularFireAuth } from '@angular/fire/auth';

@Component({
  selector: 'app-detail',
  templateUrl: './detail.component.html',
  styleUrls: ['./detail.component.scss']
})
export class DetailComponent implements OnInit {

  statistics = [];
  isAnonymous = null;

  selectedProfile: OcupationalProfile;
  @ViewChild('dangerModal') public dangerModal: ModalDirective;

  constructor(
    public occuprofilesService: OcuprofilesService,
    private route: ActivatedRoute,
    public afAuth: AngularFireAuth
  ) {
    this.afAuth.auth.onAuthStateChanged(user => {
      if (user && !user.isAnonymous) {
        this.isAnonymous = this.afAuth.auth.currentUser.isAnonymous;
      }
    });
  }

  ngOnInit() {
    this.getOccuProfileId();
    if (this.afAuth.auth.currentUser) {
      this.isAnonymous = this.afAuth.auth.currentUser.isAnonymous;
    }
  }

  getOccuProfileId(): void {
    const _id = this.route.snapshot.paramMap.get('name');
    this.occuprofilesService
      .getOccuProfileById(_id)
      .subscribe(profile => {
        this.selectedProfile = profile;
        this.calculateStatistics();
      });
  }

  calculateStatistics() {
    if (this.selectedProfile) {
      const tempStats = {};
      let tempTotal = 0;
      this.selectedProfile.knowledge.forEach(kn => {
        const code = kn.slice(1, 3);
        tempStats[code] !== undefined ? tempStats[code]++ : tempStats[code] = 1;
        tempTotal++;
      });
      Object.keys(tempStats).forEach(k => {
        this.statistics.push({ code: k, value: Math.round(tempStats[k] * 100 / tempTotal) });
      });
    }
  }
}
