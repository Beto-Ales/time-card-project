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
      <h1>{ user.username[0].toUpperCase() + user.username.slice(1).toLowerCase()}</h1>
      <br/>      
      <ul>
        {
            employees &&
            employees.filter(worker => worker.username !== user.username).map(employee =>
                <li key={employee.username}>                  
                  <button onClick={() => handleGetEmployee(employee)}>                  
                  <b>Name: </b>{employee.username[0].toUpperCase() + employee.username.slice(1).toLowerCase()}
                  <br/>
                  <b>Last update: </b>{employee.hours[0].date}
                  <br/>
                  <b>Period: </b>{employee.hours[0].month}
                  <br/>
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
      <button onClick={() => toScreen('1')} >Back</button>
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
  return (
    <div>
      <h1>{hours.month.toUpperCase()}</h1>
      <button onClick={() => toScreen('2')} >Back</button>
      <ul>
        {
          hours &&
          hours.days.map(day => 
            <li key={day.dayNumber}>
              <p>Day: {day.dayNumber} Start: {day.startWork}, End: {day.endWork}</p>
              <p>Total Hours: {hours.totalHours}</p>
            </li>
          )
        }
      </ul>
      <p>Month total Hours: {hours.monthHours}</p>
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