import * as React from 'react';
import { ReactDOM } from 'react';
import Register from '../register';
import { render, RenderResult, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';

it('renders Register view', () => {
    let r: RenderResult = render(
    <BrowserRouter>
    <Register />
    </BrowserRouter>
    );
  });