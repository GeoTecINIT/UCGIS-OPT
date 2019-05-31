import { Component, OnInit, Input } from '@angular/core';
import * as jsPDF from 'jspdf';
import { OcupationalProfile } from '../../ocupational-profile';
import { Base64img } from './base64img';

@Component({
  selector: 'app-popup',
  templateUrl: './popup.component.html',
  styleUrls: ['./popup.component.scss']
})
export class PopupComponent implements OnInit {

  @Input() idOP: any;
  constructor(private base64img: Base64img) { }

  ngOnInit() {
  }

  copyText() {
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

  generatePDF() {

    console.log('generating pdf');
      // cabecera , imágenes
      const doc = new jsPDF();
      doc.addImage(this.base64img.logo, 'PNG', 0, 0, 210, 297);
     // doc.addImage('./assets/img/brand/logo.png', 'PNG', 15, 40, 180, 160);
     // doc.addImage(this.globalService.imgData.logos, 'PNG', 15, 15, 180, 33)
     // doc.addImage(this.globalService.imgData.pm, 'JPEG', 20, 50, 60, 40)
      doc.link(15, 15, 600, 33, { url: 'http://www.eo4geo.eu' });
      doc.setFontSize(41);
      doc.setFontType('bold');
      doc.setTextColor('#1a80b6');

      // titulo sección
       doc.text(30, 45, 'GIS Developer');

      // doc.text(90, 70, this.globalService.pdfTxt[6])
      // doc.text(90, 80, this.globalService.pdfTxt[18])

      // const linkCE = this.feedbackClean[0] === this.items[6].opciones[1].feed;

      // tslint:disable-next-line:max-line-length
      const feedbackText = 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Quisque vulputate non augue ac ornare. Duis pretium dictum elit vitae bibendum. Donec tristique tincidunt malesuada. Morbi a nulla urna. Praesent sit amet lectus ut nisi sodales pretium eu quis felis. Duis et felis ac risus aliquam iaculis eget nec metus. Vivamus porttitor auctor dolor et aliquam. Sed molestie lacus tellus, semper cursus ante mollis vel. Etiam vel massa mi. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Etiam nec euismod dui. Quisque eget mattis turpis.';
      doc.setTextColor('#000');
      doc.setFontType('normal');
      const lines = doc.setFontSize(12).splitTextToSize(feedbackText, 150);
      // fecha
     // const d = new Date();
     // doc.text(90, 90, d.toLocaleDateString('es-ES'));
      // datos básicos
      // doc.setFontSize(10);

      doc.setFontType('normal');
      // lineas feedback
      doc.setFontSize(12);
      doc.text(30, 60, lines);
      /* doc.setFontSize(10)
       if (linkCE) {
         doc.setTextColor('#51bcda')
         doc.textWithLink(this.globalService.pdfTxt[15], 142, 125, { url: this.items[6].opciones[1].link })
       }*/
      // link
      doc.setFontSize(10);
      doc.setTextColor('#51bcda');
      // doc.textWithLink('asdfasdf', 20, 260, { url: 'https://renhata.es/es/ciudadania/consejos-sostenibilidad-edificio' });
      // footer
      doc.setTextColor('#40694d');
      doc.setFontType('italic');
    //  doc.text(20, 270, this.globalService.footerPDF);

      doc.save('asdfasdf.pdf');
  }

  }
