# Datapalvelin API

Yleiskäyttöinen REST-palvelin tietojen hakuun. Vain haku (GET) operaatio on toteutettu.

Tiedot talletetaan json-tiedostoon. Tiedot ovat taulukossa olioina.

```json
[
    {
        "id":1,
        "nimi":"Mansikka",
        "hinta":2,
        "kuva":"mansikka.png"
    },
    {
        "id":2,
        "nimi":"Mustikka",
        "hinta":3,
        "kuva":"mustikka.png"
    }
]
```
Olion rakenne on vapaa, mutta vain ensimmäisen tason kenttiä voi käyttää tietojen hakemisessa.

Esimerkiksi olio voi sisältää kenttiä, joiden arvo on olio tai taulukko, mutta niiden arvoilla ei voi enää hakea.

```json
[
    {
        "nimi":"Eka",
        "tiedot":{
            "teksti":"tähän paljon tekstiä.....",
            "huomautukset":["huom1","huom2"]
        }
    }
]
```
Tästä oliosta voi hakea vain avaimilla `nimi` ja `tiedot`.
Käytännössä vain nimellä.

## varastokerros API

### **haeKaikki()**
palauttaa kaikki oliot taulukkona. Jos olioita ei ole tai tulee virhe, palauttaa tyhjän taulukon [];

### **hae(arvo,avain)**
palauttaa taulukossa kaikki oliot, joiden avaimen arvo on annettu `arvo`. Jos ehdon täyttäviä olioita ei löydy palauttaa tyhjän taulukon. Myös virhetilanteessa palauttaa tyhjän taulukon.

### **haeArvot(avain,vainKerran=false)**
palauttaa taulukossa kaikki parametrina annetun avaimen arvot. Jos arvoja ei löydy tai tulee virhe, palauttaa tyhjän taulukon.

Jos `vainKerran` on `true`, tulee arvo taulukkoon vain kerran, muuten (`false`) arvo voi olla taulukossa useampaan kertaan. Oletus on `false` siis taulukkoon tulee kaikki arvot.

### **haeAvaimet()**  

palauttaa taulukon, jossa on kaikki olioista löytyvät avainten (kenttien) nimet kertaalleen. Tutkitaan vain ensimmäisen tason kentät. Jos avaimia ei löydy tai tulee virhe, palautetaan tyhjä taulukko.

Esimerkiksi ensimmäisestä esimerkistä palutetaan
```json
["id","nimi","hinta","kuva"]
```
ja tieto-oliosta
```json
["nimi","tiedot"]
```

### **haeKuva(kuvatiedostonNimi)**

Palauttaa kuvadatan binäärimuodossa (blob). Jos kuvaa ei löydy, palauttaa `null`. Tunnistettavat kuvat ovat: png, jpeg, gif ja ico

## Vakiot

### **perusavain**
palauttaa asetustiedostossa olevan `perusavain` kentän arvon.
Perusavain on yksilöivä. Ei voi olla kahta oliota, joilla olisi sama perusavain.

### **hakuavaimet**
palauttaa asetustiedostossa olevan `hakuavaimet` kentän arvon

### **resurssi**
palauttaa asetustiedostossa olevan `resurssi` kentän arvon

## Tietovaraston asetustiedosto

Kullakin tietovarastolla on oma asetustiedosto, joka on muotoa:
(esimerkkinä jäätelövarasto)

```json
{
    "varastotiedosto":"jaatelot.json",
    "perusavain":"id",
    "hakuavaimet":["id","nimi","hinta"],
    "resurssi":"jäätelöt",
    "kuvakansio":"kuvat"
}
```

## Tietovarastopalvelimen asetustiedosto
Jokaisella varastolla on lisäksi asetustiedosto, joka on muotoa:

```json
{
    "port":3001,
    "host":"localhost",
    "varasto":{
        "kansio":"jaatelovarasto",
        "asetustiedosto":"asetukset.json"
    }
}
```

## Palvelimen käynnistys
Palvelin on parametroitu siten, että palvelinta käynnistettäessä annetaan komentoriville käytettävän tietovarasto palvelimen asetustiedoston nimi.

```shell
> node datapalvelin <asetustiedoston nimi>
```
## Palvelimen config.json
```json
{
    "asetustiedostokansio":"asetustiedostot",
    "kirjasto":{
        "kansio":"kirjasto",
        "varastokerros":"varastokerros.js",
        "varastokasittelija":"varastokasittelija.js"
    },
    "varastot":{
        "kansio":"varastot"
    }
}
```
## Palvelimen käyttö

Rest-palvelin palvelee reiteissä:

-   `/`
    -   palauttaa käytössä olevan resurssin nimen
-   `/<resurssi>`
    -   /jäätelöt
-   `/<resurssi>/avaimet`
    -   /jäätelöt/avaimet
-   `/<resurssi>/hakuavaimet`
    -   /jäätelöt/hakuavaimet
-   `/<resurssi>/perusavain`
    -   /jäätelöt/perusavain
-   `/<resurssi>/ehdolla?hakuavain=arvo`
    -   /jäätelöt/ehdolla?nimi=Mansikka
-   `/<resurssi>/arvot?avain=avaimennimi&kertaalleen`
    -   /jäätelöt/arvot?avain=hinta&kertaalleen
    -   /jäätelöt/arvot?avain=hinta
-   `/<resurssi>/kuvat?nimi=kuvannimi`
    -   /jäätelöt/kuvat?nimi=mansikka.png

Kaikki tiedot ovat json-muodossa, paitsi kuva, joka palautetaan binäärimuodossa. Huomaa, että hakuehdoissa kirjainkoko on merkitsevä (case sensitive).

Jos aiheutuu virhe, palautuu tila-olio, joka on muotoa
```json
{
    "viesti":"Tietoja ei löydy", 
    "tyyppi":"virhe"
}
```
Palvelin tukee cors:sia (cross origin requests)


## Varastokäsittelijä API

### **lueVarasto(tiedostopolku)**
palauttaa JSON-taulukon. Virhetilanteessa palauttaa tyhjä taulukon

### **lueKuva(kuvapolku)**
palauttaa kuvan binäärisenä tai null, jos kuvaa ei löydy tai tulee virhe.

### **kirjoitaVarasto(varastoTiedostopolku,data)**
tallettaa data:n json-tiedostoon. Palauttaa `true`, jos kirjoitus onnistui, muuten `false`. 


## REST palvelin

Palvelimeen lisätään Rest-palvelinosuus tietojen hakuun,lisäykseen, muutokseen ja poistoon. Operaatiot GET, POST, PUT, DELETE, HEAD, OPTIONS. Palvelin tukee `cors`:ia

Palvelin palvelee samassa portissa kuin aiempi datapalvelin, mutta reitissä /rest/

### Esimerkit

Esimerkiksi, jos portti on 3001 ja resurssi `jäätelöt`:

#### resurssi
localhost:3001/rest/jäätelöt

**palauttaa kaikki jäätelöt json taulukkona** 
GET /rest/jäätelöt

**palauttaa jäätelön id:llä 2** 
GET /rest/jäätelöt/2

palauttaa
```json
{
    "id": 2,
    "nimi": "Mustikka",
    "hinta": 3,
    "kuva": "mustikka.png"
}
```
**lisää uusi** 
POST /rest/jäätelöt

**päivitä/lisää**
PUT /rest/jäätelöt/2

**poisto**
DELETE /rest/jäätelöt/2

### Tilaviestit

```js
const STATUSKOODIT={
    OHJELMAVIRHE:0,
    EI_LOYTYNYT:1,
    LISAYS_OK:2,
    ...
}

const TYYPIT={
    VIRHE:'virhe',
    INFO:'info'
}

const STATUSVIESTIT = {
    OHJELMAVIRHE: ()=>({
        viesti:'Anteeksi! Virhe ohjelmassamme',
        statuskoodi:STATUSKOODIT.OHJELMAVIRHE,
        tyyppi:TYYPIT.VIRHE
    }),
    EI_LOYTYNYT: avain=>({
        viesti:`Annetulla avaimella ${avain} ei löytynyt tietoja`,
        statuskoodi:STATUSKOODIT.EI_LOYTYNYT,
        tyyppi:TYYPIT.VIRHE
    });
    ...
}
```

### uusi varaston asetukset
```json
{
    "varastotiedosto":"jaatelot.json",
    "perusavain":"id",
    "hakuavaimet":["id","nimi","hinta"],
    "resurssi":"jäätelöt",
    "kuvakansio":"kuvat",
    "muunnin":"jaatelosovitin.js"
}
```
Lisätään muunnin-kenttä sovitusfunktiota varten. Sovitin muuntaa talletettaessa (lisäys/päivitys) mahdollisesti merkkijonona annetut numeeriset arvot numeroiksi. Jos muunnin-kenttä puuttuu tai on tyhjä, käytetään muuntimena funktiota, joka palauttaa alkuperäisen olion muuttumattomana.
