import { Component, OnInit, Input } from '@angular/core';
import { OcuprofilesService } from '../../services/ocuprofiles.service';
import { Observable, Subscription } from 'rxjs';
import { OcupationalProfile } from '../../ocupational-profile';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-detail',
  templateUrl: './detail.component.html',
  styleUrls: ['./detail.component.scss']
})
export class DetailComponent implements OnInit {

statistics = [];

  selectedProfile: OcupationalProfile;
  constructor(
    public occuprofilesService: OcuprofilesService,
    private route: ActivatedRoute
  ) {}

  ngOnInit() {
    this.getOccuProfileId();
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
    const tempStats = {};
    let tempTotal = 0;
    this.selectedProfile.knowledge.forEach(kn => {
      const code = kn.slice(1, 3);
      tempStats[code] !== undefined ? tempStats[code]++ : tempStats[code] = 1;
      tempTotal++;
    });
    Object.keys(tempStats).forEach(k => {
      this.statistics.push({code: k, value: Math.round(tempStats[k] * 100 / tempTotal )});
    });
  }
}
