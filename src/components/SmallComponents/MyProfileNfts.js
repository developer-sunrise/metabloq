import React from "react";

function MyProfileNfts(props) {
  let { putonsale, setShow, setNftsImg, data,playSound ,img} = props;
  return (
    <div>
      {putonsale ? (
        <button
          onClick={() => {
            setShow(true);
            playSound();
            setNftsImg(data.avatar);
          }}
          className="metablog_primary-filled-button w-100"
        >
          <small>Put On Sale</small>
        </button>
      ) : (
        <button
          onClick={() => {
            playSound();
            setNftsImg(data.avatar);
          }}
          className="metablog_gradient-button w-100"
        >
          <small>On Sale</small>
        </button>
      )}
    </div>
  );
}

export default MyProfileNfts;
