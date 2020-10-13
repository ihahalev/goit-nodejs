const nodemailer = require('nodemailer');
const getLogger = require('./get-logger');
const configEnv = require('../config.env');

class Mailer {
  constructor() {
    this.logger = getLogger('mailer');
    this._transport = nodemailer.createTransport(configEnv.mail);
  }

  async init() {
    this.logger.info('Creating transporter');

    await this._transport;
  }

  async sendMailFromSupport({ to, subject, text, html }) {
    this.logger.debug('Sending email');
    this.logger.debug('to ->', to);
    this.logger.debug('subject ->', subject);
    text && this.logger.debug('text ->', text);
    html && this.logger.debug('html ->', html);

    return this._transport.sendMail({
      from: configEnv.mail.auth.user,
      to: Array.isArray(to) ? to.join(', ') : to,
      subject,
      text,
      html,
    });
  }

  async sendText({ to, subject, text }) {
    return this.sendMailFromSupport({ to, subject, text });
  }

  async sendHtml({ to, subject, html }) {
    return this.sendMailFromSupport({ to, subject, html });
  }
}

module.exports = new Mailer();
