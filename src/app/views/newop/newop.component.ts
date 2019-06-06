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
    'Assertiveness',
    'Attend to detail',
    'Customer relationship management',
    'Demonstrate intercultural competence',
    'Demonstrate willingness to learn',
    'Develop company strategies',
    'Develop strategy to solve problems',
    'Digital competencies',
    'Identify opportunities',
    'Interact with othersCope with pressure',
    'Lead others',
    'Make decisions',
    'Manage frustrationListen actively',
    'Manage time',
    'Meet commitments',
    'Motivate others',
    'Report facts',
    'Show enterpreneurial spirit',
    'Team building',
    'Think creatively',
    'Think proactively',
    'Work efficientlyAdapt to change',
    'Work in an international environment',
    'Work independently'
  ];

  filteredCompetences = [];

  model = new OcupationalProfile('', '', '', null, 1, [], [], []);

  public value: string[];
  public current: string;

  isFilteringCompetences = false;
  selectedProfile: OcupationalProfile;
  _id: string;
  mode: string;
  title: string;

  selectedNodes = [];
  hasResults = false;
  limitSearch = 5;
  currentConcept = 'GIST';

  configFields = {
    displayKey: 'name', // if objects array passed which key to be displayed defaults to description
    search: true, // true/false for the search functionlity defaults to false,
    height: '200px', // height of the list so that if there are more no of items it can show a scroll defaults to auto.
    placeholder: 'Select Field', // text to be displayed when no item is selected defaults to Select,
    customComparator: () => {}, // a custom function to sort the items. default is undefined and Array.sort() will be used
    noResultsFound: 'No results found!', // text to be displayed when no items are found while searching
    searchPlaceholder: 'Search Field', // label thats displayed in search input,
    searchOnKey: 'name' // key on which search should be performed. if undefined this will be extensive search on all keys
  };

  configCompetences = {
    displayKey: 'name', // if objects array passed which key to be displayed defaults to description
    search: true, // true/false for the search functionlity defaults to false,
    height: '200px', // height of the list so that if there are more no of items it can show a scroll defaults to auto.
    placeholder: 'Select Competences', // text to be displayed when no item is selected defaults to Select,
    customComparator: () => {}, // a custom function to sort the items. default is undefined and Array.sort() will be used
    moreText: 'competences more', // text to be displayed whenmore than one items are selected like Option 1 + 5 more
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
      if (this.mode === 'copy') {
        this.title = 'Copy Occupational Profile';
      } else {
        this.title = 'Duplicate Occupational Profile';
      }
      this.getOccuProfileId();
      this.fillForm();
    } else {
      this.title = 'Add New Occupational Profile';
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

  searchInBok(text: string) {
    this.selectedNodes = bok.searchInBoK(text);
    this.hasResults = this.selectedNodes.length > 0 ? true : false;
    this.currentConcept = '';
  }

  navigateToConcept(conceptName) {
    bok.browseToConcept(conceptName);
    this.currentConcept = conceptName;
    this.hasResults = false;
    console.log('Navigate to concept :' + conceptName);
  }

  incrementLimit() {
    this.limitSearch = this.limitSearch + 5;
  }

  addExtraSkill(skill) {
    this.model.skills.push(skill);
  }
}
