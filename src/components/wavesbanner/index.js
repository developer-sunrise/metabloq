import React from 'react'
import './Styles.css';
const wave1 = require('../../assets/waves/blue.svg').default
const wave2 = require('../../assets/waves/gradient.svg').default

function WavesBanner(props) {
  let {collections} = props;
  return (
    <div className='wavesbanner_container d-flex justify-content-center align-items-start'>
        <div className='text-center bold' style={{zIndex:'1000'}}>
          {
            collections ? <h1>Collections</h1> : <h1>Explore</h1>
          }  
            <span>Here for the most trending NFTs in the Market</span>
        </div>
        <div class="waveWrapper waveAnimation">

              <div class="waveWrapperInner bgMiddle">
                <div class="wave waveMiddle" style={{backgroundImage: `url(${wave1})`,backgroundSize:'50% 100%',padding:'5% 0'}}></div>
              </div>
              
              <div class="waveWrapperInner bgBottom">
                <div class="wave waveBottom" style={{backgroundImage: `url(${wave2})`,backgroundSize:'50% 100%',padding:'0 0'}}></div>
              </div>

        </div>
    </div>
  )
}

export default WavesBanner