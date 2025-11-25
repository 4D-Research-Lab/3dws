import Link from 'next/link';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Card from 'react-bootstrap/Card';
export default function Home() {
  return (
    <Row>
      <Col md={{ span: 9, offset: 2 }}>
        <div>
          <h1>About</h1>
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
          <h1>Credits</h1>
          <p>
            Dr Jill Hilditch, Associate Professor in Archaeology, ACASA, UvA,
            ceramic analysis and technology of the Aegean Bronze Age;
          </p>
          <p>
            Dr Jitte Waagen, digital archaeologist at ACASA, coordinator of the
            4DRL, AIHR, UvA;
          </p>
          <p>
            Dr Hugo Huurdeman, Assistant Professor, Department of
            Technology-Enhanced Learning and Innovation, OU, and freelance
            designer;
          </p>
          <p>
            Tijm Lanjouw MA, senior 3D technician and modeller at the 4DRL,
            AIHR, UvA;
          </p>
          <p>
            Dr Caroline Campolo-Jeffra, digital heritage professional and
            ceramic specialist;
          </p>
          <p>Saan Rashid MSc, software engineer for CREATE, UvA;</p>
          <p>Markus Stoffer, developer for 4DRL, UvA;</p>
          <p>Ivan Kisjes MA, software engineer for CREATE, UvA;</p>
        </div>
      </Col>
    </Row>
  );
}
