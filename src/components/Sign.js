import { createUserWithEmailAndPassword } from 'firebase/auth'
import React, { useState } from 'react'
import { auth } from '../firebase'
import { Button, Form } from "semantic-ui-react";

const Login = () => {
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')

    const crea = (e) => {
        e.preventDefault()
        createUserWithEmailAndPassword(auth, email, password)
          .then((userCredential) => {
            console.log(userCredential);
          })
          .catch((error) => {
            console.log(error);
          });
    }

  return (
    <div className="sign-in-container">
      <Form onSubmit={crea}>
        <h1>create</h1>
        <Form.Input
          type="email"
          placeholder="Enter your email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        ></Form.Input>
        <Form.Input
          type="password"
          placeholder="Enter your password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        ></Form.Input>
        <Button type='submit'>create</Button>
      </Form>
    </div>
  );
}

export default Login