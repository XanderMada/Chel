import React, { FC, HTMLAttributes } from 'react';
import styled from 'styled-components';

export type TabPanelProps = HTMLAttributes<HTMLDivElement> & {
  index: number;
  value: number;
};

const Base = styled.div`
  flex: 1 1 auto;
  width: auto;
  height: auto;

  overflow: auto;
`;

export const TabPanel: FC<TabPanelProps> = ({ children, value, index, ...other }) => {
  return (
    <Base hidden={value !== index} {...other}>
      {value === index && children}
    </Base>
  );
};
