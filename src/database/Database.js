import { useState, useEffect } from "react";
import { collection } from "firebase/firestore";
import { db } from "./firebase-config";
import { getDatabase } from "firebase/database";
import { flowers } from "./plantDatabase";

const Database = () => {
  const database = getDatabase();
  const [plants, setPlants] = useState([]);
  const [housePlants, setHousePlants] = useState([]);
  const plantsCollection = collection(db, "plants");
  const housePlantsCollection = collection(db, "housePlants");

  const housePlantsData = [
    [
      1,
      "Peace Lily",
      "Spathiphyllum",
      "Bright indirect light",
      "https://www.gardeningknowhow.com/wp-content/uploads/2012/01/peace-lily-1.jpg",
    ],
    [
      2,
      "Split-leaf Philodendron",
      "Monstera deliciosa",
      "Indirect light",
      "https://pcfb.gumlet.io/images/articles/monstera-growing.jpg?w=640&h=426&mode=crop&crop=smart&s=46418c719a487c693e8f9c45e11e1d7b",
    ],
    [
      3,
      "ZZ Plant",
      "Zamioculcas",
      "Low to bright indirect light",
      "https://bouqs.com/product_images/zz-plant-white-pot/Deluxe/62b3a5ed0f43b8008e80a023/detail.jpg?c=1655940589",
    ],
    [
      4,
      "Fiddle Leaf Fig",
      "Ficus Lyrata",
      "Bright indirect light",
      "https://secure.img1-cg.wfcdn.com/im/21315530/compr-r85/1478/147899196/66-faux-fiddle-leaf-fig-tree-in-rattan-basket.jpg",
    ],
    [
      5,
      "Philodendron",
      "Philodendron",
      "Medium to bright light",
      "https://cdn.shopify.com/s/files/1/0150/6262/products/the-sill_philodendron_medium_grant_cream.jpg?v=1666970960",
    ],
    [
      6,
      "Aloe",
      "Aloe",
      "Direct light",
      "https://assets.pbimgs.com/pbimgs/ab/images/dp/wcm/202237/0004/faux-potted-speckled-aloe-vera-plant-in-terracotta-pot-c.jpg",
    ],
    [
      7,
      "Money Tree",
      "Pachira aquatica",
      "Bright indirect light",
      "https://media.greg.app/Y2FyZS1wbGFudC1wcm9maWxlL21vbmV5X3RyZWUuanBn?auto=webp&width=1000&fit=cover&format=pjpg&height=1000&optimize=medium&precrop=1000:1000,smart",
    ],
    [
      8,
      "String of Hearts",
      "Ceropegia",
      "Some direct light",
      "https://cdn.shopify.com/s/files/1/2781/9558/products/STRINGOFHEARTS-3_800x.png?v=1639678575",
    ],
    [
      9,
      "Ficus Burgundy",
      "Ficus elastica",
      "Bright indirect to direct light",
      "https://cdn.shopify.com/s/files/1/0013/3529/6118/products/ficus-elastica-burgundy-rubber-plant-ol.jpg?v=1633620569",
    ],
    [
      10,
      "Calathea Rattlesnake",
      "Goeppertia insignis",
      "Bright indirect light",
      "https://cdn.shopify.com/s/files/1/0150/6262/products/the-sill_calathea-rattlesnake_small_bryant_black.jpg?v=1663279341",
    ],
    [
      11,
      "Culinary Rosemary",
      "Salvia rosmarinus",
      "Bright direct light",
      "https://cdn11.bigcommerce.com/s-jmzfi5zcr2/images/stencil/1280x1280/products/226/1339/Chefs_Choice_Rosemary__74263.1499307644-Cropped-compressor__62676.1507086349.jpg?c=2",
    ],
    [
      12,
      "Thyme",
      "Thymus vulgaris",
      "Bright direct light",
      "http://cdn.shopify.com/s/files/1/0246/5179/2465/products/HER-THY05_1_600x.jpg?v=1577219228",
    ],
    [
      13,
      "Basil",
      "Ocimum basilicum",
      "Bright direct light",
      "https://cdn.loveandlemons.com/wp-content/uploads/2019/07/IMG_2600-2-1.jpg",
    ],
    [
      14,
      "Mint",
      "Mentha",
      "Bright direct light",
      "https://s3.amazonaws.com/eit-planttoolbox-prod/media/images/mentha-spicata-leaves--Forest-and-Kim-Starr--CC-BY-20.jpg",
    ],
    [
      15,
      "Oregano",
      "Origanum vulgare",
      "Bright direct light",
      "https://cf.ltkcdn.net/garden/images/std/164696-425x282r1-Oregano.jpg",
    ],
  ];

  useEffect(() => {
    // const getPlants = async () => {
    // await flowers.map((flower) => {
    //    addDoc(plantsCollection, { id: flower[0], species: flower[1], name: flower[2], color: flower[3], type: flower[4], method: flower[5], sowingMethod: flower[6], weeksBeforeLastFrost: flower[7], sowingDepth: flower[8], spaceInches: flower[9], life: flower[10], transplantTo: flower[11], comment1: flower[12],comment2: flower[13]})
    // })
    //   const data = await getDocs(plantsCollection)
    //   setPlants((data.docs.map((doc) => ({ ...doc.data(), id:flowers[0], Species:flowers[1], Name:flowers[2]}))))
    // }
    // getPlants();
    // const getHousePlants = async () => {
    //     await housePlantsData.map((plant) => {
    //         addDoc(housePlantsCollection, { id: plant[0], name: plant[1], species: plant[2], transplantTo: plant[3], img: plant[4] })
    //         })
    //     const data = await getDocs(housePlantsCollection)
    //     setHousePlants((data.docs.map((doc) => ({ ...doc.data(), id:housePlantsData[0], Species:housePlantsData[2], Name:housePlantsData[1]}))))
    // }
    // getHousePlants();
  }, []);

  return <></>;
};

export default Database;
