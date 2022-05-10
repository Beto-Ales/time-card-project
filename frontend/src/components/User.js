import React from 'react'
import {useState} from 'react'

// const User = ({ user, handleGetEmployees, employees }) => {
  const User = ({ user, employees }) => {

    console.log('render component')

  const [screen, setScreen] = useState('1')
  const [worker, setWorker] = useState(null)
  const [hours, setHours] = useState(null)

  // load employees list
  // handleGetEmployees()

  // const ScreenOne = ({ user, handleGetEmployees, employees }) => {
    const ScreenOne = ({ user, employees }) => {  
    
    return (
      <div>      
        <h1>{ user.username[0].toUpperCase() + user.username.slice(1).toLowerCase()}</h1>
        <br/>
        {/* <button onClick={() => handleGetEmployees()}>Get employees</button> */}
        <ul>
          {
              employees &&
              employees.filter(worker => worker.username !== user.username).map(employee =>
                  <li key={employee.username}>
                    {/* <button onClick={() => handleGetEmployee(employee.id)}> */}
                    <button onClick={() => handleGetEmployee(employee)}>
                      {/* it works but there are better solutions */}
                    {/* <b>Name: </b>{employee.username.toUpperCase()} */}
                    <b>Name: </b>{employee.username[0].toUpperCase() + employee.username.slice(1).toLowerCase()}
                    <br/>
                    {/* {console.log(employee)} */}
                    <b>Last update: </b>{employee.hours[0].date}
                    <br/>
                    <b>Period: </b>{employee.hours[0].month}
                    <br/>
                    {/* it works but not needed here */}
                    {/* <b>total horus: </b>{employee.hours[0].days[0].totalHours} */}
                    {/* {employee.hours.map(hours => console.log('hours', hours.id))} */}
                    {/* {console.log(employee.hours)} */}
                    {/* <div style={{backgroundColor: 'black', height: '1em'}}></div> */}
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
              {/* only display period */}
              <button onClick={() => handleGetHours(hours)}>Period: {hours.month}</button>
              <br/>
              {/* next screen displays ditails */}
              {/* {hours.days.map(day => <p key={day.dayNumber}>Day: {day.dayNumber} Start {day.startWork}, End {day.endWork}</p>)} */}
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

  // it works every time the component is called
  // employees &&
  // employees.map(employee => employee.hours.reverse())

  const handleGetEmployee = (id) => {
    setWorker(id)
    toScreen('2')
    console.log('see that user', id)
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

  
  // is it necesary?
  // ---------------
  // every time the component is called, let is true and nothing prevent
  // the array reverse again and again
  // let reverse = true
  // if (reverse) {
  //   employees &&
  //   employees.map(employee => employee.hours.reverse())
  //   reverse = false
  // }
    


  return (
    <div>
    {/* {screen === '1' ?    
      <ScreenOne
        user={user}
        // handleGetEmployees={handleGetEmployees}
        employees={employees}
      /> :
      <ScreenTwo worker={worker} />
    } */}

    {display()}

    
    {/* {if (screen === '1') {
        <ScreenOne
        user={user}
        // handleGetEmployees={handleGetEmployees}
        employees={employees}
      />
      }
      if (screen === '2') {
        <ScreenTwo worker={worker} />
      }
      if (screen === '3') {
        <ScreenThree worker={worker} />
      }} */}
    

    </div>
  )
}

// use this for employees
// {
//   employees &&
//   employees.filter(worker => worker.username === user.username).map(employee =>
//       <li key={employee.username}>{employee.username}</li>
//   )
// }

export default User