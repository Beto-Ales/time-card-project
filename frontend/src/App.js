import { useState, useEffect } from 'react'
import loginService from './services/login'
import usersService from './services/users'
import LoginForm from './components/LoginForm'
import User from './components/User'
import TimeCard from './components/TimeCard'
import './App.css'

const App = () => {
  const [errorMessage, setErrorMessage] = useState(null)
  const [username, setUsername] = useState('') 
  const [password, setPassword] = useState('')
  const [user, setUser] = useState(null)
  const [employees, setEmployees] = useState(null)
  // const [sigleEmployee, setSingleEmployee] = useState(null)
  
  // sigleEmployee &&
  // console.log('sigleEmployee', sigleEmployee)

  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem('loggedNoteappUser')
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON)
      setUser(user)
      usersService.setToken(user.token)
      user &&
      console.log(user)
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

  useEffect(() => {
    if(user) {
      if (user.username === 'beto') {
        try {
          console.log('first try');
          usersService.getAll()        
          .then(users => setEmployees(users))
        } catch (error) {
            setErrorMessage('failed getting employees')
            setTimeout(() => {
              setErrorMessage(null)
            }, 5000)
          }
      }
    }
  }, [user])

  // get specific user works but not needed. solved with login populate hours
  // ------------------------------------------------------------------------
  // useEffect(() => {
  //   if (user) {
  //     console.log('user', user);
  //     try {
  //       usersService.getOneUser(user.id)
  //         .then(employee => setSingleEmployee(employee))
  //     } catch (error) {
  //       setErrorMessage(error)
  //       setTimeout(() => {
  //         setErrorMessage(null)
  //       }, 5000)
  //     }      
  //   }
  // },[user])

  const display = () => {
    if (user === null) {
      return <LoginForm
      handleLogin={handleLogin}
      username={username}
      setUsername={setUsername}
      password={password}
      setPassword={setPassword}
      />
    }else if (user.username === 'beto') {
      return <User
      user={user}          
      employees={employees}
      />
    }else if (user.username !== 'beto') {
      return <TimeCard
      user={user}
      />
    }
  }

  return (
    <div className="App">
      
      <header className="App-header">        
        <h1>{errorMessage}</h1>        
      </header>

      {display()}

      {/* <TimeCard/> */}

      {/* {user === null ?
        <LoginForm
          handleLogin={handleLogin}
          username={username}
          setUsername={setUsername}
          password={password}
          setPassword={setPassword}
        /> :
        <User
          user={user}          
          employees={employees}
        />        
      } */}
    </div>
  )
}

export default App

