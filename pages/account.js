import { useRouter } from 'next/router';
import { Row, Col, Button } from 'react-bootstrap';
import { signOut } from 'firebase/auth';
import { useAuth } from '$context/AuthContext';
import { auth } from '$firebase';

export default function Account() {

  const handleSignout = () => {
    signOut(auth);
    window.location.href = '/';
  };

  const { displayName, email } = useAuth();
  return (
    <>
      {displayName && (
        <Row>
          <Col className="account">
            <h3>Name </h3>
            {displayName}
            <h3> Email </h3>
            {email}
            <div className="spacing"></div>
            <Button onClick={handleSignout}>Sign Out</Button>
          </Col>
        </Row>
      )}
    </>
  );
}
