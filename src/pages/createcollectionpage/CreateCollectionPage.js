import React from 'react'
import { Stack } from 'react-bootstrap';
import CreateCollection from '../../components/createcollection';

import './CreateCollectionPage.css';

function CreateCollectionPage() {
  return (
    <Stack gap={4}>
        <div className='createcollectionpage_createitem'>
            <h2 className='bold poppins'>Create Collection</h2>
        </div>
        <CreateCollection/>
    </Stack>
  )
}

export default CreateCollectionPage