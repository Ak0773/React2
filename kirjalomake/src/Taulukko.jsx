import { useState } from 'react'
import './Taulukko.css'
import { kuvaUrl } from './url'

function Taulukko({ tiedot, muokkaa, tilaus }) {
	const [valittu, setValittu] = useState(0)
	const [arvot, setArvot] = useState({}) // Tallennetaan kaikkien syöttökenttien arvot objektina

	function paivita(id) {
		muokkaa(id)
		setValittu(id)
	}

	function paivitaTilaus(ostoskori, id, nimi, hinta) {
		const tulos = {
			tuotenumero: id,
			nimi: nimi,
			määrä: ostoskori,
			hinta: hinta,
		}
		tilaus(tulos)
	}

	function handleInputChange(e, data) {
		const inputValue = e.target.value
		const productId = data.id

		// Jos arvo on 0, nollaa kaikkien tuotteiden arvot tyhjiksi
		if (Number(inputValue) === 0) {
			const nollatutArvot = tiedot.reduce((acc, item) => {
				acc[item.id] = ''
				return acc
			}, {})
			setArvot(nollatutArvot)
		} else {
			// Päivitä yksittäisen kentän arvo
			setArvot(prevArvot => ({
				...prevArvot,
				[productId]: inputValue,
			}))
		}
		paivitaTilaus(inputValue, data.id, data.nimi, data.hinta)
	}

	function handleBlur(productId) {
		// Jos kenttä on tyhjä, näytä 0
		setArvot(prevArvot => ({
			...prevArvot,
			[productId]: prevArvot[productId] === '' ? '0' : prevArvot[productId],
		}))
	}

	return (
		<div className='Taulukko'>
			<table>
				<thead>
					<tr>
						<th>Nimi</th>
						<th>Tekijä</th>
						<th>Hinta €</th>
						<th>varastossa</th>
						<th>Kuva</th>
						<th>Ostoskori</th>
					</tr>
				</thead>
				<tbody>
					{tiedot.map(data => (
						<tr
							key={data.id}
							id={data.id}
							className={valittu === data.id ? 'valittu' : ''}
							onClick={() => paivita(data.id)}
						>
							<td>{data.nimi}</td>
							<td>
								{data.tekijä.etunimi} {data.tekijä.sukunimi}
							</td>
							<td>{data.hinta}</td>
							<td>{data.varastotilanne}</td>
							<td>
								<img src={kuvaUrl + data.kuva} alt={data.kuva} />
							</td>
							<td>
								<input
									type='number'
									value={arvot[data.id] || ''}
									onChange={e => handleInputChange(e, data)}
									onBlur={() => handleBlur(data.id)}
									min='0'
									max={data.varastotilanne}
								/>
							</td>
						</tr>
					))}
				</tbody>
			</table>
		</div>
	)
}

export default Taulukko
