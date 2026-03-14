import mongoose from 'mongoose'
import dotenv from 'dotenv'
dotenv.config()

const url = process.env.MONGODB_URL || ''

class Database {
  private static instance: Database

  private constructor() {
    this.connectDB()
  }

  private async connectDB(): Promise<void> {
    try {
      await mongoose.connect(url, {
        maxPoolSize: 50
      })
      console.log('Connect DB successfully')
    } catch (error) {
      console.error('Error connecting to the database:', error)
    }
  }

  public static getInstance(): Database {
    if (!Database.instance) {
      Database.instance = new Database()
    }
    return Database.instance
  }
}

export default Database
