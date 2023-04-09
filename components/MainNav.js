import { Container, Nav, Navbar, Form, Button, ListGroup } from "react-bootstrap";
import Link from 'next/link';
import {useRouter} from 'next/router';
import {useState} from 'react';
import NavDropdown from 'react-bootstrap/NavDropdown';
import { searchHistoryAtom } from '@/store';
import { favouritesAtom } from '@/store';
import { useAtom } from 'jotai'
import { addToHistory } from "@/lib/userData";
import { readToken, removeToken } from '@/lib/authenticate';


export default function MainNav(){

  const [searchField, setSearchField] = useState("");
  const [isExpanded, setIsExpanded] = useState(false);
  const [searchHistory, setSearchHistory ] = useAtom(searchHistoryAtom);

  const router = useRouter();
  const token = readToken()
  function logout() {
    removeToken();
    router.push('/');
  }

  async function submitForm(e){
    e.preventDefault();
    if(searchField != ""){
      router.push(`/artwork?title=true&q=${searchField}`);
      setSearchField("");
    }
    setSearchHistory(await addToHistory(`title=true&q=${searchField}`));
  }

  return (
    <>
    <Navbar  expand="lg" className="fixed-top navbar-dark bg-primary" expanded={isExpanded}>
      <Container>
        <Navbar.Brand>James Little</Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" onClick={(e) => setIsExpanded(!isExpanded)}/>
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="me-auto">
             <Link href="/" passHref legacyBehavior><Nav.Link active={router.pathname === "/"} onClick={(e) => setIsExpanded(false)}>Home</Nav.Link></Link>
             {token && <Link href="/search" passHref legacyBehavior ><Nav.Link active={router.pathname === "/search"} onClick={(e) => setIsExpanded(false)}>Advanced Search</Nav.Link></Link>}
          </Nav>
          &nbsp;
          { token && <Form className="d-flex" onSubmit={submitForm}>
            <Form.Control
              type="search"
              placeholder="Search"
              className="me-2"
              aria-label="Search"
              value={searchField} onChange={(e) => setSearchField(e.target.value)}
            />
            <Button type="submit" variant="success">Search</Button>
          </Form> }
          &nbsp;
          <Nav>
            { token && <NavDropdown title={token.userName} id="basic-nav-dropdown">
              <Link href="/favourites" passHref legacyBehavior>
                  
                  <NavDropdown.Item active={router.pathname === "/favourites"} onClick={(e) => setIsExpanded(false)}>Favourites</NavDropdown.Item>
                 
              </Link>
              <Link href="/history" passHref legacyBehavior>
                  <NavDropdown.Item active={router.pathname === "/history"} onClick={(e) => setIsExpanded(false)}>Search History</NavDropdown.Item>
              </Link>
                  <NavDropdown.Item onClick={(e) => logout()}>Logout</NavDropdown.Item>
            </NavDropdown> }
          </Nav>
        </Navbar.Collapse>
       
        <Nav className="me-auto">
             { !token && <Link href="/login" passHref legacyBehavior><Nav.Link active={router.pathname === "/login"} onClick={(e) => setIsExpanded(false)}>Login</Nav.Link></Link>}
             {!token && <Link href="/register" passHref legacyBehavior ><Nav.Link active={router.pathname === "/register"} onClick={(e) => setIsExpanded(false)}>Register</Nav.Link></Link>}
        </Nav>
        
      </Container>
    </Navbar>
    <br /><br /><br />
    </>
  );
}