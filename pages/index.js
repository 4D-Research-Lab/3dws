import Link from 'next/link';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Card from 'react-bootstrap/Card';
export default function Home() {
  return (
    <Row>
      <Col md={{ span: 9, offset: 2 }}>
        <div>
          <h1>A platform for reuse of 3D models and collaboration</h1>
          <p>
            The 3DWorkSpace project aims to deliver a platform for reuse of 3D
            models and collaboration, by adapting the open-source Voyager 3D
            digital museum curation tool suite. This way, interactive engagement
            with traditionally complex digital datasets can be promoted.
            Embedded structured guidance, or Learning Pathways, will be
            generated to provide training for gaining competence and skills for
            interpreting 3D datasets. Through the creation of annotated personal
            3D collections that can be tailored to specific learning goals or
            interests, broader narratives can be generated and new avenues for
            knowledge publication opened up.
          </p>

          <Row>
            <Col sm>
              <Link href="/models" passHref>
                <Card className="landing-card landing-press">
                  <Card.Img variant="top" src="placeholder.jpg" />
                  <Card.Body>
                    <Card.Title>Browse Models</Card.Title>
                    <Card.Text></Card.Text>
                  </Card.Body>
                </Card>
              </Link>
            </Col>
            <Col sm>
              <Link href="/collections" passHref>
                <Card className="landing-card landing-press">
                  <Card.Img variant="top" src="placeholder.jpg" />
                  <Card.Body>
                    <Card.Title>Browse Collections</Card.Title>
                    <Card.Text></Card.Text>
                  </Card.Body>
                </Card>
              </Link>
            </Col>
          </Row>
        </div>
      </Col>
    </Row>
  );
}
