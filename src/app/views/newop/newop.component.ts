import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { OcupationalProfile, Competence } from '../../ocupational-profile';
import * as bok from '@eo4geo/bok-dataviz';
import { OcuprofilesService } from '../../services/ocuprofiles.service';
import { FieldsService } from '../../services/fields.service';
import { EscoCompetenceService } from '../../services/esco-competence.service';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-newop',
  templateUrl: './newop.component.html',
  styleUrls: ['./newop.component.scss']
})
export class NewopComponent implements OnInit {

  competences = [];
  filteredCompetences = [];
  fullcompetences = [];

  model = new OcupationalProfile('', '', '', null, 1, [], [], []);

  public value: string[];
  public current: string;

  selectedProfile: OcupationalProfile;
  _id: string;
  mode: string;
  title: string;

  selectedNodes = [];
  hasResults = false;
  limitSearch = 5;
  currentConcept = 'GIST';

  isfullESCOcompetences = false;

  configFields = {
    displayKey: 'concatName', // if objects array passed which key to be displayed defaults to description
    search: true, // true/false for the search functionlity defaults to false,
    height: '200px', // height of the list so that if there are more no of items it can show a scroll defaults to auto.
    placeholder: 'Select Field', // text to be displayed when no item is selected defaults to Select,
    customComparator: () => { }, // a custom function to sort the items. default is undefined and Array.sort() will be used
    noResultsFound: 'No results found!', // text to be displayed when no items are found while searching
    searchPlaceholder: 'Search Field', // label thats displayed in search input,
    searchOnKey: 'concatName' // key on which search should be performed. if undefined this will be extensive search on all keys
  };

  configCompetences = {
    displayKey: 'preferredLabel', // if objects array passed which key to be displayed defaults to description
    search: true, // true/false for the search functionlity defaults to false,
    height: '200px', // height of the list so that if there are more no of items it can show a scroll defaults to auto.
    placeholder: 'Select Competences', // text to be displayed when no item is selected defaults to Select,
    customComparator: () => { }, // a custom function to sort the items. default is undefined and Array.sort() will be used
    moreText: 'competences more', // text to be displayed whenmore than one items are selected like Option 1 + 5 more
    noResultsFound: 'No results found!', // text to be displayed when no items are found while searching
    searchPlaceholder: 'Search Competences', // label thats displayed in search input,
    searchOnKey: 'preferredLabel' // key on which search should be performed. if undefined this will be extensive search on all keys
  };

  configfullCompetences = {
    displayKey: 'preferredLabel', // if objects array passed which key to be displayed defaults to description
    search: true, // true/false for the search functionlity defaults to false,
    height: '200px', // height of the list so that if there are more no of items it can show a scroll defaults to auto.
    placeholder: 'Select Competences', // text to be displayed when no item is selected defaults to Select,
    customComparator: () => { }, // a custom function to sort the items. default is undefined and Array.sort() will be used
    moreText: 'competences more', // text to be displayed whenmore than one items are selected like Option 1 + 5 more
    noResultsFound: 'No results found!', // text to be displayed when no items are found while searching
    searchPlaceholder: 'Search Competences', // label thats displayed in search input,
    searchOnKey: 'preferredLabel' // key on which search should be performed. if undefined this will be extensive search on all keys
  };

  @ViewChild('textBoK') textBoK: ElementRef;

  constructor(
    private occuprofilesService: OcuprofilesService,
    public fieldsService: FieldsService,
    public escoService: EscoCompetenceService,
    private route: ActivatedRoute
  ) {
    this.competences = this.escoService.basicCompetences;
    this.filteredCompetences = this.competences;
  }

  ngOnInit() {
    bok.visualizeBOKData('#bubbles', 'assets/saved-bok.xml', '#textBoK');
    this.getMode();
  }

  addBokKnowledge() {
    const divs = this.textBoK.nativeElement.getElementsByTagName('div');
    if (divs['bokskills'] != null) {
      const shortCode = this.textBoK.nativeElement.getElementsByTagName('h4')[0].innerText.split(' ')[0];
      const as = divs['bokskills'].getElementsByTagName('a');
      for (const skill of as) {
        if (!this.model.skills.includes(shortCode + ' ' + skill.innerText)) {
          this.model.skills.push(shortCode + ' ' + skill.innerText);
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

  // Add custom competence to model to force updating component, and to competences lists to find it again if removed
  addExtraCompetence(comp) {
    this.model.competences = [...this.model.competences, { preferredLabel: comp }];
    this.escoService.allcompetences = [...this.escoService.allcompetences, { preferredLabel: comp }];
    this.escoService.basicCompetences = [...this.escoService.basicCompetences, { preferredLabel: comp }];
  }

  fullListESCO() {
    /* this.escoService.allcompetences.forEach(com => {
      if (com.preferredLabel == null) {
       console.log('ERROR ' + com.uri);
      }
     });
     */
    this.isfullESCOcompetences = !this.isfullESCOcompetences;
  }

  // custom search to match term also in altLabels
  customSearchFn(term: string, item: Competence) {
    let found = false;
    term = term.toLocaleLowerCase();
    if (item.preferredLabel.toLocaleLowerCase().indexOf(term) > -1) {
      found = true;
    }
    if (item.altLabels && item.altLabels.length > 0) {
      item.altLabels.forEach((alt) => {
        if (alt.toLocaleLowerCase().indexOf(term) > -1) {
        found = true;
        }
      });
    }
    return found;
  }
}
