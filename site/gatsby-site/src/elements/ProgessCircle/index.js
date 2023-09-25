import React, { useEffect, useState } from 'react';

const ProgressCircle = ({
  percentage,
  size = 50,
  strokeWidth = 5,
  className = '',
  color = null,
}) => {
  const [offset, setOffset] = useState(0);

  useEffect(() => {
    const progress = percentage / 100;

    const circumference = 2 * Math.PI * (size / 2 - strokeWidth / 2);

    setOffset(circumference * (1 - progress));
  }, [size, strokeWidth, percentage]);

  return (
    <svg className={`circular-progress ${className}`} width={size} height={size}>
      <circle
        className="progress-background"
        cx={size / 2}
        cy={size / 2}
        r={size / 2 - strokeWidth / 2}
        stroke="#e6e6e6"
        strokeWidth={strokeWidth}
        fill="transparent"
      />
      <circle
        className="progress"
        cx={size / 2}
        cy={size / 2}
        r={size / 2 - strokeWidth / 2}
        strokeWidth={strokeWidth}
        strokeDasharray={`${2 * Math.PI * (size / 2 - strokeWidth / 2)} ${
          2 * Math.PI * (size / 2 - strokeWidth / 2)
        }`}
        strokeDashoffset={offset}
        stroke={color || '#00b4d8'}
        fill="transparent"
      />
      <text x={size / 2} y={size / 2} textAnchor="middle" dominantBaseline="central">
        {percentage}%
      </text>
    </svg>
  );
};

export default ProgressCircle;
