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
  /*occupationalProfile = {
    title: 'Occupational Profile A',
    // tslint:disable-next-line:max-line-length
    description:
      'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Quisque vulputate non augue ac ornare. Duis pretium dictum elit vitae bibendum. Donec tristique tincidunt malesuada. Morbi a nulla urna. Praesent sit amet lectus ut nisi sodales pretium eu quis felis. Duis et felis ac risus aliquam iaculis eget nec metus. Vivamus porttitor auctor dolor et aliquam. Sed molestie lacus tellus, semper cursus ante mollis vel. Etiam vel massa mi. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Etiam nec euismod dui. Quisque eget mattis turpis.'
  };*/
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
      .subscribe(profile => (this.selectedProfile = profile));
  }

  removeAndGoToList() {

  }
}
