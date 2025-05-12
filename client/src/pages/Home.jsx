import { useState, useEffect } from 'react';
import { Container, Card, Button } from 'react-bootstrap';
import axios from 'axios';

function Home() {
    const [posts, setPosts] = useState([]);

    useEffect(() => {
        axios.get('http://localhost:5000/api/posts').then(res => {
            setPosts(res.data);
        });
    }, []);

    return (
        <Container className="py-5">
            <h1 className="mb-4">Blog Posts</h1>
            {posts.map(post => (
                <Card key={post.id} className="mb-3 animate__animated animate__fadeIn">
                    <Card.Body>
                        <Card.Title>{post.title}</Card.Title>
                        <Card.Text>{post.content.substring(0, 200)}...</Card.Text>
                        <Card.Subtitle className="text-muted">By {post.author}</Card.Subtitle>
                        <Button variant="primary" href={`/post/${post.id}`}>Read More</Button>
                    </Card.Body>
                </Card>
            ))}
        </Container>
    );
}

export default Home;