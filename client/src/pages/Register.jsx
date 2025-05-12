import { useState } from 'react';
import { Container, Form, Button, Alert } from 'react-bootstrap';
import axios from 'axios';
import { useNavigate } from 'react-router-dom;'

function Register() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await axios.post('http://localhost:5000/api/register', { username, password });
            navigate('/login');
        } catch (err) {
            setError(err.response.data.error || 'Registration failed');
        }
    };

    return (
        <Container className="py-5 animate__animated animate__fadeIn">
            <h1 className="mb-4">Register</h1>
            {error && <Alert variant="danger">{error}</Alert>}
            <Form onSubmit={handleSubmit} className="shadow p-4 rounded bg-white">
                <Form.Group className="mb-3">
                    <Form.Label>Username</Form.Label>
                    <Form.Control
                        type="text"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        required
                        placeholder="Enter username"
                    />
                </Form.Group>
                <Form.Group className="mb-3">
                    <Form.Label>Password</Form.Label>
                    <Form.Control
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                        placeholder="Enter password"
                    />
                </Form.Group>
                <Button type="submit" variant="primary" className="w-100">
                    Register
                </Button>
            </Form>
            <p className="mt-3 text-center">
                Already have an account? <a href="/login">Login here</a>
            </p>
        </Container>
    );
}

export default Register;