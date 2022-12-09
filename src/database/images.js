
import React, { useEffect, useState } from "react"
import { createClient } from 'pexels';



function Images (plantName) {
let image
    const client = createClient('563492ad6f91700001000001f640d146419b4a78aaa2af0160487147');
    const query = plantName;
    
        client.photos.search({ query, per_page: 1 }).then(photos => {image=photos });
   
   
        // const [images, setImages]=useState([])
    // async function image(){
    //    let images2= await client.photos.search({ query, per_page: 1 }).then(photos => {...})
    // }
    // console.log(client)
    // const [loading, setLoading] = useState(true)
    // const [images, setImages] = useState([])
    // const [query, setQuery] = useState("nature")
    // const url = "https://cors-anywhere.herokuapp.com/https://api.pexels.com/v1/search"

    // const getPhotos = async () => {
    // //     setLoading(true)
    //     const res= fetch(url, {
    //         headers: {
    //             // Access_Control_Allow_Origin: "https://api.pexels.com/v1/search",

    //             Authorition: "563492ad6f91700001000001f640d146419b4a78aaa2af0160487147"
    //         },
    //     })
    //     const data= await res.json()
    //     return data
    // }

    //     useEffect(() => {
    //         getPhotos()
    //     }, [])
    console.log(image)
        return (
            
image.photos[0].src.original 
        )
    
}
    export default Images
