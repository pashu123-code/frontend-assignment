import React from 'react';
import { expect } from 'chai';
import { shallow, mount, render } from 'enzyme';
import SortReducer from '../components/Global/SortReducer';

function jsonEqual(a, b) {
  return JSON.stringify(a) === JSON.stringify(b);
}

describe('Test SortReducer: ', function() {
  it('Default state(UNSORTED) to ASC', function() {
    let action = {
      type: 'SORT_ROW',
      label: 'name',
    };
    const currentState = {
      rows: [
        { id: 103, name: 'Anh', tools: { hammer: true }, country: 'fi' },
        { id: 101, name: 'Jack', tools: { hammer: false }, country: 'dk' },
        { id: 102, name: 'Jill', tools: { hammer: true }, country: 'in' },
        { id: 100, name: 'Jack', tools: { hammer: false }, country: 'dk' },
        { id: 104, name: 'Jack', tools: { hammer: false }, country: 'dk' },
        { id: 105, name: 'Adam', tools: { hammer: false }, country: 'dk' },
      ],
      currentSortType: 0,
      isMultiSortActive: false,
      multiSortKeyMap: [],
    };
    let expectedState = {
      rows: [
        { id: 105, name: 'Adam', tools: { hammer: false }, country: 'dk' },
        { id: 103, name: 'Anh', tools: { hammer: true }, country: 'fi' },
        { id: 101, name: 'Jack', tools: { hammer: false }, country: 'dk' },
        { id: 100, name: 'Jack', tools: { hammer: false }, country: 'dk' },
        { id: 104, name: 'Jack', tools: { hammer: false }, country: 'dk' },
        { id: 102, name: 'Jill', tools: { hammer: true }, country: 'in' },
      ],
      currentSortType: 1,
      multiSortKeyMap: [],
      currentSortingKey: 'name',
    };
    // console.log(JSON.stringify(SortReducer(state, action)));
    expect(jsonEqual(expectedState, SortReducer(currentState, action))).to.be
      .true;
  });

  it('Test MySortingTable: ASC to DSC', function() {
    let action = {
      type: 'SORT_ROW',
      label: 'name',
    };
    let currentState = {
      rows: [
        { id: 105, name: 'Adam', tools: { hammer: false }, country: 'dk' },
        { id: 103, name: 'Anh', tools: { hammer: true }, country: 'fi' },
        { id: 101, name: 'Jack', tools: { hammer: false }, country: 'dk' },
        { id: 100, name: 'Jack', tools: { hammer: false }, country: 'dk' },
        { id: 104, name: 'Jack', tools: { hammer: false }, country: 'dk' },
        { id: 102, name: 'Jill', tools: { hammer: true }, country: 'in' },
      ],
      currentSortType: 1,
      multiSortKeyMap: [],
      currentSortingKey: 'name',
    };
    const expectedState = {
      rows: [
        { id: 102, name: 'Jill', tools: { hammer: true }, country: 'in' },
        { id: 101, name: 'Jack', tools: { hammer: false }, country: 'dk' },
        { id: 100, name: 'Jack', tools: { hammer: false }, country: 'dk' },
        { id: 104, name: 'Jack', tools: { hammer: false }, country: 'dk' },
        { id: 103, name: 'Anh', tools: { hammer: true }, country: 'fi' },
        { id: 105, name: 'Adam', tools: { hammer: false }, country: 'dk' },
      ],
      currentSortType: 2,
      multiSortKeyMap: [],
      currentSortingKey: 'name',
    };
    // console.log(JSON.stringify(SortReducer(currentState, action)));
    expect(jsonEqual(expectedState, SortReducer(currentState, action))).to.be
      .true;
  });

  it('Test MySortingTable: DSC to UNSORTED', function() {
    let action = {
      type: 'SORT_ROW',
      label: 'name',
    };
    let currentState = {
      rows: [
        { id: 102, name: 'Jill', tools: { hammer: true }, country: 'in' },
        { id: 101, name: 'Jack', tools: { hammer: false }, country: 'dk' },
        { id: 100, name: 'Jack', tools: { hammer: false }, country: 'dk' },
        { id: 104, name: 'Jack', tools: { hammer: false }, country: 'dk' },
        { id: 103, name: 'Anh', tools: { hammer: true }, country: 'fi' },
        { id: 105, name: 'Adam', tools: { hammer: false }, country: 'dk' },
      ],
      currentSortType: 2,
      multiSortKeyMap: [],
      currentSortingKey: 'name',
    };
    const expectedState = {
      rows: [
        { id: 103, name: 'Anh', tools: { hammer: true }, country: 'fi' },
        { id: 101, name: 'Jack', tools: { hammer: false }, country: 'dk' },
        { id: 102, name: 'Jill', tools: { hammer: true }, country: 'in' },
        { id: 100, name: 'Jack', tools: { hammer: false }, country: 'dk' },
        { id: 104, name: 'Jack', tools: { hammer: false }, country: 'dk' },
        { id: 105, name: 'Adam', tools: { hammer: false }, country: 'dk' },
      ],
      currentSortType: 0,
      multiSortKeyMap: [],
      currentSortingKey: 'name',
      isMultiSortActive: false,
    };
    // console.log(JSON.stringify(SortReducer(currentState, action)));
    expect(jsonEqual(expectedState, SortReducer(currentState, action))).to.be
      .true;
  });

  it('Test MySortingTable: ctrl+click ID', function() {
    let action = {
      type: 'SORT_ROW',
      label: 'name',
      isMultiSort: true,
    };
    let currentState = {
      rows: [
        { id: 103, name: 'Anh', tools: { hammer: true }, country: 'fi' },
        { id: 101, name: 'Jack', tools: { hammer: false }, country: 'dk' },
        { id: 102, name: 'Jill', tools: { hammer: true }, country: 'in' },
        { id: 100, name: 'Jack', tools: { hammer: false }, country: 'dk' },
        { id: 104, name: 'Jack', tools: { hammer: false }, country: 'dk' },
        { id: 105, name: 'Adam', tools: { hammer: false }, country: 'dk' },
      ],
      currentSortType: 0,
      isMultiSortActive: false,
      multiSortKeyMap: new Map(),
    };

    const expectedState = {
      rows: [
        { id: 105, name: 'Adam', tools: { hammer: false }, country: 'dk' },
        { id: 103, name: 'Anh', tools: { hammer: true }, country: 'fi' },
        { id: 101, name: 'Jack', tools: { hammer: false }, country: 'dk' },
        { id: 100, name: 'Jack', tools: { hammer: false }, country: 'dk' },
        { id: 104, name: 'Jack', tools: { hammer: false }, country: 'dk' },
        { id: 102, name: 'Jill', tools: { hammer: true }, country: 'in' },
      ],
      currentSortType: 1,
      isMultiSortActive: true,
      multiSortKeyMap: [['name', { sortType: 1, keyOrder: 1 }]],
    };
    // console.log(JSON.stringify(SortReducer(currentState, action)));
    expect(jsonEqual(expectedState, SortReducer(currentState, action))).to.be
      .true;
  });
});
