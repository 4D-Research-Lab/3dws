import React, { useRef, useState } from 'react';
import { Form, Card, Button, Alert, Row, Col } from 'react-bootstrap';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useAuth } from '$context/AuthContext';

export default function SignIn() {
  const emailRef = useRef(null);
  const passwordRef = useRef(null);
  const { login } = useAuth();
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();

    setLoading(true);
    try {
      setLoading(true);
      setError('');
      await login(emailRef.current.value, passwordRef.current.value);

      router.push('/');
    } catch (error) {
      console.log(error);
      setError('failed to Log in');
    }
    setLoading(false);
  };

  return (
    <Row className="justify-content-md-center">
      <Col md="4">
        <Card>
          <Card.Body>
            <h2 className="text-center mb-4">Log In</h2>
            {error && <Alert variant="danger">{error}</Alert>}
            <Form onSubmit={handleSubmit}>
              <Form.Group id="email">
                <Form.Label>Email</Form.Label>
                <Form.Control
                  type="email"
                  required
                  ref={emailRef}
                ></Form.Control>
              </Form.Group>
              <Form.Group id="password">
                <Form.Label>Password</Form.Label>
                <Form.Control
                  type="password"
                  required
                  ref={passwordRef}
                ></Form.Control>
              </Form.Group>
              <Button type="submit" className="w-100" disabled={loading}>
                Log In
              </Button>
            </Form>
            <div className="text-center w-100 mt-3">
              <Link href="/reset-password">Reset Password</Link>
            </div>
          </Card.Body>
        </Card>
        <div className="text-center w-100 mt-2">
          Not registered yet? <Link href="/register">Sign Up</Link>
        </div>
      </Col>
    </Row>
  );
}
