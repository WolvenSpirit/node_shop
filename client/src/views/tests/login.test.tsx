import * as React from 'react';
import { ReactDOM } from 'react';
import Login from '../login';
import { render, RenderResult, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';

it('renders Login view', () => {
    let r: RenderResult = render(
    <BrowserRouter>
    <Login />
    </BrowserRouter>
    );
  });