import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { OcupationalProfile } from '../../ocupational-profile';
import * as bok from '@eo4geo/bok-dataviz';


@Component({
  selector: 'app-newop',
  templateUrl: './newop.component.html',
  styleUrls: ['./newop.component.scss']
})
export class NewopComponent implements OnInit {

  // TODO: Retrieve this from the DB
  competences = ['Team building', 'Think creatively', 'Manage time',
    'Demonstrate intercultural competence', 'Work in an international environment', 'Demonstrate willingness to learn',
    'Develop strategy to solve problems', 'Identify opportunities', 'Work independently', 'Work efficientlyAdapt to change',
    'Digital competencies', 'Meet commitments', 'Attend to detail', 'Interact with othersCope with pressure',
    'Manage frustrationListen actively', 'Lead others', 'Assertiveness', 'Make decisions', 'Motivate others', 'Report facts',
    'Customer relationship management', 'Show enterpreneurial spirit', 'Develop company strategies', 'Think proactively'
  ];

  filteredCompetences = ['Team building', 'Think creatively', 'Manage time',
    'Demonstrate intercultural competence', 'Work in an international environment', 'Demonstrate willingness to learn',
    'Develop strategy to solve problems', 'Identify opportunities', 'Work independently', 'Work efficientlyAdapt to change',
    'Digital competencies', 'Meet commitments', 'Attend to detail', 'Interact with othersCope with pressure',
    'Manage frustrationListen actively', 'Lead others', 'Assertiveness', 'Make decisions', 'Motivate others', 'Report facts',
    'Customer relationship management', 'Show enterpreneurial spirit', 'Develop company strategies', 'Think proactively'
  ];

  // tslint:disable-next-line:max-line-length
  model = new OcupationalProfile('id', 'Occupational Profile A', 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Quisque vulputate non augue ac ornare. Duis pretium dictum elit vitae bibendum. Donec tristique tincidunt malesuada. Morbi a nulla urna. Praesent sit amet lectus ut nisi sodales pretium eu quis felis. Duis et felis ac risus aliquam iaculis eget nec metus. Vivamus porttitor auctor dolor et aliquam. Sed molestie lacus tellus, semper cursus ante mollis vel. Etiam vel massa mi. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Etiam nec euismod dui. Quisque eget mattis turpis.', 'Maritime', 6, [], [], []);

  public value: string[];
  public current: string;

  isFilteringCompetences = false;

  @ViewChild('boktitle') boktitleEl: ElementRef;
  @ViewChild('bokskills') bokskills: ElementRef;
  @ViewChild('textBoK') textBoK: ElementRef;

  constructor(private elementRef: ElementRef) {
    console.log('newOP');
  }

  ngOnInit() {
    bok.visualizeBOKData('#bubbles', 'assets/saved-bok.xml', '#textBoK');
  }

  addCompetence(c: string) {
    this.model.competences.push(c);
    this.removeCompetence(c, this.filteredCompetences);
    this.isFilteringCompetences = false;
  }

  removeCompetence(name: string, array: string[]) {
    array.forEach((item, index) => {
      if (item === name) { array.splice(index, 1); }
    });
  }

  filterCompetence(ev) {
    this.isFilteringCompetences = true;
    const txt = ev.target.value.toUpperCase();
    this.filteredCompetences = [];
    this.competences.forEach((item) => {
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

    const concept = this.textBoK.nativeElement.getElementsByTagName('h4')[0].textContent;
    if (!this.model.knowledge.includes(concept)) {
      this.model.knowledge.push(concept);
    }
  }
}
