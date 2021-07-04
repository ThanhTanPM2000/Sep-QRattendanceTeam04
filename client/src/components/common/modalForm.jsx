import React from "react";
import { useEffect } from "react";
import { Modal, Button } from "react-bootstrap";

import "../../assets/css/modalForm.css";

const ModalForm = ({ titleHeader, children, onHide, ...otherProps }) => {
  useEffect(() => {
    var element = document.getElementsByClassName("modal");
    element.scrollTop = element.scrollHeight;
  }, []);
  return (
    <Modal
      size="xl"
      onHide={onHide}
      backdrop="static"
      centered
      aria-labelledby="gogo"
      {...otherProps}
    >
      <Modal.Header closeButton>
        <Modal.Title id="gogo">{titleHeader}</Modal.Title>
      </Modal.Header>
      <Modal.Body>{children}</Modal.Body>
    </Modal>
  );
};

export default ModalForm;
