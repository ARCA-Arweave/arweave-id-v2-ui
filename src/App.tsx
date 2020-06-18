import React, { useState } from 'react'
import { IonContent, IonApp, IonCard, IonButton, IonGrid, IonItem, IonInput } from '@ionic/react'
import { InputChangeEventDetail} from '@ionic/core'
import '@ionic/react/css/core.css'
import * as CSS from 'csstype'
import { loadIdentity, IIdData, setIdentity } from './providers/arweave.provider'
import { mdiImageEdit, mdiSend } from '@mdi/js' //material icons: https://materialdesignicons.com/
import { Icon } from '@mdi/react';
import Header from './components/Header'
import Footer from './components/Footer'
import { loadImage } from './providers/imageloader.provider'
import { ArweaveId } from 'arweave-id'

const App = () => {
  // const [arId, setArId] = useState<ArweaveId>({name: ''})
  const [address, setAddress] = useState('No wallet loaded')
  const [name, setName] = useState<string>()
  const [avatarDataUri , setAvatarDataUri ] = useState<string>()

  const onLoadIdentity = async (ev: React.ChangeEvent<HTMLInputElement>) => {
    try{
      let data: IIdData = await loadIdentity(ev)
      let arid = data.arweaveId
      setAddress(data.address!)
      setName(arid!.name)
      arid!.avatarDataUri !== undefined && setAvatarDataUri(arid?.avatarDataUri) 
      console.log('received data')
      console.log(data.arweaveId)
    }catch(err){
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
    if(address.length>40){
      let updated: ArweaveId = {name: name!}
      if(avatarDataUri !== undefined){
        updated.avatarDataUri = avatarDataUri
      }
      setIdentity(updated)
    } else{
      alert('Wallet not loaded')
    }
  }

  return (
    <IonApp>
      <Header/>
      <IonContent >
        <IonCard style={mainCardStyle}>
          <IonGrid style={gridStyle}>
            <IonButton color='secondary'>
              <label htmlFor='myloadjson' style={labelStyle} title='Load Your Arweave Wallet'>
                {address}
              </label>
            </IonButton>
            <input id='myloadjson' type='file' onChange={onLoadIdentity} style={hiddenStyle}/>    

            <IonItem>
              <IonInput placeholder='enter new name' value={name} onIonChange={ev=>setName(ev.detail.value!)}></IonInput>
            </IonItem>

            <IonCard style={{...avatarStyle, backgroundImage: `url('${avatarDataUri}')`}}>
              <label htmlFor='avatarinput' style={editImageStyle} title='Load New Avatar Image'>
                <Icon path={mdiImageEdit} size={2} color='black'/>
              </label>
              <input id='avatarinput' type='file' accept='image/*' onChange={onChangeAvatar} style={hiddenStyle} />    
            </IonCard>
            
            <IonButton onClick={onUpdateIdentity}>
              Update Profile &nbsp; <Icon path={mdiSend} size={1}/>
            </IonButton>

          </IonGrid>
        </IonCard>
      </IonContent>
      <Footer/>
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
}

const hiddenStyle: CSS.Properties = { 
  visibility: 'hidden',
  position: 'absolute',
  left: 0,
  top: 0,
  width: '0px', 
  height: '0px',
}