import helmet from 'helmet';
export const helmetMw = helmet({
  crossOriginEmbedderPolicy: false,
  crossOriginOpenerPolicy: { policy: 'same-origin' },
  contentSecurityPolicy: false
});
