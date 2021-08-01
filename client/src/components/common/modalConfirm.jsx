import React from "react";
import { Modal, Button } from "react-bootstrap";
import "../../assets/css/modalConfirm.css";

const ModalConfirm = ({
  onHide,
  onDelete,
  data,
  title,
  content,
  cancelLabel = "No",
  confirmLabel = "Yes",
  ...otherProps
}) => {
  const [isDelete, setIsDelete] = React.useState(false);

  const handleExit = () => {
    setIsDelete(false);
  };

  return (
    <Modal
      backdrop="static"
      dialogClassName="modal-confirm"
      centered
      keyboard={false}
      onHide={onHide}
      onExit={handleExit}
      {...otherProps}
    >
      <Modal.Header closeButton={!isDelete}>
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
        <Button variant="info" disabled={isDelete} onClick={onHide}>
          Cancel
        </Button>
        <Button
          variant="danger"
          disabled={isDelete}
          onClick={async () => {
            setIsDelete(true);
            await onDelete(data);
            setIsDelete(false);
          }}
        >
          {isDelete ? "Waiting" : "Delete"}
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default ModalConfirm;
