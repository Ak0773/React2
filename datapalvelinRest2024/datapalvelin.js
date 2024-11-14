'use strict';

const  http = require('http');
const path = require('path');

const asetukset = require('./config.json');

const PERUSPOLKU=__dirname;

const virheViesti=`
################################################
Käyttö: node datapalvelin <asetustiedosto>

Esimerkki: node datapalvelin jaatelovarasto.json
################################################`;

if(process.argv.length<3){
    console.log(virheViesti);
}
else{
    const [,,asetusTiedostoPolku] = process.argv;

    try{
        const asetustiedosto=require(path.join(
            PERUSPOLKU,
            asetukset.varastot.kansio,
            asetukset.asetustiedostokansio,
            asetusTiedostoPolku
            ));
        kaynnistaPalvelin(asetustiedosto);
    }
    catch(virhe){
        console.log(virhe);
        console.log(`Asetustiedostoa '${asetusTiedostoPolku}' ei löydy`);
    }
}

function kaynnistaPalvelin(asetustiedosto){
    // console.log('asetukset',asetukset);
    // console.log('asetustiedosto',asetustiedosto);
    const kirjastokansioPolku=path.join(PERUSPOLKU,asetukset.kirjasto.kansio);
    const varastokansioPolku=path.join(PERUSPOLKU,
                                        asetukset.varastot.kansio,
                                        asetustiedosto.varasto.kansio
                                        );
    const restKirjastokansioPolku=path.join(PERUSPOLKU,
                                            asetukset.rest.kansio)
    const polut={
        peruspolku:PERUSPOLKU,
        kirjastokansioPolku,
        varastokansioPolku,
        restKirjastokansioPolku,
        varastokerrosPolku:path.join(kirjastokansioPolku, asetukset.kirjasto.varastokerros),
        varastokasittelijaPolku:path.join(kirjastokansioPolku, asetukset.kirjasto.varastokasittelija),
        varastoAsetuksetPolku:path.join(varastokansioPolku, 
                            asetustiedosto.varasto.asetustiedosto),
        restStatusPolku: path.join(restKirjastokansioPolku,
                                    asetukset.rest.tilakoodit),
        restfunktiotPolku:path.join(restKirjastokansioPolku,
                                    asetukset.rest.restfunktiot),
        restVarastofunktiotPolku:path.join(restKirjastokansioPolku,
                                    asetukset.rest.varastofunktiot),
        restVarastokerrosPolku: path.join(restKirjastokansioPolku,
            asetukset.rest.varastokerros)
    }
  
    // console.log(polut);
    // const {luoVarastokerros}=require(polut.restVarastofunktiotPolku);

    // const {
    //     haeKaikkiVarastosta,
    //     haeYksiVarastosta,
    //     lisaaVarastoon,
    //     poistaVarastosta,
    //     paivitaVarasto
    // }=luoVarastokerros(polut);

    // haeKaikkiVarastosta().then(console.log).catch(console.log);
    // haeYksiVarastosta(10).then(console.log).catch(console.log);
    // const apu = {
    //     "id": 30,
    //     "nimi": "Vadelma",
    //     "hinta": 45,
    //     "kuva": "vadelma.png"
    // };
    // // lisaaVarastoon(apu).then(console.log).catch(console.log);
    // // paivitaVarasto(apu).then(console.log).catch(console.log);
    // poistaVarastosta(30).then(console.log).catch(console.log);
    
    const {luoVarasto} =require(polut.varastokerrosPolku);

    const {
        haeKaikki,
        hae,
        haeArvot,
        haeAvaimet,
        haeKuva,
        haeKuvalista,
        perusavain,
        hakuavaimet,
        resurssi
    } =luoVarasto(polut);

    // console.log(perusavain,hakuavaimet,resurssi);
    // haeKaikki().then(console.log);
    // hae(1).then(console.log);
    // hae(3,'hinta').then(console.log);
    // hae(4, 'hinta').then(console.log);
    // haeArvot('hinta').then(console.log).catch(console.log);
    // haeArvot('hinta',true).then(console.log).catch(console.log);
    // haeAvaimet().then(console.log).catch(console.log);
    // haeKuva('mansikka.png').then(console.log).catch(console.log);


    const restkasittelijaPolku = 
        path.join(restKirjastokansioPolku,
                asetukset.rest.restkasittelija);
    // console.log(restkasittelijaPolku);
    const { luoRestKasittelija }=require(restkasittelijaPolku);

    const kasitteleRest=luoRestKasittelija(polut);
    
    const palvelin = http.createServer(async (req,res)=>{
        const {pathname, searchParams} = 
            new URL(`http://${req.headers.host}${req.url}`);
        const reitti=decodeURIComponent(pathname);

        try{
            if(reitti.startsWith('/rest/')){
                kasitteleRest(req,res,reitti);
            }
            else if(reitti==='/'){
                lahetaJson(res,resurssi);
            }
            else if(reitti===`/${resurssi}/avaimet`){
                lahetaJson(res, await haeAvaimet());
            }
            else if(reitti===`/${resurssi}/hakuavaimet`){
                lahetaJson(res,hakuavaimet);
            }
            else if(reitti===`/${resurssi}/perusavain`){
                lahetaJson(res,perusavain);
            }
            else if(reitti===`/${resurssi}`){
                lahetaJson(res, await haeKaikki());
            }
            else if (reitti === `/${resurssi}/ehdolla`){
                const hakuavain=valitsehakuavain(searchParams);
                if(hakuavain){
                    const hakuarvo=searchParams.get(hakuavain);
                    const tulos = await hae(hakuarvo,hakuavain);
                    lahetaJson(res, tulos);
                }
                else{
                    lahetaVirheilmoitus(res,
                        `Hakuavain ei ole joukossa '${hakuavaimet.join()}`
                    );
                }
            }
            else if(reitti === `/${resurssi}/arvot`){
                const hakuavain=searchParams.get('avain');
                const kertaalleen = searchParams.has('kertaalleen');
                if(hakuavain){
                    lahetaJson(res,await haeArvot(hakuavain,kertaalleen));
                }
                else{
                    lahetaVirheilmoitus(res,'hakuavainta "avain" ei löydy');
                }
            }
            else if(reitti===`/${resurssi}/kuvalista`){
                haeKuvalista()
                    .then(lista=>lahetaJson(res,lista))
                    .catch(lista=>lahetaJson(res,lista));
            }
            else if(reitti===`/${resurssi}/kuvat`){
               
                const nimi=searchParams.get('nimi');
                if(nimi){
                    const kuva=await haeKuva(nimi);
                    if(kuva && kuva.kuvaData){
                        return lahetaKuva(res,kuva);
                    }
                }
                res.statusCode=404;
                res.setHeader('Access-Control-Allow-Origin','*');
                res.end();
            }
            else{
                lahetaVirheilmoitus(res, `resurssia ${reitti} ei löydy`);
            }
        }
        catch(virhe){
            lahetaVirheilmoitus(res,virhe.message);
        }
    }); //palvelimen loppu


    palvelin.listen(asetustiedosto.port,asetustiedosto.host,
    ()=>console.log(`${asetustiedosto.host}:${asetustiedosto.port} palvelee`));


    //apufunktiot

    function lahetaJson(res, jsonResurssi){
        const jsonData=JSON.stringify(jsonResurssi);
        res.writeHead(200,{
            'Content-Type':'application/json',
            'Access-Control-Allow-Origin':'*'
        });
        res.end(jsonData);
    }

    function lahetaKuva(res,kuvaresurssi){
        res.writeHead(200,{
            'Content-Type':kuvaresurssi.mime.tyyppi,
            'Content-Length':Buffer.byteLength( kuvaresurssi.kuvaData,
                                                kuvaresurssi.mime.koodaus),
            'Access-Control-Allow-Origin': '*'                   
        });
        res.end(kuvaresurssi.kuvaData,kuvaresurssi.mime.koodaus);
    }

    function valitsehakuavain(hakuParams){
        for(const avain of hakuavaimet){
            if(hakuParams.has(avain)){
                return avain;
            }
        }
        return null;
    }

    function lahetaVirheilmoitus(res, viesti){
        lahetaJson(res, {
            viesti:viesti,
            tyyppi:'virhe'
        });
    }


} //kaynnistaPalvelin loppu