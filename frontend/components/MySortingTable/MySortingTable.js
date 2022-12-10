import React from 'react';
import { connect } from 'react-redux';
import * as Table from 'reactabular-table';
import FormatColHeader from '../FormatColHeader/FormatColHeader.js';

const Countries = {
  fi: 'Finland',
  dk: 'Denmark',
  in: 'India',
};
/* MySortingTable : For multi column selection, altKey is used to support in Mac machines.
    because ctrl + click = rightclick in Mac
  */
function MySortingTable(props) {
  function getColumns() {
    return [
      {
        property: 'id',
        header: {
          label: 'ID',
          transforms: [
            label => ({
              onClick: event => {
                event.stopPropagation();

                props.sortTable(label, event.altKey || event.ctrlKey);
              },
            }),
          ],
          formatters: [
            label => (
              <FormatColHeader sortingState={props.sorting} label={label} />
            ),
          ],
        },
      },
      {
        property: 'name',
        header: {
          label: 'Name',
          transforms: [
            label => ({
              onClick: event => {
                event.stopPropagation();
                props.sortTable(label, event.altKey || event.ctrlKey);
              },
            }),
          ],
          formatters: [
            label => (
              <FormatColHeader sortingState={props.sorting} label={label} />
            ),
          ],
        },
      },
      {
        property: 'tools',
        header: {
          label: 'Active',
          transforms: [
            label => ({
              onClick: event => {
                event.stopPropagation();
                props.sortTable('tools', event.altKey || event.ctrlKey);
              },
            }),
          ],
          formatters: [
            label => (
              <FormatColHeader
                sortingState={props.sorting}
                property="tools"
                label={label}
              />
            ),
          ],
        },
        cell: {
          formatters: [tools => (tools.hammer ? 'Hammertime' : 'nope')],
        },
      },
      {
        property: 'country',
        header: {
          label: 'Country',
          transforms: [
            label => ({
              onClick: event => {
                event.stopPropagation();
                props.sortTable(label, event.altKey || event.ctrlKey);
              },
            }),
          ],
          formatters: [
            country => (
              <FormatColHeader sortingState={props.sorting} label={country} />
            ),
          ],
        },
        cell: {
          formatters: [country => Countries[country]],
        },
      },
    ];
  }

  const { columns } = getColumns();
  const { rows } = props.sorting;

  return (
    <div>
      <Table.Provider
        className="table table-striped table-bordered"
        columns={getColumns()}
      >
        <Table.Header />
        <Table.Body rows={rows} rowKey="id" />
      </Table.Provider>
    </div>
  );
}

const mapStateToProps = ({ sorting }) => {
  return { sorting: sorting };
};
const mapDispatchToProps = dispatch => ({
  sortTable: (label, isMultiSort) =>
    dispatch({
      type: 'SORT_ROW',
      label,
      isMultiSort,
    }),
});

const ConnectedSortTable = connect(
  mapStateToProps,
  mapDispatchToProps
)(MySortingTable);

export default ConnectedSortTable;
