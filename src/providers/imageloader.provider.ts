


export const loadImage = async (ev: React.ChangeEvent<HTMLInputElement>):Promise<string> => {
	return new Promise((resolve, reject) => {
		let file = ev.target.files![0]

		if(file.size>1048576){ // size limit 1MB
			reject('File is is too big: ' + file.size)
		}

		let fr = new FileReader()
		fr.onload = async () => {
			try {
				let dataUri:string = fr.result as string

				resolve(dataUri)
			} catch (error) {
				reject()
			}
		}
		fr.onerror = reject
		fr.readAsDataURL( file )
	})
}