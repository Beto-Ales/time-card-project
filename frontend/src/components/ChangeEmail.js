import React, { useContext, useState } from 'react'
// global context
import { GlobalContext } from '../App'
// services
import userService from '../services/users'

const UpdateEmailForm = () => {
  const [newEmail, setNewEmail] = useState('')
  
  const { user, setErrorMessage } = useContext(GlobalContext)
  
  console.log(user)
  const currentEmail = user.email
  const userId = user.id

  const handleChange = (e) => {
    setNewEmail(e.target.value)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      await userService.changeEmail(userId, currentEmail, newEmail)   // al cambiar email no se actualiza la view
      setErrorMessage('Email updated successfully')
    } catch (error) {
      setErrorMessage('Error updating email')
    }
  }

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <p>Current Email: "{ user.email }" </p>     {/*al cambiar email no se actualiza la view*/}
        <input
          type="email"
          name="email"
          placeholder="New Email"
          value={newEmail}
          onChange={handleChange}
          required
        />
        <button type="submit">Update Email</button>
      </form>
    </div>
  )
}

export default UpdateEmailForm
