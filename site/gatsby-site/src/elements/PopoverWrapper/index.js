import React, { useEffect } from 'react';
import { Popover } from 'react-bootstrap';

// This is used to force the popover to re-render to adjust correctly to the label's position
const PopoverWrapper = React.forwardRef(({ popper, children, ...props }, ref) => {
  useEffect(() => {
    setTimeout(() => {
      popper.scheduleUpdate();
    }, 0);
  }, [children, popper]);

  return (
    <div className="bootstrap">
      <Popover ref={ref} {...props}>
        {children}
      </Popover>
    </div>
  );
});

PopoverWrapper.displayName = 'PopoverWrapper';

export default PopoverWrapper;
