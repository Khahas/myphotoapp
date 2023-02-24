import React from "react";
import { Modal, Header, Image, Button, ModalHeader } from "semantic-ui-react";

const ModalComp = ({
  open,
  setOpen,
  img,
  name,
  info,
  email,
  contact,
  id,
  handleDelete,
}) => {
  return (
    <Modal
      onClose={() => setOpen(false)}
      onOpen={() => setOpen(true)}
      open={open}
    >
      <Modal.Header>User Detail</Modal.Header>
      <Modal.Content image>
        <Image size="medium" src={img} wrapped />
        <Modal.Description>
          <Header>{name}</Header>
          <p>{email}</p>
        </Modal.Description>
      </Modal.Content>
      <Modal.Actions>
        <Button color="black" onClick={() => setOpen(false)}>
          cancel
        </Button>
        <Button 
        color="red" 
        content="Delete"
        labelPosition="right"
        icon="checkmark"
        onClick={() => handleDelete(id)}>
          
        </Button>
      </Modal.Actions>
    </Modal>
  );
};

export default ModalComp;
