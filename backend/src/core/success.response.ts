import { reasonPhrases } from '~/constants/reason-phrases'
import { statusCodes } from '~/constants/status-codes'

class SuccessResponse {
  message: string
  status: number
  data: any
  typeError: string
  statusMessage: string

  constructor({ message = '', status = statusCodes.OK, data = null }) {
    this.message = !message ? reasonPhrases.OK : message
    this.status = status
    this.data = data
    this.typeError = ''
    this.statusMessage = 'success'
  }
  send = (res: any) => {
    return res.status(this.status).json(this)
  }
}
class OK extends SuccessResponse {
  constructor({ message, data }: { message: string; data: any }) {
    super({
      message,
      data
    })
  }
}

class CREATED extends SuccessResponse {
  constructor({ message, data }: { message: string; data: any }) {
    super({
      message,
      status: statusCodes.CREATED,
      data
    })
  }
}

export { OK, CREATED, SuccessResponse }
