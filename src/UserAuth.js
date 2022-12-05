import { useState, useEffect } from 'react';

import { addDoc, collection, getDocs, query, where } from 'firebase/firestore';
import { db } from './firebase-config';


export default function UpdateZipCode(props) {
	const [currentChild, setCurrentChild] = useState(props.userId)
	console.log(props.userId, "****")


	const wormIdCollection = collection(db, "worms")
	const q = query(wormIdCollection, where("id", "==", props.userId))

	useEffect(() => {
		const wormCollection = collection(db, "worms", props.userId, "personal")
		// const check = query(wormCollection, where("zip", "==", props.zip))

		async function getworms() {
			const data1 = await getDocs(q)
			const datas = await getDocs(wormCollection)
			// console.log(check, "$$$$")
			if (data1.docs.length === 0) {
				addDoc(wormCollection, {
					zip: props.zip,
					zone: props.zone,
					coordinates: props.coordinates,
				})
			}
			// else if(check)
			addDoc(wormCollection, { zip: props.zip, zone: props.zone })
		}
		// await setWorms((datas.docs.map((doc) => ({ ...doc.data(), id: doc.id }))))
		getworms()
	}, [])

	return (
		<>
		</>
	)

}
