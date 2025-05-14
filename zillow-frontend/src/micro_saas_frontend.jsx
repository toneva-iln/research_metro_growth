import { useState } from 'react';
import React from 'react';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import TableSortLabel from '@mui/material/TableSortLabel';
import './App.css';

export default function ZillowSearchApp() {
  const [state, setState] = useState('');
  const [last, setLast] = useState('');
  const [secondLast, setSecondLast] = useState('');
  const [thirdLast, setThirdLast] = useState('');
  const [results, setResults] = useState([]);
  const [orderBy, setOrderBy] = useState('');
  const [order, setOrder] = useState('asc');

  const handleSearch = async () => {
    const params = new URLSearchParams();
    if (state) params.append('state', state);
    if (last) params.append('last', last);
    if (secondLast) params.append('second_last', secondLast);
    if (thirdLast) params.append('third_last', thirdLast);

    const res = await fetch(` http://127.0.0.1:8000/search?${params.toString()}`);
    const data = await res.json();
    setResults(data);
  };

  const handleSort = (column) => {
    const isAsc = orderBy === column && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(column);
    const sorted = [...results].sort((a, b) => {
      if (a[column] < b[column]) return isAsc ? -1 : 1;
      if (a[column] > b[column]) return isAsc ? 1 : -1;
      return 0;
    });
    setResults(sorted);
  };

  const columns = results.length > 0 ? Object.keys(results[0]) : [];

  return (
    <div className="p-6 space-y-6 max-w-6xl mx-auto">
      <h1 className="text-2xl font-bold">Zillow Case Search</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <TextField label="State Name" value={state} onChange={(e) => setState(e.target.value)} />
        <TextField label="Near Future Prediction" value={last} onChange={(e) => setLast(e.target.value)} />
        <TextField label="Next 6 months prediction" value={secondLast} onChange={(e) => setSecondLast(e.target.value)} />
        <TextField label="Next 9-12 months prediction" value={thirdLast} onChange={(e) => setThirdLast(e.target.value)} />
      </div>
      <Button onClick={handleSearch}>Search</Button>
      <div className="space-y-4">
        {results.length === 0 && <p>No results found.</p>}
        {results.length > 0 && (
          <TableContainer component={Paper}>
            <Table size="small">
              <TableHead>
                <TableRow>
                  {columns.map((column) => (
                    <TableCell key={column}>
                      <TableSortLabel
                        active={orderBy === column}
                        direction={orderBy === column ? order : 'asc'}
                        onClick={() => handleSort(column)}
                      >
                        {column}
                      </TableSortLabel>
                    </TableCell>
                  ))}
                </TableRow>
              </TableHead>
              <TableBody>
                {results.map((row, index) => (
                  <TableRow key={index}>
                    {columns.map((col) => (
                      <TableCell key={col}>{row[col]}</TableCell>
                    ))}
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        )}
      </div>
    </div>
  );
}
