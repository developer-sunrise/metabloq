
const initialState = {
    loadTab: "All Items"
}

const TabReducer = (state=initialState,action)=>{
    switch (action.type) {
        case "ART":
            return{
                ...state,
                loadTab:"Art"
            }
        case "LAND":
            return{
                ...state,
                loadTab:"Land"
            }
        case "VIRTUALREALESTATE":
            return{
                ...state,
                loadTab:"Real Estate"
            }
        case "METAPETS":
            return{
                ...state,
                loadTab:"Meta Pets"
            }
        case "WEARABLES":
            return{
                ...state,
                loadTab:"Wearables"
            }
        case "MISCELLANEOUS":
            return{
                ...state,
                loadTab:"Miscellaneous"
            }
    
        default: 
            return state;
    }
}

export default TabReducer;