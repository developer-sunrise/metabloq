import React from 'react'
import './Styles.css'
import {Row,Col} from 'react-bootstrap'
import AccordionFAQs from './AccordionFAQs';
import Fade from 'react-reveal/Fade';

const Datas = [
    {
        id:1,
        question:"How to Buy NFTs?",
        content:"Lorem ipsum dolor, sit amet consectetur adipisicing elit. Quis sapiente laborum cupiditate possimus labore, hic temporibus velit dicta earum suscipit commodi eum enim atque at? Et perspiciatis dolore iure voluptatem."
    },
    {
        id:2,
        question:"How to Sell NFTs?",
        content:"Lorem ipsum dolor, sit amet consectetur adipisicing elit. Quis sapiente laborum cupiditate possimus labore, hic temporibus velit dicta earum suscipit commodi eum enim atque at? Et perspiciatis dolore iure voluptatem."
    },
    {
        id:3,
        question:"How to Exhibit at Museum?",
        content:"Lorem ipsum dolor, sit amet consectetur adipisicing elit. Quis sapiente laborum cupiditate possimus labore, hic temporibus velit dicta earum suscipit commodi eum enim atque at? Et perspiciatis dolore iure voluptatem."
    },
    {
        id:4,
        question:"Do NFTs have Utilities in Meta City?",
        content:"Lorem ipsum dolor, sit amet consectetur adipisicing elit. Quis sapiente laborum cupiditate possimus labore, hic temporibus velit dicta earum suscipit commodi eum enim atque at? Et perspiciatis dolore iure voluptatem."
    },
    {
        id:5,
        question:"How sustainable in Xin-Fin Blockchain?",
        content:"Lorem ipsum dolor, sit amet consectetur adipisicing elit. Quis sapiente laborum cupiditate possimus labore, hic temporibus velit dicta earum suscipit commodi eum enim atque at? Et perspiciatis dolore iure voluptatem."
    }
]
function FAQs() {

  return (
    <Fade bottom>
    <div className='metabloq_container'>
        <Row>
            <Col xxl={4} xl={4} lg={4} md={4} sm={12} xs={12} >
                <div className=''>
                    <h2 className='font-weight-bold'>FAQs</h2>
                    <small className='secondary-text'>What our fellow Meta-Citizens usually ask</small>
                </div>
            </Col>
            <Col xxl={8} xl={8} lg={8} md={8} sm={12} xs={12} >
                {
                    Datas.map((data,i)=>(
                        <AccordionFAQs key={i} title={data.question} content={data.content} id={data.id}/>
                    ))
                }
            </Col>
        </Row>
    </div>
    </Fade>
  )
}

export default FAQs