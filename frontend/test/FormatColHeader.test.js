import React from 'react';
import { expect } from 'chai';
import { shallow, mount, render } from 'enzyme';
import FormatColHeader from '../components/FormatColHeader/FormatColHeader';

const props = {
  label: 'ID',
  sortingState: {
    rows: [
      { id: 103, name: 'Anh', tools: { hammer: true }, country: 'fi' },
      { id: 101, name: 'Jack', tools: { hammer: false }, country: 'dk' },
      { id: 102, name: 'Jill', tools: { hammer: true }, country: 'in ' },
      { id: 100, name: 'Jack', tools: { hammer: false }, country: 'dk' },
      { id: 104, name: 'Jack', tools: { hammer: false }, country: 'dk' },
      { id: 105, name: 'Adam', tools: { hammer: false }, country: 'dk' },
    ],
    currentSortType: 0,
    isMultiSortActive: false,
    multiSortKeyMap: [],
  },
};
describe('Test FormatColHeader', function() {
  before(function() {});

  it('FormatColHeader is rendered properly', function() {
    const colHeader = mount(
      <FormatColHeader sortingState={props.sortingState} label={props.label} />
    );
    expect(colHeader.find('.style_sort-by')).to.have.length(1);
  });
});
