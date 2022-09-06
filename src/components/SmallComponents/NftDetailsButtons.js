import React, { useState } from "react";
import MakeOfferModal from "../makeoffermodal";

function NftDetailsButtons(props) {
    let {playSound,setNftsImg,data} = props;
  const [makeModalOpen, setMakeModalOpen] = useState(false);

  const makeModalClose = () => {
    setMakeModalOpen(false);
  };

  return (
    <>
      <div>
          <button
            onClick={() => {
              setMakeModalOpen(true);
              playSound();
              setNftsImg(data.avatar);
            }}
            className="metablog_gradient-button w-100"
          >
            <small>Make Offer</small>
          </button>
      </div>
      <MakeOfferModal
        makeModalOpen={makeModalOpen}
        setMakeModalOpen={setMakeModalOpen}
        makeModalClose={makeModalClose}
      />
    </>
  );
}

export default NftDetailsButtons;
