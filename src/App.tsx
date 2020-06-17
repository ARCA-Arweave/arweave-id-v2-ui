import React, { useState } from 'react'
import { IonContent, IonApp, IonHeader, IonTitle, IonToolbar, IonCard, IonButton, IonGrid, IonItem, IonInput } from '@ionic/react'
import '@ionic/react/css/core.css'
import * as CSS from 'csstype'
import { ArweaveId } from 'arweave-id'
import { loadIdentity, IIdData } from './providers/arweave.provider'

const App = () => {
  const [arId, setArId] = useState<ArweaveId>({name: ''})
  const [address, setAddress] = useState('No wallet loaded')

  const onLoadIdentity = async (ev: React.ChangeEvent<HTMLInputElement>) => {
    let data:IIdData
    try{
      data = await loadIdentity(ev)
      setAddress(data.address!)
      setArId(data.arweaveId!)
      console.log('received data')
      console.log(data.arweaveId)
    }catch(err){
      setAddress('Error: Unable to load wallet')
      console.log('no data received')
    }
  }

  return (
    <IonApp>
      <IonHeader>
        <IonToolbar>
          <IonTitle>ArweaveID Rebooted! Version 2</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent>
        <IonCard>
          <IonGrid style={gridStyle}>
            <IonButton>
              <label htmlFor='myfileinput'>{address}</label>
            </IonButton>
            <input id='myfileinput' type='file' onChange={onLoadIdentity} style={{visibility:'hidden',width: '0px', height: '0px'}} />    

            <IonItem><IonInput placeholder='enter new name' value={arId.name} ></IonInput></IonItem>
            <IonCard style={{...avatarStyle, backgroundImage: `url('${arId.avatarDataUri}')`}}>
              Load New Avatar Image
            </IonCard>
            
          </IonGrid>
        </IonCard>
      </IonContent>
    </IonApp>
  )
}
export default App;

const gridStyle: CSS.Properties = {
  height: '100%',
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'space-between',
  alignItems: 'center',
}

const avatarStyle: CSS.Properties = {
	margin: '0px',
	padding: '0px',
	width: '100%',
	height: '100%',
	overflow: 'hidden',
	backgroundPosition: 'center center',
	backgroundRepeat: 'no-repeat',
	backgroundSize: 'cover',
}