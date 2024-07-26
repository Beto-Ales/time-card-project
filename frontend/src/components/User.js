import React from 'react'
import {useState, useEffect} from 'react'
// services
import userService from '../services/users'
// components
import UserSettings from './UserSettings'
// material
import ToggleButton from '@mui/material/ToggleButton'
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup'
import Box from '@mui/material/Box'
import InputLabel from '@mui/material/InputLabel'
import MenuItem from '@mui/material/MenuItem'
import FormControl from '@mui/material/FormControl'
import Select from '@mui/material/Select'
import Button from '@mui/material/Button'

const User = ({ user, employees, onUpdateEmployees }) => {  
  const [screen, setScreen] = useState('1')

  const [periodResume, setPeriodResume] = useState([])
  const [period, setPeriod] = useState('January/February')
  const [year, setYear] = useState(2024)
  
  const [worker, setWorker] = useState(null)
  const [hours, setHours] = useState(null)
  
  const [activeEmployees, setActiveEmployees] = useState([])
  const [onlyActiveUsers, setOnlyActiveUsers] = useState('false')

  useEffect(() => {
    if (employees) {
      if (onlyActiveUsers === 'true') {
        const activeUsers = employees.filter(employee => employee.isActive)
        setActiveEmployees(activeUsers)
      } else {
        setActiveEmployees(employees)
      }
    }
  }, [employees, onlyActiveUsers])
  
  const handleDate = (date) => {
    return date.split("T")[0]
  }

  const filterByPeriod = () => {

    // const year = 2022
    // const month = "January/February"

    const results = activeEmployees.map(user => {
      const matchedHours = user.hours.filter(hour => {
        const hourYear = new Date(hour.date).getFullYear()
        return hourYear === year && hour.month === period
      }).map(hour => hour.monthHours)
    
      return {
        username: user.username,
        matchedHours: matchedHours
      }
    }).filter(user => user.matchedHours.length > 0)

    console.log(results)
    setPeriodResume(results)
  }

  const handleChangeYear = (event) => {
    setYear(event.target.value)
  }

  const handleChangePeriod = (event) => {
    setPeriod(event.target.value)
  }

  const currentYear = new Date().getFullYear()
  const yearOptions = []
  for (let year = currentYear; year >= 2022; year--) {
    yearOptions.push({ value: year, label: year.toString() })
  }

  const periodOptions = [
    { value: 'January/February', label: 'January/February' },
    { value: 'February/March', label: 'February/March' },
    { value: 'March/April', label: 'March/April' },
    { value: 'April/May', label: 'April/May' },
    { value: 'May/June', label: 'May/June' },
    { value: 'June/July', label: 'June/July' },
    { value: 'July/August', label: 'July/August' },
    { value: 'August/September', label: 'August/September' },
    { value: 'September/October', label: 'September/October' },
    { value: 'October/November', label: 'October/November' },
    { value: 'November/December', label: 'November/December' },
    { value: 'December/January', label: 'December/January' },
  ]

  const ScreenOne = ({ user, employees }) => {
    
    console.log(employees)


    const handleToggleActive = (event, newValue) => {
    if (newValue !== null) {
      setOnlyActiveUsers(newValue)
      if (newValue === 'true') {
        const activeUsers = employees.filter(employee => employee.isActive)
        setActiveEmployees(activeUsers)
      } else {
        setActiveEmployees(employees)
      }
    }
  }
  
  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
      <UserSettings/>
      <ToggleButtonGroup
        style={{ margin: '20px 0', width: '12em' }}
        color="primary"
        value={onlyActiveUsers}
        exclusive
        onChange={handleToggleActive}
        aria-label="Platform"
      >
        <ToggleButton value="true">Only Activate Users</ToggleButton>
        <ToggleButton value="false">All users</ToggleButton>
      </ToggleButtonGroup>
      <Button variant="contained" onClick={() => handleSetPeriod()}>Period</Button>

      <Box sx={{ minWidth: 120, margin: '1em' }}>
        <FormControl  sx={{ mb: 2 }}>
          <InputLabel id="select1-label">Year</InputLabel>
          <Select
            labelId="select1-label"
            id="select1"
            value={year}
            label="Age 1"
            onChange={handleChangeYear}
          >
            {yearOptions.map((option) => (
              <MenuItem key={option.value} value={option.value}>
                {option.label}
              </MenuItem>
            ))}
            {/* <MenuItem value={2024}>2024</MenuItem>
            <MenuItem value={2023}>2023</MenuItem>
            <MenuItem value={2022}>2022</MenuItem> */}
          </Select>
        </FormControl>

        <FormControl >
          <InputLabel id="select2-label">Period</InputLabel>
          <Select
            labelId="select2-label"
            id="select2"
            value={period}
            label="Age 2"
            onChange={handleChangePeriod}
          >
            {periodOptions.map((option) => (
              <MenuItem key={option.value} value={option.value}>
                {option.label}
              </MenuItem>
            ))}
            {/* <MenuItem value={'January/February'}>January / February</MenuItem>
            <MenuItem value={'February/March'}>February / March</MenuItem>
            <MenuItem value={'March/April'}>March / April</MenuItem> */}
          </Select>
        </FormControl>
      </Box>

      <ul>
        {
            employees === null ?
            'Loading' :
            activeEmployees.filter(worker => worker.username !== user.username).map(employee =>
                <li key={employee.username}>                  
                  <button onClick={() => handleGetEmployee(employee)}>
                    <p><b>Name: </b>{employee.username[0].toUpperCase() + employee.username.slice(1).toLowerCase()}</p>                  
                    <p><b>Last update: </b>{employee.hours.length > 0 && handleDate(employee.hours[0].date)}  {/* some employees don't have hours uploaded */}</p>                  
                    <p><b>Period: </b>{employee.hours.length > 0 && employee.hours[0].month}  {/* some employees don't have hours uploaded */}</p>                  
                  </button>
                  {
                    employee.isActive ? (
                      <button onClick={() => onDeactivate(employee)}>Deactivate</button>
                    ) : (
                      <button onClick={() => onActivate(employee)}>Activate</button>
                    )
                  }
                </li>
            )
        }
      </ul>
    </Box>
  )
}

const ScreenTwo = ({ worker }) => {
  return (
    <div>
      <h1>{worker.username[0].toUpperCase() + worker.username.slice(1).toLowerCase()}</h1>
      <button className='screenBtn' onClick={() => toScreen('1')} >Back</button>
      <ul>
        {worker &&
        worker.hours.map((hours, index) => 
          <li key={index}>
            <button onClick={() => handleGetHours(hours)}>
              <p><b>Period: </b>{hours.month}</p>
              <p><b>Last update: </b>{handleDate(hours.date)}</p>
            </button>
            <br/>
          </li>
          )}
      </ul>
    </div>
  )
}
const ScreenThree = ({ hours, worker }) => {
  return (
    <div>
      <h1>{worker.username[0].toUpperCase() + worker.username.slice(1).toLowerCase()}</h1>
      <h3>{hours.month.toUpperCase()}</h3>
      <button className='screenBtn' onClick={() => toScreen('2')} >Back</button>
      
      <div className='userTable userTableHeader'>
          <span className='headerTitle date-column'>DATE</span>
          <span className='headerTitle holiday-column'>HOLIDAY</span>
          <span className='headerTitle jobdescription'>JOB DESCRIPTION</span>
          <span className='headerTitle startA'>START</span>
          <span className='headerTitle endA'>FINISH</span>
          <span className='headerTitle startB'>START</span>
          <span className='headerTitle endB'>FINISH</span>
          <span className='headerTitle hours-min-width'>TOTAL</span>
          <span className='headerTitle hours-min-width'>NORMAL</span>
          <span className='headerTitle hours-min-width'>LATE HOURS</span>
          <span className='headerTitle hours-min-width'>HOLYDAY HOURS</span>
      </div>
      
      
      <ul className='freeWidth'>
        {
          hours &&
          hours.days.map((day, index) => 
            <li key={index}>
              <div className='userTable'>
                <span className='userSpan date-column'>{day.dayNumber}</span>
                <span className='userSpan holiday-column'>{day.holiday ? '✔' : ''}</span>
                <span className='userSpan jobdescription'>{day.jobDescription}</span>
                <span className='userSpan startA'>{day.startWorkA}</span>
                <span className='userSpan endA'>{day.endWorkA}</span>
                <span className='userSpan startB'>{day.startWorkB}</span>
                <span className='userSpan endB'>{day.endWorkB}</span>
                <span className='userSpan hours-min-width'>{day.totalHours && day.totalHours.total}</span>
                <span className='userSpan hours-min-width'>{day.totalHours && day.totalHours.normal}</span>
                <span className='userSpan hours-min-width'>{day.totalHours && day.totalHours.lateHours}</span>
                <span className='userSpan hours-min-width'>{day.totalHours && day.totalHours.holidayHours}</span>
              </div>
            </li>
          )
        }
      </ul>
      <h3>Month total Hours: <span className='totalHoursStyle'>{hours.monthHours.totalHours}</span>, Normal rate: <span className='totalHoursStyle'>{hours.monthHours.normalRate}</span>, Late hours rate: <span className='totalHoursStyle'>{hours.monthHours.lateHoursRate}</span>, Holyday hours rate: <span className='totalHoursStyle'>{hours.monthHours.holidayHoursRate}</span></h3>
    </div>
  )
}
const ScreenFour = ({ periodResume }) => {
  return (
    <div>
      <h1>Resume of the Period { period } { year }</h1>
      <button className='screenBtn' onClick={() => toScreen('1')} >Back</button>
      {console.log(periodResume)}
      <ul>
        {
            periodResume === null ?
            'Loading' :
            periodResume.filter(worker => worker.username !== user.username).map(employee =>
                <li key={employee.username}>                  
                    <p><b>Name: </b>{employee.username[0].toUpperCase() + employee.username.slice(1).toLowerCase()}</p>                  
                    <p><b>Holiday Hours: </b>{employee.matchedHours[0].holidayHoursRate}</p>
                    <p><b>Late Hours: </b>{employee.matchedHours[0].lateHoursRate}</p>
                    <p><b>Normal Hours: </b>{employee.matchedHours[0].normalRate}</p>
                    <p><b>Total Hours: </b>{employee.matchedHours[0].totalHours}</p>
                </li>
            )
        }
      </ul>
    </div>
  )
}

const onDeactivate = async  (employee) => {
  console.log('implementar delete ', employee)
  const id = employee.id
  await userService.deactivateUser(id)
  onUpdateEmployees()
}

const onActivate = async  (employee) => {
  console.log('implementar delete ', employee)
  const id = employee.id
  await userService.activateUser(id)
  onUpdateEmployees()
}

const handleGetEmployee = (employee) => {
  console.log(employee)
  setWorker(employee)
  toScreen('2')
}
const handleGetHours = (hours) => {
  setHours(hours)
  toScreen('3')
}
const handleSetPeriod = () => {
  filterByPeriod()
  toScreen('4')
}
const toScreen = (screen) => {
  setScreen(screen)
}
const display = () => {
    if (screen === '1') {
      return <ScreenOne
      user={user}
      employees={employees}
      />
    }else if (screen === '2') {
      return <ScreenTwo
      worker={worker}
      />
    }else if (screen === '3') {
      return <ScreenThree
      hours={hours}
      worker={worker}
      />
    }else if (screen === '4') {
      return <ScreenFour
      periodResume={periodResume}
      />
    }
  }
  
  return (
    <div>  
      {display()}  
    </div>
    )
}

export default User