import React, { useState, useEffect } from 'react'
import { IonContent, IonApp, IonCard, IonButton, IonGrid, IonItem, IonInput, IonList } from '@ionic/react'
import '@ionic/react/css/core.css'
import * as CSS from 'csstype'
import { loadIdentity, IIdData, setIdentity, getUnavailableNames } from './providers/arweave.provider'
import { mdiImageEdit, mdiSend } from '@mdi/js' //material icons: https://materialdesignicons.com/
import { Icon } from '@mdi/react';
import Header from './components/Header'
import Footer from './components/Footer'
import { loadImage } from './providers/imageloader.provider'
import { ArweaveId } from 'arweave-id'
import Popover from 'react-tiny-popover'


const App = () => {

	const [disableUpdateButton, setDisableUpdateButton] = useState(true)
	const [address, setAddress] = useState('No wallet loaded')
	const [name, setName] = useState<string>('');
	const [url, setUrl] = useState<string>('');
	const [text, setText] = useState<string>('');
	const [retrievedID, setID] = useState<ArweaveId>();
	const [avatarDataUri, setAvatarDataUri] = useState<string>()
	const [showModal, setShowModal] = useState<boolean>(false)
	const [unavailableNames, setUnavailableNames] = useState<string[]>()
	useEffect(() => {
		const getNames = async () => {
			const names = await getUnavailableNames();
			setUnavailableNames(names);
			console.log(names);
		}
		getNames();
	}, [])

	const onLoadIdentity = async (ev: React.ChangeEvent<HTMLInputElement>) => {
		setName('')
		setAvatarDataUri('')
		try {
			let data: IIdData = await loadIdentity(ev)
			let arid = data.arweaveId
			setAddress(data.address!)
			setName(arid!.name)
			arid!.avatarDataUri !== undefined && setAvatarDataUri(arid?.avatarDataUri)
			console.log('received data')
			console.log(data.arweaveId)
			setID(arid);
			setDisableUpdateButton(false)
		} catch (err) {
			setDisableUpdateButton(true)
			setAddress('Error: Unable to load wallet')
			console.log('no data received')
		}
	}

	const onChangeAvatar = async (ev: React.ChangeEvent<HTMLInputElement>) => {
		try {
			let dataUri = await loadImage(ev)
			setAvatarDataUri(dataUri)
		} catch (error) {
			alert(error) // replace with <IonToast> or something
		}
	}

	const onUpdateIdentity = async () => {
		let updated: ArweaveId = { name: name!, url: url, text: text }
		if (avatarDataUri !== undefined) {
			updated.avatarDataUri = avatarDataUri
		}
		setIdentity(updated)
	}

	const checkName = (ev: any) => {
		setName(ev.detail.value!)
		if ((retrievedID?.name !== ev.detail.value) && (unavailableNames?.includes(ev.detail.value!))) {
			setShowModal(true)
			setDisableUpdateButton(true)
		}
		else {
			setShowModal(false);
			setDisableUpdateButton(false);
		}
	}

	return (
		<IonApp>
			<Header />
			<IonContent >
				<IonCard style={mainCardStyle}>
					<IonGrid style={gridStyle}>
						<IonButton color='secondary'>
							<label htmlFor='myloadjson' style={labelStyle} title='Load Your Arweave Wallet'>
								{address}
							</label>
						</IonButton>
						<input id='myloadjson' type='file' onChange={onLoadIdentity} style={hiddenStyle} />
						<IonList>
						<IonItem>
							<Popover
								isOpen={showModal}
								position={'bottom'} // preferred position
								content={<IonCard color='danger' style={{ padding: '10px' }}>Name Not Available</IonCard>}
							>
								<IonInput
									placeholder='enter new name'
									value={name}
									onIonChange={ev => checkName(ev)}
									onFocus={() => setShowModal(false)}
									style={{ textAlign: 'center' }}
								/>
							</Popover>
							</IonItem>
							<IonItem>
							<IonInput
								placeholder='Enter URL'
								value={url}
								onIonChange={ev => setUrl(ev.detail.value!)}
								style={{ textAlign: 'center' }}
							/></IonItem>
							<IonItem>
							<IonInput
								placeholder='Enter any freeform text'
								value={text}
								onIonChange={ev => setText(ev.detail.value!)}
								style={{ textAlign: 'center' }}
							/></IonItem>
						</IonList>
						<IonCard style={{ ...avatarStyle, backgroundImage: `url('${avatarDataUri}')` }}>
							{!avatarDataUri && (
								<span style={noImageTextStyle}>No avatar image found</span>
							)}
							<label htmlFor='avatarinput' style={editImageStyle} title='Edit Avatar Image'>
								<Icon path={mdiImageEdit} size={2} color='black' />
							</label>
							<input id='avatarinput' type='file' accept='image/*' onChange={onChangeAvatar} style={hiddenStyle} />
						</IonCard>

						<IonButton onClick={onUpdateIdentity} disabled={disableUpdateButton || name === ''}>
							Update Profile &nbsp; <Icon path={mdiSend} size={1} />
						</IonButton>

					</IonGrid>
				</IonCard>
			</IonContent>
			<Footer />
		</IonApp>
	)
}
export default App;


const mainCardStyle: CSS.Properties = {
	height: '80%',
	margin: '10%',
}
const gridStyle: CSS.Properties = {
	height: '100%',
	display: 'flex',
	flexDirection: 'column',
	justifyContent: 'start',
	alignItems: 'center',
}
const avatarStyle: CSS.Properties = {
	position: 'relative',
	width: '100%',
	height: '100%',
	maxHeight: '300px',
	maxWidth: '300px',
	overflow: 'hidden',
	backgroundPosition: 'center center',
	backgroundRepeat: 'no-repeat',
	backgroundSize: 'cover',
	textAlign: 'center',
}
const noImageTextStyle: CSS.Properties = {
	position: 'relative',
	top: '45%',
}
const editImageStyle: CSS.Properties = {
	position: 'absolute',
	bottom: '10%',
	right: '10%',
	cursor: 'pointer',
	backgroundColor: 'rgba(255, 255, 255, 0.5)',
	borderRadius: '5px',
}
const labelStyle: CSS.Properties = {
	cursor: 'pointer',
	padding: '10px',
}
const hiddenStyle: CSS.Properties = {
	visibility: 'hidden',
	position: 'absolute',
	left: 0,
	top: 0,
	width: '0px',
	height: '0px',
}
