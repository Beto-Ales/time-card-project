import { createContext, useState, useEffect, useCallback  } from 'react'
import {
  BrowserRouter as Router,
  Routes, Route, Navigate
} from 'react-router-dom'
// material
import Button from '@mui/material/Button'
import Snackbar from '@mui/material/Snackbar'
import IconButton from '@mui/material/IconButton'
import CloseIcon from '@mui/icons-material/Close'
// services
import loginService from './services/login'
import usersService from './services/users'
import signinService from './services/signin'
import hoursService from './services/hours'
// components
import LoginForm from './components/LoginForm'
import User from './components/User'
import TimeCard from './components/TimeCard'
import ResetPassword from './components/ResetPassword'
// styles
import './App.css'

export const GlobalContext = createContext()

const App = () => {
  const [errorMessage, setErrorMessage] = useState(null)
  const [username, setUsername] = useState('') 
  const [password, setPassword] = useState('')
  const [user, setUser] = useState(null)
  const [employees, setEmployees] = useState(null)
  
  // material snackbar
  // -----------------
  const [openSnackbar, setOpenSnackbar] = useState(false)

  const handleSnackbarClose = (event, reason) => {
    if (reason === 'clickaway') {
      return
    }

    setOpenSnackbar(false)
  }

  const actionSnackbar = (
    <>
      <Button color="secondary" size="small" onClick={handleSnackbarClose}>
        Close
      </Button>
      <IconButton
        size="small"
        aria-label="close"
        color="inherit"
        onClick={handleSnackbarClose}
      >
        <CloseIcon fontSize="small" />
      </IconButton>
    </>
  )
  // -----------------
  // material snackbar

  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem('loggedNoteappUser')
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON)
      setUser(user)
      usersService.setToken(user.token)
      hoursService.setToken(user.token)
      // user &&
      // console.log(user)
    }    
  }, [])

  useEffect(() => {
    if (errorMessage) {
      setOpenSnackbar(true)
    }
  }, [errorMessage])

  const handleLogin = async (event) => {
    event.preventDefault()
    try {
      const user = await loginService.login({
        username, password,
      })
      usersService.setToken(user.token)
      hoursService.setToken(user.token)
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
  
  const handleSignin = async (event) => {
    event.preventDefault()
    if (!username) {                
                setErrorMessage('Username is a required field')
                setTimeout(() => {
                setErrorMessage(null)
                }, 5000)
                return
            }
    try {
      const newUser = await signinService.signin({
        username, password,
      })       
      setUsername('')
      setPassword('')
      setErrorMessage(`${JSON.stringify(newUser.username)} signed in`)  /* maybe newUser.username signed in */
        setTimeout(() => {
          setErrorMessage(null)
        }, 5000)
    } catch (exception) {
        setErrorMessage(exception.response.data.error)        
        setTimeout(() => {
          setErrorMessage(null)
        }, 5000)
      }
  }

  const fetchEmployees = useCallback(async () => {
    if (user && user.username === 'jan') {
      try {
        const users = await usersService.getAll()
        setEmployees(users)
      } catch (error) {
        setErrorMessage('Failed getting employees')
        setTimeout(() => {
          setErrorMessage(null)
        }, 5000)
      }
    }
  }, [user])

  useEffect(() => {
    fetchEmployees()
  }, [user, fetchEmployees])

  const updateEmployees = () => {
    // console.log('update employees')
    fetchEmployees()
  }

  const handleLogout = () => {
    window.localStorage.removeItem('loggedNoteappUser')
    setUser(null)
  }

  return (
    <GlobalContext.Provider value={{ user, setErrorMessage }}>
      <Router>
        <div className="App">
          <header className="App-header">
            <Snackbar
              open={openSnackbar}
              autoHideDuration={4000}
              onClose={handleSnackbarClose}
              message={errorMessage}
              action={actionSnackbar}
              anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
            />
            <br/>
            <h1>{ user && user.username[0].toUpperCase() + user.username.slice(1).toLowerCase() }</h1>
            {
              user &&
              <p><button onClick={() => handleLogout()}>Logout</button></p>
            }
            <br/>
          </header>
          <Routes>
            <Route
              path='/'
              element={user === null ? (
                <LoginForm
                handleLogin={ handleLogin }
                username={ username }
                setUsername={ setUsername }
                password={ password }
                setPassword={ setPassword }
                handleSignin={ handleSignin }
                />
              ) : (
                <Navigate to={user.username === 'jan' ? "/Jan" : "/Home"} replace />
              )}
            />
            <Route
              path='/Jan/*'
              element={user && user.username === 'jan' ? (
                <User
                  user={user}
                  employees={employees}
                  onUpdateEmployees={updateEmployees}
                />
              ) : (
                <Navigate to="/" replace />
              )}
            />
            <Route
              path='/Home/*'
              element={user && user.username !== 'jan' ? (
                <TimeCard
                  user={user}
                  setUser={setUser}
                  setErrorMessage={setErrorMessage}
                />
              ) : (
                <Navigate to="/" replace />
              )}
            />
            <Route path="/resetPassword" element={<ResetPassword />} />
            <Route path='*' element={<Navigate to="/" replace />} /> {/* Redirect unknown routes to the homepage */}
          </Routes>
        </div>
      </Router>
    </GlobalContext.Provider>
  )
}

export default App

