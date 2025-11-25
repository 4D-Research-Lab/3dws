import React, { useRef, useState } from 'react';
import { Form, Card, Button, Alert, Row, Col } from 'react-bootstrap';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { getAuth, updateProfile } from 'firebase/auth';
import { useAuth } from '$context/AuthContext';

export default function Signup() {
  const nameRef = useRef(null);
  const emailRef = useRef(null);
  const passwordRef = useRef(null);
  const passwordConfirmRef = useRef(null);
  const { signup } = useAuth();
  const auth = getAuth();

  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (passwordRef.current.value !== passwordConfirmRef.current.value) {
      return setError('Passwords do not match');
    }
    try {
      setLoading(true);
      setError('');
      await signup(emailRef.current.value, passwordRef.current.value);

      updateProfile(auth.currentUser, {
        displayName: nameRef.current.value,
      })
        .then(() => {
          router.push('/login');
        })
        .catch((error) => {
          console.log(error);
        });
    } catch (error) {
      setError(
        'Failed to create an account. Does your password have more than 6 characters?'
      );
    }
    setLoading(false);
  };

  return (
    <Row className="justify-content-md-center">
      <Col md="4">
        <Card>
          <Card.Body>
            <h2 className="text-center mb-4">Sign Up</h2>
            {error && <Alert variant="danger">{error}</Alert>}
            <Form onSubmit={handleSubmit}>
              <Form.Group id="name">
                <Form.Label>
                  Name (non-editable). This name will be publicly visible
                </Form.Label>
                <Form.Control type="name" required ref={nameRef}></Form.Control>
              </Form.Group>
              <Form.Group id="email">
                <Form.Label>Email (non-editable)</Form.Label>
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
              <Form.Group id="password-confirm">
                <Form.Label>Password confirmation</Form.Label>
                <Form.Control
                  type="password"
                  required
                  ref={passwordConfirmRef}
                ></Form.Control>
              </Form.Group>
              <Button type="submit" className="w-100" disabled={loading}>
                Sign Up
              </Button>
            </Form>
          </Card.Body>
        </Card>
        <div className="text-center w-100 mt-2">
          Already have an account? <Link href="/login">Log In</Link>
        </div>
      </Col>
    </Row>
  );
}
