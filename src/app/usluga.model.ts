export class Usluga {
    constructor(
        public id: string,
        public nazivUsluge: string,
        public kratakOpis: string,
        public slikaUrl: string,
        public userId: string,
        public datumZakazivanja?: string,
        public datumiZakazivanja: string[] = [],
        public lokacija?: string,  
        public dodatniKomentar?: string  
    ) { }
}

