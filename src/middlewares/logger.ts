import pino from 'pino';
import pinoHttp from 'pino-http';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc.js';
import timezone from 'dayjs/plugin/timezone.js';

dayjs.extend(utc);
dayjs.extend(timezone);

const logger = pinoHttp({
  logger: pino({
    transport: {
      target: 'pino-pretty',
      options: {
        colorize: true,
        translateTime: 'HH:MM:ss dd-mm-yyyy',
        ignore: 'pid,hostname,req.headers,res.headers,req,res,responseTime',
        messageFormat:
          'method: {req.method} | url: {req.url} | status: {res.statusCode} | time: {responseTime}ms',
      },
    },
    timestamp: () =>
      `,"time":"${dayjs().tz('Asia/Jakarta').format('HH:mm:ss DD-MM-YYYY')}"`,
  }),
});

export default logger;
