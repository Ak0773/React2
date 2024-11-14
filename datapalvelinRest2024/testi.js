const muunna=require('./varastot/jaatelovarasto/jaatelosovitin.js');
// const muunna=olio=>olio;

const apu = {
    "id": "1",
    "nimi": "Mansikka",
    "hinta": "2",
    "kuva": "mansikka.png"
}

console.log(apu);
console.log(muunna(apu));