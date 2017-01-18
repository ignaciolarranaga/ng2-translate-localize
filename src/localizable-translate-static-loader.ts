import { Observable } from "rxjs/Rx";
import { Http } from "@angular/http";
import { TranslateLoader } from "ng2-translate";

/**
 * Able to handle different localizations for the same language.
 * You can define for example es.json & es-UY.json overriding custom localizations in the latest
 * (i.e. all the keys in es.json are going to be overriden by es-UY.json if the latest repeats them)
 * E.g: es.json: { "currency": "Moneda", "currency-symbol": "$" }
 * E.g: es-UY.json: { "currency-symbol": "$U" } -> only currency symbol is going to be overriden
 * Additionally you need use the correct locale (i.e. _translateService.use('es-UY');)
 */
export class LocalizableTranslateStaticLoader implements TranslateLoader {
    constructor(private http: Http, private prefix: string = "i18n", private suffix: string = ".json") {
    }

    /**
     * Gets the base translation overriden by the localizations if corresponds
     */
    getTranslation(locale: string): Observable<any> {
        let language = locale.split("-")[0];
        if (language.length == 2) {
            return Observable.forkJoin(
                this.http.get(`${this.prefix}/${language}${this.suffix}`)
                    .map((res: any) => res.json()),
                this.http.get(`${this.prefix}/${locale}${this.suffix}`)
                    .map((res: any) => res.json())
            ).map((translations: any[]) => this.mergeRecursive(translations[0], translations[1]));
        } else {
            return this.http.get(`${this.prefix}/${locale}${this.suffix}`)
                .map((res: any) => res.json());
        }
    }

    private mergeRecursive(obj1: any, obj2: any) {
        for (let p in obj2) {
            try {
                // Property in destination object set; update its value.
                if (obj2[p].constructor == Object) {
                    obj1[p] = this.mergeRecursive(obj1[p], obj2[p]);
                } else {
                    obj1[p] = obj2[p];
                }
            } catch(e) {
                // Property in destination object not set; create it and set its value.
                obj1[p] = obj2[p];
            }
        }

        return obj1;
    }

}
