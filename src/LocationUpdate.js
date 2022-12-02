import { useState, useEffect } from 'react';
import {
	SearchIcon,
	ArrowDownIcon,
	ArrowUpIcon,
} from '@heroicons/react/outline';
import background, { gradient } from './background';
import { shuffle } from 'lodash';
import DisplayZone from './Zone';
import { addDoc, collection, doc, getDocs, query, updateDoc, where } from 'firebase/firestore';
import { db } from './firebase-config';
import { update } from 'firebase/database';


export default function UpdateZipCode(props){


		const wormIdCollection = collection(db, "worms")
		const q = query(wormIdCollection, where("id", "==", props.userId))
		
		useEffect(() => {
            const wormCollection = collection(db, "worms", props.userId, "personal")
            // const check = query(wormCollection, where("zip", "==", props.zip))
			console.log(props.userId)
			async function getworms() {
				const data1 = await getDocs(q)
				const datas = await getDocs(wormCollection)
				const userPersonal= doc(db, "worms", props.userId, "personal", datas.docs[0].id)
				console.log(datas.docs)
				if (datas.docs.length === 0) {
					addDoc(wormCollection, { 
						zip: props.zip, 
						zone:props.zone,
						coordinates:props.coordinates
						  })
				} 
                else {
					await updateDoc(userPersonal, {	
						zip: props.zip, 
						zone:props.zone,
						coordinates:props.coordinates
					})
				}
			}
			// await setWorms((datas.docs.map((doc) => ({ ...doc.data(), id: doc.id }))))
			getworms()
		}, [])
	
return (
    <>
    </>
)

}
