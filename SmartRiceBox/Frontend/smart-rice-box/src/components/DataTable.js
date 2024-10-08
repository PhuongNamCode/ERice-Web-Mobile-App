import * as React from 'react';
import PropTypes from 'prop-types';
import { alpha } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TablePagination from '@mui/material/TablePagination';
import TableRow from '@mui/material/TableRow';
import TableSortLabel from '@mui/material/TableSortLabel';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Paper from '@mui/material/Paper';
import Checkbox from '@mui/material/Checkbox';
import IconButton from '@mui/material/IconButton';
import Tooltip from '@mui/material/Tooltip';
import FormControlLabel from '@mui/material/FormControlLabel';
import Switch from '@mui/material/Switch';
import DeleteIcon from '@mui/icons-material/Delete';
import FilterListIcon from '@mui/icons-material/FilterList';
import { visuallyHidden } from '@mui/utils';
import Loading from "../components/Loading"
import Modal from '@mui/material/Modal';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import TextField from '@mui/material/TextField';
import Fab from '@mui/material/Fab';

const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 400,
    bgcolor: 'background.paper',
    border: '2px solid #000',
    boxShadow: 24,
    p: 4,
};


function createData(imei, calories, fat, carbs, protein, is_tick) {
    return {
        imei,
        calories,
        fat,
        carbs,
        protein,
        is_tick,
        imei
    };
}

function descendingComparator(a, b, orderBy) {
    if (b[orderBy] < a[orderBy]) {
        return -1;
    }
    if (b[orderBy] > a[orderBy]) {
        return 1;
    }
    return 0;
}

function getComparator(order, orderBy) {
    return order === 'desc'
        ? (a, b) => descendingComparator(a, b, orderBy)
        : (a, b) => -descendingComparator(a, b, orderBy);
}

// Since 2020 all major browsers ensure sort stability with Array.prototype.sort().
// stableSort() brings sort stability to non-modern browsers (notably IE11). If you
// only support modern browsers you can replace stableSort(exampleArray, exampleComparator)
// with exampleArray.slice().sort(exampleComparator)
function stableSort(array, comparator) {
    const stabilizedThis = array.map((el, index) => [el, index]);
    stabilizedThis.sort((a, b) => {
        const order = comparator(a[0], b[0]);
        if (order !== 0) {
            return order;
        }
        return a[1] - b[1];
    });
    return stabilizedThis.map((el) => el[0]);
}

const headCells = [
    {
        id: 'imei',
        numeric: false,
        disablePadding: true,
        label: 'Mã thùng gạo',
    },
    {
        id: 'amount',
        numeric: true,
        disablePadding: false,
        label: 'Số lượng',
    },
    {
        id: 'address',
        numeric: true,
        disablePadding: false,
        label: 'Địa chỉ',
    },
    {
        id: 'phone',
        numeric: true,
        disablePadding: false,
        label: 'Số điện thoại',
    },
    {
        id: 'request',
        numeric: true,
        disablePadding: false,
        label: 'Yêu cầu mua gạo',
    },
];

function EnhancedTableHead(props) {
    const { onSelectAllClick, order, orderBy, numSelected, rowCount, onRequestSort } =
        props;
    const createSortHandler = (property) => (event) => {
        onRequestSort(event, property);
    };

    return (
        <TableHead>
            <TableRow>
                <TableCell padding="checkbox">
                    {/* <Checkbox
                        color="primary"
                        indeterminate={numSelected > 0 && numSelected < rowCount}
                        checked={rowCount > 0 && numSelected === rowCount}
                        onChange={onSelectAllClick}
                        inputProps={{
                            'aria-label': 'select all desserts',
                        }}
                    /> */}
                </TableCell>
                {headCells.map((headCell) => (
                    <TableCell
                        key={headCell.id}
                        align={headCell.numeric ? 'right' : 'left'}
                        padding={headCell.disablePadding ? 'none' : 'normal'}
                        sortDirection={orderBy === headCell.id ? order : false}
                    >
                        <TableSortLabel
                            active={orderBy === headCell.id}
                            direction={orderBy === headCell.id ? order : 'asc'}
                            onClick={createSortHandler(headCell.id)}
                        >
                            {headCell.label}
                            {orderBy === headCell.id ? (
                                <Box component="span" sx={visuallyHidden}>
                                    {order === 'desc' ? 'sorted descending' : 'sorted ascending'}
                                </Box>
                            ) : null}
                        </TableSortLabel>
                    </TableCell>
                ))}
            </TableRow>
        </TableHead>
    );
}

EnhancedTableHead.propTypes = {
    numSelected: PropTypes.number.isRequired,
    onRequestSort: PropTypes.func.isRequired,
    onSelectAllClick: PropTypes.func.isRequired,
    order: PropTypes.oneOf(['asc', 'desc']).isRequired,
    orderBy: PropTypes.string.isRequired,
    rowCount: PropTypes.number.isRequired,
};

function EnhancedTableToolbar(props) {
    const { numSelected } = props;

    return (
        <Toolbar
            sx={{
                pl: { sm: 2 },
                pr: { xs: 1, sm: 1 },
                ...(numSelected > 0 && {
                    bgcolor: (theme) =>
                        alpha(theme.palette.primary.main, theme.palette.action.activatedOpacity),
                }),
            }}
        >
            {numSelected > 0 ? (
                <Typography
                    sx={{ flex: '1 1 100%' }}
                    color="inherit"
                    variant="subtitle1"
                    component="div"
                >
                    {numSelected} selected
                </Typography>
            ) : (
                <Typography
                    sx={{ flex: '1 1 100%' }}
                    variant="h6"
                    id="tableTitle"
                    component="div"
                >
                    Danh sách các thùng gạo sắp hết
                </Typography>
            )}

            {numSelected > 0 ? (
                <Tooltip title="Delete">
                    <IconButton>
                        <DeleteIcon />
                    </IconButton>
                </Tooltip>
            ) : (
                <Tooltip title="Filter list">
                    <IconButton>
                        <FilterListIcon />
                    </IconButton>
                </Tooltip>
            )}
        </Toolbar>
    );
}

EnhancedTableToolbar.propTypes = {
    numSelected: PropTypes.number.isRequired,
};

export default function EnhancedTable() {
    const [order, setOrder] = React.useState('asc');
    const [orderBy, setOrderBy] = React.useState('calories');
    const [selected, setSelected] = React.useState([]);
    const [page, setPage] = React.useState(0);
    const [dense, setDense] = React.useState(false);
    const [rowsPerPage, setRowsPerPage] = React.useState(5);
    const [rows, setRows] = React.useState(null)
    const [loading, setLoading] = React.useState(true)

    const [open, setOpen] = React.useState(false);
    const handleOpen = () => setOpen(true);
    const handleClose = () => setOpen(false);

    const [riceType, setRiceType] = React.useState("");
    const [riceAmount, setRiceAmount] = React.useState(0);
    const [imeiModal, setImeiModal] = React.useState("");

    const [riceTypes, setRiceTypes] = React.useState([])

    const [isLoading, setIsLoading] = React.useState(false)

    const handleChange = (event) => {
        setRiceType(event.target.value);
    };


    React.useEffect(() => {
        const fetchAPI = async () => {
            var response = await fetch(
                `${process.env.REACT_APP_BACKEND_URL}/api/rice_box/get_data_table`,
                {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json",
                        "Authorization": "Bearer " + localStorage.getItem("access_token")
                    }
                }
            )
            var responseJson = await response.json()
            var tempRow = []
            for (var e of responseJson) {
                if (e.status_request) {
                    tempRow.push(createData(e.imei, e.amount, e.address, e.phone_num, "Khách hàng yêu cầu mua gạo", e.is_tick))
                }
                else {
                    tempRow.push(createData(e.imei, e.amount, e.address, e.phone_num, "Khách hàng chưa yêu cầu mua gạo", e.is_tick))
                }
            }
            setRows(tempRow)

            var response = await fetch(
                `${process.env.REACT_APP_BACKEND_URL}/api/rice_box/get_rice_type`,
                {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json",
                        "Authorization": "Bearer " + localStorage.getItem("access_token")
                    }
                }
            )
            var responseJson = await response.json()
            setRiceTypes(responseJson)
        }
        fetchAPI()
    }, [])

    React.useEffect(() => {
        if (rows) {
            setLoading(false)
        }
    }, [rows])


    //   const rows = [
    //     createData('Cupcake', 305, 3.7, 67, 4.3),
    //     createData('Donut', 452, 25.0, 51, 4.9),
    //     createData('Eclair', 262, 16.0, 24, 6.0),
    //     createData('Frozen yoghurt', 159, 6.0, 24, 4.0),
    //     createData('Gingerbread', 356, 16.0, 49, 3.9),
    //     createData('Honeycomb', 408, 3.2, 87, 6.5),
    //     createData('Ice cream sandwich', 237, 9.0, 37, 4.3),
    //     createData('Jelly Bean', 375, 0.0, 94, 0.0),
    //     createData('KitKat', 518, 26.0, 65, 7.0),
    //     createData('Lollipop', 392, 0.2, 98, 0.0),
    //     createData('Marshmallow', 318, 0, 81, 2.0),
    //     createData('Nougat', 360, 19.0, 9, 37.0),
    //     createData('Oreo', 437, 18.0, 63, 4.0),
    //   ];

    const handleRequestSort = (event, property) => {
        const isAsc = orderBy === property && order === 'asc';
        setOrder(isAsc ? 'desc' : 'asc');
        setOrderBy(property);
    };

    const handleSelectAllClick = (event) => {
        if (event.target.checked) {
            const newSelected = rows.map((n) => n.name);
            setSelected(newSelected);
            return;
        }
        setSelected([]);
    };

    const handleConfirm = async () => {
        setIsLoading(true)
        await fetch(
                `${process.env.REACT_APP_BACKEND_URL}/api/rice_box/tick_deliver?access_token=${imeiModal}&rice_type_id=${riceType}&quantity=${riceAmount}`,
                {
                    method: "PUT"
                }
            )
        setIsLoading(false)
        for (let row of rows) {
            if (row.imei === imeiModal) {
                row.is_tick = !row.is_tick
            }
        }
        handleClose()
    }

    const handleClick = async (event, imei) => {
        let is_ticked = false
        var updateRows = []
        for (let row of rows) {
            if (row.imei === imei) {
                row.is_tick = !row.is_tick
                is_ticked = true
            }
            updateRows.push(row)
        }
        setRows(updateRows)
        console.log(is_ticked)
        if (is_ticked) {
            await fetch(
                    `${process.env.REACT_APP_BACKEND_URL}/api/rice_box/tick_deliver?access_token=${imei}`,
                    {
                        method: "PUT"
                    }
                )
        }
        else{
            setImeiModal(imei)
            handleOpen()
        }
        // var response = await fetch(
        //     `${process.env.REACT_APP_BACKEND_URL}/api/rice_box/tick_deliver?access_token=${imei}`,
        //     {
        //         method: "PUT"
        //     }
        // )
        // var updateRows = []
        // for (let row of rows) {
        //     if (row.imei === imei) {
        //         row.is_tick = !row.is_tick
        //     }
        //     updateRows.push(row)
        // }
        // setRows(updateRows)
    };

    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
    };

    const handleChangeDense = (event) => {
        setDense(event.target.checked);
    };

    const isSelected = (name) => selected.indexOf(name) !== -1;

    // Avoid a layout jump when reaching the last page with empty rows.
    const emptyRows =
        page > 0 ? Math.max(0, (1 + page) * rowsPerPage - rows.length) : 0;

    return (loading ? <Loading loading={loading}></Loading> :
        <Box sx={{ width: '100%' }}>
            <Paper sx={{ width: '100%', mb: 2 }}>
                {/* <EnhancedTableToolbar numSelected={selected.length} /> */}
                <TableContainer>
                    <Table
                        sx={{ minWidth: 750 }}
                        aria-labelledby="tableTitle"
                        size={dense ? 'small' : 'medium'}
                    >
                        <EnhancedTableHead
                            numSelected={selected.length}
                            order={order}
                            orderBy={orderBy}
                            onSelectAllClick={handleSelectAllClick}
                            onRequestSort={handleRequestSort}
                            rowCount={rows.length}
                        />
                        <TableBody>
                            {rows.map((row, index) => {
                                const isItemSelected = isSelected(row.name);
                                const labelId = `enhanced-table-checkbox-${index}`;

                                return (
                                    <TableRow
                                        hover
                                        onClick={(event) => handleClick(event, row.imei)}
                                        role="checkbox"
                                        aria-checked={row.is_tick}
                                        tabIndex={-1}
                                        key={row.name}
                                        selected={row.is_tick}
                                        sx={{ cursor: 'pointer' }}
                                    >
                                        <TableCell padding="checkbox">
                                            <Checkbox
                                                color="primary"
                                                checked={row.is_tick}
                                                inputProps={{
                                                    'aria-labelledby': labelId,
                                                }}
                                            />
                                        </TableCell>
                                        <TableCell
                                            component="th"
                                            id={labelId}
                                            scope="row"
                                            padding="none"
                                        >
                                            {row.imei}
                                        </TableCell>
                                        <TableCell align="right">{row.calories}%</TableCell>
                                        <TableCell align="right">{row.fat}</TableCell>
                                        <TableCell align="right">{row.carbs}</TableCell>
                                        <TableCell align="right">{row.protein}</TableCell>
                                    </TableRow>
                                );
                            })}
                            {emptyRows > 0 && (
                                <TableRow
                                    style={{
                                        height: (dense ? 33 : 53) * emptyRows,
                                    }}
                                >
                                    <TableCell colSpan={6} />
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                </TableContainer>
                <TablePagination
                    rowsPerPageOptions={[5, 10, 25]}
                    component="div"
                    count={rows.length}
                    rowsPerPage={rowsPerPage}
                    page={page}
                    onPageChange={handleChangePage}
                    onRowsPerPageChange={handleChangeRowsPerPage}
                />
            </Paper>
            <Modal
                open={open}
                onClose={handleClose}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
            >
                <Box sx={style}>
                    <FormControl fullWidth>
                        <InputLabel id="rice-type">Rice Type</InputLabel>
                        <Select
                            labelId="rice-type"
                            id="rice-type-select"
                            value={riceType}
                            label="Rice Type"
                            onChange={handleChange}
                        >
                            {riceTypes.map((riceType) => (
                                <MenuItem key={riceType} value={riceType.id}>{riceType.name}</MenuItem>
                            ))}
                        </Select>
                        <TextField sx={{ mt: 2 }} id="outlined-basic" label="Amount of rice (kg)" variant="outlined" value={riceAmount} onChange={(event) => setRiceAmount(event.target.value)} />
                        <Fab variant="extended" color="primary" sx={{ mt: 2 }} onClick={handleConfirm}>
                            Confirm
                        </Fab>
                    </FormControl>
                </Box>
            </Modal>
        </Box>
    );
}