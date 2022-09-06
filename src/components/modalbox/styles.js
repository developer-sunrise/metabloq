import { makeStyles,createStyles } from '@mui/styles'
import { padding } from '@mui/system'
export const Styles = makeStyles((theme) =>createStyles ({
    modalmainwrapper: {
        background: '#fff !important',
        marginTop: '10% !important',
        padding: '1% 3% 3% 3% !important',
        borderRadius: '1em !important',
        fontFamily:'LufgaRegular !important',
        [theme.breakpoints.down(600)]: {
           margin:'5% !important',
           padding: '5% !important',
           borderRadius: '15px !important',
        },
    },
    modalmainauctionwrapper:{
        background: '#fff !important',
        marginTop: '1% !important',
        padding: '1% !important',
        borderRadius: '1em !important',
        fontFamily:'LufgaRegular !important',
        [theme.breakpoints.down(600)]: {
            margin:'5% !important',
            padding: '5% !important',
            borderRadius: '15px !important',
         },
    },
    buttonmodalbox:{
        borderRadius: '100px !important',
        padding:'5em'
    },
    headergrid:{
        borderBottom: '1px solid rgba(122,122,122,0.15) !important'
    },
    afterheadergrid: {
        padding: 0
    },
    modalparahead: {
        color: '#232731 !important',

        fontWeight: 'bold !important',
        fontFamily:'LufgaRegular !important',
        [theme.breakpoints.down(600)]: {

         }, 
    },
    bannerimglast: {
        overflow: 'hidden !important',
        width: '100% !important',
        objectFit:'contain !important',
        fontFamily:'LufgaRegular !important',
        borderRadius:'1em'
    },
    bannerimglastgrid: {
        // width: '400px !important',
        // height: '100px !important'
    },
    parainnermodal: {
        color: '#4F5259 !important',

        fontWeight: '500 !important',
        fontFamily:'LufgaRegular !important',
        [theme.breakpoints.down(600)]: {

         },
    },
    pirceparasecmodal: {
        color: '#16255C !important',
        fontWeight: '500 !important',
        fontFamily:'LufgaRegular !important',
        [theme.breakpoints.down(600)]: {
     
         },
    },
    reserveprice: {
        color: '#7C7D83 !important',

        fontWeight: '500 !important',
        fontFamily:'LufgaRegular !important',
        [theme.breakpoints.down(600)]: {
   
         },
    },
    closebtnmodal: {
     
        fontFamily:'LufgaRegular !important',
        color: '#000 !important',
        marginTop: '-10px !important'
    }
   
}))