import * as React from 'react';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import SearchIcon from '@mui/icons-material/Search';
import IconButton from '@mui/material/IconButton';
import { useState } from 'react';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';

function SearchAndSort(props) {
    const [serchText, setSearchText] = useState('')
    const [category, setCategory] = useState('');
    const [sort, setSort] = useState('');


    function SearchItem() {
        console.log(serchText);
        console.log(category);
        console.log(sort);

    }
    return (
        <Box
            component="form"
            sx={{
                marginTop: 2,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between'

            }}
            noValidate
            autoComplete="off"
        >
            <div style={{ border: '1px solid #2F343A', display: 'flex', padding: '10px', gap: 2, alignItems: 'center' }} >
                <TextField label="Search" color="primary" onChange={(e) => setSearchText(e.target.value)} />
                <IconButton aria-label="delete" sx={{ width: '40px', height: '40px' }} onClick={SearchItem}>
                    <SearchIcon />
                </IconButton>
            </div>
            <div style={{ border: '1px solid #2F343A', display: 'flex', gap: 2, alignItems: 'center' }} >
                <FormControl variant="filled" sx={{ m: 1, minWidth: 180 }}>
                    <InputLabel id="demo-simple-select-filled-label">category</InputLabel>
                    <Select
                        labelId="demo-simple-select-filled-label"
                        id="demo-simple-select-filled"
                        value={category}
                        onChange={(e) => setCategory(e.target.value)}
                    >
                        {props.myCategories.map((i) =>
                            <MenuItem key={i._id} value={i.categoryName}>{i.categoryName}</MenuItem>
                        )}
                    </Select>
                </FormControl>

                <FormControl variant="filled" sx={{ m: 1, minWidth: 80 }}>
                    <InputLabel id="demo-simple-select-filled-label">Sort</InputLabel>
                    <Select
                        labelId="demo-simple-select-filled-label"
                        id="demo-simple-select-filled"
                        value={sort}
                        onChange={(e) => setSort(e.target.value)}
                    >
                        <MenuItem value={'asc'}>ASC</MenuItem>
                        <MenuItem value={'desc'}>DESC</MenuItem>
                    </Select>
                </FormControl>
                <IconButton aria-label="delete" sx={{ width: '40px', height: '40px' }} onClick={SearchItem}>
                    <SearchIcon />
                </IconButton>
            </div>
        </Box>
    )
}
export default SearchAndSort