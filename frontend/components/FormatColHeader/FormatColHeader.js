import React, { Fragment } from 'react';
import Styles from './style.css';
import { sortTypes } from '../Global/SortReducer.js';

function FormatColHeader(props) {
  const { sortingState, label, property } = props;
  let sortType = sortTypes.UNSORTED,
    keyOrder;
  if (sortingState.isMultiSortActive) {
    let sortKey =
      sortingState.multiSortKeyMap.get(label) ||
      sortingState.multiSortKeyMap.get(property);
    if (sortKey) {
      sortType = sortKey.sortType;
      keyOrder = sortKey.keyOrder;
    }
  } else if (
    sortingState.currentSortingKey === label ||
    sortingState.currentSortingKey === property
  ) {
    sortType = sortingState.currentSortType;
  }
  let sortTypeToArrowClass =
    `${Styles['sort-by']} ` +
    (sortType === sortTypes.ASC
      ? `${Styles['sort-by-asc']}`
      : sortType === sortTypes.DSC
      ? `${Styles['sort-by-dsc']}`
      : `${Styles['sort-by-asc']} ${Styles['sort-by-dsc']}`);

  return (
    <span className={sortTypeToArrowClass}>
      <span> {label}</span>{' '}
      {keyOrder && <span className={Styles['my-col-header']}> {keyOrder}</span>}
    </span>
  );
}
export default FormatColHeader;
