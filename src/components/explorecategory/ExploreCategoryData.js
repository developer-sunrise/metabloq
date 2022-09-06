
const art = require('../../assets/category/Art.svg').default
const buildings = require('../../assets/category/building.svg').default
const wearables = require('../../assets/category/waerables.svg').default
const realestate = require('../../assets/category/real-estate.svg').default
const metapets = require('../../assets/category/pets.svg').default
const miscellaneous = require('../../assets/category/Miscellaneous.svg').default

export const ExploreCategoryData = [
    {
        id:1,
        image:art,
        name:"Art"
    },
    {
        id:2,
        image:buildings,
        name:"Land"
    },
    {
        id:3,
        image:realestate,
        name:"Virtual Real Estate"
    },
    {
        id:4,
        image:metapets,
        name:"MetaPets"
    },
    {
        id:5,
        image:wearables,
        name:"Wearables"
    },
    {
        id:6,
        image:miscellaneous,
        name:"Miscellaneous"
    }
]