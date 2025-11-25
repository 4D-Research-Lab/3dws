import React from 'react';
import { Card, Button } from 'react-bootstrap';

export default function VoyagerExplorerCard({
  children,
  title,
  creator,
  filename,
  description = undefined,
}) {
  return (
    <Card className="spacing">
      <Card.Body>
        <Card.Title>{title}</Card.Title>
        {creator && (
          <Card.Subtitle className="mb-2 text-muted">{creator}</Card.Subtitle>
        )}
        {description && <Card.Text>{description}</Card.Text>}
        <div className="model-explorer-wrapper">{children}</div>
      </Card.Body>
    </Card>
  );
}
