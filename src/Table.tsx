import React, { useState } from 'react'

interface TableRow {
  [colValue: string]: string | number | boolean
}

interface ColumnMap<T extends TableRow> {
  key: keyof T
  name: string
}

interface TableProps<T extends TableRow> {
  headers: ColumnMap<T>[]
  rows: T[]
}

enum SORT_DIRECTION {
  NONE,
  UP,
  DOWN,
}

interface SortState<T extends TableRow> {
  direction: SORT_DIRECTION
  key: keyof T
}

const Table: React.FC<TableProps<any>> = ({ headers, rows }) => {
  const headerKeys = headers.map((h) => h.key)[0]

  const [sortState, setSortState] = useState<SortState<any>>({
    direction: SORT_DIRECTION.NONE,
    key: headerKeys[0],
  })

  const sortUp = (key: string, rows: TableRow[]) =>
    rows.sort((r1, r2) => (r1[key] > r2[key] ? -1 : 1))

  const sortDown = (key: string, rows: TableRow[]) =>
    rows.sort((r1, r2) => (r1[key] > r2[key] ? 1 : -1))

  const sortedRows =
    sortState.direction === SORT_DIRECTION.NONE
      ? rows
      : sortState.direction === SORT_DIRECTION.UP
      ? sortUp(sortState.key, rows)
      : sortDown(sortState.key, rows)

  return (
    <table>
      <thead>
        <tr>
          {headers.map((h) => (
            <th key={h.key}>
              <button
                onClick={() =>
                  setSortState({ key: h.key, direction: SORT_DIRECTION.UP })
                }
              >
                🔼
              </button>
              <button
                onClick={() =>
                  setSortState({ key: h.key, direction: SORT_DIRECTION.DOWN })
                }
              >
                🔽
              </button>
              {h.name}
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        {sortedRows.map((r, i) => {
          const colKeys = headers.map((h) => h.key)

          return (
            <tr key={i}>
              {colKeys.map((c, j) => (
                <td key={j}>{r[c]}</td>
              ))}
            </tr>
          )
        })}
      </tbody>
    </table>
  )
}

const filterRows = (q, rows) =>
  rows.filter(
    (r) =>
      Object.values(r).filter(
        (v) =>
          v !== undefined &&
          v.toString().toLowerCase().includes(q.toLowerCase()),
      ).length > 0,
  )

// from stackoverflow:
// https://stackoverflow.com/questions/45198001/replace-subsring-by-an-html-tag-in-react
const markText = (q, t) => {
  let strArr = (t || '').toString().split(new RegExp(`(${q})`, 'ig'))
  return strArr.map((ea, i) => {
    if (ea.toLowerCase() === q.toLowerCase()) {
      return <mark key={i}>{ea}</mark>
    } else {
      return ea
    }
  })
}

const markRow = (q, row) => {
  const keys = Object.keys(row)
  const objects = keys.map((k) => ({ [k]: markText(q, row[k]) }))
  return Object.assign(...objects)
}

export const SearchableTable: React.FC<TableProps<any>> = (props) => {
  const [query, setQuery] = useState<string>('')

  const filteredRows = query !== '' ? filterRows(query, props.rows) : props.rows

  const markedRows = filteredRows.map((r) => markRow(query, r))

  return (
    <>
      <input value={query} onChange={(e) => setQuery(e.target.value)} />
      {markedRows.length > 0 ? (
        <Table {...props} rows={markedRows} />
      ) : (
        <p>No results</p>
      )}
    </>
  )
}

export default Table
