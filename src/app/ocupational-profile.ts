export class OcupationalProfile {

    constructor(
        public id: string,
        public title: string,
        public description: string,
        public field: string,
        public eqf: number,
        public knowledge: string[],
        public skills: string[],
        public competences: string[]
      ) {  }
}
