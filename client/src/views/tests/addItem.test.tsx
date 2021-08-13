import * as React from 'react';
import { ReactDOM } from 'react';
import Additem from '../additem';
import { render, RenderResult, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';

it('renders Add Item view', () => {
    let r: RenderResult = render(
    <BrowserRouter>
    <Additem />
    </BrowserRouter>
    );
    
    expect(screen.getByText('Add product')).toBeInTheDocument();
    expect(r.baseElement.getElementsByTagName('TextField').length > 0);
    expect(r.baseElement.getElementsByTagName('Button').length > 0);
  });
  