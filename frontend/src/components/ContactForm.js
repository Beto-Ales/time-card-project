import React, { useState } from 'react'
// services
import userService from '../services/users'

const ContactForm = () => {
  const [formData, setFormData] = useState('')

  const [status, setStatus] = useState('')

  const handleChange = (e) => {
    setFormData( e.target.value )
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      await userService.forgotPassword(formData)
      setStatus('Email sent successfully')
    } catch (error) {
      setStatus('Error sending email')
    }
  }

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <input
          type="email"
          name="to"
          placeholder="Recipient's Email"
          value={formData.to}
          onChange={handleChange}
          required
        />
        <button type="submit">Send Email</button>
      </form>
      {status && <p>{status}</p>}
    </div>
  )
}

export default ContactForm
