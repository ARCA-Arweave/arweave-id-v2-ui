import Arweave from 'arweave/web'
import { get, ArweaveId, set, check } from 'arweave-id'
import { JWKInterface } from 'arweave/web/lib/wallet'


const arweave = Arweave.init({
    host: 'arweave.net',
    port: 443,
    protocol: 'https',
})

let jwk: JWKInterface

export interface IIdData {
	address?: string
	arweaveId?: ArweaveId
}

export const loadIdentity = async (ev: React.ChangeEvent<HTMLInputElement>): Promise<IIdData> => {
	return new Promise((resolve, reject) => {
		let file = ev.target.files![0]
		let fr = new FileReader()
		fr.onload = async () => {
			try {
				jwk = JSON.parse((fr.result as string))

				let address = await arweave.wallets.jwkToAddress(jwk)
				let arweaveId = await get(address, arweave)
				console.log(arweaveId);
				resolve({ address, arweaveId })
			} catch (error) {
				reject()
			}
		}
		fr.onerror = reject
		fr.readAsText(file)
	})
}

export const setIdentity = async (arId: ArweaveId) => {
	if (!jwk) {
		alert('need to load jwk first')
		return
	}
	console.log('Setting data:..')
	console.log(arId)

	let res = await set(arId, jwk, arweave)
	console.log(res)
	return res
}

export const checkAvailable = async (name:string) => {
	return await check(name, arweave)
}