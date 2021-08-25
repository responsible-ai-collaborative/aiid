import React from 'react';
import { Popover as BSPopOver } from 'react-bootstrap';

const Popover = (title, text) => (
  <BSPopOver id="popover-basic">
    <BSPopOver.Title as="h3">{title}</BSPopOver.Title>
    <BSPopOver.Content>{text}</BSPopOver.Content>
  </BSPopOver>
);

export default Popover;
