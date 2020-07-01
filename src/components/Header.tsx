import React from 'react'
import { IonHeader, IonToolbar, IonTitle } from '@ionic/react'
import * as CSS from 'csstype'

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