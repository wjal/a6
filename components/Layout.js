import { Container } from 'react-bootstrap';
import MainNav from './MainNav';
import { useAtom } from 'jotai';
import { favouritesAtom } from '@/store';

export default function Layout(props) {
  return (
    <>
      <MainNav />
      <br />
      <Container>
          {props.children}
      </Container>
      <br />
    </>
  );
}