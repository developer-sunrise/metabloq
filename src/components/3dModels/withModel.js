import React, { useState, useRef, useEffect } from "react";
import { Button } from "@mui/material";
import { Engine, Scene, useBeforeRender } from "react-babylonjs";
import {
  Vector3,
  Color3,
  ActionManager,
  SetValueAction,
  Color4,
} from "@babylonjs/core";
import { PrismCode } from "react-prism";
import Octicon, { ArrowDown, ArrowUp } from "@githubprimer/octicons-react";
import ScaledModelWithProgress from "./ScaledModelWithProgress";

// import './WithModel.css'

const WithModel = (props) => {
  const [avocadoSettings, updateAvocadoSettings] = useState({
    avocadoYPos: -1,
    avocadoScaling: 0,
  });
  const moveAvocadoDown = () => {
    updateAvocadoSettings((state) => ({
      ...state,
      avocadoYPos: state.avocadoYPos - 0.5,
    }));
  };

  const moveAvocadoUp = () => {
    updateAvocadoSettings((state) => ({
      ...state,
      avocadoYPos: state.avocadoYPos + 0.5,
    }));
  };

  const increaseAvocadoSize = () => {
    updateAvocadoSettings((state) => ({
      ...state,
      avocadoScaling: state.avocadoScaling + 0.1,
    }));
  };

  const decreaseAvocadoSize = () => {
    updateAvocadoSettings((state) => ({
      ...state,
      avocadoScaling: state.avocadoScaling - 0.1,
    }));
  };

  const onModelLoaded = (model) => {
    let mesh = model.meshes[1];
    console.log("loaded mesh:", mesh);
    mesh.actionManager = new ActionManager(mesh._scene);
    mesh.actionManager.registerAction(
      new SetValueAction(
        ActionManager.OnPointerOverTrigger,
        mesh.material,
        "wireframe",
        true
      )
    );
    mesh.actionManager.registerAction(
      new SetValueAction(
        ActionManager.OnPointerOutTrigger,
        mesh.material,
        "wireframe",
        false
      )
    );
  };

  const [rotation, setRotation] = useState({ x: 0, y: 0, z: 0 });
  const [state1, setState1] = useState({ num: 0 });
  const counter = useRef(0);

  useEffect(() => {
    counter.current += 1;
    const timer = setTimeout(() => {
      setState1({ num: state1.num + 1 });
      setRotation({ x: 0, y: rotation.y - 0.005, z: 0 });
    });
    return () => clearTimeout(timer);
  }, [state1]);

  useEffect(() => {
    document.getElementById("sample-canvas").onwheel = function (event) {
      event.preventDefault();
    };

    document.getElementById("sample-canvas").onmousewheel = function (event) {
      event.preventDefault();
    };
  }, []);

  // const element = document.getElementById("wrapper");
  // element.addEventListener("wheel",evt=>evt.preventDefault())
  return (
    <>
      <div className="row">
        <div className="col-xs-3 col-lg-3 align-top">
          <Button onClick={moveAvocadoUp}>
            <Octicon icon={ArrowUp} />
          </Button>
          &nbsp;&nbsp;
          <Button onClick={moveAvocadoDown}>
            <Octicon icon={ArrowDown} />
          </Button>
        </div>
      </div>
      <div id="wrapper" className="wrapper">
        <Engine
          style={{
            height: 500,
            width: "100%",
            border: "none",
            borderRadius: "10px",
          }}
          antialias={true}
          adaptToDeviceRatio={true}
          canvasId="sample-canvas"
        >
          <Scene clearColor={Color3.FromHexString(props.bgColor)}>
            <arcRotateCamera
              name="camera1"
              alpha={Math.PI / 2}
              beta={Math.PI / 2}
              radius={6.0}
              target={Vector3.Zero()}
              minZ={0.001}
            />
            <hemisphericLight
              name="light1"
              intensity={0.7}
              direction={Vector3.Up()}
            />
            <ScaledModelWithProgress
              rootUrl={`https://sunrisetechs.s3.ap-southeast-2.amazonaws.com/metabloqs/nft/`}
              sceneFilename={props?.id + ".glb"}
              scaleTo={avocadoSettings.avocadoScaling}
              progressBarColor={Color3.FromHexString(props.bgColor)}
              center={new Vector3(0, avocadoSettings.avocadoYPos, 0)}
              // onModelLoaded={onModelLoaded}
              modelRotation={new Vector3(0, rotation.y, 0)}
              scaling={
                new Vector3(
                  avocadoSettings.avocadoScaling,
                  avocadoSettings.avocadoScaling,
                  avocadoSettings.avocadoScaling
                )
              }
            />
            {/* <ScaledModelWithProgress 
             rootUrl={`https://sunrisetechs.s3.ap-southeast-2.amazonaws.com/metabloqs/nft/`}
              sceneFilename={2+".glb"} 
              scaleTo={avocadoSettings.avocadoScaling} 
                progressBarColor={Color3.FromInts(255, 165, 0)}
                 center={new Vector3(0, avocadoSettings.avocadoYPos, 0)}
              /> */}
          </Scene>
        </Engine>
      </div>
    </>
  );
};

export default WithModel;
