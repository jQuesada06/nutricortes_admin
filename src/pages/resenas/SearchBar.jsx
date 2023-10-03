import React, { useState } from 'react';
import { TextField, IconButton, Button } from '@mui/material';
import { Search, Clear } from '@mui/icons-material';

const SearchBar = ({ onSearch }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [isSearching, setIsSearching] = useState(false);

  const handleSearch = () => {
    onSearch(searchTerm);
    setIsSearching(true);
  };

  const handleClear = () => {
    setSearchTerm('');
    setIsSearching(false);
    onSearch('');
  };

  return (
    <div className="search-bar">
      <div style={{ display: 'flex', alignItems: 'center' }}>

        <TextField
          label="Buscar"
          variant="outlined"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          style={{  marginRight: '2px' }}
           size="small"
        />
        <Button
          variant="contained"
          color="primary"
          style={{ minWidth: 0, width: '40px', height: '40px' }}
          onClick={isSearching ? handleClear : handleSearch}
        >
          {isSearching ? <Clear /> : <Search />}
        </Button>
      </div>
    </div>
  );
};

export default SearchBar;