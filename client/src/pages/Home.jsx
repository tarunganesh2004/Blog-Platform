// @ts-nocheck
import { Pagination } from 'react-bootstrap';

function Home() {
    const [posts, setPosts] = useState([]);
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);

    useEffect(() => {
        axios.get(`http://localhost:5000/api/posts?page=${page}`).then(res => {
            setPosts(res.data.posts);
            setTotalPages(res.data.pages);
        });
    }, [page]);

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
            <Pagination>
                {Array.from({ length: totalPages }, (_, i) => (
                    <Pagination.Item key={i + 1} active={i + 1 === page} onClick={() => setPage(i + 1)}>
                        {i + 1}
                    </Pagination.Item>
                ))}
            </Pagination>
        </Container>
    );
}

export default Home