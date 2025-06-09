import pino from 'pino';
import pinoHttp from 'pino-http';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc.js';
import timezone from 'dayjs/plugin/timezone.js';
import { IncomingMessage, ServerResponse } from 'http';

dayjs.extend(utc);
dayjs.extend(timezone);

const baseLogger = pino({
  transport: {
    target: 'pino-pretty',
    options: {
      colorize: true,
      translateTime: false,
      ignore: 'pid,hostname,req,res,responseTime',
      messageFormat: '{msg} {customerId}',
    },
  },
  timestamp: () =>
    `,"time":"${dayjs().tz('Asia/Jakarta').format('HH:mm:ss DD-MM-YYYY')}"`,
});

const httpLogger = pinoHttp({
  logger: baseLogger,
  serializers: {
    req: (req: IncomingMessage) => ({
      method: req.method,
      url: req.url,
    }),
    res: (res: ServerResponse) => ({
      statusCode: res.statusCode,
    }),
  },
  customLogLevel: (req: IncomingMessage, res: ServerResponse, err) => {
    if (res.statusCode >= 500 || err) return 'error';
    if (res.statusCode >= 400) return 'warn';
    return 'info';
  },
  customSuccessMessage: (
    req: IncomingMessage,
    res: ServerResponse,
    responseTime: number
  ) => {
    return `method: ${req.method} | url: ${req.url} | status: ${res.statusCode} | time: ${responseTime} ms`;
  },
  customErrorMessage: (req: IncomingMessage, res: ServerResponse, err) => {
    return `method: ${req.method} | url: ${req.url} | status: ${res.statusCode} | error: ${err.message}`;
  },
});

export { baseLogger, httpLogger };
