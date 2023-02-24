import { signInWithEmailAndPassword } from 'firebase/auth'
import React, { useState } from 'react'
import { auth } from '../firebase'
import { Button, Form, } from "semantic-ui-react";

const Login = () => {
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')

    const logIn = (e) => {
        e.preventDefault()
        signInWithEmailAndPassword(auth, email, password)
        .then((userCredential) => {
            console.log(userCredential)
        }).catch((error) => {
            console.log(error)
        })
    }

  return (
    <div className="sign-in-container">
      <Form onSubmit={logIn}>
        <h1>Log in</h1>
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
        <Button type='submit'>Log in</Button>
      </Form>
    </div>
  );
}

export default Login
