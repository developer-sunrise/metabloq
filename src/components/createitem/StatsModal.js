import React, { useState } from "react";
import Box from "@mui/material/Box";
import Modal from "@mui/material/Modal";
import "./Styles.css";
import { Col, Image, Row, Stack } from "react-bootstrap";
// example for stats
// {
//   "display_type": "number",
//   "trait_type": "Generation",
//   "value": 2
// }
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

function StatsModal(props) {
  let { statsModal, setStatsModal, statsModalClose ,setAttributes} = props;

  const saveClick = () => {
    var newArr = inputFields.map((x) => {
      return {
        display_type: "number",
        trait_type: x.name,
        value: (x.value1 / x.value2) * 100,
        type:"stats"
      };
    });
    setAttributes(newArr,"stats")
    setStatsModal(false);
  };

  const [inputFields, setInputFields] = useState([
    {
      name: "",
      value1: "",
      value2: "",
    },
  ]);

  const addInputField = () => {
    setInputFields([
      ...inputFields,
      {
        name: "",
        value1: "",
        value2: "",
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
        open={statsModal}
        onClose={statsModalClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          <div className="placebid_modal-box">
            <Stack gap={3}>
              <div className="d-flex justify-content-between align-items-center">
                <h3 className="font-weight-bold">Add Stats</h3>
                <small onClick={statsModalClose} style={{ cursor: "pointer" }}>
                  X
                </small>
              </div>

              <small>
                Stats show up underneath your item, are clickable, and can be
                filtered in your collections's sidebar
              </small>
              <div className="">
                <Row>
                  <Col>Name</Col>
                  <Col>Value</Col>
                </Row>
                {inputFields.map((data, index) => {
                  const { value1, value2, name } = data;
                  return (
                    <Row className="my-3" key={index}>
                      <Col xxl={5} xl={5} lg={5} md={5} className="">
                        <div className="">
                          <input
                            type="text"
                            onChange={(evnt) => handleChange(index, evnt)}
                            value={name}
                            name="name"
                            className="createitem_input"
                            placeholder="Speed"
                          />
                        </div>
                      </Col>
                      <Col xxl={2} xl={2} lg={2} md={2} className="p-0">
                        <div className="">
                          <input
                            type="number"
                            onChange={(evnt) => handleChange(index, evnt)}
                            value={value1}
                            name="value1"
                            className="createitem_input"
                            placeholder="3"
                          />
                        </div>
                      </Col>
                      <Col
                        xxl={1}
                        xl={1}
                        lg={1}
                        md={1}
                        className="p-0 d-flex align-items-center justify-content-center"
                      >
                        of
                      </Col>
                      <Col xxl={2} xl={2} lg={2} md={2} className="p-0">
                        <div className="">
                          <input
                            type="number"
                            onChange={(evnt) => handleChange(index, evnt)}
                            value={value2}
                            name="value2"
                            className="createitem_input"
                            placeholder="5"
                          />
                        </div>
                      </Col>
                      <Col xxl={1} xl={1} lg={1} md={1} className="">
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

export default StatsModal;
