import React from 'react'
import { IonHeader, IonToolbar, IonTitle, IonText } from '@ionic/react'
import * as CSS from 'csstype'
import Icon from '@mdi/react'
import { mdiAccount } from '@mdi/js'

const Header = () => {
	return (
		<IonHeader>
			<IonToolbar>
				<div style={toolbarStyle}>
					<Icon path={mdiAccount} size={1}/> 
					<IonTitle> Edit Your Arweave Profile</IonTitle>
					<IonText>ArweaveID Version 2 - Reboot</IonText>
				</div>
			</IonToolbar>
		</IonHeader>
	)
}

export default Header

const toolbarStyle: CSS.Properties = {
  display: 'flex',
  flexDirection: 'row',
  margin: '20px',
}