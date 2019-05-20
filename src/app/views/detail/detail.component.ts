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
  selectedProfile: OcupationalProfile;
  constructor(
    private occuprofilesService: OcuprofilesService,
    private route: ActivatedRoute
  ) {}

  ngOnInit() {
    this.getOccuProfileId();
  }

  getOccuProfileId(): void {
    const _id = this.route.snapshot.paramMap.get('name');
    this.occuprofilesService
      .getOccuProfileById(_id)
      .subscribe(profile => (this.selectedProfile = profile));
  }
}
