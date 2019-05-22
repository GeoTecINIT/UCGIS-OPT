import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { OcupationalProfile } from '../../ocupational-profile';
import * as bok from '@eo4geo/bok-dataviz';
import { OcuprofilesService } from '../../services/ocuprofiles.service';
import { FieldsService, Field } from '../../services/fields.service';
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

  filteredCompetences = [];

  model = new OcupationalProfile('', '', '', null, 1, [], [], []);

  public value: string[];
  public current: string;

  isFilteringCompetences = false;
  selectedProfile: OcupationalProfile;
  _id: string;
  mode: string;

  configFields = {
    displayKey: 'name', // if objects array passed which key to be displayed defaults to description
    search: true, // true/false for the search functionlity defaults to false,
    height: 10, // height of the list so that if there are more no of items it can show a scroll defaults to auto.
    placeholder: 'Select Field', // text to be displayed when no item is selected defaults to Select,
    customComparator: () => { }, // a custom function to sort the items. default is undefined and Array.sort() will be used
    limitTo: 10, // a number thats limits the no of options displayed in the UI similar to angular's limitTo pipe
    moreText: 'more', // text to be displayed whenmore than one items are selected like Option 1 + 5 more
    noResultsFound: 'No results found!', // text to be displayed when no items are found while searching
    searchPlaceholder: 'Search Field', // label thats displayed in search input,
    searchOnKey: 'name' // key on which search should be performed. if undefined this will be extensive search on all keys
  };


  configCompetences = {
    displayKey: 'name', // if objects array passed which key to be displayed defaults to description
    search: true, // true/false for the search functionlity defaults to false,
    height: 5, // height of the list so that if there are more no of items it can show a scroll defaults to auto.
    placeholder: 'Select Competences', // text to be displayed when no item is selected defaults to Select,
    customComparator: () => { }, // a custom function to sort the items. default is undefined and Array.sort() will be used
    limitTo: 5, // a number thats limits the no of options displayed in the UI similar to angular's limitTo pipe
    moreText: 'more', // text to be displayed whenmore than one items are selected like Option 1 + 5 more
    noResultsFound: 'No results found!', // text to be displayed when no items are found while searching
    searchPlaceholder: 'Search Competences', // label thats displayed in search input,
    searchOnKey: 'name' // key on which search should be performed. if undefined this will be extensive search on all keys
  };

  @ViewChild('textBoK') textBoK: ElementRef;

  constructor(
    private occuprofilesService: OcuprofilesService,
    public fieldsService: FieldsService,
    private route: ActivatedRoute
  ) {
    this.filteredCompetences = this.competences;
  }

  ngOnInit() {
    bok.visualizeBOKData('#bubbles', 'assets/saved-bok.xml', '#textBoK');
    this.getMode();
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

  removeCompetence(name: string, array: string[]) {
    array.forEach((item, index) => {
      if (item === name) {
        array.splice(index, 1);
      }
    });
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
