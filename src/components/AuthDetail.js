import { onAuthStateChanged, signOut } from 'firebase/auth'
import React, { useEffect, useState } from 'react'
import {auth} from '../firebase'

const AuthDetail = () => {
    const [authUser, setAuthUser] = useState(null)

    useEffect(() => {
        const listen = onAuthStateChanged(auth, (user) => {
            if (user) {
                setAuthUser(user)
            } else {
                setAuthUser(null)
            }
        })

        return () => {
            listen()
        }

    }, [])
    

    const userSignOut = () => {
        signOut(auth).then(() => {
            console.log('sign out successfully')
        }).catch(error => console.log(error))
    }
  return (
    <div>
      {authUser ? (
        <>
          <p>{`Hello ${authUser.email}`}</p>
          <button onClick={userSignOut}>Logg out</button>
        </>
      ) : (
        <p>Logged Out</p>
      )}
    </div>
  );

  }
export default AuthDetail