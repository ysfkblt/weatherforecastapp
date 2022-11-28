import { useState, useEffect } from "react"
import { db } from "./firebase-config"
import { collection, getDocs } from "firebase/firestore"
const App2 = () => {
  const [worm, setWorm] = useState([])
  const wormCollection = collection(db, "worms")

  useEffect(() => {
    const getWorms = async () => {
      const data = await getDocs(wormCollection)
      console.log(data)
    }
    getWorms()
  }, [])

  return (
    <>
      <div> App2</div>
    </>
  )
}

export default App2
