import React, { useState, useEffect, useContext } from 'react'
// global context
import { GlobalContext } from '../App'
// material
import Snackbar from '@mui/material/Snackbar'
import Button from '@mui/material/Button'
import CloseIcon from '@mui/icons-material/Close'
import { TextField, InputAdornment, IconButton } from '@mui/material'
import { Visibility, VisibilityOff } from '@mui/icons-material'
// services
import userService from '../services/users'

const ChangePasswordForm = ({ isRecoverPassword }) => {
  const [errorMessage, setErrorMessage] = useState(null)
  const [newPassword, setNewPassword] = useState('')
  const [newPasswordRepeat, setNewPasswordRepeat] = useState('')
  const [showPassword, setShowPassword] = useState(false)

  const { user } = useContext(GlobalContext)

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

  useEffect(() => {
    if (errorMessage) {
      setOpenSnackbar(true)
    }
  }, [errorMessage])
  // -----------------
  // material snackbar

  const handleTogglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  }

  const handleSubmit = async (e) => {
    console.log('submit')
    e.preventDefault()
    if (newPassword.trim() === '') {
      setErrorMessage('New password cannot be empty')
      return
    }

    if (newPassword === newPasswordRepeat) {
      if (isRecoverPassword) {
        try {
          await userService.resetPassword(newPassword)
          setErrorMessage('Password recovered successfully')
        } catch (error) {
          setErrorMessage(`Error: ${error.message}`)
        }
      } else {
        try {
          await userService.changePassword( user.id, user.email, newPassword )
          setErrorMessage('Password updated successfully')
        } catch (error) {
          setErrorMessage(`Error: ${error.message}`)
        }
      }
    } else {
      setErrorMessage('Passwords do not match')
    }
  }

  return (
    <div>
      <Snackbar
        open={openSnackbar}
        autoHideDuration={4000}
        onClose={handleSnackbarClose}
        message={errorMessage}
        action={actionSnackbar}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      />
      <form onSubmit={handleSubmit}>
        <TextField
          type={showPassword ? 'text' : 'password'}
          label="New Password"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <IconButton
                  aria-label="toggle password visibility"
                  onClick={handleTogglePasswordVisibility}
                >
                  {showPassword ? <VisibilityOff /> : <Visibility />}
                </IconButton>
              </InputAdornment>
            ),
          }}
          variant="outlined"
          required
          fullWidth
          margin="normal"
        />

        <TextField
          type={showPassword ? 'text' : 'password'}
          label="Repeat Password"
          value={newPasswordRepeat}
          onChange={(e) => setNewPasswordRepeat(e.target.value)}
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <IconButton
                  aria-label="toggle password visibility"
                  onClick={handleTogglePasswordVisibility}
                >
                  {showPassword ? <VisibilityOff /> : <Visibility />}
                </IconButton>
              </InputAdornment>
            ),
          }}
          variant="outlined"
          required
          fullWidth
          margin="normal"
        />
        {/* <input
          type="password"
          name="newPassword"
          placeholder="New Password"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
          required
        />

        <input
          type="password"
          name="newPasswordRepeat"
          placeholder="Repeat Password"
          value={newPasswordRepeat}
          onChange={(e) => setNewPasswordRepeat(e.target.value)}
          required
        /> */}

        <button type="submit">Change Password</button>
      </form>
    </div>
  )
}

export default ChangePasswordForm
