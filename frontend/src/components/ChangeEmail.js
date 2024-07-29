import React, { useContext, useState } from 'react'
// global context
import { GlobalContext } from '../App'
// services
import userService from '../services/users'

const UpdateEmailForm = () => {
  const [newEmail, setNewEmail] = useState('')
  const currentEmail = ''
  const [status, setStatus] = useState('')

  const { user } = useContext(GlobalContext)

  console.log(user)

  const handleChange = (e) => {
    setNewEmail(e.target.value)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      await userService.changeEmail(currentEmail, newEmail)
      setStatus('Email updated successfully')
    } catch (error) {
      setStatus('Error updating email')
    }
  }

  return (
    <div>
      <form onSubmit={handleSubmit}>
        {/* mostrar el current email */}
        <p>{ user.username }</p>
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
      {status && <p>{status}</p>}
    </div>
  )
}

export default UpdateEmailForm
