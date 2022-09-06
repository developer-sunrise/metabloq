import React from 'react'
import { Stack } from 'react-bootstrap';
import CreateItem from '../../components/createitem';
import './CreateItemPage.css';

function CreateItemPage() {
  return (
    <>
        <Stack gap={4}>
            <div className='createitempage_createitem'>
                <h2 className='bold poppins'>Create NFT</h2>
            </div>
            <CreateItem/>
        </Stack>
        
    </>
  )
}

export default CreateItemPage