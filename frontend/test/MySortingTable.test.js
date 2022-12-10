import React from 'react';
import { expect } from 'chai';
import { shallow, mount, render } from 'enzyme';
import { Provider } from 'react-redux';
import { createStore, combineReducers, applyMiddleware } from 'redux';
import { syncHistoryWithStore, routerReducer } from 'react-router-redux';
import rootReducer from 'Global/RootReducer.js';
import MySortingTable from 'MySortingTable/MySortingTable';
import SortReducer from '../components/Global/SortReducer';

const store = createStore(
  combineReducers({
    app: rootReducer,
    sorting: SortReducer,
    routing: routerReducer,
  }),
  {} // initial state
);
describe('Test MySortingTable', function() {
  before(function() {});

  it('MySortingTable is rendered properly', function() {
    const input = mount(
      <Provider store={store}>
        <MySortingTable />
      </Provider>
    );
    console.log(input.find('*'));
    expect(input.find('thead tr')).to.have.length(1);
    expect(input.find('tbody tr')).to.have.length(6);
  });
});
