import React from 'react'
import NFTDetails from '../../components/nftdetails'


function NFTDetailsPage(props) {
 
  return (
    <div className='mt-3'>
        <NFTDetails {...props}/>
    </div>
  )
}

export default NFTDetailsPage