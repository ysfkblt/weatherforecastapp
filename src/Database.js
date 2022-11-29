import { useState, useEffect } from "react"
import { addDoc, collection, getDocs } from "firebase/firestore"
import { db, dbReal } from "./firebase-config"
import { storage } from "./firebase-config"
import { getDownloadURL, listAll, uploadBytes } from "firebase/storage"
import { onValue, ref, getDatabase } from "firebase/database"
const Database = () => {
    const database = getDatabase()
    const [plants, setPlants] = useState([])
    const plantsCollection = collection(db, "plants")

    console.log(database)
    // id,Species,Name,Color,Type,Seed Stock,Year,Quantity,Method #,Sowing Method,Weeks before last frost,Sowing Depth,Space inches,Life,Transplant To,Comment one,Comment two
    const flowers = [
        [1, 'Abrus precatorius', 'Prayer beads', 'yellow', 'vine', 'out', '', '', 1 - 15 - 16, "nick and soak, <2 wks @ 59ºF, rapid germ.", -6, 'covr', 18, 'a', 'fsun', "vine to 30 ft., requires string or wire", ''],
        [2, 'Abutilon vitifolium', 'Flowering maple', 'light blue', 'orn', 'out', '', '', 1, "<2 wks @ 68ºF, rapid germ.", -7, 'thin', 18, 'a', 'fsun', "to zone 7, winter indoors", 'spray for whitefly'],
        [3, 'Acer ginnala', 'Amur maple', 'yellowish white', 'tree', 'out', '', '', 8, "4 wks @ 75ºF, 4 mos @ 39º, then 68ºF", -17, 'covr', 180, 'p', 'fsun', 'takes more shade than other maples', "moist, well drained soil"],
        [4, 'Achillea filipendulina', 'Yarrow', 'white', 'orn', 'out', '', '', 1, "<2 wks @ 68ºF in lite, rapid germ.", -3, 'surf', 15, 'p', 'fsun', "rapid spreader, grow cool, 50", 'plant only to informal areas'],
        [5, 'Achillea ptarmica', 'Sneezewort', 'The pearl', 'orn', 'out','','' , 1, "<2 wks @ 68ºF in lite, rapid germ.", -7, 'surf', 10, 'p', 'fsun', 'mulch to protect from severe winters', "divide clumps after 2 - 3 years, grow cool, 50"],
        [6, 'Acmella oleracea', 'Eyeball plant', 'yellow-maroon eye', 'orn', 'in', 2000, 'lots', 1, "<2 wks @ 68ºF, rapid germ.", -6, 'thin', 10, 'a', 'psha', 'protect from slugs while young', ''],
        [7, 'Acokanthera oblongifolia', 'Wintersweet', 'white', 'vine', 'out', '', '', 1 - 16, "soak seed, <2 wks @ 68ºF, rapid germ.", -6, 'covr', 12, 'a', 'fsha', "very poisonous, Z10 vine to 18 ft.", 'requires string or wire to climb'],
    ]

    useEffect(() => {
        const getPlants = async () => {
            await flowers.map((flower) => {

                // addDoc(plantsCollection, { id: flower[0], species: flower[1], name: flower[2], color: flower[3], type: flower[4], seedStock: flower[5], year: flower[6], quantity: flower[7], method: flower[8], sowingMethod: flower[9], weeksBeforeLastFrost: flower[10], })
            })
            //   const data = await getDocs(plantsCollection)
            //   setPlants((data.docs.map((doc) => ({ ...doc.data(), id:flowers[0], Species:flowers[1], Name:flowers[2]}))))
        }
        getPlants()

        // listAll(imageListRef).then((response) => {
        //   response.items.forEach((item) => {
        //     getDownloadURL(item).then((url) => {
        //       setImageList((prev) => [...prev, url])
        //     })
        //   })
        // })
    }, [])




    return (
        <>

        </>
    )
}

export default Database
