import Arweave from 'arweave/web'
import { retrieveArweaveIdfromAddress, ArweaveId } from 'arweave-id'
import { JWKInterface } from 'arweave/web/lib/wallet'

const arweave = Arweave.init({})

let jwk: JWKInterface

export interface IIdData {
	address?: string
	arweaveId?: ArweaveId
}

export const loadIdentity = async (ev: React.ChangeEvent<HTMLInputElement>):Promise<IIdData> => {
	return new Promise((resolve, reject) => {
		let file = ev.target.files![0]
		let fr = new FileReader()
		fr.onload = async () => {
			try {
				jwk = JSON.parse( (fr.result as string) )
		
				let address = await arweave.wallets.jwkToAddress(jwk)
				let arweaveId = await retrieveArweaveIdfromAddress(address, arweave)
	
				resolve({address, arweaveId})
			} catch (error) {
				reject()
			}
		}
		fr.onerror = reject
		fr.readAsText( file )
	})
}


export const setIdentity = async (arId: ArweaveId) => {
	//TODO: setArweaveID
	if(!jwk){
		alert('need to load jwk first')
	}
}

