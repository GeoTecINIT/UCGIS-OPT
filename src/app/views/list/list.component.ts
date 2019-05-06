import { Component, OnInit } from '@angular/core';
import { NgForOf } from '@angular/common';

@Component({
  selector: 'app-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.scss']
})
export class ListComponent implements OnInit {

  occupationalProfiles = [
    {
      title: 'Occupational Profile A',
      // tslint:disable-next-line:max-line-length
      description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Quisque vulputate non augue ac ornare. Duis pretium dictum elit vitae bibendum. Donec tristique tincidunt malesuada. Morbi a nulla urna. Praesent sit amet lectus ut nisi sodales pretium eu quis felis. Duis et felis ac risus aliquam iaculis eget nec metus. Vivamus porttitor auctor dolor et aliquam. Sed molestie lacus tellus, semper cursus ante mollis vel. Etiam vel massa mi. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Etiam nec euismod dui. Quisque eget mattis turpis.'
    },
    {
      title: 'Occupational Profile B',
      // tslint:disable-next-line:max-line-length
      description: 'Pellentesque venenatis, massa quis condimentum dapibus, purus nulla elementum dolor, ut commodo enim tellus nec velit. Vivamus ac odio vehicula, ullamcorper augue sed, luctus lectus. Sed nisl diam, imperdiet sit amet odio sed, rutrum tempus libero. Cras in aliquam urna. Aliquam ac ipsum quis ipsum pretium gravida. Vivamus tincidunt dolor in iaculis congue. Duis quis tellus a turpis mollis lobortis. Vestibulum ullamcorper pharetra nisi, at ultricies felis feugiat sit amet.'
    },
    {
      title: 'Occupational Profile C',
      // tslint:disable-next-line:max-line-length
      description: 'Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia Curae; Cras rhoncus turpis sit amet augue malesuada, non hendrerit eros gravida. Vivamus quam urna, hendrerit non purus cursus, lacinia interdum nibh. Ut pretium sapien vel quam placerat rutrum. Nunc gravida volutpat odio at convallis.'
    }
  ];

  constructor() { }

  ngOnInit() {
  }

}
