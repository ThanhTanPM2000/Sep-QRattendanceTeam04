import { findLastIndex } from "lodash";
import React from "react";
import { Modal, Button } from "react-bootstrap";

const ModalCommon = ({ titleHeader, children, onHide, ...otherProps }) => {
  return (
    <Modal
      size="lg"
      onHide={onHide}
      backdrop="static"
      keyboard={false}
      {...otherProps}
    >
      <Modal.Header closeButton>
        <Modal.Title id="contained-modal-title-vcenter">
          {titleHeader}
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>{children}</Modal.Body>
    </Modal>
  );
};

export default ModalCommon;
