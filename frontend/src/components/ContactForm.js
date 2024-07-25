import React, { useState } from 'react'
import { sendEmail } from '../services/emailService' // Adjust the path as necessary

const ContactForm = () => {
  const [formData, setFormData] = useState({
    to: '',
    subject: '',
    message: '',
  })

  const [status, setStatus] = useState('')

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      await sendEmail(formData)
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
        <input
          type="text"
          name="subject"
          placeholder="Subject"
          value={formData.subject}
          onChange={handleChange}
          required
        />
        <textarea
          name="message"
          placeholder="Message"
          value={formData.message}
          onChange={handleChange}
          required
        ></textarea>
        <button type="submit">Send Email</button>
      </form>
      {status && <p>{status}</p>}
    </div>
  )
}

export default ContactForm
