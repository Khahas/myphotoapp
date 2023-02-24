import React, { useEffect, useState } from "react";
import { db } from "../firebase";
import {
  Button,
  Card,
  Container,
  Grid,
  Image,
} from "semantic-ui-react";
import { useNavigate } from "react-router-dom";
import { collection, deleteDoc, doc, onSnapshot } from "firebase/firestore";
import ModalComp from "../components/ModalComp";
import Spinner from "../components/Spinner";

const Users = () => {
  const [images, setImages] = useState([]);
  const [open, setOpen] = useState(false)
  const [image, setImage] = useState({})
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    setLoading(true);
    const unsub = onSnapshot(
      collection(db, "users"),
      (snapshot) => {
        let list = [];
        snapshot.docs.forEach((doc) => {
          list.push({ id: doc.id, ...doc.data() });
        });
        setImages(list);
        setLoading(false);
      },
      (error) => {
        console.log(error);
      }
    );
    return () => {
      unsub();
    };
  }, []);

  if(loading) {
    return <Spinner />
  }

  const handleModal = (item) => {
    setOpen(true)
    setImage(item)
  }

  const handleDelete = async (id) => {
    if(window.confirm("Are you sure!!")) {
       try {
        setOpen(false)
        await deleteDoc(doc(db, "users", id))
        setImages(images.filter((image) => image.id !== id))
       } catch (err) {
        console.log(err)
       }
    }
  }

  return (
    <Container>
        <Grid columns={3} stackable>
          {images &&
            images.map((item) => (
              <Grid.Column key={item.id}>
                <Card>
                  <Card.Content>
                    <Image
                      src={item.img}
                      size="medium"
                      style={{
                        height: "150px",
                        width: "150px",
                        borderRadius: " 50%",
                      }}
                    />
                    <Card.Header style={{ marginTop: "10px" }}>
                      {item.name}
                    </Card.Header>
                  </Card.Content>
                  <Card.Content extra>
                    <div>
                      <Button
                        color="green"
                        onClick={() => navigate(`/update/${item.id}`)}
                      >
                        update
                      </Button>
                      <Button color="purple" onClick={() => handleModal(item)}>view</Button>
                      {open && (
                        <ModalComp
                        open={open}
                        setOpen={setOpen}
                        handleDelete={handleDelete}
                        {...image}
                        />
                      )}
                    </div>
                  </Card.Content>
                </Card>
              </Grid.Column>
            ))}
        </Grid>
    </Container>
  );
};

export default Users;
