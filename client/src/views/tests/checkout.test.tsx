import * as React from 'react';
import { ReactDOM } from 'react';
import Checkout from '../checkout';
import { render, RenderResult, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';

it('renders Add Item view', () => {
    let r: RenderResult = render(
    
    <Checkout />
    
    );
  });