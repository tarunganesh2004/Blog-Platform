import { useState } from 'react';
import { Container, Form, Button, Alert } from 'react-bootstrap';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function CreatePost() {
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await axios.post('http://localhost:5000/api/posts', { title, content }, {
                withCredentials: true // Include cookies for Flask-Login
            });
            navigate('/');
        } catch (err) {
            setError(err.response.data.error || 'Failed to create post');
        }
    };

    return (
        <Container className="py-5 animate__animated animate__fadeIn">
            <h1 className="mb-4">Create a New Post</h1>
            {error && <Alert variant="danger">{error}</Alert>}
            <Form onSubmit={handleSubmit} className="shadow p-4 rounded bg-white">
                <Form.Group className="mb-3">
                    <Form.Label>Title</Form.Label>
                    <Form.Control
                        type="text"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        required
                        placeholder="Enter post title"
                    />
                </Form.Group>
                <Form.Group className="mb-3">
                    <Form.Label>Content</Form.Label>
                    <Form.Control
                        as="textarea"
                        rows={6}
                        value={content}
                        onChange={(e) => setContent(e.target.value)}
                        required
                        placeholder="Write your post content here..."
                    />
                </Form.Group>
                <Button type="submit" variant="primary" className="w-100">
                    Publish Post
                </Button>
            </Form>
        </Container>
    );
}

export default CreatePost;