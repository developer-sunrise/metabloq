// import "./Styles.css";
// import { Row, Col, Stack, Image } from "react-bootstrap";
// import React, { useState, useEffect } from "react";
// import Select from "react-select";
// import "react-phone-number-input/style.css";
// import PhoneInput from "react-phone-number-input";
// import { Country, State, City }  from 'country-state-city';
// import { useFormik } from "formik";
// import { ReactS3Client1,ReactS3Client2 } from "../../helpers/API&Helpers";
// const uploadimg = require("../../assets/profile/upload.png");

// function EditProfile() {
//   const [uploadedImg, setUploadedImg] = useState();

//   const getBase64 =async (e) => {
//     var date=new Date()
//     var timeStamp=date.getTime()
//     var file = e.target.files[0];
//     let name = file.name;
//     let extension = "." + name.split(".").pop();
//     let filename = timeStamp +extension;
//     try {
//       console.log("filename",filename,file,)
//       const data = await ReactS3Client2.uploadFile(file, filename);
//       console.log("teasssa",data)
//       if (data.status === 204) {
//         // setProfilePicture(data.location);
//         // setUploadedImg(data.location);
//       } else {
//       }
//     } catch (err) {
//       // console.log("error image uploading", err);
//     }
//     // let reader = new FileReader();
//     // reader.readAsDataURL(file);
//     // reader.onload = () => {
//     //   setUploadedImg(reader.result);
//     // };
//     // reader.onerror = function (error) {
//     //   console.log("Error: ", error);
//     // };
//   };

//   const [phoneCode, setPhoneCode] = useState();
//   const addressFromik = useFormik({
//     initialValues: {
//       country: "India",
//       state: null,
//       city: null
//     },
//     onSubmit: (values) => console.log(JSON.stringify(values))
//   });

//   const countries = Country.getAllCountries();

//   const updatedCountries = countries.map((country) => ({
//     label: country.name,
//     value: country.id,
//     ...country
//   }));
//   const updatedStates = (countryId) =>
//     State
//       .getStatesOfCountry(countryId)
//       .map((state) => ({ label: state.name, value: state.id, ...state }));
//   const updatedCities = (stateId) =>
//     City
//       .getCitiesOfState(stateId)
//       .map((city) => ({ label: city.name, value: city.id, ...city }));

//   const { values, handleSubmit, setFieldValue, setValues } = addressFromik;

//   useEffect(() => {}, [values]);

//   return (
//     <div className="editprofile_container">
//       <Row>
//         <div>Profile Photo</div>
//         <Col xxl={6} xl={6} lg={6} md={6} sm={12} xs={12} className="mb-3">
//           <div className="editprofile_imgupload-box h-100">
//             {!uploadedImg ? (
//               <div>
//                 <Stack gap={2}>
//                   <Image
//                     fluid
//                     src={uploadimg}
//                     alt="upload"
//                     height={80}
//                     width={80}
//                     className="mx-auto"
//                   />
//                   <h4 className="text-center">
//                     Drag and drop <br />
//                     files to upload
//                   </h4>
//                   <div className="text-center">OR</div>
//                   <label class="metablog_primary-filled-square-button">
//                     <small>Browse</small>
//                     <input
//                       type="file"
//                       style={{ display: "none" }}
//                       onChange={getBase64}
//                     />
//                   </label>
//                 </Stack>
//               </div>
//             ) : (
//               <Image fluid src={uploadedImg} alt="img" className="h-100" />
//             )}
//           </div>
//         </Col>

//         <Col xxl={6} xl={6} lg={6} md={6} sm={12} xs={12} className="mb-3">
//         <form onSubmit={handleSubmit}>
//           <Stack gap={2} direction="horizontal" className="d-flex">
//             <div>
//               <span>First Name</span>
//               <input
//                 type="text"
//                 placeholder="mobina"
//                 className="editprofile_input"
//               />
//             </div>
//             <div>
//               <span>Surname</span>
//               <input
//                 type="text"
//                 placeholder="Mr"
//                 className="editprofile_input"
//               />
//             </div>
//           </Stack>
//           <div>
//             <span>Email</span>
//             <input
//               type="text"
//               placeholder="Enter value"
//               className="editprofile_input"
//             />
//           </div>
//           <div className="checking-div">
//             <span>Phone Number</span>
//             <Stack gap={2} direction="horizontal">
//               <div className="w-25">
//                 <PhoneInput
//                   defaultCountry="IN"
//                   placeholder="+91"
//                   value={phoneCode}
//                   onChange={setPhoneCode}
//                 />
//               </div>
//               <div className="w-75">
//                 <input
//                   type="text"
//                   placeholder="9120000000"
//                   className="editprofile_input"
//                 />
//               </div>
//             </Stack>
//           </div>
//           <div className="dummy-wrapper">
//             <span>Country</span>
//             <Select
//               id="country"
//               name="country"
//               label="country"
//               options={updatedCountries}
//               value={values.country}
//               onChange={(value) => {
//                 setValues({ country: value, state: null, city: null }, false);
//               }}
//             />
//           </div>
//           <div className="dummy-wrapper">
//             <span>State</span>
//             <Select
//               id="state"
//               name="state"
//               options={updatedStates(
//                 values.country ? values.country.value : null
//               )}
//               value={values.state}
//               onChange={(value) => {
//                 setValues({ state: value, city: null }, false);
//               }}
//             />
//           </div>

//           <div className="dummy-wrapper">
//             <span>City</span>
//             <Select
//               id="city"
//               name="city"
//               options={updatedCities(values.state ? values.state.value : null)}
//               value={values.city}
//               onChange={(value) => setFieldValue("city", value)}
//             />
//           </div>
//           <div className="d-flex mt-2">
//             <button type="submit" className="metablog_primary-filled-square-button">
//               <font size="2">Save</font>
//             </button>
//           </div>
//         </form>
//         </Col>
//       </Row>
//     </div>
//   );
// }

// export default EditProfile;




import "./Styles.css";
import { Row, Col, Stack, Image } from "react-bootstrap";
import React, { useState, useEffect } from "react";
import Select from "react-select";
import "react-phone-number-input/style.css";
import PhoneInput from "react-phone-number-input";
import { Country, State, City }  from 'country-state-city';
import { useFormik } from "formik";
import { ReactS3Client1,ReactS3Client2 } from "../../helpers/API&Helpers";
const uploadimg = require("../../assets/profile/upload.png").default
function EditProfile() {
  const [uploadedImg, setUploadedImg] = useState();

  const getBase64 =async (e) => {
    var date=new Date()
    var timeStamp=date.getTime()
    var file = e.target.files[0];
    let name = file.name;
    let extension = "." + name.split(".").pop();
    let filename = timeStamp +extension;
   
    try {
      var final=await fetch("http://localhost:8000/api/json")
      var  finalJson=await final.json()
      console.log("filenamegsadb",finalJson.ok)
      const data = await ReactS3Client2.uploadFile(JSON.stringify(finalJson.result), "land.json");
      console.log("teasssa",data)
      if (data.status === 204) {
        // setProfilePicture(data.location);
        // setUploadedImg(data.location);
      } else {
      }
    } catch (err) {
      // console.log("error image uploading", err);
    }
    // let reader = new FileReader();
    // reader.readAsDataURL(file);
    // reader.onload = () => {
    //   setUploadedImg(reader.result);
    // };
    // reader.onerror = function (error) {
    //   console.log("Error: ", error);
    // };
  };

  const [phoneCode, setPhoneCode] = useState();
  const addressFromik = useFormik({
    initialValues: {
      country: "India",
      state: null,
      city: null
    },
    onSubmit: (values) => console.log(JSON.stringify(values))
  });

  const countries = Country.getAllCountries();

  const updatedCountries = countries.map((country) => ({
    label: country.name,
    value: country.id,
    ...country
  }));
  const updatedStates = (countryId) =>
    State
      .getStatesOfCountry(countryId)
      .map((state) => ({ label: state.name, value: state.id, ...state }));
  const updatedCities = (stateId) =>
    City
      .getCitiesOfState(stateId)
      .map((city) => ({ label: city.name, value: city.id, ...city }));

  const { values, handleSubmit, setFieldValue, setValues } = addressFromik;

  useEffect(() => {}, [values]);

  return (
    <div className="editprofile_container">
      <Row>
        <div>Profile Photo</div>
        <Col xxl={6} xl={6} lg={6} md={6} sm={12} xs={12} className="mb-3">
          <div className="editprofile_imgupload-box h-100">
            {!uploadedImg ? (
              <div>
                <Stack gap={2}>
                  <Image
                    fluid
                    src={uploadimg}
                    alt="upload"
                    height={80}
                    width={80}
                    className="mx-auto"
                  />
                  <h4 className="text-center">
                    Drag and drop <br />
                    files to upload
                  </h4>
                  <div className="text-center">OR</div>
                  <label class="metablog_primary-filled-square-button">
                    <small>Browse</small>
                    <input
                      type="file"
                      style={{ display: "none" }}
                      onChange={getBase64}
                    />
                  </label>
                </Stack>
              </div>
            ) : (
              <Image fluid src={uploadedImg} alt="img" className="h-100" />
            )}
          </div>
        </Col>

        <Col xxl={6} xl={6} lg={6} md={6} sm={12} xs={12} className="mb-3">
        <form onSubmit={handleSubmit}>
          <Stack gap={2} direction="horizontal" className="d-flex">
            <div>
              <span>First Name</span>
              <input
                type="text"
                placeholder="mobina"
                className="editprofile_input"
              />
            </div>
            <div>
              <span>Surname</span>
              <input
                type="text"
                placeholder="Mr"
                className="editprofile_input"
              />
            </div>
          </Stack>
          <div>
            <span>Email</span>
            <input
              type="text"
              placeholder="Enter value"
              className="editprofile_input"
            />
          </div>
          <div className="checking-div">
            <span>Phone Number</span>
            <Stack gap={2} direction="horizontal">
              <div className="w-25">
                <PhoneInput
                  defaultCountry="IN"
                  placeholder="+91"
                  value={phoneCode}
                  onChange={setPhoneCode}
                />
              </div>
              <div className="w-75">
                <input
                  type="text"
                  placeholder="9120000000"
                  className="editprofile_input"
                />
              </div>
            </Stack>
          </div>
          <div className="dummy-wrapper">
            <span>Country</span>
            <Select
              id="country"
              name="country"
              label="country"
              options={updatedCountries}
              value={values.country}
              onChange={(value) => {
                setValues({ country: value, state: null, city: null }, false);
              }}
            />
          </div>
          <div className="dummy-wrapper">
            <span>State</span>
            <Select
              id="state"
              name="state"
              options={updatedStates(
                values.country ? values.country.value : null
              )}
              value={values.state}
              onChange={(value) => {
                setValues({ state: value, city: null }, false);
              }}
            />
          </div>

          <div className="dummy-wrapper">
            <span>City</span>
            <Select
              id="city"
              name="city"
              options={updatedCities(values.state ? values.state.value : null)}
              value={values.city}
              onChange={(value) => setFieldValue("city", value)}
            />
          </div>
          <div className="d-flex mt-2">
            <button type="submit" className="metablog_primary-filled-square-button">
              <font size="2">Save</font>
            </button>
          </div>
        </form>
        </Col>
      </Row>
    </div>
  );
}

export default EditProfile;
