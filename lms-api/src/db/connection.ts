import mongoose from 'mongoose'

class DatabaseConnection {
  private static instance: DatabaseConnection
  private isConnected = false

  private constructor() {}

  public static getInstance(): DatabaseConnection {
    if (!DatabaseConnection.instance) {
      DatabaseConnection.instance = new DatabaseConnection()
    }
    return DatabaseConnection.instance
  }

  public async connect(): Promise<void> {
    if (this.isConnected) {
      console.log('Đã kết nối MongoDB trước đó')
      return
    }

    try {
      const mongoUri = process.env.MONGODB_URI!

      await mongoose.connect(mongoUri)

      this.isConnected = true
      console.log('Kết nối MongoDB thành công')

      // Xử lý sự kiện kết nối
      mongoose.connection.on('error', (error) => {
        console.error('Lỗi kết nối MongoDB:', error)
        this.isConnected = false
      })

      mongoose.connection.on('disconnected', () => {
        console.log('MongoDB đã ngắt kết nối')
        this.isConnected = false
      })

      mongoose.connection.on('reconnected', () => {
        console.log('MongoDB đã kết nối lại')
        this.isConnected = true
      })
    } catch (error) {
      console.error('Kết nối MongoDB thất bại:', error)
      this.isConnected = false
      throw error
    }
  }

  public async disconnect(): Promise<void> {
    if (!this.isConnected) {
      return
    }

    try {
      await mongoose.disconnect()
      this.isConnected = false
      console.log('Đã ngắt kết nối MongoDB')
    } catch (error) {
      console.error('Lỗi khi ngắt kết nối MongoDB:', error)
      throw error
    }
  }

  public getConnectionStatus(): boolean {
    return this.isConnected
  }
}

export default DatabaseConnection.getInstance()
