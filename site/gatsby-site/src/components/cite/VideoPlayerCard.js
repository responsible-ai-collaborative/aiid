import React, { useState } from 'react';
import VideoPlayer from 'components/cite/VideoPlayer';
import Row from '../../elements/Row';
import Col from '../../elements/Col';
import Card from '../../elements/Card';
import { Trans } from 'react-i18next';

const VideoPlayerCard = ({ videoURLs = [], index = 0, fallback = null }) => {
  if (index >= videoURLs.length) return fallback;
  const [works, setWorks] = useState(true);

  return works ? (
    <Row>
      <Col>
        <Card className="border-1.5 border-border-light-gray rounded-5px shadow-card mt-6">
          <Card.Header className="items-center justify-between">
            <h4 className="m-0">
              <Trans ns="video">Incident Video</Trans>
            </h4>
          </Card.Header>
          <Card.Body className="block">
            <VideoPlayer
              mediaURL={videoURLs[index]}
              onError={() => {
                console.log(`VPC: ${videoURLs[index]} didn't work`);
                setWorks(false);
              }}
            />
          </Card.Body>
        </Card>
      </Col>
    </Row>
  ) : (
    <VideoPlayerCard videoURLs={videoURLs} index={index + 1} fallback={fallback} />
  );
};

export default VideoPlayerCard;
