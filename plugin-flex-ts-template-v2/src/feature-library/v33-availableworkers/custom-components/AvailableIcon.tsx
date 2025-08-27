import React from 'react';

interface ComponentProps {
  color: string;
  number: number;
  info: string;
}

export default function AvailableIcon(props: ComponentProps) {
  // const {color, number,info}=props;

  return (
    <div
      style={{
        width: '30%',
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-around',
        alignItems: 'center',
      }}
      title={props.info}
    >
      <div
        style={{
          backgroundColor: props.color,
          width: 20,
          height: 20,
          borderRadius: 10,
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        {props.number}
      </div>
    </div>
  );
}
