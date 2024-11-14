'use strict';

function luoTietovarasto(polut){

    const { 
        STATUSKOODIT, 
        STATUSVIESTIT, 
        TYYPIT 
    } = require(polut.restStatusPolku);

    const { luoVarastokerros } = 
            require(polut.restVarastofunktiotPolku);

    const {
        haeKaikkiVarastosta,
        haeYksiVarastosta,
        lisaaVarastoon,
        poistaVarastosta,
        paivitaVarasto,
        perusavain,
        resurssi,
        kuvakansio
    } = luoVarastokerros(polut);

    class Tietovarasto{
        get STATUSKOODIT(){
            return STATUSKOODIT;
        }
        get STATUSVIESTIT(){
            return STATUSVIESTIT;
        }
        get TYYPIT(){
            return TYYPIT;
        }
        get RESURSSI(){
            return resurssi;
        }
        get KUVAKANSIO(){
            return kuvakansio;
        }
        get PERUSAVAIN(){
            return perusavain;
        }

        haeKaikki(){
            return haeKaikkiVarastosta();
        }//haeKaikki loppu

        hae(arvo){
            return new Promise(async (resolve,reject)=>{
                if(!arvo){
                    reject(STATUSVIESTIT.EI_LOYTYNYT('--tyhjä--'));
                }
                else{
                    const tulos=await haeYksiVarastosta(arvo);
                    if(tulos){
                        resolve(tulos);
                    }
                    else{
                        reject(STATUSVIESTIT.EI_LOYTYNYT(arvo));
                    }
                }
            })
        }//hae loppu
        lisaa(uusi){
            return new Promise(async(resolve,reject)=>{
                if(uusi){
                    const tulos = await haeYksiVarastosta(uusi[perusavain]);
                    if (tulos) {
                        console.log(tulos, STATUSVIESTIT.JO_KAYTOSSA(uusi[perusavain]))
                        reject(STATUSVIESTIT.JO_KAYTOSSA(uusi[perusavain]));
                    }
                    else {
                        if(await lisaaVarastoon(uusi)){
                            resolve(STATUSVIESTIT.LISAYS_OK(uusi[perusavain]));  
                        }
                        else{
                            reject(STATUSVIESTIT.EI_LISATTY());
                        }
                    }
                }
                else{
                    reject(STATUSVIESTIT.EI_LISATTY());
                }
            })
        } //lisää loppu

        poista(arvo){
            return new Promise(async(resolve,reject)=>{
                if(!arvo){
                    reject(STATUSVIESTIT.EI_LOYTYNYT('--tyhjä--'));
                }
                else if(await poistaVarastosta(arvo)){
                    resolve(STATUSVIESTIT.POISTO_OK(arvo));
                }
                else{
                    reject(STATUSVIESTIT.EI_POISTETTU());
                }
            });
        }// poista loppu

        paivita(muutettuOlio,avain){
            return new Promise(async (resolve,reject)=>{
                if(muutettuOlio && avain){
                    if(muutettuOlio[perusavain]!=avain){
                        reject(STATUSVIESTIT.PERUSAVAIN_RISTIRIITAINEN(muutettuOlio[perusavain],avain));
                    }
                    else if(await haeYksiVarastosta(avain)){
                        if(await paivitaVarasto(muutettuOlio)){
                            resolve(STATUSVIESTIT.PAIVITYS_OK(avain));
                        }
                        else{
                            reject(STATUSVIESTIT.EI_PAIVITETTY());
                        }
                    }
                    else if(await lisaaVarastoon(muutettuOlio)){
                        resolve(STATUSVIESTIT.LISAYS_OK(avain));
                    }
                    else{
                        reject(STATUSVIESTIT.EI_LISATTY());
                    }
                }
                else{
                    reject(STATUSVIESTIT.EI_PAIVITETTY());
                }
            });
        } //paivita loppu

    } //luokan loppu

    return new Tietovarasto();

} //luoTietovarasto loppu

module.exports={luoTietovarasto};