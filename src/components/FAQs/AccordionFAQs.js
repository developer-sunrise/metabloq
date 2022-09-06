import React, { useState } from 'react';
import {IoIosArrowDropdown} from 'react-icons/io';
import {IoIosArrowDropup} from 'react-icons/io';

function AccordionFAQs({title,content,id}) {
    const [isActive, setIsActive] = useState(false);

  return (
    <div className='FAQs_accordion accordion' key={id}>
        <div className='d-flex justify-content-between' onClick={() => setIsActive(!isActive)}>
            <span className='font-weight-bold'>{title}</span>
            <span>{isActive ? <IoIosArrowDropup size={20} color='#1C83E5'/> : <IoIosArrowDropdown size={20}/>}</span>
        </div>
        {isActive && <div className="accordion-content secondary-text">{content}</div>}
    </div>
  )
}

export default AccordionFAQs