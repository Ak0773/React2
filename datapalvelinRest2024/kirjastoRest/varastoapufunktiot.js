'use strict';

const path = require('path');

function luoVarastokerros(polut){

    const asetukset = require(polut.varastoAsetuksetPolku);

    const {
        varastotiedosto,
        perusavain,
        resurssi,
        kuvakansio
    } = asetukset;

    const varastoPolku = path.join(polut.varastokansioPolku, varastotiedosto);

    let muunna = olio=>olio;

    if(asetukset.muunnin && asetukset.muunnin.length>3){
        muunna = require(path.join(polut.varastokansioPolku,asetukset.muunnin));
    }

    const {
        lueVarasto, 
        kirjoitaVarasto
    } = require(polut.varastokasittelijaPolku);

    async function haeKaikkiVarastosta(){
        return lueVarasto(varastoPolku);
    }

    async function haeYksiVarastosta(arvo){
        return (await lueVarasto(varastoPolku))
            .find(olio=>olio[perusavain]==arvo) || null;
    }

    async function lisaaVarastoon(uusiOlio){
        const varasto = await lueVarasto(varastoPolku);
        varasto.push(muunna(uusiOlio));
        return await kirjoitaVarasto(varastoPolku,varasto);
    }

    async function poistaVarastosta(arvo){
        const varasto = await lueVarasto(varastoPolku);
        const i=varasto.findIndex(alkio=>alkio[perusavain]==arvo);
        if(i<0) return false; //ei löytynyt poistettavaa
        varasto.splice(i,1);
        return await kirjoitaVarasto(varastoPolku,varasto);
    }

    async function paivitaVarasto(olio){
        const varasto=await lueVarasto(varastoPolku);
        const vanhaOlio = varasto.find(vanha=>vanha[perusavain]==olio[perusavain]);

        if(vanhaOlio){
            Object.assign(vanhaOlio, muunna(olio));
            return await kirjoitaVarasto(varastoPolku, varasto);
        }

        return false;
    }

    return {
        haeKaikkiVarastosta,
        haeYksiVarastosta,
        lisaaVarastoon,
        poistaVarastosta,
        paivitaVarasto,
        perusavain,
        resurssi,
        kuvakansio
    }

} //luoVarastokerros loppu


module.exports={luoVarastokerros};