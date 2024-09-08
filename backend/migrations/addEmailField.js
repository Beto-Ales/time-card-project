const mongoose = require('mongoose')
const User = require('../models/user') // Update the path to where your User model is located

const MONGO_URI = 'mongodb+srv://beto:hbKKcwE3r469xXJ@cluster0.k43vr.mongodb.net/aic?retryWrites=true&w=majority'

const addEmailField = async () => {
  try {
    // Connect to the MongoDB database
    await mongoose.connect(MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
    
    // Update all users to add the userEmail field with default value ''
    const result = await User.updateMany(
      { userEmail: { $exists: false } }, // Only update documents where userEmail does not exist
      { $set: { userEmail: '' } }      // Set userEmail to ''
    )
    
    console.log('Update complete:', result)
  } catch (error) {
    console.error('Error updating users:', error)
  } finally {
    // Close the database connection
    mongoose.connection.close()
  }
}

addEmailField()
