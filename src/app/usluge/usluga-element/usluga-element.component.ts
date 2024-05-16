import { Component, Input, OnInit } from '@angular/core';
import { Usluga } from 'src/app/usluga.model';

@Component({
  selector: 'app-usluga-element',
  templateUrl: './usluga-element.component.html',
  styleUrls: ['./usluga-element.component.scss'],
})
export class UslugaElementComponent  implements OnInit {

  @Input() usluga:Usluga={id:"u1",nazivUsluge:"Fotografisanje slavlja",kratakOpis:"blabla",slikaUrl:""};
  constructor() { }

  ngOnInit() {}

}
