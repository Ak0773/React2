'use strict';

const STATUSKOODIT = {
    OHJELMAVIRHE: 0,
    EI_LOYTYNYT: 1,
    LISAYS_OK: 2,
    EI_LISATTY:3,
    JO_KAYTOSSA:4,
    POISTO_OK:5,
    EI_POISTETTU:6,
    PAIVITYS_OK:7,
    EI_PAIVITETTY:8,
    PERUSAVAIN_RISTIRIITAINEN:9   
}

const TYYPIT = {
    VIRHE: 'virhe',
    INFO: 'info'
}

const STATUSVIESTIT = {
    OHJELMAVIRHE: () => ({
        viesti: 'Anteeksi! Virhe ohjelmassamme',
        statuskoodi: STATUSKOODIT.OHJELMAVIRHE,
        tyyppi: TYYPIT.VIRHE
    }),
    EI_LOYTYNYT: avain => ({
        viesti: `Annetulla avaimella ${avain} ei löytynyt tietoja`,
        statuskoodi: STATUSKOODIT.EI_LOYTYNYT,
        tyyppi: TYYPIT.VIRHE
    }),
    LISAYS_OK: avain=>({
        viesti:`Tieto avaimella ${avain} lisättiin`,
        statuskoodi:STATUSKOODIT.LISAYS_OK,
        tyyppi:TYYPIT.INFO
    }),
    EI_LISATTY: ()=>({
        viesti: 'Tietoja ei lisätty',
        statuskoodi: STATUSKOODIT.EI_LISATTY,
        tyyppi: TYYPIT.VIRHE
    }),
    JO_KAYTOSSA: avain=>({
        viesti:`Perusavain ${avain} oli jo käytössä`,
        statuskoodi:STATUSKOODIT.JO_KAYTOSSA,
        tyyppi:TYYPIT.VIRHE
    }),
    POISTO_OK: avain => ({
        viesti: `Tieto avaimella ${avain} poistettiin`,
        statuskoodi: STATUSKOODIT.POISTO_OK,
        tyyppi: TYYPIT.INFO
    }),
    EI_POISTETTU: () => ({
        viesti: 'Tietoja ei poistettu',
        statuskoodi: STATUSKOODIT.EI_POISTETTU,
        tyyppi: TYYPIT.VIRHE
    }),
    PAIVITYS_OK: avain => ({
        viesti:`Tiedot avaimella ${avain} päivitettiin`,
        statuskoodi:STATUSKOODIT.PAIVITYS_OK,
        tyyppi:TYYPIT.INFO
    }),
    EI_PAIVITETTY: () => ({
        viesti: 'Tietoja ei päivitetty',
        statuskoodi: STATUSKOODIT.EI_PAIVITETTY,
        tyyppi: TYYPIT.VIRHE
    }),
    PERUSAVAIN_RISTIRIITAINEN: (perusavain,avain) =>({
        viesti:`Olion perusavain ${perusavain} ei ole sama`+
                ` kuin resurssin avain ${avain}`,
        statuskoodi:STATUSKOODIT.PERUSAVAIN_RISTIRIITAINEN,
        tyyppi:TYYPIT.VIRHE
    })
}

module.exports={STATUSKOODIT, STATUSVIESTIT, TYYPIT}