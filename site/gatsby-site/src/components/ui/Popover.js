import React from 'react';
import { Popover as BSPopOver } from 'react-bootstrap';

const Popover = ({ title, text }) => (
  <BSPopOver id="popover-basic">
    <BSPopOver.Header as="h3">{title}</BSPopOver.Header>
    <BSPopOver.Body>{text}</BSPopOver.Body>
  </BSPopOver>
);

export default Popover;
