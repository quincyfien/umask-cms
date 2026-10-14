type LogLevel = "debug" | "info" | "warn" | "error";

interface LogPayload {
  level: LogLevel;
  message: string;
  timestamp: string;
  service: string;
  context?: Record<string, unknown>;
  error?: {
    name?: string;
    message: string;
    stack?: string;
  };
}

class Logger {
  private serviceName = "btrc-web";

  private formatError(err: unknown) {
    if (err instanceof Error) {
      return {
        name: err.name,
        message: err.message,
        stack: err.stack,
      };
    }
    if (typeof err === "string") {
      return { message: err };
    }
    return { message: String(err) };
  }

  private write(level: LogLevel, message: string, context?: Record<string, unknown>, error?: unknown) {
    const payload: LogPayload = {
      level,
      message,
      timestamp: new Date().toISOString(),
      service: this.serviceName,
      ...(context && Object.keys(context).length > 0 ? { context } : {}),
      ...(error ? { error: this.formatError(error) } : {}),
    };

    const isDev = process.env.NODE_ENV !== "production";
    if (isDev) {
      const color =
        level === "error"
          ? "\x1b[31m"
          : level === "warn"
          ? "\x1b[33m"
          : level === "info"
          ? "\x1b[36m"
          : "\x1b[90m";
      const reset = "\x1b[0m";
      const extra = context ? ` ${JSON.stringify(context)}` : "";
      const errOut = error ? `\n${payload.error?.stack || payload.error?.message}` : "";
      console.log(
        `${color}[${level.toUpperCase()}]${reset} ${payload.timestamp} [${this.serviceName}]: ${message}${extra}${errOut}`
      );
    } else {
      console.log(JSON.stringify(payload));
    }
  }

  debug(message: string, context?: Record<string, unknown>) {
    this.write("debug", message, context);
  }

  info(message: string, context?: Record<string, unknown>) {
    this.write("info", message, context);
  }

  warn(message: string, context?: Record<string, unknown>, error?: unknown) {
    this.write("warn", message, context, error);
  }

  error(message: string, error?: unknown, context?: Record<string, unknown>) {
    this.write("error", message, context, error);
  }
}

export const logger = new Logger();
