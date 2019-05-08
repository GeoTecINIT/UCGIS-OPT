import { Component, OnInit } from '@angular/core';
import { OcupationalProfile } from '../../ocupational-profile';
import * as bok from '@eo4geo/bok-dataviz';

@Component({
  selector: 'app-newop',
  templateUrl: './newop.component.html',
  styleUrls: ['./newop.component.scss']
})
export class NewopComponent implements OnInit {

  competences = ['Team bulding', 'Think creatively', 'Manage time',
    'Demonstrate intercultural competence', 'Work in an international environment', 'Demonstrate willingness to learn',
    'Develop strategy to solve problems', 'Identify opportunities', 'Work independently', 'Work efficientlyAdapt to change',
    'Digital competencies', 'Meet commitmentsAttend to detail', 'Interact with othersCope with pressure',
    'Manage frustrationListen actively', 'Lead others', 'Assertiveness', 'Make decisions', 'Motivate others', 'Report facts',
    'Customer relationship management', 'Show enterpreneurial spirit', 'Develop company strategies', 'Think proactively'
  ];

  // tslint:disable-next-line:max-line-length
  model = new OcupationalProfile('id', 'Occupational Profile A', 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Quisque vulputate non augue ac ornare. Duis pretium dictum elit vitae bibendum. Donec tristique tincidunt malesuada. Morbi a nulla urna. Praesent sit amet lectus ut nisi sodales pretium eu quis felis. Duis et felis ac risus aliquam iaculis eget nec metus. Vivamus porttitor auctor dolor et aliquam. Sed molestie lacus tellus, semper cursus ante mollis vel. Etiam vel massa mi. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Etiam nec euismod dui. Quisque eget mattis turpis.', 'Maritime', 6, [], [], []);

  constructor() { }

  ngOnInit() {
    bok.visualizeBOKData('#bubbles', 'assets/saved-bok.xml');
  }

  addCompetence(c: string) {
    this.model.competences.push(c);
    this.removeCompetence(c, this.competences);
  }

  removeCompetence(name: string, array: string[]) {
    array.forEach( (item, index) => {
      if (item === name) { array.splice(index, 1); }
    });
  }

}
