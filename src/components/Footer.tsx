import React from 'react'
import { IonFooter, IonToolbar} from '@ionic/react'
import * as CSS from 'csstype'
import { mdiGithub } from '@mdi/js'
import { Icon } from '@mdi/react';
import arweave from '../assets/arweave.png'
import arca from '../assets/arca.png'
const Footer = () => {
	return (
		<IonFooter >
			<IonToolbar style={toolbarStyle}>
				<img src={arweave} alt="Arweave" style={{height:'20px', width:'20px',paddingLeft:'20px'}}/><a href="https://www.arweave.org" target="_blank" rel="noopener noreferrer">Arweave</a>
				<Icon path={mdiGithub} size={1} style={{paddingLeft:'20px'}}/><a href="https://github.com/ARCA-Arweave/arweave-id-v2" target="_blank" rel="noopener noreferrer">Developed with ArweaveID</a>
				<img src={arca} alt="ARCA DAO" style={{height:'20px', width:'20px',paddingLeft:'20px'}}/><label>Funded by ARCA</label>
				<a style={{paddingLeft:'20px'}} href="https://faucet.perma.online/" target="_blank" rel="noopener noreferrer">Get some AR Tokens</a>
			</IonToolbar>
		</IonFooter>
	)
}

const toolbarStyle: CSS.Properties = {
	display: 'flex',
	textAlign: 'center',
	flexDirection: 'row'

}

export default Footer

