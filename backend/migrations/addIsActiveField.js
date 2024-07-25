const mongoose = require('mongoose')
const User = require('../models/user') // Update the path to where your User model is located

const MONGO_URI = 'mongodb+srv://beto:hbKKcwE3r469xXJ@cluster0.k43vr.mongodb.net/aic-test?retryWrites=true&w=majority'

const addIsActiveField = async () => {
  try {
    // Connect to the MongoDB database
    await mongoose.connect(MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
    
    // Update all users to add the isActive field with default value true
    const result = await User.updateMany(
      { isActive: { $exists: false } }, // Only update documents where isActive does not exist
      { $set: { isActive: true } }      // Set isActive to true
    )
    
    console.log('Update complete:', result)
  } catch (error) {
    console.error('Error updating users:', error)
  } finally {
    // Close the database connection
    mongoose.connection.close()
  }
}

addIsActiveField()
