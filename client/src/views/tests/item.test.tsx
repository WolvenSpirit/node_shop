import * as React from 'react';
import { ReactDOM } from 'react';
import Item from '../item';
import { render, RenderResult, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';

it('renders Item view', () => {
    let r: RenderResult = render(
    <BrowserRouter>
    <Item />
    </BrowserRouter>
    );
  });