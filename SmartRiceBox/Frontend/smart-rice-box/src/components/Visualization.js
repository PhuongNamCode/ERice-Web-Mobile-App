import * as React from 'react';
import Stack from '@mui/material/Stack';
import FormControl from '@mui/material/FormControl';
import FormLabel from '@mui/material/FormLabel';
import RadioGroup from '@mui/material/RadioGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import Radio from '@mui/material/Radio';
import { BarChart } from '@mui/x-charts/BarChart';
import { PieChart } from '@mui/x-charts/PieChart';
import { axisClasses } from '@mui/x-charts/ChartsAxis';
import { dataset } from '../dataset/weather';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DateRangePicker } from '@mui/x-date-pickers-pro/DateRangePicker';
import { SingleInputDateRangeField } from '@mui/x-date-pickers-pro/SingleInputDateRangeField';
import { DemoContainer } from '@mui/x-date-pickers/internals/demo';
import dayjs, { Dayjs } from 'dayjs';
import { Button } from '@mui/material';
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';



function TickParamsSelector({
    tickPlacement,
    tickLabelPlacement,
    setTickPlacement,
    setTickLabelPlacement,
}) {
    return (
        <Stack direction="column" justifyContent="space-between" sx={{ width: '100%' }}>
            <FormControl>
                <FormLabel id="tick-placement-radio-buttons-group-label">
                    tickPlacement
                </FormLabel>
                <RadioGroup
                    row
                    aria-labelledby="tick-placement-radio-buttons-group-label"
                    name="tick-placement"
                    value={tickPlacement}
                    onChange={(event) => setTickPlacement(event.target.value)}
                >
                    <FormControlLabel value="start" control={<Radio />} label="start" />
                    <FormControlLabel value="end" control={<Radio />} label="end" />
                    <FormControlLabel value="middle" control={<Radio />} label="middle" />
                    <FormControlLabel
                        value="extremities"
                        control={<Radio />}
                        label="extremities"
                    />
                </RadioGroup>
            </FormControl>
            <FormControl>
                <FormLabel id="label-placement-radio-buttons-group-label">
                    tickLabelPlacement
                </FormLabel>
                <RadioGroup
                    row
                    aria-labelledby="label-placement-radio-buttons-group-label"
                    name="label-placement"
                    value={tickLabelPlacement}
                    onChange={(event) => setTickLabelPlacement(event.target.value)}
                >
                    <FormControlLabel value="tick" control={<Radio />} label="tick" />
                    <FormControlLabel value="middle" control={<Radio />} label="middle" />
                </RadioGroup>
            </FormControl>
        </Stack>
    );
}

const valueFormatter = (value) => `${value} kg`;

const chartSetting = {
    yAxis: [
        {
            label: 'Tổng lượng gạo đã mua (kg)',
        },
    ],
    series: [{ dataKey: 'total_quanlity', label: 'Tổng lượng gạo đã mua', valueFormatter }],
    height: 300,
    sx: {
        [`& .${axisClasses.directionY} .${axisClasses.label}`]: {
            transform: 'translateX(-10px)',
        },
    },
};

export default function TickPlacementBars() {
    const [tickPlacement, setTickPlacement] = React.useState('middle');
    const [tickLabelPlacement, setTickLabelPlacement] = React.useState('middle');

    const [barData, setBarData] = React.useState([]);
    const [pieData, setPieData] = React.useState([]);
    const [districtData, setDistrictData] = React.useState([]);
    const [allPieData, setAllPieData] = React.useState([])

    const [pieDistrict, setPieDistrict] = React.useState("")

    const handleChange = (event) => {
        setPieDistrict(event.target.value);
        console.log(event.target.value)
        setPieData(allPieData[event.target.value])
    };

    const [value, setValue] = React.useState([
        dayjs('2024-01-01'),
        dayjs('2024-12-31'),
    ]);

    const changeDateRange = (newValue) => {
        setValue(newValue);
        let start_month = newValue[0].month() + 1
        let end_month = newValue[1].month() + 1
        let start_year = newValue[0].year()
        let end_year = newValue[1].year()
        // console.log(start_month, end_month, start_year, end_year)

        fetch(
            `${process.env.REACT_APP_BACKEND_URL}/api/rice_box/visualization?start_month=${start_month}&end_month=${end_month}&start_year=${start_year}&end_year=${end_year}`,
            {
                method: "GET"
            }
        )
            .then((response) => response.json())
            .then((data) => {
                console.log(data)
                setBarData(data["bar_data"])
                setAllPieData(data["pie_data"])
                setPieData(data["pie_data"][data["district"][0]])
                setDistrictData(data["district"])
                setPieDistrict(`${data["district"][0]}`)
            })
    };

    return (
        <div style={{ width: '100%' }}>
            <LocalizationProvider dateAdapter={AdapterDayjs}>
                <DemoContainer components={['SingleInputDateRangeField']}>
                    <DateRangePicker
                        slots={{ field: SingleInputDateRangeField }}
                        name="allowedRange"
                        value={value}
                        onChange={(newValue) => {
                            setValue(newValue);
                        }}
                    />
                </DemoContainer>

            </LocalizationProvider>
            <div style={{ marginTop: 5 }}>
                <Button variant="contained" onClick={() => changeDateRange(value)}>OK</Button>
            </div>
            <div>

                <BarChart
                    dataset={barData}
                    xAxis={[
                        { scaleType: 'band', dataKey: 'district', tickPlacement, tickLabelPlacement },
                    ]}
                    {...chartSetting}
                />
            </div>

            <div style={{ marginTop: 100 }}>
                <Select
                    labelId="demo-simple-select-label"
                    id="demo-simple-select"
                    value={pieDistrict}
                    label="Quận"
                    onChange={handleChange}
                >
                    {
                        districtData.map((item, index) => {
                            return <MenuItem key={index} value={item}>Quận {item}</MenuItem>
                        })
                    }
                </Select>
                <PieChart
                    series={[
                        {
                            data: pieData,
                            highlightScope: { faded: 'global', highlighted: 'item' },
                            faded: { innerRadius: 30, additionalRadius: -30, color: 'gray' },
                            outerRadius: 200, 
                            arcLabel: (item) => `${item.value} kg`
                        },
                    ]}
                    height={400}
                />
            </div>
        </div>
    );
}
