export class Korisnik {
    constructor(public id: string, public email: string, private _token: string, private tokenExpirationDate: Date, public role: string, public ime?: string,
        public prezime?: string) {

    }
    get token() {
        if (!this.tokenExpirationDate || this.tokenExpirationDate <= new Date) {
            return null;
        }
        return this._token;
    }
}