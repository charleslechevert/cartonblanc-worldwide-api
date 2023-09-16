import * as nodemailer from 'nodemailer';
import * as handlebars from 'handlebars';
import * as fs from 'fs';
import * as path from 'path';
import { HttpException, HttpStatus } from '@nestjs/common';

export const sendEmail = async (
  email,
  subject,
  payload,
  template,
): Promise<boolean> => {
  try {
    const transporter = nodemailer.createTransport({
      host: 'smtp.gmail.com',
      port: 465,
      auth: {
        user: 'charles.lechevert@gmail.com',
        pass: 'eqwj qjzj dklv vjih',
      },
      secure: true,
    });

    // const compiledTemplate = handlebars.compile(template);
    // const htmlToSend = compiledTemplate(payload);

    const htmlToSend = `
    <p>Bonjour ${payload.name},</p>
    <p>Voici le lien pour changer votre mot de passe : ${payload.link} </p>
  `;

    const options = () => {
      return {
        from: 'charles.lechevert@gmail.com',
        to: 'charles.lechevert@outlook.fr',
        subject: subject,
        html: htmlToSend,
      };
    };

    await transporter.sendMail(options());
    return true; // or you can return info if you need
  } catch (error) {
    console.log(error);
    throw new HttpException(
      'Error sending email',
      HttpStatus.INTERNAL_SERVER_ERROR,
    );
  }
};
