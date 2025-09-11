import { render } from '@testing-library/react';
import React from 'react';
import TeamsScreen from '../(tabs)/teams';

test('shows NFL text', () => {
  const { getByText } = render(<TeamsScreen />);
  expect(getByText('NFL')).toBeTruthy();
});
