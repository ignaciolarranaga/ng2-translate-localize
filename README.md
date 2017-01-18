# Introduction

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

The provided loader `LocalizableTranslateStaticLoader` if used will load the base translation and the localization
in the adequate order for the specific localization to override the keys of the generic translation,
so for example in the previous example you will get the correct translation for the specific locale you are using.

In other words all the translations of es.json are going to be available and just the repeated ones overriden,
which is the common scenario on application localization.

# Usage

The same as detailed on ng2-translate but at the time you instantiate the `TranslateStaticLoader` you use `LocalizableTranslateStaticLoader` instead.

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

## 2. Initialization of the TranslateService on your application:
Later at the moment of initialize the TranslateService remember to use the localized version matching the file.
For example:

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

## 2. Localization files:
Basically the same as ng2-translate but you can also add individual localization files, for example:

* es.json
    * es-UY.json
    * es-AR.json
    * es-US.json
* en.json
    * en-US.json
    * en-UK.json

As of now the only supported format is language-region, please comment/improve if some additional format is required.