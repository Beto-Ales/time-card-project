import { useState, useEffect } from 'react'
import loginService from './services/login'
import usersService from './services/users'
import LoginForm from './components/LoginForm'
import User from './components/User'
import './App.css'

const App = () => {
  const [errorMessage, setErrorMessage] = useState(null)
  const [username, setUsername] = useState('') 
  const [password, setPassword] = useState('')
  const [user, setUser] = useState(null)
  const [employees, setEmployees] = useState(null)

  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem('loggedNoteappUser')
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON)
      setUser(user)
      usersService.setToken(user.token)
    }
  }, [])

  const handleLogin = async (event) => {
    event.preventDefault()
    try {
      const user = await loginService.login({
        username, password,
      })
      usersService.setToken(user.token)
      setUser(user)
      window.localStorage.setItem(
        'loggedNoteappUser', JSON.stringify(user)
      ) 
      setUsername('')
      setPassword('')
    } catch (exception) {
        setErrorMessage('Wrong credentials')
        setTimeout(() => {
          setErrorMessage(null)
        }, 5000)
      }
  }

  const handleGetEmployees = async () => {
    if (user.username === 'beto') {
      try {
        const users = await usersService.getAll()
        setEmployees(users)
      } catch (error) {
          setErrorMessage('Faild getting employees')
          setTimeout(() => {
            setErrorMessage(null)
      }, 5000)
      }
      
      console.log('get employees')
    }
  }
  return (
    <div className="App">
      
      <header className="App-header">        
        <h1>{errorMessage}</h1>        
      </header>

      {user === null ?
        <LoginForm
          handleLogin={handleLogin}
          username={username}
          setUsername={setUsername}
          password={password}
          setPassword={setPassword}
        /> :
        <User
          user={user}
          handleGetEmployees={handleGetEmployees}
          employees={employees}
        />
        // <div>
        //   <h1>{user.username}</h1>
        //   <br/>
        //   <button onClick={() => handleGetEmployees()}>Get employees</button>
        //   <User
        //     employees={employees}
        //   />
        // </div>
      }            
    </div>
  )
}

export default App

