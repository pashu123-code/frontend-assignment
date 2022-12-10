import update from 'immutability-helper';
import rowData from './MockData.js';

//
export const sortTypes = Object.freeze({ UNSORTED: 0, ASC: 1, DSC: 2 });
const NUMBER_OF_STATES = 3;
const NUMBER_OF_COLUMNS = 4;

let initialState = {
  rows: rowData.slice(),
  currentSortType: sortTypes.UNSORTED, // used for one col sort
  currentSortingKey: undefined, //used for one column sort
  isMultiSortActive: false,
  multiSortKeyMap: new Map(),
};

/* Sorting algorithm using JS Array.sort() */
var sort_by = function(field, sortType, primer) {
  var key = primer
    ? function(x) {
        return primer(x[field]);
      }
    : function(x) {
        return x[field];
      };

  let reverse = sortType === sortTypes.ASC ? 1 : -1;

  return function(a, b) {
    if (typeof a === 'boolean') {
      return a === b ? 0 : reverse * x ? 1 : -1;
    }
    return (a = key(a)), (b = key(b)), reverse * ((a > b) - (b > a));
  };
};

/* Get the unsortedlist with all the default values */
const getUnsortedList = (state, label) =>
  update(state, {
    rows: {
      $set: rowData.slice(),
    },
    currentSortingKey: {
      $set: label,
    },
    currentSortType: {
      $set: sortTypes.UNSORTED,
    },
    isMultiSortActive: {
      $set: false,
    },
    multiSortKeyMap: new Map(),
  });

const getNextSortType = sortType => {
  return (sortType + 1) % NUMBER_OF_STATES;
};
/* GetNextKeyOrder: This function returns the property order when multi column sort is selected
using ctrl+click on multiple columns */
const getNextKeyOrder = (sortKeyMap, label) => {
  let nextKeyOrder = 1;
  for (const [key, entry] of sortKeyMap) {
    if (key === label) {
      return entry.keyOrder;
    } else if (
      entry.keyOrder >= nextKeyOrder &&
      entry.keyOrder < NUMBER_OF_COLUMNS
    ) {
      nextKeyOrder = entry.keyOrder + 1;
    }
  }
  return nextKeyOrder;
};
const getSortedList = ({ state, label, primer, isMultiSort }) => {
  const nextSortType = getNextSortType(state.currentSortType);
  return update(state, {
    rows: {
      $set: rowData
        .slice()
        .sort(sort_by(label.toLowerCase(), nextSortType, primer)),
    },
    currentSortType: {
      $set: nextSortType,
    },
    isMultiSortActive: {
      $set: isMultiSort,
    },
    currentSortingKey: {
      $set: !isMultiSort ? label : undefined,
    },
    multiSortKeyMap: {
      $set: !isMultiSort ? new Map() : state.multiSortKeyMap,
    },
  });
};

const getMultiSortedList = ({ state, label, primer }) => {
  let sortedKey = state.multiSortKeyMap.get(label);
  let currentSortType = sortedKey ? sortedKey.sortType : sortTypes.UNSORTED;
  const keyOrder = getNextKeyOrder(state.multiSortKeyMap, label);
  return update(state, {
    rows: {
      $set: state.rows
        .slice()
        .sort(
          sort_by(
            label.toLowerCase(),
            getNextSortType(state.currentSortType),
            primer
          )
        ),
    },
    currentSortingKey: {
      $set: undefined,
    },
    multiSortKeyMap: {
      $set: state.multiSortKeyMap.set(label, {
        sortType: getNextSortType(state.currentSortType),
        keyOrder: keyOrder,
      }),
    },
  });
};

const handleMultiSort = (state, label) => {
  let finalState = state;
  if (!state.isMultiSortActive) {
    // Multi column sort selected and this is the first column click after pressing ctrl
    finalState = update(getSortedList({ state, label, isMultiSort: true }), {
      multiSortKeyMap: {
        $set: state.multiSortKeyMap.set(label, {
          sortType: sortTypes.ASC,
          keyOrder: getNextKeyOrder(state.multiSortKeyMap, label),
        }),
      },
    });
  } else {
    //already few columns sorted based on multi col selection ( ctrl + click)
    finalState = getMultiSortedList({ state, label });
  }
  return finalState;
};

function SortReducer(sortState = initialState, action) {
  let finalState;
  switch (action.type) {
    case 'SORT_ROW':
      if (action.isMultiSort) {
        finalState = handleMultiSort(sortState, action.label);
      } else if (
        getNextSortType(sortState.currentSortType) === sortTypes.UNSORTED
      ) {
        finalState = getUnsortedList(sortState, action.label);
      } else {
        let primer;
        if (action.label.toLowerCase() === 'tools') {
          primer = cell => cell.hammer;
        }
        finalState = getSortedList({
          state: sortState,
          label: action.label,
          primer,
        });
      }
      break;
    default:
      finalState = sortState;
      break;
  }
  return finalState;
}
export default SortReducer;
