import * as Next from 'next';

declare module 'next' {
  interface NextApiRequest {
    userPresent?: boolean;
  }
}
