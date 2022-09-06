import S3 from "react-aws-s3";


const config1 = {
  bucketName: "sunrisetechs",
  dirName: "metabloqs/json",
  region: "ap-southeast-2",
  accessKeyId: process.env.REACT_APP_ACCESS_KEY_ID,
  secretAccessKey: process.env.REACT_APP_SECRET_ACCESS_KEY_ID,
};
const config2 = {
  bucketName: "sunrisetechs",
  dirName: "metabloqs/nft",
  region: "ap-southeast-2",
  accessKeyId: process.env.REACT_APP_ACCESS_KEY_ID,
  secretAccessKey: process.env.REACT_APP_SECRET_ACCESS_KEY_ID,
};


const config3 = {
  bucketName: "sunrisetechs",
  dirName: "metabloqs/preview",
  region: "ap-southeast-2",
  accessKeyId: process.env.REACT_APP_ACCESS_KEY_ID,
  secretAccessKey: process.env.REACT_APP_SECRET_ACCESS_KEY_ID,
};
// collection images
const config4 = {
  bucketName: "sunrisetechs",
  dirName: "metabloqs/collection",
  region: "ap-southeast-2",
  accessKeyId: process.env.REACT_APP_ACCESS_KEY_ID,
  secretAccessKey: process.env.REACT_APP_SECRET_ACCESS_KEY_ID,
};

export const ReactS3Client1 = new S3(config1);
export const ReactS3Client2 = new S3(config2);
export const ReactS3Client3 = new S3(config3);
export const ReactS3Client4 = new S3(config4);

export const ImageLoad="https://sunrisetechs.s3-ap-southeast-2.amazonaws.com/metabloqs/collection/1661234911107Banner.png";

export const getMethod = async (item) => {
  try {
    const response = await fetch(process.env.REACT_APP_BASE_URL + item.url, {
      method: "GET",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        "x-auth-token": item.authtoken,
      },
    });
    const json = await response.json();
    if (json.success == false) {
      if (json.message == "Token Expired") {
        localStorage.clear();
        window.location.replace("/");
      }
    }
    return json;
  } catch (error) {
    // console.log("get api error", error);
    return false;
  }
};

export const postMethod = async (item) => {
  try {
    const response = await fetch(process.env.REACT_APP_BASE_URL + item.url, {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        "x-auth-token": item.authtoken,
      },
      body: JSON.stringify(item.params),
    });
    const json = await response.json();
    if (json.success == false) {
      if (json.message == "Token Expired") {
        localStorage.clear();
        window.location.replace("/");
      }
    }

    return json;
  } catch (error) {
    // console.log("post api error", error);
    return false;
  }
};

export const putMethod = async (item) => {
  try {
    const response = await fetch(process.env.REACT_APP_BASE_URL + item.url, {
      method: item.method,
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify(item.params),
    });
    const json = await response.json();

    return json;
  } catch (error) {
    // console.log("api error", error);
    // alert("Try again")
    // crashlytics().recordError(error);
    return false;
  }
};

export const FormatDate1 = (dateString) => {
  let newFormat = new Date(dateString).toString().substring(4, 15).split(" ");
  return newFormat[1] + " " + newFormat[0] + " " + newFormat[2];
};
export const EmailValidator = (text) => {
  var reg2 = /^\w+([\.-]?\w+)@\w+([\.-]?\w+)(\.\w\w+)+$/;
  return reg2.test(text);
};

export const UrlValidator = (userInput) => {
  var res = userInput.match(
    /(http(s)?:\/\/.)?(www\.)?[-a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_\+.~#?&//=]*)/g
  );
  if (res == null) {
    return false;
  } else {
    return true;
  }
};
export const PasswordValidator = (text) => {
  var reg1 = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
  return reg1.test(text);
};
export const OtpValidator = (text) => {
  var reg1 = /^-?[0-9]\d*\.?\d*$/;
  return reg1.test(text);
};
export const RoundValue = (data) => {
  var data1 = parseFloat(data);
  var roundOfValue = Math.round(data1 * 1e12) / 1e12;
  return roundOfValue;
};

export const Slicer = (address) => {
  if (address.length < 9) {
    return address;
  } else {
    let front = address.slice(0, 4);
    let back = address.substr(address.length - 4);
    return front + "...." + back;
  }
};
export const BackSlicer = (word,length) => {
  if(isNaN(length)){
    return word;
  }
  if (word.length < length) {
    return word;
  } else {
    let front = word.slice(0, length);
    return front + "..." ;
  }
};