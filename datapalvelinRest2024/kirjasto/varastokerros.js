'use strict';

const path=require('path');


const MIMETYYPIT={
    '.png':{ tyyppi:'image/png', koodaus:'binary' },
    '.jpg': { tyyppi: 'image/jpeg', koodaus: 'binary' },
    '.jpeg': { tyyppi: 'image/jpeg', koodaus: 'binary' },
    '.gif': { tyyppi: 'image/gif', koodaus: 'binary' },
    '.ico': { tyyppi: 'image/ico', koodaus: 'binary' }
};

function luoVarasto(polut){
    const {
        varastotiedosto,
        perusavain,
        hakuavaimet,
        resurssi,
        kuvakansio
    } = require(polut.varastoAsetuksetPolku);

    const { lueVarasto, lueKuva, lueKuvalista } = require(polut.varastokasittelijaPolku);

    const varastotiedostoPolku = path.join(polut.varastokansioPolku, varastotiedosto);

    // console.log(varastotiedostoPolku);

    const haeKaikki = async ()=>{
        return lueVarasto(varastotiedostoPolku);
    }

    const hae= async (arvo, avain=perusavain)=>{
        try{
            const tiedot = await lueVarasto(varastotiedostoPolku);
            return tiedot.filter(alkio=>alkio[avain]==arvo);
        }
        catch(virhe){
            // console.log(virhe);
            return [];
        }
    }

    // const haeArvot= async (avain, vainKerran = false)=>{
    //     try{
    //         const tiedot = await lueVarasto(varastotiedostoPolku);
    //         const arvot=[];
    //         if(vainKerran){
    //             for(const alkio of tiedot){
    //                 if(alkio[avain] && !arvot.includes(alkio[avain])){
    //                     arvot.push(alkio[avain]);
    //                 }
    //             }
    //         }
    //         else{
    //             for(const alkio of tiedot){
    //                 if(alkio[avain]){
    //                     arvot.push(alkio[avain]);
    //                 }
    //             }
    //         }
    //         return arvot;
    //     }
    //     catch(virhe){
    //         return [];
    //     }
    // }
    const haeArvot = async (avain, vainKerran = false) => {
        try {
            const tiedot = await lueVarasto(varastotiedostoPolku);
            const arvot = tiedot.map(alkio=>alkio[avain])
                .filter(arvo=>arvo!=null);
            if (vainKerran) {
                const tulos = new Set(arvot);
                return [...tulos];
            }
            return arvot;
        }
        catch (virhe) {
            return [];
        }
    }

    const haeAvaimet= async ()=>{
        try{
            const tiedot= await lueVarasto(varastotiedostoPolku);
            // console.log(tiedot.map(alkio => Object.keys(alkio)));
            // console.log(tiedot.flatMap(alkio => Object.keys(alkio)));
            const nimet = new Set(tiedot.flatMap(alkio=>Object.keys(alkio)));
            return [...nimet];
        }
        catch(virhe){
            return [];
        }
    } 

    const haeKuvalista = async () =>{
        const kuvakansiopolku = path.join(polut.varastokansioPolku, kuvakansio);
        return lueKuvalista(kuvakansiopolku);
    }

    const haeKuva = async kuvatiedostonNimi =>{
        if(kuvakansio){
            try{
                const tiedostotunniste=path.extname(kuvatiedostonNimi).toLowerCase();
                if(!MIMETYYPIT[tiedostotunniste]) return null;
                const mime = MIMETYYPIT[tiedostotunniste];
                const kuvapolku=path.join(polut.varastokansioPolku,kuvakansio,kuvatiedostonNimi);
                const kuvaData=await lueKuva(kuvapolku);
                return {kuvaData,mime}
            }
            catch(virhe){
                console.log(virhe)
                return null;
            }
        }
        else{
            return null;
        }
    }
    return {
        haeKaikki,
        hae,
        haeArvot,
        haeAvaimet,
        haeKuva,
        haeKuvalista,
        perusavain,
        hakuavaimet,
        resurssi
    }
} //luovarasto loppu

module.exports={luoVarasto};