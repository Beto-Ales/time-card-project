import React from 'react'

const User = ({ user, handleGetEmployees, employees }) => {

  employees &&
  employees.map(employee => employee.hours.reverse())
  
  // is it necesary?
  // ---------------
  // let reverse = true
  // if (reverse) {
  //   employees &&
  //   employees.map(employee => employee.hours.reverse())
  //   reverse = false
  // }
  
  return (
    <div>
      <h1>{ user.username }</h1>
      <br/>
      <button onClick={() => handleGetEmployees()}>Get employees</button>
      <ul>
        {
            employees &&
            employees.filter(worker => worker.username !== user.username).map(employee =>
                <li key={employee.username}>
                  <b>Name: </b>{employee.username}
                  <br/>
                  {console.log(employee)}
                  <b>Last update: </b>{employee.hours[0].date}
                  <br/>
                  <b>Period: </b>{employee.hours[0].month}
                  <br/>
                  <b>total horus: </b>{employee.hours[0].days[0].totalHours}
                  {employee.hours.map(hours => console.log('hours', hours.id))}
                  {console.log(employee.hours)}
                  <div style={{backgroundColor: 'black', height: '1em'}}></div>
                </li>
                
            )
        }
      </ul>
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