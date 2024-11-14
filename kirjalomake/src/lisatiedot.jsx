import './lisatiedot.css'
import { useState } from 'react'

function Lisatiedot({ tiedot }) {
	return (
		<div className='lisatiedot'>
			<label>
				Julkaisuvuosi: <p>{tiedot.julkaisuvuosi}</p>
			</label>
			<label>
				Sivut:<p>{tiedot.sivut}</p>
			</label>
			<label>
				Kieli: <p>{tiedot.kieli}</p>
			</label>
			<label>
				Kustantaja: <p>{tiedot.kustantaja}</p>
			</label>
			<label>
				Sidosasu: <p>{tiedot.sidosasu}</p>
			</label>
			<label>
				ISBN: <p>{tiedot.isbn}</p>
			</label>
			<label>
				Tuoteryhmä: <p>{tiedot.tuoteryhma}</p>
			</label>
			<label>
				Avainsanat: <p>{tiedot.avainsanat}</p>
			</label>
			<label>
				Varastotilanne:<p>{tiedot.varastotilanne}</p>
			</label>
		</div>
	)
}

export default Lisatiedot
