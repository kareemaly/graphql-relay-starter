import React from 'react';
import styled from 'styled-components';
import PlusIcon from 'app/components/Blog/Icons/PlusIcon';
import FloatingActionButton from 'material-ui/FloatingActionButton';

const StyledFloatingButton = styled(FloatingActionButton)`
  position: fixed;
  bottom: 15px;
  right: 15px;
`;

export default ({ ...props }) => (
  <StyledFloatingButton {...props}>
    <PlusIcon width={15} height={15} />
  </StyledFloatingButton>
);

