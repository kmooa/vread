/**
 * Created by JohnBae on 4/6/17.
 */
import { Accounts } from 'meteor/accounts-base';

Accounts.emailTemplates.siteName = "Revomake";
Accounts.emailTemplates.from = "Revomake <admin@Revomake.com>";

Accounts.emailTemplates.verifyEmail = {
    subject() {
        return "[Revomake] Verify Your Email Address";
    },
    text( user, url ) {
        let emailAddress   = user.emails[0].address,
            urlWithoutHash = url.replace( '#/', '' ),
            supportEmail   = "support@Revomake.com",
            emailBody      = `To verify your email address (${emailAddress}) visit the following link:\n\n${urlWithoutHash}\n\n If you did not request this verification, please ignore this email. If you feel something is wrong, please contact our support team: ${supportEmail}.`;

        return emailBody;
    }
};