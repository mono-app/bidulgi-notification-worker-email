const Creator = require("@app/entities/creator");
const Recipient = require("@app/entities/recipient");
const Sms = require("@app/entities/sms");
const Smtp = require("@app/entities/smtp");
const CustomError = require("@app/entities/error");
const StatusUtils = require("@app/utils/status");

class Notification{
// id: string
// _creator: Creator
// _recipient: Recipient
// _sentTime: bigint
// _channel: string
// _content: string
// _title: string
// _status: string
// _sms: Sms
// _smtp: Smtp
// extraData: object
// serverSentTime: bigint
// createdAt: bigint
// updatedAt: bigint
// deletedAt: bigint

  /**
   * 
   * @param {Creator} creator 
   * @param {Recipient} recipient 
   * @param {bigint} sentTime 
   * @param {string} channel 
   * @param {string} content 
   * @param {string} title 
   * @param {string} status 
   * @param {Sms} sms 
   * @param {Smtp} smtp 
   * @param {bigint} serverSentTime 
   * @param {object} extraData
   */
  constructor(creator, recipient, sentTime, channel, content, status, title=null, sms=null, smtp=null, serverSentTime=null, extraData=null){
    this.title = title;
    this.sms = sms
    this.smtp = smtp
    this.serverSentTime = serverSentTime;
    this.extraData = extraData;
    this.creator = creator;
    this.recipient = recipient;
    this.sentTime = sentTime;
    this.channel = channel;
    this.content = content;
    this.status = status;
  }

  get creator() { return this._creator }
  set creator(value) {
    if(!(value instanceof Creator)) throw new CustomError("notification/wrong-type", "creator must be Creator entity")
    this._creator = value
  }

  get recipient() { return this._recipient }
  set recipient(value) {
    if(!(value instanceof Recipient)) throw new CustomError("notification/wrong-type", "recipient must be Recipient entity")
    this._recipient = value
  }

  get sentTime() { return this._sentTime }
  set sentTime(value) { 
    if(!value) throw new CustomError("null-value", "sentTime cannot be empty")
    this._sentTime = value
  }

  get channel() { return this._channel }
  set channel(value) { 
    if(!value) throw new CustomError("null-value", "channel cannot be empty")
    if(value !== "sms" && value !== "pushNotification" && value !== "email" && value !== "mono") throw new CustomError("null-value","channel must be sms, mono, email, or pushNotification")
    if(value==="sms" && !this.sms) throw new CustomError("null-value","smsApiKey, smsApiSecret must be filled if the channel is sms")
    if(value==="email" && !this.smtp) throw new CustomError("null-value","smtpHost, smtpPort, smtpUsername,smtpPassword must be filled if the channel is email")
    this._channel = value
  }

  get content() { return this._content }
  set content(value) { 
    if(!value) throw new CustomError("null-value", "content cannot be empty") 
    this._content = value
  }

  get status() { return this._status }
  set status(value) { 
    if(!value) throw new CustomError("null-value", "status cannot be empty")
    if(value !== StatusUtils.QUEUEING && value !== StatusUtils.SENDING && 
       value !== StatusUtils.SENT && value !== StatusUtils.FAILED && value !== StatusUtils.DELETED) 
       throw new CustomError("null-value",`STATUS must be ${StatusUtils.DELETED}, ${StatusUtils.QUEUEING}, ${StatusUtils.SENDING}, ${StatusUtils.SENT}, or ${StatusUtils.FAILED}`)
    this._status = value
  }

  get sms() { return this._sms }
  set sms(value) {
    if(value) if(!(value instanceof Sms)) throw new CustomError("notification/wrong-type", "sms must be Sms entity")
    this._sms = value
  }

  get smtp() { return this._smtp }
  set smtp(value) {
    if(value) if(!(value instanceof Smtp)) throw new CustomError("notification/wrong-type", "smtp must be Smtp entity")
    this._smtp = value
  }

  static fromDatabase(row){
    const creator = new Creator(row.creatorId, row.creatorProvider)
    const recipient = new Recipient(row.recipientId, row.recipientType)
    const sms = (row.smsProvider && row.smsApiKey && row.smsApiSecret && row.smsSenderId)? new Sms(row.smsProvider, row.smsApiKey, row.smsApiSecret, row.smsSenderId): null
    const smtp = (row.smtpHost && row.smtpPort && row.smtpUsername && row.smtpPassword)? new Smtp(row.smtpHost, row.smtpPort, row.smtpUsername, row.smtpPassword): null
   
    const notification = new Notification(creator, recipient, row.sentTime, row.channel, row.content, row.status, row.title, sms, smtp, row.serverSentTime, row.extraData)
    notification.id = row.id
    notification.createdAt = row.createdAt
    notification.updatedAt = row.updatedAt
    notification.deletedAt = row.deletedAt
    return notification;
  }

  get data(){
    const transformedData = {}
    Object.keys(this).map((prop) => {
      const newProp = (prop.indexOf("_") === 0)? prop.substring(1): prop;
      if(typeof(this[newProp]) === "object" && this[newProp].data) transformedData[newProp] = this[newProp].data;
      else transformedData[newProp] = this[newProp];
    })
    return transformedData;
  }
  
}
module.exports = Notification;