
import React, { useEffect, useState } from "react"
import { createClient } from 'pexels';



function Images () {
    // const [images, setImages]=useState([])
    // async function image(){
    //    let images2= await client.photos.search({ query, per_page: 1 }).then(photos => {...})
    // }
    // console.log(client)
    // const [loading, setLoading] = useState(true)
    // const [images, setImages] = useState([])
    // const [query, setQuery] = useState("nature")
    const url = "https://api.pexels.com/v1/search"

    // const getPhotos = async () => {
    //     setLoading(true)
         fetch(url, {
            headers: {
                Authorition: "563492ad6f91700001000001f640d146419b4a78aaa2af0160487147"
            },
        })
    

        // useEffect(() => {
        //     getPhotos()
        // }, [])
        console.log( "TESTING")
        return (
            <>

            </>
        )
    
}
    export default Images
