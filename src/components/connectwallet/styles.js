import { createStyles, makeStyles } from '@mui/styles';

const useStyles = makeStyles((theme) =>
	createStyles({
		walletContainer: {
			'&.MuiBox-root': {
				position: 'absolute',
				top: '50%',
				left: '50%',
				transform: 'translate(-50%, -50%)',
				width: '45%',
                padding: '0 0 1% 0',
				backgroundColor: 'white',
				boxShadow: 'none',
                borderRadius: '22px',
                [theme.breakpoints.down(600)]:{
                    width: '90%',
                }
			},
		},
        modalHeader:{
            '&.MuiBox-root': {
                background: 'linear-gradient(90deg, #6DC6FE 0%, #0295FA 100%)',
                display:'flex',
                justifyContent:'space-around',
                alignItems:'center',
                color:'white',
                borderRadius: '22px 22px 0 0 ',
                padding:'2.5% 0'
            }
        },
        walletTitle: {
            '&.MuiTypography-root': {
                textAlign: 'center',
                fontWeight: '700',
                fontFamily:'Poppins-Regular',
                color:"white"
            },
        },
        divider: {
            '&.MuiBox-root': {
                
                borderBottom: '1px solid #E0E0E0',
            },
        },
        itemContainer: {
            '&.MuiBox-root': {
                padding: '5%',
                margin:'2% 12% 0 12%',
                backgroundColor:'#F9F9F9',
                borderRadius:'1em',
                fontFamily:'Poppins-Regular'
            },
        },
        radioContainer: {
            '&.MuiBox-root': {
                display: 'flex',
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'space-between',
                paddingRight: '6.5%',
                paddingLeft: '4%',
                height: '65px',
                marginTop: '16px',
                borderRadius: '16px',
                backgroundColor:'white',
                boxShadow: '0 5px 21px 0 rgba(179,187,193,0.2)'
            }
        },
        radioTitle: {
            '&.MuiBox-root': {
                display: 'flex',
                flex: '1',
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'flex-start',
                fontFamily:'Poppins-Regular'
            }
        },
        title: {
            '&.MuiTypography-root': {
                marginLeft: '2%',
                fontFamily:'Poppins-Regular'
            },
        },
        icon: {
            '&.MuiCardMedia-root': {
                width: '25px',
                height: '25px',
            },
        },
        btnContainer: {
            '&.MuiBox-root': {
                display: 'flex',
                flexDirection: 'row',
                justifyContent: 'center',
                padding: '0 25%',
            },
        },
        btnNext: {
            '&.MuiButton-root': {
                height: '51px',
                width: '100%',
                color: 'white',
                borderRadius: '.7em',
                background: 'linear-gradient(90deg, #6DC6FE 0%, #0295FA 100%)',
            },
        },
	})
);
export default useStyles;
