import React, { useState, useEffect, useRef } from 'react'
import { IonContent, IonApp, IonCard, IonButton, IonGrid, IonItem, IonInput, IonList, IonCardContent, IonLabel, IonRow, IonTextarea, IonSpinner } from '@ionic/react'
import '@ionic/react/css/core.css'
import * as CSS from 'csstype'
import { loadIdentity, IIdData, setIdentity, getUnavailableNames } from './providers/arweave.provider'
import { mdiWeb, mdiTagFaces, mdiFormatAlignRight } from '@mdi/js'
import { Icon } from '@mdi/react';
import Header from './components/Header'
import Footer from './components/Footer'
import { loadImage } from './providers/imageloader.provider'
import { ArweaveId, getIdenticon } from 'arweave-id'
import Popover from 'react-tiny-popover'


const App = () => {

	const [disableUpdateButton, setDisableUpdateButton] = useState(true)
	const [address, setAddress] = useState('No address loaded')
	const [name, setName] = useState<string>('');
	const [url, setUrl] = useState<string>('');
	const [text, setText] = useState<string>('');
	const [retrievedID, setID] = useState<ArweaveId>();
	const [avatarDataUri, setAvatarDataUri] = useState<string>()
	const [showModal, setShowModal] = useState<boolean>(false)
	const [unavailableNames, setUnavailableNames] = useState<string[]>()
	const [successModal, setSuccess] = useState<boolean>(false);
	const [successModalContent, setModalContent] = useState<any>()
	const [copiedModal, setCopied] = useState<boolean>(false);
	const walletFileInput = useRef<HTMLInputElement>(null)
	const avatarFileInput = useRef<HTMLInputElement>(null)

	useEffect(() => {
		const getNames = async () => {
			const names = await getUnavailableNames();
			setUnavailableNames(names);
			console.log(names);
		}
		getNames();
	}, [])

	useEffect(() => {
		if ((retrievedID?.name === name) && (retrievedID?.text === text) && (retrievedID?.url === url) && (retrievedID?.avatarDataUri === avatarDataUri)) {
			setDisableUpdateButton(true)
		}
		else {
			setDisableUpdateButton(false)
		}
	}, [name, text, url, avatarDataUri, retrievedID, disableUpdateButton]);

	const onLoadIdentity = async (ev: React.ChangeEvent<HTMLInputElement>) => {
		setName('')
		setAvatarDataUri('')
		try {
			let data: IIdData = await loadIdentity(ev)
			let arid = data.arweaveId
			setAddress(data.address!)
			setName(arid!.name)
			if (arid!.text) setText(arid!.text)
			if (arid!.url) setUrl(arid!.url)
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

	const openFileInput = (fileInput: any) => {
		if (fileInput.current) {
			fileInput.current.click();
		}
	}

	const onUpdateIdentity = async () => {
		setDisableUpdateButton(true)
		setSuccess(true)
		setModalContent(<IonCard style={{ padding: '10px', borderRadius: "15px", textAlign: "center", width: "200px" }}>
			<IonSpinner name="dots" /></IonCard>)
		let updated: ArweaveId = { name: name!, url: url, text: text }
		if (avatarDataUri !== undefined) {
			updated.avatarDataUri = avatarDataUri
		}
		let res = await setIdentity(updated);

		if (res?.statusCode === 202) {
			setModalContent(<IonCard color="primary" style={{ padding: '10px', borderRadius: "15px", textAlign: "center", width: "200px" }}>
				<label>ArweaveID submitted successfully. <br /> See transaction
		<a href={"https://viewblock.io/arweave/tx/" + res.txid} target="blank"> here</a></label></IonCard>)
		}
		else setModalContent(<IonCard color="danger" style={{ padding: '10px', borderRadius: "15px", textAlign: "center", width: "200px" }}>
			<label>Error: {res?.statusMessage}</label></IonCard>)
	}

	return (
		<IonApp >
			<Header />
			<IonContent >
				<IonGrid style={gridStyle}>
					<IonCardContent>
						<IonRow style={{flexDirection:'row', justifyContent:'center'}}>
						<Popover
								isOpen={copiedModal}
								position={'bottom'}
								content={<IonCard color='primary' style={{ padding: '5px', borderRadius:'15px'}}>Copied</IonCard>}
							>
							<IonItem onClick={() => {
								navigator.clipboard.writeText(address)
								.then(()=>{
									setCopied(true)
									setTimeout(() => setCopied(false),1500)
								})
							}
								}lines="none">
								<IonLabel style={addressStyle}>
									{address}
								</IonLabel>
							</IonItem></Popover>
							<IonButton shape="round" color='secondary' fill="outline" onClick={() => openFileInput(walletFileInput)} >
								<label style={labelStyle} title='Load Your Arweave Wallet'>
									import wallet
							</label>
								<input id='myloadjson' type='file' ref={walletFileInput} onChange={onLoadIdentity} style={hiddenStyle} />
							</IonButton></IonRow>
					</IonCardContent>
					<IonItem lines="none" style={{ flexShrink: 0 }}>
						<IonButton shape="round" size="default" onClick={() => {
							let identicon = getIdenticon(name);
							setAvatarDataUri(`${identicon}`)
						}} disabled={name === ''}>
							<label style={labelStyle} title='generate avatar'>
								generate avatar
							</label>
						</IonButton>
					</IonItem>

					<IonCard onClick={() => openFileInput(avatarFileInput)} style={{ ...avatarStyle, backgroundImage: `url('${avatarDataUri}')` }}>
						{!avatarDataUri && (
							svgCircle()
						)}
						<input id='avatarinput' type='file' ref={avatarFileInput} accept='image/*' onChange={onChangeAvatar} style={hiddenStyle} />
					</IonCard>


					<IonList>
						<IonItem lines="none" style={{ border: '0px solid white' }}>
							<Icon path={mdiTagFaces} size={1} />
							<Popover
								isOpen={showModal}
								position={'bottom'}
								content={<IonCard color='danger' style={{ padding: '10px' }}>Name Not Available</IonCard>}
							>

								<IonInput
									placeholder="What's your name?"
									value={name}
									onIonChange={ev => checkName(ev)}
									onFocus={() => setShowModal(false)}
									style={textAreaStyle}
								/>
							</Popover>
						</IonItem>
						<IonItem lines="none"><Icon path={mdiWeb} size={1} />
							<IonInput
								placeholder="What's your web address?"
								value={url}
								onIonChange={ev => setUrl(ev.detail.value!)}
								style={textAreaStyle}
							/></IonItem>
						<IonItem lines="none">
							<Icon path={mdiFormatAlignRight} size={1} style={{ marginTop: "5px" }} />
							<IonTextarea
								placeholder='Tell us about yourself'
								value={text}
								onIonChange={ev => setText(ev.detail.value!)}
								style={textAreaStyle}
							/></IonItem>
					</IonList>
					<IonRow style={{ justifyContent: "end" }}>
						<Popover
							isOpen={successModal}
							position={'bottom'}
							content={successModalContent}
						>
							<IonButton onClick={onUpdateIdentity} disabled={disableUpdateButton || name === ''} shape="round">
								save
								</IonButton></Popover>
					</IonRow>
				</IonGrid>
			</IonContent>
			<Footer />
		</IonApp>
	)
}
export default App;


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
	borderRadius: "50%",
	flexShrink: 0
}

const editImageStyle: CSS.Properties = {
	position: 'relative',
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

const svgStyle: CSS.Properties = {
	height: "200px",
	stroke: "#707070",
	bottom: '-15%',
	right: '0%'
}

const textAreaStyle: CSS.Properties = {
	textAlign: "left",
	marginLeft: "10px",
	border: "1px solid black",
	paddingLeft: "5px"
}

const addressStyle: CSS.Properties = {
	overflow: "ellipsis",
	maxWidth: "90vw",
	cursor: "pointer"
}

const svgCircle = () => {
	return <svg style={{ ...editImageStyle, ...svgStyle }} viewBox="0 0 100 100">
		<circle cx="50" cy="50" r="45" fill="none" strokeWidth="1"></circle>
		<line x1="32.5" y1="50" x2="67.5" y2="50" strokeWidth="5"></line>
		<line x1="50" y1="32.5" x2="50" y2="67.5" strokeWidth="5"></line>
	</svg>

}