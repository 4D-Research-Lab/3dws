export default function ListCollectionDescription({ data }) {
  const { title, creator, timeStamp, lastEdit, description, access } = data;
  return (
    <ul className="list-unstyled">
      {title && (
        <li className="mt-3">
          <strong>Title</strong>
          <span className="d-block">{title}</span>
        </li>
      )}
      {creator && (
        <li className="mt-3">
          <strong>Creator</strong>
          <span className="d-block">{creator}</span>
        </li>
      )}
      {timeStamp && (
        <>
          <li className="mt-3">
            <strong>Created</strong>
            <span className="d-block">
              {new Date(timeStamp).toLocaleDateString('nl-NL')}
            </span>
          </li>
          <li className="mt-3">
            <strong>Last edit:</strong>
            <span className="d-block">
              {new Date(lastEdit).toLocaleDateString('nl-NL')}
            </span>
          </li>
        </>
      )}
      {description && (
        <li className="mt-3">
          <strong>Description</strong>
          <span className="d-block">{description}</span>
        </li>
      )}
      <li className="mt-3">
        <strong>Access</strong>
        <span className="d-block">{access ? 'Public' : 'Private'}</span>
      </li>
    </ul>
  );
}
