import React from 'react'
import { IonHeader, IonToolbar, IonTitle, IonText } from '@ionic/react'
import * as CSS from 'csstype'
import Icon from '@mdi/react'
import { mdiAccount } from '@mdi/js'

const Header = () => {
	return (
		<IonHeader >
			<IonToolbar style={toolbarStyle}>
				<IonTitle> ArweaveID V2</IonTitle>
			</IonToolbar>
		</IonHeader>
	)
}

export default Header

const toolbarStyle: CSS.Properties = {
	display: 'flex',
	textAlign: 'center'
}