const Consts = require('../misc/const');
const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: Consts.GMAIL_USER,
    pass: Consts.GMAIL_PASSWORD
  }
});

class Mail {
  constructor( from, to, subject, html, text ){ 
    this.from = from;
    this.to = to;
    this.subject = subject; 
    this.html = html;
    this.text = text;
    Mail.validateReceiver(this.to);
    Mail.validateMessageBody(this.subject,this.text,this.html);
  }

  static validateReceiver(toEmail) {
    if (!toEmail) {
      throw 'Email is empty.';
    }
  }

  static validateMessageBody(subject, text, html){
    if (!subject) {
      if (!html) {
        if (!text) {
          throw 'Wrong message.';
        }
      }
    }
  }
}

class MailWithAttachments extends Mail {
  constructor(from, to, subject, html, text, attachments) {
    super(from, to, subject, html, text);
    this.attachments = attachments;
    MailWithAttachments.validateAttachments(attachments);
  }

  static validateAttachments(attachments){ 
   for( let attachment of attachments ) { 
      if( !attachment.filename ){ 
        if( !attachment.content ) {
          throw 'Wrong attachment.';
        }
      }
    }
  }
}

class MailService { 
  constructor() {}

  async sendMessageWithAttachments (toEmail, subject, text, html, attachments) {
    
    if( !attachments && attachments.length == 0 ){ 
      this.sendMessage(toEmail, subject, text, html );
    }
    
    await transporter.sendMail(new MailWithAttachments(Consts.GMAIL_USER, toEmail, subject, html, text, attachments));
  }

  async sendMessage (toEmail, subject, text, html) {
    
    this.validateReceiver(toEmail);
    this.validateMessageBody(subject,text,html);
    const message = new Mail('wedrobetona@yandex.ru', toEmail, subject, html, text)
    await transporter.sendMail(message);
  }
}

module.exports = new MailService();