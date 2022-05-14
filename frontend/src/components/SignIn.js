import React from 'react'

const SignIn = ({handleSignin, username, setUsername, password, setPassword} ) => {
    return (
      <><h2>Signin</h2>
      <form onSubmit={handleSignin}>
            <div>
                username
                <input
                    type="text"
                    value={username}
                    name="Username"
                    onChange={({ target }) => setUsername(target.value)} />
            </div>
            <div>
                password
                <input
                    type="password"
                    value={password}
                    name="Password"
                    onChange={({ target }) => setPassword(target.value)} />
            </div>
            <button type="submit">login</button>
        </form></>
    )
  }
  
  export default SignIn