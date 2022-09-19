import React, { useEffect } from 'react';
import { Popover as BootstrapPopover } from 'react-bootstrap';

// This is used to force the popover to re-render to adjust correctly to the label's position
const Popover = React.forwardRef(({ popper, children, ...props }, ref) => {
  useEffect(() => {
    setTimeout(() => {
      popper.scheduleUpdate();
    }, 0);
  }, [children, popper]);

  return (
    <div className="bootstrap">
      <BootstrapPopover ref={ref} {...props}>
        {children}
      </BootstrapPopover>
    </div>
  );
});

Popover.displayName = 'Popover';

export default Popover;
