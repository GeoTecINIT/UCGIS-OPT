import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { OcupationalProfile } from '../../ocupational-profile';
import * as bok from '@eo4geo/bok-dataviz';
import { OcuprofilesService } from '../../services/ocuprofiles.service';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-newop',
  templateUrl: './newop.component.html',
  styleUrls: ['./newop.component.scss']
})
export class NewopComponent implements OnInit {
  // TODO: Retrieve this from the DB
  competences = [
    'Team building',
    'Think creatively',
    'Manage time',
    'Demonstrate intercultural competence',
    'Work in an international environment',
    'Demonstrate willingness to learn',
    'Develop strategy to solve problems',
    'Identify opportunities',
    'Work independently',
    'Work efficientlyAdapt to change',
    'Digital competencies',
    'Meet commitments',
    'Attend to detail',
    'Interact with othersCope with pressure',
    'Manage frustrationListen actively',
    'Lead others',
    'Assertiveness',
    'Make decisions',
    'Motivate others',
    'Report facts',
    'Customer relationship management',
    'Show enterpreneurial spirit',
    'Develop company strategies',
    'Think proactively'
  ];

  filteredCompetences = [
    'Team building',
    'Think creatively',
    'Manage time',
    'Demonstrate intercultural competence',
    'Work in an international environment',
    'Demonstrate willingness to learn',
    'Develop strategy to solve problems',
    'Identify opportunities',
    'Work independently',
    'Work efficientlyAdapt to change',
    'Digital competencies',
    'Meet commitments',
    'Attend to detail',
    'Interact with othersCope with pressure',
    'Manage frustrationListen actively',
    'Lead others',
    'Assertiveness',
    'Make decisions',
    'Motivate others',
    'Report facts',
    'Customer relationship management',
    'Show enterpreneurial spirit',
    'Develop company strategies',
    'Think proactively'
  ];

  // tslint:disable-next-line:max-line-length
  model = new OcupationalProfile('', '', '', '', 1, [], [], []);

  public value: string[];
  public current: string;

  isFilteringCompetences = false;
  selectedProfile: OcupationalProfile;
  _id: string;
  mode: string;

  @ViewChild('boktitle') boktitleEl: ElementRef;
  @ViewChild('bokskills') bokskills: ElementRef;
  @ViewChild('textBoK') textBoK: ElementRef;

  constructor(
    private elementRef: ElementRef,
    private occuprofilesService: OcuprofilesService,
    private route: ActivatedRoute
  ) {
    console.log('newOP');
  }

  ngOnInit() {
    bok.visualizeBOKData('#bubbles', 'assets/saved-bok.xml', '#textBoK');
    this.getMode();
  }

  addCompetence(c: string) {
    this.model.competences.push(c);
    this.removeCompetence(c, this.filteredCompetences);
    this.isFilteringCompetences = false;
  }

  removeCompetence(name: string, array: string[]) {
    array.forEach((item, index) => {
      if (item === name) {
        array.splice(index, 1);
      }
    });
  }

  filterCompetence(ev) {
    this.isFilteringCompetences = true;
    const txt = ev.target.value.toUpperCase();
    this.filteredCompetences = [];
    this.competences.forEach(item => {
      if (item.toUpperCase().indexOf(txt) !== -1) {
        if (!this.model.competences.includes(item)) {
          this.filteredCompetences.push(item);
        }
      }
    });
    console.log('filteringgggg');
  }

  addBokKnowledge() {
    const divs = this.textBoK.nativeElement.getElementsByTagName('div');

    if (divs['bokskills'] != null) {
      const as = divs['bokskills'].getElementsByTagName('a');

      for (const skill of as) {
        if (!this.model.skills.includes(skill.innerText)) {
          this.model.skills.push(skill.innerText);
        }
      }
    }

    const concept = this.textBoK.nativeElement.getElementsByTagName('h4')[0]
      .textContent;
    if (!this.model.knowledge.includes(concept)) {
      this.model.knowledge.push(concept);
    }
  }

  saveOccuProfile() {
    if (this.mode === 'copy') {
      this.occuprofilesService.updateOccuProfile(this._id, this.model);
    } else {
      this.occuprofilesService.addNewOccuProfile(this.model);
    }
  }

  getMode(): void {
    this.mode = this.route.snapshot.paramMap.get('mode');
    if (this.mode === 'duplicate' || this.mode === 'copy') {
      this.getOccuProfileId();
      this.fillForm();
    }
  }
  getOccuProfileId(): void {
    this._id = this.route.snapshot.paramMap.get('name');
    this.occuprofilesService
      .getOccuProfileById(this._id)
      .subscribe(profile => (this.selectedProfile = profile));
  }

  fillForm(): void {
    this.occuprofilesService
      .getOccuProfileById(this._id)
      .subscribe(profile => (this.model = profile));
  }
}
