import React,{useEffect, useState} from 'react'
import './Styles.css'
import {Col, Image, Row, Stack} from 'react-bootstrap';
import {AiOutlineLogout, AiTwotoneCopy} from 'react-icons/ai';
import {TbLogout} from 'react-icons/tb'
import {FaFacebookF} from 'react-icons/fa';
import {BsTwitter,BsInstagram} from 'react-icons/bs';
import {FaTelegramPlane} from 'react-icons/fa';
import Fade from 'react-reveal/Fade';
import { useSelector } from "react-redux";
import {useNavigate} from 'react-router-dom'
import useSound from 'use-sound';
import buttonSound from '../../assets/audio/button.wav';
import { postMethod, getMethod } from "../../helpers/API&Helpers";
import { connected } from 'process';

const coverpic = require('../../assets/profile/coverpic.png').default
const profilepic = require('../../assets/profile/blankprofile.png').default

function CollectorsProfile() {
    const [playSound] = useSound(buttonSound)
    const navigate = useNavigate()
    const [copySuccess,setCopySuccess] = useState(null);
    const [showElement,setShowElement] = useState(false);
    const [AllActivity,setAllActivity] = useState([]);
    const [profileImage, setprofileImage]=useState(null)
    const [userEmail, setUserEmail]=useState('')
    const [userName, setuserName]=useState('')
    const [Facebooklink, setFacebooklink] = useState('');
    const [Instagramlink, setInstagramlink] = useState('');
    const [Twitterlink, setTwitterlink] = useState('');
    const [Telegramlink, setTelegramlink] = useState('');
    const wallet = useSelector((state) => state.WalletConnect);
    const { connected , address} =wallet
    useEffect(()=>{
        setTimeout(function() {
          setShowElement(false)
             }, 3000);
         },[showElement])
         useEffect(()=>{
            var userprofile =JSON.parse(localStorage.getItem('Userdata'))
            if(userprofile){
                setprofileImage(userprofile.profileImage)
                setUserEmail(userprofile.email)
                setuserName(userprofile.user_name)
                setFacebooklink(userprofile.facebooklink)
                setTelegramlink(userprofile.telegramlink)
                setTwitterlink(userprofile.twitterlink)
                setInstagramlink(userprofile.instagramlink)
            }
            if(connected){
                getactivity()
            }
         },[connected])
    const copytoclipboard = ()=>{
        navigator.clipboard.writeText(wallet.address);
        setCopySuccess("Copied!");
        setShowElement(true);
    }

    const editProfileClick = ()=>{
        playSound();
        navigate("editprofile");
    }
    const getactivity =async()=>{
        let url = "getAllUserActivites";
        let params ={
            wallet:address
        }
        let authtoken = "";
        let response = await postMethod({ url,params, authtoken })
        // console.log("userActivity",response.result)
        setAllActivity(response.result)
    }
    const activityClick = ()=>{
        navigate("activity",{state:AllActivity})
        playSound();
    }
  return (
    <Fade >
    <div className='collectors_profile h-100'>
        <div className='h-25'>
            <Image src={coverpic} fluid alt="collector profile" className='metabloq_img' style={{borderRadius:'1em 1em 0 0'}}/>
        </div>
        <Row className='h-75 d-flex collectors_profile-imgdiv'>
            <Col xxl={7} xl={7} lg={7} md={7} sm={12} xs={12} className='d-flex mb-3'>
                <div className=''>
                    {
                        profileImage?
                        <Image src={profileImage} fluid alt="profile" style={{borderRadius:'1em'}} height={200} width={200}/>
                        :
                        <Image src={profilepic} fluid alt="profile" style={{borderRadius:'1em'}} height={200} width={200}/>
                    }
                   
                </div>
                <div className='mx-3 d-flex align-items-center'>
                    <div>
                    <Stack gap={1}>
                        <h2>{localStorage.getItem('@user')}<font size="2" className='secondary-text'>({userName})</font></h2> 
                        <span>{userEmail}</span>
                        {
                            wallet.connected && 
                            <div className='collectors_profile-walletbox'>
                            <small>{wallet.address.slice(0, 5) + "..." + wallet.address.slice(-5)}</small>
                            {" "}<small onClick={copytoclipboard}><AiTwotoneCopy size={18}/></small>
                            </div>
                        }
                        {
                            showElement && copySuccess ? <small className='text-success text-center'>{copySuccess}</small> : null
                        }
                    </Stack>
                    </div>
                </div>     
            </Col>
            <Col xxl={5} xl={5} lg={5} md={5} sm={12} xs={12} className=''>
                <div className='h-100 d-flex flex-column justify-content-around align-items-center'>
                    <div className='collectors-social-icons-div d-flex justify-sm-content-end align-items-start'>
                        <a className='collectors-social-icons'href={Instagramlink} target="_blank" ><BsInstagram color="white" /></a>
                        <a className='collectors-social-icons' href={Twitterlink} target="_blank" ><BsTwitter color="white" /></a>
                        <a className='collectors-social-icons' href={Facebooklink} target="_blank" ><FaFacebookF color="white" /></a>
                        <a className='collectors-social-icons' href={Telegramlink} target="_blank" ><FaTelegramPlane color="white" /></a>
                    </div>
                    <div className='d-flex'>
                        <Stack direction="horizontal" gap={3}>
                        <button className='metablog_gradient-button' onClick={editProfileClick}>
                            <span>Edit Profile</span>
                        </button>
                        <button className='metablog_primary-button' onClick={activityClick}>
                            <span>My Activity</span>
                        </button>
                        <button className='metablog_primary-filled-button' onClick={()=>{
                          localStorage.removeItem('UserToken')
                          localStorage.removeItem('Userdata')
                          navigate("signin")
                        }}>
                            <span><TbLogout size={20} /></span>
                        </button>
                        {/* <AiOutlineLogout color="#0295FA" size={40}  /> */}
                        </Stack>
                    </div>
                </div>
            </Col>
        </Row>
    </div>
    </Fade>
  )
}

export default CollectorsProfile