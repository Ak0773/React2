const palvelinUrl = 'http://localhost:4000'
const tilausUrl = 'http://localhost:4001'

const tilausresurssi = 'tilaukset'
const resurssi = 'kirjat'

const kaikkiUrl = `${palvelinUrl}/${resurssi}`
const kuvaUrl = `${palvelinUrl}/${resurssi}/kuvat?nimi=`
// const haeYksiUrl = `${palvelinUrl}/${resurssi}/ehdolla?numero=`; //palauttaa taulukon

const haeYksiUrl = `${palvelinUrl}/rest/${resurssi}` //rest versio palauttaa olion
const lisaysUrl = `${tilausUrl}/rest/${tilausresurssi}`
const lisaysUrlKuva = `${palvelinUrl}/rest/${resurssi}/kuvat`
const tilausnumeroUrl = `${tilausUrl}/tilaukset/arvot?avain=tilausnumero&kertaalleen`

export { kuvaUrl, lisaysUrl, lisaysUrlKuva, haeYksiUrl, kaikkiUrl, tilausnumeroUrl }