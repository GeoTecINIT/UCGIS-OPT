import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-popup',
  templateUrl: './popup.component.html',
  styleUrls: ['./popup.component.scss']
})
export class PopupComponent implements OnInit {
  @Input() idOP: any;
  constructor() { }

  ngOnInit() {
  }

  copyText() {
    console.log(location.href);
    let url = location.href;
    if (url.includes('list')) {
      url = url.replace('list', 'detail') + '/' + this.idOP;
    }
    const selBox = document.createElement('textarea');
      selBox.style.position = 'fixed';
      selBox.style.left = '0';
      selBox.style.top = '0';
      selBox.style.opacity = '0';
      selBox.value = url;
      document.body.appendChild(selBox);
      selBox.focus();
      selBox.select();
      document.execCommand('copy');
      document.body.removeChild(selBox);
    }
}
