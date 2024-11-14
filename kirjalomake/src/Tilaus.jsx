import { useState, useEffect } from 'react'
import './Tilaus.css'
import { lisaysUrl, tilausnumeroUrl } from './url'

function Tilaus({ tilaus }) {
	const [tilaukset, setTilaukset] = useState([])

	useEffect(() => {
		setTilaukset(tilaus)
	}, [tilaus])

	// Check if there are any valid items in the filtered list
	const hasItems = tilaukset.length > 0

	async function laheta(e) {
		e.preventDefault()
		// try {
		// 	const lomakeData = new FormData(e.target)
		// 	const dataJson = Object.fromEntries(lomakeData.entries())
		// 	dataJson.tilausnumero = 1
		// 	dataJson.tuoteet = tilaukset.filter(data => data.määrä > 0)

		// 	const tulos = await fetch(`${lisaysUrl}/${tilausnumero}`, {
		// 		method: 'PUT',
		// 		headers: { 'Content-Type': 'application/json' },
		// 		mode: 'kirjataulukko',
		// 		body: JSON.stringify(tilaukset),
		// 	})
		// 	const tulosJson = await tulos.json()
		// 	console.log(tulosJson)
		// } catch (virhe) {
		// 	console.log('laheta:', virhe)
		// }

		const lomakeData = new FormData(e.target)
		const dataJson = Object.fromEntries(lomakeData.entries())
		const tilausnumerodata = await fetch(tilausnumeroUrl, { mode: 'cors' })
		const tilausnumerodataJson = await tilausnumerodata.json()
		console.log(tilausnumerodataJson)
		const tilausnumero = Math.max(...tilausnumerodataJson, 0) + 1
		dataJson.tilausnumero = tilausnumero
		dataJson.tuoteet = tilaukset.filter(data => data.määrä > 0)
		console.log(dataJson)

		const optiot = {
			method: 'PUT',
			headers: { 'Content-Type': 'application/json' },
			mode: 'cors',
			body: JSON.stringify(dataJson),
		}

		const tulos = await fetch(`${lisaysUrl}/${dataJson.tilausnumero}`, optiot)
		const tulosJson = await tulos.json()
	}

	return (
		<>
			<div>Tilaus</div>
			{hasItems ? (
				<table>
					<thead>
						<tr>
							<th>Nimi</th>
							<th>Hinta €</th>
							<th>Määrä</th>
							<th>Yhteensä €</th>
						</tr>
					</thead>
					<tbody>
						{tilaukset
							.filter(data => data.määrä > 0)
							.map((data, index) => (
								<tr key={index} className='tilaus'>
									<td>{data.nimi}</td>
									<td>{data.hinta}</td>
									<td>{data.määrä}</td>
									<td>{Math.round(data.hinta * data.määrä)}</td>
								</tr>
							))}
					</tbody>
				</table>
			) : (
				<p>Ei tuotteita tilauksessa.</p>
			)}

			<form onSubmit={laheta}>
				<div>
					<p>Tilauspäivä:</p>
					<input
						type='date'
						value={new Date().toISOString().split('T')[0]}
						readOnly
					/>
				</div>
				<div>
					<p>Etunimi:</p>
					<input type='text' name='etunimi' />
				</div>
				<div>
					<p>Sukunimi:</p>
					<input type='text' name='sukunimi' />
				</div>
				<div>
					<p>Katuosoite:</p>
					<input type='text' name='katuosoite' />
				</div>
				<div>
					<p>Postipaikka:</p>
					<input type='text' name='postipaikka' />
				</div>
				<div>
					<button type=''>Vahvista Tilaus</button>
				</div>
			</form>
		</>
	)
}

export default Tilaus
