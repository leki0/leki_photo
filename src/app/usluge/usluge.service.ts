import { Injectable } from '@angular/core';
import { Usluga } from '../usluga.model';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, map, switchMap, take, tap } from 'rxjs';
import { AuthService } from '../auth/auth.service';
import { supabase } from '../../environments/supabase.client';
import { from } from 'rxjs';


interface UslugaData {
  nazivUsluge: string;
  kratakOpis: string;
  slikaUrl: string;
  userId: string;
  datumZakazivanja?: string;
  lokacija?: string;
  dodatniKomentar?: string;
}

@Injectable({
  providedIn: 'root'
})
export class UslugeService {
  private slikaUrl: string | undefined;
  private _usluge = new BehaviorSubject<Usluga[]>([]);
  private _savedUsluge = new BehaviorSubject<Usluga[]>([]);
  private _sviDatumiZakazivanja: string[] = [];
  get savedUsluge() {
    return this._savedUsluge.asObservable();
  }
  getAllDatumiZakazivanja(): Observable<string[]> {
    return this.getAllSavedUsluge().pipe(
      map(savedUsluge => savedUsluge
        .filter(usluga => usluga.datumZakazivanja)
        .map(usluga => usluga.datumZakazivanja!)
      )
    );
  }

  saveUsluga(usluga: Usluga) {
    let fetchedUserId: string;
    return this.authService.userId.pipe(
      take(1),
      switchMap(userId => {
        if (!userId) {
          throw new Error('No user ID found!');
        }
        fetchedUserId = userId;
        return this.authService.token;
      }),
      take(1),
      switchMap(token => {
        const newSavedUsluga = {
          nazivUsluge: usluga.nazivUsluge,
          kratakOpis: usluga.kratakOpis,
          slikaUrl: usluga.slikaUrl,
          userId: fetchedUserId 
        };
        return this.http.post<{ name: string }>(
          `https://lekiphoto-e1777-default-rtdb.europe-west1.firebasedatabase.app/savedUsluge.json?auth=${token}`,
          newSavedUsluga
        );
      })
    );
  }

  oldUsluge: Usluga[] = [{ id: "u1", nazivUsluge: "Fotografisanje rodjendana", kratakOpis: "blabla", slikaUrl: "", userId: "x", datumiZakazivanja: [] },
  { id: "u2", nazivUsluge: "Fotografisanje krstenja", kratakOpis: "blabla", slikaUrl: "", userId: "xc", datumiZakazivanja: [] }];

  constructor(private http: HttpClient, private authService: AuthService) { }

  get usluge() {
    return this._usluge.asObservable();
  }
async uploadUpdatedImage(newFile: File, oldImageUrl?: string): Promise<string> {
  const fileName = `${Date.now()}_${newFile.name}`;

  // Ako postoji stara slika, pokušaj da je obrišeš
  if (oldImageUrl) {
    const oldFileName = this.extractFileNameFromUrl(oldImageUrl);
    const { error: deleteError } = await supabase.storage
      .from('usluge')
      .remove([oldFileName]);

    if (deleteError) {
      console.warn('Greška pri brisanju stare slike:', deleteError);
    } else {
      console.log('Stara slika obrisana:', oldFileName);
    }
  }

  // Upload nove slike
  const { error } = await supabase.storage.from('usluge').upload(fileName, newFile);
  if (error) {
    throw error;
  }

  // Vraćanje URL-a nove slike
  const { data: publicUrlData } = supabase.storage.from('usluge').getPublicUrl(fileName);
  return publicUrlData.publicUrl;
}


  async uploadImageToSupabase(file: File): Promise<string> {
    const fileName = `${Date.now()}_${file.name}`;
    const { data, error } = await supabase.storage
      .from('usluge') 
      .upload(fileName, file);

      console.log('FILE', file);
      console.log('FILE name', fileName);
    if (error) {
      console.error('Greška prilikom upload-a:', error);
      throw error;
    }

    const { data: publicUrlData } = supabase.storage.from('usluge').getPublicUrl(fileName);
    this.slikaUrl = publicUrlData.publicUrl;
    return publicUrlData.publicUrl;
  }

  addUsluga(nazivUsluge: string, kratakOpis: string) {
    let generatedId: string;
    let novaUsluga: Usluga;
    let fetchedUserId: string;
    return this.authService.userId.pipe(
      take(1),
      switchMap(userId => {
        if (!userId) {
          throw new Error('No user ID found!');
        }
        fetchedUserId = userId;
        return this.authService.token;
      }),
      take(1),
      switchMap(token => {
        novaUsluga = new Usluga(
          '',
          nazivUsluge,
          kratakOpis,
          this.slikaUrl || '',
          fetchedUserId
        );
        console.log('Nova usluga pre slanja:', novaUsluga);
        return this.http.post<{ name: string }>(
          `https://lekiphoto-e1777-default-rtdb.europe-west1.firebasedatabase.app/usluge.json?auth=${token}`,
          novaUsluga
        );
      }),
      take(1),
      switchMap(resData => {
        generatedId = resData.name;
        console.log('Generisani ID:', generatedId);
        novaUsluga.id = generatedId;
        return this.authService.token.pipe(
          take(1),
          switchMap(token => {
            return this.http.patch(
              `https://lekiphoto-e1777-default-rtdb.europe-west1.firebasedatabase.app/usluge/${generatedId}.json?auth=${token}`,
              { id: generatedId }
            );
          }),
          take(1),
          switchMap(() => this.usluge),
          take(1)
        );
      }),
      tap(usluge => {
        console.log('Nova usluga sa generisanim ID-em:', novaUsluga);
        this._usluge.next(usluge.concat(novaUsluga));
      })
    );
  }
  getUsluge() {
    return this.authService.token.pipe(
      take(1),
      switchMap((token) => {
        return this.http.
          get<{ [key: string]: UslugaData }>(`https://lekiphoto-e1777-default-rtdb.europe-west1.firebasedatabase.app/usluge.json?auth=${token}`)
      }),
      map((uslugeData) => {
        console.log('Podaci primljeni iz baze:', uslugeData);
        const usluge: Usluga[] = [];
        for (const key in uslugeData) {
          if (uslugeData.hasOwnProperty(key)) {
            usluge.push(new Usluga(
              key,
              uslugeData[key].nazivUsluge,
              uslugeData[key].kratakOpis,
              uslugeData[key].slikaUrl,
              uslugeData[key].userId
            )

            )
          }
        }

        return usluge;
      }), tap(usluge => {
        this._usluge.next(usluge);
      })
    )

  }

  zakaziUslugu(usluga: Usluga, datum: string, lokacija: string, dodatniKomentar: string): Observable<any> {
    let fetchedUserId: string;
    return this.authService.userId.pipe(
      take(1),
      switchMap(userId => {
        if (!userId) {
          throw new Error('Nije pronadjen ID korisnika!');
        }
        fetchedUserId = userId;
        return this.authService.token;
      }),
      take(1),
      switchMap(token => {
        const zakazanaUsluga = {
          ...usluga,
          datumZakazivanja: datum,
          lokacija,
          dodatniKomentar,
          userId: fetchedUserId
        };
        return this.http.post<{ name: string }>(
          `https://lekiphoto-e1777-default-rtdb.europe-west1.firebasedatabase.app/savedUsluge.json?auth=${token}`,
          zakazanaUsluga
        );
      }),
      tap(() => {
        this.getSavedUsluge().subscribe();
      })
    );
  }

  getSavedUsluge() {
    let fetchedUserId: string;
    return this.authService.userId.pipe(
      take(1),
      switchMap(userId => {
        if (!userId) {
          throw new Error('No user ID found!');
        }
        fetchedUserId = userId;
        console.log('User ID pri preuzimanju sačuvanih usluga:', fetchedUserId);
        return this.authService.token;
      }),
      take(1),
      switchMap((token) => {
        return this.authService.userRole.pipe(
          take(1),
          switchMap(role => {
            if (role === 'admin') {
              return this.getAllSavedUsluge();
            } else {
              return this.http.get<{ [key: string]: Usluga }>(
                `https://lekiphoto-e1777-default-rtdb.europe-west1.firebasedatabase.app/savedUsluge.json?auth=${token}`
              ).pipe(
                map(savedUslugeData => {
                  const savedUsluge: Usluga[] = [];
                  for (const key in savedUslugeData) {
                    if (savedUslugeData.hasOwnProperty(key)) {
                      const usluga = new Usluga(
                        key,
                        savedUslugeData[key].nazivUsluge,
                        savedUslugeData[key].kratakOpis,
                        savedUslugeData[key].slikaUrl,
                        savedUslugeData[key].userId,
                        savedUslugeData[key].datumZakazivanja, 
                        savedUslugeData[key].datumiZakazivanja,
                        savedUslugeData[key].lokacija || '', 
                        savedUslugeData[key].dodatniKomentar || '' 
                      );
                      if (usluga.userId === fetchedUserId) {
                        savedUsluge.push(usluga);
                      }
                    }
                  }
                  console.log('Filtrirane sačuvane usluge:', savedUsluge);
                  return savedUsluge;
                })
              );
            }
          })
        );
      }),
      tap(savedUsluge => {
        this._savedUsluge.next(savedUsluge);
      })
    );
  }

  getAllSavedUsluge() {
    return this.authService.token.pipe(
      take(1),
      switchMap(token => {
        return this.http.get<{ [key: string]: Usluga }>(
          `https://lekiphoto-e1777-default-rtdb.europe-west1.firebasedatabase.app/savedUsluge.json?auth=${token}`
        );
      }),
      map(allSavedUslugeData => {
        const allSavedUsluge: Usluga[] = [];
        for (const key in allSavedUslugeData) {
          if (allSavedUslugeData.hasOwnProperty(key)) {
            allSavedUsluge.push(new Usluga(
              key,
              allSavedUslugeData[key].nazivUsluge,
              allSavedUslugeData[key].kratakOpis,
              allSavedUslugeData[key].slikaUrl,
              allSavedUslugeData[key].userId,
              allSavedUslugeData[key].datumZakazivanja,
              allSavedUslugeData[key].datumiZakazivanja,
              allSavedUslugeData[key].lokacija || '', 
              allSavedUslugeData[key].dodatniKomentar || ''
            ));
          }
        }
        return allSavedUsluge;
      }),
      tap(allSavedUsluge => {
        this._savedUsluge.next(allSavedUsluge);
      })
    );
  }

  updateUsluga(id: string, nazivUsluge: string, kratakOpis: string, slikaUrl: string): Observable<any> {
    let fetchedUserId: string;
    return this.authService.userId.pipe(
      take(1),
      switchMap(userId => {
        if (!userId) {
          throw new Error('No user ID found!');
        }
        fetchedUserId = userId;
        return this.authService.token;
      }),
      take(1),
      switchMap(token => {
        return this.http.patch(
          `https://lekiphoto-e1777-default-rtdb.europe-west1.firebasedatabase.app/usluge/${id}.json?auth=${token}`,
          { nazivUsluge, kratakOpis, slikaUrl }
        );
      })
    );
  }

  deleteUsluga(id: string): Observable<any> {
  return this.getUsluga(id).pipe(
    take(1),
    switchMap((usluga) => {
      if (!usluga || !usluga.slikaUrl) {
        // ako nema slike, brišemo samo podatke
        return this.deleteUslugaFromFirebase(id);
      }

      const fileName = this.extractFileNameFromUrl(usluga.slikaUrl);
return from(
  supabase.storage.from('usluge').remove([fileName])
).pipe(
  switchMap(({ error }) => {
    if (error) {
      console.error('Greška pri brisanju slike iz Supabase:', error);
    } else {
      console.log('Slika uspešno obrisana:', fileName);
    }

    return this.deleteUslugaFromFirebase(id);
  })
);

    })
  );
}

private deleteUslugaFromFirebase(id: string): Observable<any> {
  return this.authService.token.pipe(
    take(1),
    switchMap(token => {
      return this.http.delete(
        `https://lekiphoto-e1777-default-rtdb.europe-west1.firebasedatabase.app/usluge/${id}.json?auth=${token}`
      );
    }),
    tap(() => {
      this.getUsluge().subscribe();
    })
  );
}

private extractFileNameFromUrl(url: string): string {
  const parts = url.split('/');
  return decodeURIComponent(parts[parts.length - 1]);
}




  getUsluga(id: string): Observable<Usluga | undefined> {
    return this.usluge.pipe(
      take(1),
      map(usluge => usluge.find(usluga => usluga.id === id))
    );
  }
}