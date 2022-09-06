import React, { useState } from "react";
import Box from "@mui/material/Box";
import Modal from "@mui/material/Modal";
import "./Styles.css";
import { Col, Image, Row, Stack } from "react-bootstrap";
// property example
//   {
//     trait_type: "Base",
//     value: "Starfish",
//   },
const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: "40%",
  bgcolor: "background.paper",
  border: "none !important",
  boxShadow: 2,
  p: 2,
  borderRadius: "1em",
};

function PropertyModal(props) {
  let { propModal, setPropModal, propModalClose,setAttributes } = props;

  const saveClick = () => {
    var newArr = inputFields.map((x) => {
      return {
        trait_type: x.type,
        value: x.name,
        type:"property"
      };
    });
    setAttributes(newArr,"property")
    setPropModal(false);
  };

  const [inputFields, setInputFields] = useState([
    {
      type: "",
      name: "",
    },
  ]);
  const addInputField = () => {
    setInputFields([
      ...inputFields,
      {
        type: "",
        name: "",
      },
    ]);
  };

  const removeInputFields = (index) => {
    const rows = [...inputFields];
    rows.splice(index, 1);
    setInputFields(rows);
  };

  const handleChange = (index, evnt) => {
    const { name, value } = evnt.target;
    const list = [...inputFields];
    list[index][name] = value;
    setInputFields(list);
  };

  return (
    <>
      <Modal
        open={propModal}
        onClose={propModalClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          <div className="placebid_modal-box">
            <Stack gap={3}>
              <div className=" d-flex justify-content-between align-items-center">
                <h3 className="font-weight-bold">Add Properties</h3>
                <small onClick={propModalClose} style={{ cursor: "pointer" }}>
                  X
                </small>
              </div>

              <small>
                Properties show up underneath your item, are clickable, and can
                be filtered in your collections's sidebar
              </small>
              <div className="">
                <Row>
                  <Col>Type</Col>
                  <Col>Name</Col>
                </Row>
                {inputFields.map((data, index) => {
                  const { type, name } = data;
                  return (
                    <Row className="my-3" key={index}>
                      <Col
                        xxl={5}
                        xl={5}
                        lg={5}
                        md={5}
                        sm={5}
                        xs={5}
                        className=""
                      >
                        <div className="">
                          <input
                            type="text"
                            onChange={(evnt) => handleChange(index, evnt)}
                            value={type}
                            name="type"
                            className="createitem_input"
                            placeholder="character"
                          />
                        </div>
                      </Col>
                      <Col
                        xxl={5}
                        xl={5}
                        lg={5}
                        md={5}
                        sm={5}
                        xs={5}
                        className=""
                      >
                        <div className="">
                          <input
                            type="text"
                            onChange={(evnt) => handleChange(index, evnt)}
                            value={name}
                            name="name"
                            className="createitem_input"
                            placeholder="Male"
                          />
                        </div>
                      </Col>
                      <Col
                        xxl={2}
                        xl={2}
                        lg={2}
                        md={2}
                        sm={2}
                        xs={2}
                        className=""
                      >
                        <div className="d-flex align-items-end justify-content-center">
                          {inputFields.length !== 1 ? (
                            <button
                              className="btn btn-outline-danger"
                              onClick={removeInputFields}
                            >
                              X
                            </button>
                          ) : null}
                        </div>
                      </Col>
                    </Row>
                  );
                })}
                <br />
                <button
                  className="metablog_primary-filled-button"
                  onClick={addInputField}
                >
                  Add more
                </button>
              </div>
              <button
                className="metablog_primary-filled-square-button"
                onClick={saveClick}
              >
                <span>Save</span>
              </button>
            </Stack>
          </div>
        </Box>
      </Modal>
    </>
  );
}

export default PropertyModal;
