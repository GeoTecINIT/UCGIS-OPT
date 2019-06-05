import { Component, OnInit, Input } from '@angular/core';
import * as jsPDF from 'jspdf';
import { OcuprofilesService } from '../../services/ocuprofiles.service';
import { OcupationalProfile } from '../../ocupational-profile';
import { Base64img } from './base64img';
import { ActivatedRoute } from '@angular/router';


@Component({
  selector: 'app-popup',
  templateUrl: './popup.component.html',
  styleUrls: ['./popup.component.scss']
})
export class PopupComponent implements OnInit {

  @Input() idOP: any;
  selectedProfile: OcupationalProfile;
  constructor(private base64img: Base64img,
    public occuprofilesService: OcuprofilesService,
    private route: ActivatedRoute) { }

  ngOnInit() {
    this.getOccuProfileId();
  }

  getOccuProfileId(): void {
    this.occuprofilesService
      .getOccuProfileById(this.idOP)
      .subscribe(profile => {
        this.selectedProfile = profile;
      });
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
    let currentLinePoint = 45;
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

    const titleLines = doc.setFontSize(41).splitTextToSize(this.selectedProfile.title, 150);
    doc.text(30, currentLinePoint, titleLines);
    currentLinePoint = currentLinePoint + (12 * titleLines.length);

    doc.setFontSize(12).setTextColor('#1a80b6').setFontType('bold'); // headline
    doc.text(30, currentLinePoint, 'EQF' + this.selectedProfile.eqf + ' - ' + this.selectedProfile.field);
    currentLinePoint = currentLinePoint + 5;

    // titulo sección
    doc.setTextColor('#000').setFontType('normal');
    const lines = doc.setFontSize(12).splitTextToSize(this.selectedProfile.description, 150);
    // fecha
    // const d = new Date();
    // doc.text(90, 90, d.toLocaleDateString('es-ES'));

    doc.text(30, currentLinePoint, lines); // description

    if (this.selectedProfile.knowledge.length > 0) {
      currentLinePoint = currentLinePoint + 10 + (4 * lines.length);
      doc.setFontSize(12).setTextColor('#1a80b6').setFontType('bold'); // headline
      doc.text(30, currentLinePoint, 'Knowledge required');
      currentLinePoint = currentLinePoint + 5;
      doc.setTextColor('#000').setFontType('normal').setFontSize(8); // normal text
      this.selectedProfile.knowledge.forEach(kn => {
        const knLines = doc.setFontSize(8).splitTextToSize('· ' + kn, 150);
        doc.text(30, currentLinePoint, knLines);
        currentLinePoint = currentLinePoint + 4 * knLines.length;
      });
    }

    if (this.selectedProfile.skills.length > 0) {
      currentLinePoint = currentLinePoint + 10;
      doc.setFontSize(12).setTextColor('#1a80b6').setFontType('bold'); // headline
      doc.text(30, currentLinePoint, 'Skills required');
      currentLinePoint = currentLinePoint + 5;
      doc.setTextColor('#000').setFontType('normal').setFontSize(8); // normal text
      this.selectedProfile.skills.forEach(sk => {
        const skLines = doc.setFontSize(8).splitTextToSize('· ' + sk, 150);
        doc.text(30, currentLinePoint, skLines);
        currentLinePoint = currentLinePoint + 4 * skLines.length;
      });
    }

    if (this.selectedProfile.competences.length > 0) {
      currentLinePoint = currentLinePoint + 10;
      doc.setFontSize(12).setTextColor('#1a80b6').setFontType('bold'); // headline
      doc.text(30, currentLinePoint, 'Competences');
      currentLinePoint = currentLinePoint + 5;
      doc.setTextColor('#000').setFontType('normal').setFontSize(8); // normal text
      this.selectedProfile.competences.forEach(co => {
        const coLines = doc.setFontSize(8).splitTextToSize('· ' + co, 150);
        doc.text(30, currentLinePoint,  coLines);
        currentLinePoint = currentLinePoint + 4 * coLines.length;
      });
    }

    // doc.textWithLink('asdfasdf', 20, 260, { url: 'https://renhata.es/es/ciudadania/consejos-sostenibilidad-edificio' });

    doc.save('OccupationalProfile.pdf');
  }

}
