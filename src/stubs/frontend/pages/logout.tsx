import { GetServerSidePropsContext } from 'next';
import cookie from 'cookie';
import http from '../http';

export default function Logout() {
  return null;
}

export async function getServerSideProps({
  req,
  res,
}: GetServerSidePropsContext) {
  // todo, this doesnt work all the time
  await http('logout', { method: 'post', req });
  res.setHeader('set-cookie', [
    cookie.serialize('XSRF-TOKEN', '', { expires: new Date(), maxAge: 0 }),
    cookie.serialize('laravel_session', '', { expires: new Date(), maxAge: 0 }),
    cookie.serialize('user', '', { expires: new Date(), maxAge: 0 }),
  ]);
  return {
    redirect: {
      destination: '/login',
      permanent: false,
    },
  };
}
