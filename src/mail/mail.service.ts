import { Injectable } from '@nestjs/common';
import { User } from '../user/models/user.model';
import { MailerService } from '@nestjs-modules/mailer';

@Injectable()
export class MailService {
    constructor(private mailerService: MailerService) { }

    async sendUserConfirmation(user: User): Promise<void> {
        const url = `${process.env.API_HOST}/api/user/activate/${user.activation_link}`;
        console.log(url);
        await this.mailerService.sendMail({
            to: user.email,
            subject: 'Welcome to Stadium App! Confirm your Email!',
            template: './confirmation',
            context: {
                name: user.first_name,
                url
            }
        });
    }
}
