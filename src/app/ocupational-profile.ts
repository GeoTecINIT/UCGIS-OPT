import { Field } from './services/fields.service';

export class OcupationalProfile extends Object {
  constructor(
    public _id: string,
    public title: string,
    public description: string,
    public field: Field,
    public eqf: number,
    public knowledge: string[],
    public skills: string[],
    public competences: string[]
  ) {
    super();
  }
}
