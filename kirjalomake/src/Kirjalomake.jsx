import { useState } from 'react'
import { kuvaUrl } from './url'
import './kirjalomake.css'
function Kirjalomake({ tiedot }) {
	return (
		<div className='kirjalomake'>
			<h1>Kirjalomake</h1>

			<div className='lomake'>
				<div>
					<label>
						Nimi: <p>{tiedot.nimi}</p>
					</label>
				</div>
				<div>
					<label>
						Tekijä:
						<p>
							{tiedot.tekijä ? tiedot.tekijä.etunimi : ''}{' '}
							{tiedot.tekijä ? tiedot.tekijä.sukunimi : ''}
						</p>
					</label>
				</div>
				<div>
					<label>
						Hinta €: <p>{tiedot.hinta}</p>
					</label>
				</div>
				<div>
					<label>
						Huomautuksia:
						<p>{tiedot.kuvaus ? tiedot.kuvaus.join(' ') : ''}</p>
					</label>
				</div>
				<img src={kuvaUrl + tiedot.kuva} alt={tiedot.kuva} />
			</div>
		</div>
	)
}

export default Kirjalomake
