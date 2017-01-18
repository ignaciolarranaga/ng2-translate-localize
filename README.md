# ng2-translate-localize

In some situations you need to handle different localizations for the same language, something like:

```
es.json: {
    "currency": "Moneda",
    "currency-symbol": "$"
}
es-UY.json: {
    "currency-symbol": "$U"
}
es-AR.json: {
    "currency-symbol": "ARS"
}
es-UK.json: {
    "currency-symbol": "£"
}
```

where you want currency-symbol to change according to the specific spanish localization.

The loader provided by the plugin (`LocalizableTranslateStaticLoader`) will resolve the keys prioritazing, if exists,
the localized version. Internally it will load all the translations of base language (e.g. es.json) and override the
ones from the current localization (e.g. es-UY.json), which is the common scenario on application localization.

## Installation

First you need to install the npm module:

```
npm install ng2-translate-localize --save
```

## Usage

The same as detailed on ng2-translate, but at the time you instantiate the `TranslateStaticLoader` you will use
`LocalizableTranslateStaticLoader` instead.

```
@NgModule({
    imports: [
        BrowserModule,
        HttpModule,
        TranslateModule.forRoot({
            provide: TranslateLoader,
            useFactory: (http: Http) => new LocalizableTranslateStaticLoader(http, '/assets/i18n', '.json'),
            deps: [Http]
        })
    ],
    bootstrap: [AppComponent]
})
export class AppModule { }
```

or the following for AOT:

```
export function createTranslateLoader(http: Http) {
    return new LocalizableTranslateStaticLoader(http, './assets/i18n', '.json');
}

@NgModule({
    imports: [
        BrowserModule,
        HttpModule,
        TranslateModule.forRoot({
            provide: TranslateLoader,
            useFactory: (createTranslateLoader),
            deps: [Http]
        })
    ],
    bootstrap: [AppComponent]
})
export class AppModule { }
```

### Initialization of the TranslateService on your application
At the moment of initialize the TranslateService remember to use the localized version (that should match
one of the localization files you created). For example:

```
import {Component} from '@angular/core';
import {TranslateService} from 'ng2-translate';

@Component({
    selector: 'app',
    template: `
        <div>{{ 'HELLO' | translate:param }}</div>
    `
})
export class AppComponent {
    param = {value: 'world'};

    constructor(translate: TranslateService) {
        // this language will be used as a fallback when a translation isn't found in the current language
        translate.setDefaultLang('es');

         // the lang to use, if the lang isn't available, it will use the current loader to get them
        translate.use('es-UY');
    }
}
```

### Localizated translations
Identically to ng2-translate you create the translation files (e.g. es.json, en.json, ..), but now you can
also add individual localization files (es-UY.json, es-AR.json, ...), for example:

* es.json
    * es-UY.json
    * es-AR.json
    * es-US.json
* en.json
    * en-US.json
    * en-UK.json

As of now the only supported format is language-region, please comment/improve if some additional format is required.