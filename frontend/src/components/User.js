import React from 'react'

// const User = ({ employees }) => {
//   return (
//     <ul>
//         {
//             employees &&
//             employees.map(user =>
//                 <li key={user.id}>{user.username}</li>
//             )
//         }
//     </ul>
//   )
// }

const User = ({ user, handleGetEmployees, employees }) => {
  const handleGethours = () => {
    let hours = []
    employees &&
    employees.map(employee => hours.concat(employee.hours))
    console.log(hours[hours.length - 1])
    console.log(hours);
  }
  
  return (
    <div>
      <h1>{ user.username }</h1>
      <br/>
      <button onClick={() => handleGetEmployees()}>Get employees</button>
      <button onClick={() => handleGethours()}>Get hours</button>

      <ul>
        {
            employees &&
            employees.filter(worker => worker.username !== user.username).map(employee =>
                <li key={employee.username}>
                  <b>name: </b>{employee.username}
                  <br/>
                  {console.log(employee)}
                  <b>date: </b>{employee.hours[1].date}
                  <br/>
                  <b>period: </b>{employee.hours[1].month}
                  <br/>
                  <b>total horus: </b>{employee.hours[1].days[1].totalHours}
                  {employee.hours.map(hours => console.log('hours', hours.id))}
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