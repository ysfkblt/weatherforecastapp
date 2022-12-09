import { useState, useEffect } from "react"
import Home from "./Home.js"

export default function App(props) {
  const [userId, setUserId] = useState("")

  useEffect(() => {
    setUserId(props.userId)
  }, [props.userId])


  
  return (
    <>
      <Home userId={userId} user={props.user}/>
    </>
  )
}
