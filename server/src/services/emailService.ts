import { logger } from '../utils/logger';

export class EmailService {
  static async sendWelcomeEmail(to: string, name: string) {
    logger.info(`[EMAIL] Welcome email queued for ${to} (${name})`);
  }

  static async sendOtpEmail(to: string, otp: string, purpose: string) {
    logger.info(`[EMAIL] OTP ${otp} dispatched to ${to} for ${purpose}`);
  }

  static async sendInterestEmail(to: string, fromName: string) {
    logger.info(`[EMAIL] New interest alert sent to ${to} from ${fromName}`);
  }

  static async sendMatchEmail(to: string, matchName: string) {
    logger.info(`[EMAIL] New Match alert sent to ${to} with ${matchName}`);
  }
}
