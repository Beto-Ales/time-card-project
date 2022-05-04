import { useState, useEffect } from 'react'
import loginService from './services/login'
import LoginForm from './components/LoginForm'
import './App.css'

const App = () => {
  const [errorMessage, setErrorMessage] = useState(null)
  const [username, setUsername] = useState('') 
  const [password, setPassword] = useState('')
  const [user, setUser] = useState(null)

  const handleLogin = async (event) => {
    event.preventDefault()
    try {
      const user = await loginService.login({
        username, password,
      })
      setUser(user)
      setUsername('')
      setPassword('')
    } catch (exception) {
        setErrorMessage('Wrong credentials')
        setTimeout(() => {
          setErrorMessage(null)
        }, 5000)
      }
  }
  return (
    <div className="App">
      <header className="App-header">
        {/* <h1>beto</h1> */}
        <h1>{errorMessage}</h1>
        {/* <h1>{JSON.stringify(user)}</h1> */}
        {/* <h1>{ user.username }</h1> */}
        {user !== null && <h1>{user.username}</h1>}
      </header>

      <LoginForm
        handleLogin={handleLogin}
        username={username}
        setUsername={setUsername}
        password={password}
        setPassword={setPassword}
      />

      {/*                         replace with component
                                  ---------------------- 
      <h2>Login</h2>
      <form onSubmit={handleLogin}>
        <div>
          username
            <input
            type="text"
            value={username}
            name="Username"
            onChange={({ target }) => setUsername(target.value)}
          />
        </div>
        <div>
          password
            <input
            type="password"
            value={password}
            name="Password"
            onChange={({ target }) => setPassword(target.value)}
          />
        </div>
        <button type="submit">login</button>
      </form> 
                                  ----------------------    
      */}
    </div>
  )
}

export default App

