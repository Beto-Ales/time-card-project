import React from 'react'
import {useState} from 'react'

const User = ({ user, employees }) => {
  console.log('render component')
  const [screen, setScreen] = useState('1')
  const [worker, setWorker] = useState(null)
  const [hours, setHours] = useState(null)

  const ScreenOne = ({ user, employees }) => {  
  
  return (
    <div>
      {/* name displayed in header */}
      {/* <h1>{ user.username[0].toUpperCase() + user.username.slice(1).toLowerCase()}</h1> */}
      <br/>      
      <ul>
        {
            employees === null ?
            'Loading' :
            employees.filter(worker => worker.username !== user.username).map(employee =>
                <li key={employee.username}>                  
                  <button onClick={() => handleGetEmployee(employee)}>
                  <p><b>Name: </b>{employee.username[0].toUpperCase() + employee.username.slice(1).toLowerCase()}</p>                  
                  <p><b>Last update: </b>{employee.hours.length > 0 && employee.hours[0].date}  {/* some employees don't have hours uploaded */}</p>                  
                  <p><b>Period: </b>{employee.hours.length > 0 && employee.hours[0].month}  {/* some employees don't have hours uploaded */}</p>                  
                  </button>
                </li>
            )
        }
      </ul>
    </div>
  )
}

const ScreenTwo = ({ worker }) => {
  console.log('worker', worker)
  return (
    <div>
      <h1>{worker.username[0].toUpperCase() + worker.username.slice(1).toLowerCase()}</h1>
      <button className='screenBtn' onClick={() => toScreen('1')} >Back</button>
      <ul>
        {worker &&
        worker.hours.map(hours => 
          <li key={hours.id}>
            <button onClick={() => handleGetHours(hours)}>Period: {hours.month}</button>
            <br/>
          </li>
          )}
      </ul>
    </div>
  )
}
const ScreenThree = ({ hours }) => {  
  // done when creating timecard line 531
  // const normal = hours.days.map(day => day.totalHours && day.totalHours.normal)
  // const special = hours.days.map(day => day.totalHours && day.totalHours.special)
  // const total = hours.days.map(day => day.totalHours && day.totalHours.total)
  // const allNormal = normal.filter(value => value !== undefined ).reduce((a,b) => a+b)
  // const allSpecial = special.filter(value => value !== undefined ).reduce((a,b) => a+b)
  // const allTotal = total.filter(value => value !== undefined ).reduce((a,b) => a+b)
  // // console.log('normal', normal, 'special', special, 'total', total)
  // console.log('allNormal', allNormal)

  

  return (
    <div>
      <h1>{hours.month.toUpperCase()}</h1>
      <button className='screenBtn' onClick={() => toScreen('2')} >Back</button>
      
      <div className='userTable userTableHeader'>
          <span className='headerTitle'>DATE</span>
          <span className='headerTitle'>JOB DESCRIPTION</span>
          <span className='headerTitle'>START</span>
          <span className='headerTitle'>FINISH</span>
          <span className='headerTitle'>TOTAL</span>
          <span className='headerTitle'>NORMAL</span>
          <span className='headerTitle'>SPECIAL</span>
          {/* <p className='left'>TOTAL HOURS/TIMER</p> */}
      </div>
      
      
      <ul className='freeWidth'>
        {
          hours &&
          hours.days.map(day => 
            <li key={day.dayNumber}>
              {/* <p>Day: {day.dayNumber} Job description: {day.jobDescription} Start: {day.startWork}, End: {day.endWork} Total Hours: {day.totalHours && day.totalHours.total} Normal rate: {day.totalHours && day.totalHours.normal} Special rate: {day.totalHours && day.totalHours.special}</p> */}
              <div className='userTable'>
                <span className='userSpan'>{day.dayNumber}</span>
                <span className='userSpan'>{day.jobDescription}</span>
                <span className='userSpan'>{day.startWork}</span>
                <span className='userSpan'>{day.endWork}</span>
                <span className='userSpan'>{day.totalHours && day.totalHours.total}</span>
                <span className='userSpan'>{day.totalHours && day.totalHours.normal}</span>
                <span className='userSpan'>{day.totalHours && day.totalHours.special}</span>
              </div>
              {/* <p>Total Hours: {hours.totalHours}</p> */}
            </li>
          )
        }
      </ul>      
      {/* <h3>Month total Hours: <span className='totalHoursStyle'>{allTotal}</span>, Normal rate: <span className='totalHoursStyle'>{allNormal}</span>, Special rate: <span className='totalHoursStyle'>{allSpecial}</span></h3> */}
      <h3>Month total Hours: <span className='totalHoursStyle'>{hours.monthHours.totalHours}</span>, Normal rate: <span className='totalHoursStyle'>{hours.monthHours.normalRate}</span>, Special rate: <span className='totalHoursStyle'>{hours.monthHours.specialRate}</span></h3>
      {/* <h3>{hours.monthHours}</h3> */}
    </div>
  )
}

const handleGetEmployee = (employee) => {
  setWorker(employee)
  toScreen('2')
  console.log('see that user', employee)
}
const handleGetHours = (hours) => {
  setHours(hours)
  toScreen('3')
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