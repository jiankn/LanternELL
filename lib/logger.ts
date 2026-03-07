// Structured logger for Cloudflare Workers (uses console.log with JSON)

type LogLevel = 'info' | 'warn' | 'error' | 'debug'

interface LogEntry {
  level: LogLevel
  message: string
  context?: string
  data?: Record<string, unknown>
  timestamp: string
}

function log(level: LogLevel, message: string, context?: string, data?: Record<string, unknown>) {
  const entry: LogEntry = {
    level,
    message,
    context,
    data,
    timestamp: new Date().toISOString(),
  }

  switch (level) {
    case 'error': console.error(JSON.stringify(entry)); break
    case 'warn': console.warn(JSON.stringify(entry)); break
    case 'debug': console.debug(JSON.stringify(entry)); break
    default: console.log(JSON.stringify(entry))
  }
}

export const logger = {
  info: (message: string, context?: string, data?: Record<string, unknown>) => log('info', message, context, data),
  warn: (message: string, context?: string, data?: Record<string, unknown>) => log('warn', message, context, data),
  error: (message: string, context?: string, data?: Record<string, unknown>) => log('error', message, context, data),
  debug: (message: string, context?: string, data?: Record<string, unknown>) => log('debug', message, context, data),
}
