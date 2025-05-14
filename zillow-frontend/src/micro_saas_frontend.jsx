import { useState } from 'react';
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
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import CircularProgress from '@mui/material/CircularProgress';
import Link from '@mui/material/Link';
import CssBaseline from '@mui/material/CssBaseline';
import { createTheme, ThemeProvider } from '@mui/material/styles';

const darkTheme = createTheme({ palette: { mode: 'dark' } });

export default function ZillowSearchApp() {
  const [state, setState] = useState('');
  const [last, setLast] = useState('');
  const [secondLast, setSecondLast] = useState('');
  const [thirdLast, setThirdLast] = useState('');
  const [results, setResults] = useState([]);
  const [orderBy, setOrderBy] = useState('');
  const [order, setOrder] = useState('asc');
  const [loading, setLoading] = useState(false);

  const handleSearch = async () => {
    const params = new URLSearchParams();
    if (state) params.append('state', state);
    if (last) params.append('last', last);
    if (secondLast) params.append('second_last', secondLast);
    if (thirdLast) params.append('third_last', thirdLast);

    setLoading(true);
    const res = await fetch(`http://127.0.0.1:8000/search?${params.toString()}`);
    const data = await res.json();
    setResults(data);
    setLoading(false);
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
    <ThemeProvider theme={darkTheme}>
    <CssBaseline />
    <Container maxWidth="lg">
      <Box py={5} textAlign="center">
        <Typography variant="h4" gutterBottom>
          Zillow Market Forecast Search
        </Typography>
        <Typography variant="subtitle1" color="textSecondary">
          Explore housing price trends by state and prediction period
        </Typography>
      </Box>
      <Box mb={4}>
        <Grid container spacing={2} justifyContent="center">
          <Grid item xs={12} sm={6} md={3}>
            <TextField
              label="State Name"
              value={state}
              onChange={(e) => setState(e.target.value)}
              helperText="Enter a state code like TX or NC"
              fullWidth
              variant="outlined"
            />
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <TextField
              label="Near Future Prediction"
              value={thirdLast}
              onChange={(e) => setThirdLast(e.target.value)}
              helperText="Enter a filter like >0.3 or <=1.2"
              fullWidth
              variant="outlined"
            />
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <TextField
              label="Next 6 months prediction"
              value={secondLast}
              onChange={(e) => setSecondLast(e.target.value)}
              helperText="Enter a filter like >0.3 or <=1.2"
              fullWidth
              variant="outlined"
            />
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <TextField
              label="Next 9-12 months prediction"
              value={last}
              onChange={(e) => setLast(e.target.value)}
              helperText="Enter a filter like >0.3 or <=1.2"
              fullWidth
              variant="outlined"
            />
          </Grid>
          <Grid item xs={12} textAlign="center">
            <Button variant="contained" color="primary" onClick={handleSearch}>
              Search
            </Button>
          </Grid>
        </Grid>
      </Box>
      {results.length === 0 ? (
        loading ? (
          <Box textAlign="center" my={4}><CircularProgress /></Box>
        ) : (
          <Typography align="center" color="textSecondary">No results found.</Typography>
        )
      ) : (

        <TableContainer component={Paper} elevation={3}>
          <Table size="small">
            <TableHead>
              <TableRow>
                {columns.map((column) => (
                  <TableCell key={column} style={{ fontWeight: 'bold' }}>
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
                <TableRow key={index} hover>
                  {columns.map((col) => (
                    <TableCell key={col}>{row[col]}</TableCell>
                  ))}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}
    <Box mt={6} textAlign="center">
        <Typography variant="body2" color="textSecondary">
          This site uses public forecast data provided by{' '}
          <Link href="https://files.zillowstatic.com/research/public_csvs/zhvf_growth/Metro_zhvf_growth_uc_sfrcondo_tier_0.33_0.67_sm_sa_month.csv?t=1741754571" target="_blank" rel="noopener">
            Zillow
          </Link>
          .
        </Typography>
      </Box>
    </Container>
    </ThemeProvider>
  );
}
