import React, { useEffect, useState } from "react";
import { db, auth } from "../firebase";
import { Button, Card, Container, Grid, Image } from "semantic-ui-react";
import { useNavigate } from "react-router-dom";
import { collection, deleteDoc, doc, onSnapshot } from "firebase/firestore";
import ModalComp from "../components/ModalComp";
import Spinner from "../components/Spinner";
import Album from "./Album";
import { query, where } from "firebase/firestore";

const Home = () => {
  const [images, setImages] = useState([]);
  const [open, setOpen] = useState(false);
  const [image, setImage] = useState({});
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    setLoading(true);
    let unsub = undefined;

    auth.onAuthStateChanged((user) => {
      if (user) {
        const uid = user.uid;

        // use uid to query the database
        const albumsRef = collection(db, "albums");
        unsub = onSnapshot(
          query(albumsRef, where("user_id", "==", uid)),
          (snapshot) => {
            let list = [];
            snapshot.docs.forEach((doc) => {
              list.push({ id: doc.id, ...doc.data() });
            });
            setImages(list);
            console.log("list: ", list);
            setLoading(false);
          },
          (error) => {
            console.log(error);
          }
        );
      } else {
        // user is not logged in
      }
    });

    // return the unsub function to be called when the component unmounts
    return () => {
      if (unsub) {
        unsub();
      }
    };
  }, []);

  if (loading) {
    return <Spinner />;
  }

  const handleModal = (item) => {
    setOpen(true);
    setImage(item);
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure!!")) {
      try {
        setOpen(false);
        await deleteDoc(doc(db, "albums", id));
        setImages(images.filter((image) => image.id !== id));
      } catch (err) {
        console.log(err);
      }
    }
  };

  return (
    <Container>
      <div>
        <Album />
      </div>
      <h2>Recently Added Albums</h2>

      <Grid columns={3} stackable>
        {images &&
          images.map((item) => (
            <Grid.Column key={item.id}>
              <Card>
                <Card.Content>
                  <Image
                    src={item.cover}
                    size="medium"
                    style={{
                      height: "150px",
                      width: "100%",
                    }}
                  />
                  <Card.Header style={{ marginTop: "10px" }}>
                    {item.title}
                  </Card.Header>
                </Card.Content>
                <Card.Content extra>
                  <div>
                    {/* <Button
                      color="green"
                      onClick={() => navigate(`/update/${item.id}`)}
                    >
                      update
                    </Button> */}
                    <Button color="red" onClick={() => handleDelete(item.id)}>
                      Delete
                    </Button>
                    <Button
                      color="purple"
                      onClick={() => navigate(`show-album/${item.id}`)}
                    >
                      view
                    </Button>
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

export default Home;
