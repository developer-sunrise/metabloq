import React from 'react'
import './Styles.css'
import NFTDetailsList from './NFTDetailsList';

function NFTDetailsCards(props) {
    let {collectors} = props;

  return (
    <>
    <div className='nftdetails_cards-menu '>
        {
            collectors ? 
        <h3 className='bold text-left'>
            Portfolio Product
        </h3> : 
        <h3 className='bold text-left'>
            Explore more
        </h3>
        }
        <NFTDetailsList {...props}/>
    </div>
    </>
  )
}

export default NFTDetailsCards