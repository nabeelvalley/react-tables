import React from 'react'
import Table, { SearchableTable } from './Table'
import data from './data'
import headers from './headers'
import './App.css'

function App() {
  return (
    <main>
      <SearchableTable headers={headers} rows={data} />
    </main>
  )
}

export default App
