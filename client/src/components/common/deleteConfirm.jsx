import React from "react";
import { Modal, Button } from "react-bootstrap";
import "../../assets/css/deleteConfirm.css";

const DeleteConfirm = ({ onHide, onDelete, data, ...otherProps }) => {
  return (
    <Modal
      backdrop="static"
      dialogClassName="modal-confirm"
      onHide={onHide}
      {...otherProps}
    >
      <Modal.Header closeButton>
        <div className="icon-box">
          <i className="nc-icon nc-simple-remove">&#xE5CD;</i>
        </div>
        <Modal.Title>Are You Sure?</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <p>
          Do you really want to delete these records? This process cannot be
          undone.
        </p>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="info" onClick={onHide}>
          Cancel
        </Button>
        <Button variant="danger" onClick={() => onDelete(data)}>
          Delete
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default DeleteConfirm;
