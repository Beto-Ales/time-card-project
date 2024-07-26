import React, { useState } from 'react'
import userService from '../services/users'

const UpdateEmailForm = () => {
  const [newEmail, setNewEmail] = useState('')
  const currentEmail = ''
  const [status, setStatus] = useState('')

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
