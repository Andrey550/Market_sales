export function logError(event, error, context = {}) {
  console.error(JSON.stringify({
    level: 'error',
    timestamp: new Date().toISOString(),
    event,
    error: {
      name: error?.name,
      message: error?.message,
      stack: error?.stack
    },
    context
  }));
}

export function logInfo(event, data = {}) {
  console.log(JSON.stringify({
    level: 'info',
    timestamp: new Date().toISOString(),
    event,
    data
  }));
}
