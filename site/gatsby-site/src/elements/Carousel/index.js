import React from 'react';
import { faArrowCircleLeft, faArrowCircleRight } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

export const CarouselLeftArrow = () => {
  return (
    <FontAwesomeIcon
      icon={faArrowCircleLeft}
      className="h-8 w-8 text-white bg-gray-500 shadow rounded-full"
    />
  );
};

export const CarouselRightArrow = () => {
  return (
    <FontAwesomeIcon
      icon={faArrowCircleRight}
      className="h-8 w-8 text-white bg-gray-500 shadow rounded-full"
    />
  );
};
