import React, { useState, useEffect } from 'react'
import './App.css'
import Taulukko from './Taulukko'
import { kaikkiUrl, haeYksiUrl } from './url'
import Kirjalomake from './Kirjalomake'
import Lisatiedot from './lisatiedot'
import Tilaus from './Tilaus'

function App() {
	const [kaikki, setKaikki] = useState([])
	const [yksi, setYksi] = useState({})
	const [tila, setTila] = useState({})
	const [valittu, setValittu] = useState(1)
	const [valittuLomake, setValittuLomake] = useState(1)

	const haeKaikki = async () => {
		const data = await fetch(kaikkiUrl, { mode: 'cors' })
		const hakutulos = await data.json()
		setKaikki(hakutulos)
	}

	const hae = async id => {
		const data = await fetch(`${haeYksiUrl}/${id}`, { mode: 'cors' })
		const hakuYksiTulos = await data.json()
		if (hakuYksiTulos) {
			setYksi(hakuYksiTulos)
		}
	}

	useEffect(() => {
		haeKaikki()
	}, [])

	function haeMuokattava(id) {
		hae(id)
	}

	function paivitaTilaukset(tilaus) {
		if (tila[tilaus.tuotenumero]) {
			tila[tilaus.tuotenumero].määrä = tilaus.määrä
		} else {
			tila[tilaus.tuotenumero] = tilaus
		}
		setTila(tila)
	}

	function paivitaTiedot() {
		haeKaikki()
	}

	function vaihdaTila(valinta) {
		switch (valinta) {
			case 1:
				return null
			case 2:
				return <Lisatiedot tiedot={yksi} />
			default:
				return null
		}
	}

	function text(valittu) {
		return valittu === 1 ? 'näytä lisätiedot' : 'piilota lisätiedot'
	}
	function text2(valittuLomake) {
		return valittuLomake === 1 ? 'Kassa' : 'Tuoteen tiedot'
	}

	function vaihdalomake(lomake) {
		switch (lomake) {
			case 1:
				return (
					<div>
						<Kirjalomake tiedot={yksi} />
						<button onClick={() => setValittu(valittu === 1 ? 2 : 1)}>
							{text(valittu)}
						</button>
						{vaihdaTila(valittu)}
					</div>
				)
			case 2:
				return <Tilaus tilaus={Object.values(tila)} paivita={paivitaTiedot} />
			default:
				return null
		}
	}

	return (
		<>
			<Taulukko
				tiedot={kaikki}
				muokkaa={haeMuokattava}
				paivita={paivitaTiedot}
				tilaus={paivitaTilaukset}
			/>

			<button onClick={() => setValittuLomake(valittuLomake === 1 ? 2 : 1)}>
				{text2(valittuLomake)}
			</button>

			{vaihdalomake(valittuLomake)}
		</>
	)
}

export default App
