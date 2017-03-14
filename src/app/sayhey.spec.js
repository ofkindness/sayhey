/* eslint-env jasmine */
import React from 'react';
import TestUtils from 'react-dom/lib/ReactTestUtils';
import {Sayhey} from './sayhey';

describe('hello component', () => {
  it('should render sayhey world', () => {
    const sayhey = TestUtils.renderIntoDocument(<Sayhey/>);
    const h1 = TestUtils.findRenderedDOMComponentWithTag(sayhey, 'h1');
    expect(h1.textContent).toEqual('Say hey!');
  });
});
