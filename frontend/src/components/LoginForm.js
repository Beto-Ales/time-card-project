import React from 'react'
import { useState } from 'react'
// components
import SignIn from './SignIn'
import ContactForm from './ContactForm'
// material
import { Button } from '@mui/material'

const LoginForm = ({handleLogin, username, setUsername, password, setPassword, handleSignin} ) => {
  const [logSign, setlogSign] = useState(false)
  const [recoverPassword, setRecoverPassword] = useState(false)

  const log = {display: logSign ? 'none' : ''}
  const sign = {display: logSign ? '' : 'none'}
  const butStyl = {backgroundColor: 'red'}
  const inputStyle = {marginLeft: '1em', marginBottom: '1em'}

  const contactForm = {display: recoverPassword ? '' : 'none'}

  const toggleLogSign = () => {
    setlogSign(!logSign)
  }

  const handleRecoverPassword = () => {
    setRecoverPassword(true)
  }
  return (
    <>
      <button className='screenBtn' style={butStyl} onClick={toggleLogSign}>{logSign ? 'Log in' : 'Sign up'}</button>   {/* buttons are confusing */}
      <div style={log}>
      <h2>Log in</h2>
        <form onSubmit={handleLogin}>
              <div>
                  Username
                  <input style={inputStyle}
                      type="text"
                      value={username}
                      name="Username"
                      onChange={({ target }) => setUsername(target.value)} />
              </div>
              <div>
                  Password
                  <input style={inputStyle}
                      type="password"
                      value={password}
                      name="Password"
                      onChange={({ target }) => setPassword(target.value)} />
              </div>
              <button className='screenBtn' type="submit">Login</button>    {/* buttons are confusing */}
              <Button variant="contained" onClick={() => handleRecoverPassword()}>Recover Password</Button>
        </form>
      </div>
      <div style={sign}>
        {/* <h1>signin</h1> */}
        <SignIn
          handleSignin={handleSignin}
          username={username}
          setUsername={setUsername}
          password={password}
          setPassword={setPassword}
        />
      </div>
      <div style={contactForm}>
        <ContactForm
        />
      </div>
    </>
  )
}

export default LoginForm