import Arweave from 'arweave/web'
import { get, ArweaveId, set } from 'arweave-id'
import { JWKInterface } from 'arweave/web/lib/wallet'


const arweave = Arweave.init({})

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
}

export const getUnavailableNames = async (): Promise<Array<string>> => {
	let query = `query {
		transactions(tags: [{name: "App-Name", value: "arweave-id"},{name: "App-Version", value:"0.0.2"}]) {
		  id
		  tags{name value}
		}
	  }`
	let allNamesQuery = Object.assign(await arweave.arql({query: query}));
	let nameTxns = allNamesQuery.data.transactions as Array<object>;
	//@ts-ignore
	let names = nameTxns.map(txn => {
		//@ts-ignore
		let name = txn.tags.filter(tag => tag['name'] === 'Name');
		return name[0]['value'];
	})

	return names;
}