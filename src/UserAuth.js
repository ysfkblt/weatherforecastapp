import { useState, useEffect } from 'react';
import {
	SearchIcon,
	ArrowDownIcon,
	ArrowUpIcon,
} from '@heroicons/react/outline';
import background, { gradient } from './background';
import { shuffle } from 'lodash';
import DisplayZone from './Zone';
import { addDoc, collection, getDocs, query, where } from 'firebase/firestore';
import { db } from './firebase-config';


export default function UpdateZipCode(props){
	const [currentChild, setCurrentChild] = useState(props.userId)
console.log(props.userId,"****")


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
					addDoc(wormIdCollection, { zip: props.userId })
				} 
                // else if(check)
                addDoc(wormCollection,{zip:props.zip})
			}
			// await setWorms((datas.docs.map((doc) => ({ ...doc.data(), id: doc.id }))))
			getworms()
		}, [])
	
return (
    <>
    </>
)

}
