'use strict';

const fs=require('fs').promises;

async function lueVarasto(varastoTiedostopolku){
    try{
        const data = await fs.readFile(varastoTiedostopolku,'utf8');
        return JSON.parse(data);
    }
    catch(virhe){
        console.log(virhe);
        return [];
    }
}

async function lueKuva(kuvapolku){
    try{
        return await fs.readFile(kuvapolku,'binary');
    }
    catch(virhe){
        return null;
    }
}

async function lueKuvalista(kuvakansiopolku){
    try{
        const hakemisto=await fs.readdir(kuvakansiopolku,{withFileTypes:true});
        return hakemisto.filter(tiedosto=> !tiedosto.isDirectory())
            .map(tiedosto=>tiedosto.name);
    }
    catch(virhe){
        console.log(virhe);
        return [];
    }
}

async function kirjoitaVarasto(varastoTiedostopolku, data){
    try{
        await fs.writeFile(varastoTiedostopolku,
            JSON.stringify(data,null,4), {
                encoding:'utf8',
                flag:'w'
            });
        return true;
    }
    catch(virhe){
        return false;
    }
}

module.exports = { lueVarasto, lueKuva,lueKuvalista,kirjoitaVarasto};