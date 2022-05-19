import React from 'react'
import { useState } from 'react'
import hoursService from '../services/hours'

const TimeCard = ({ user, setErrorMessage }) => {
    const [screen, setScreen] = useState('1')
    const [hours, setHours] = useState(null)

    const loading = () => {
        if (user === null) {
            return 'Loading...'
        } else {
            return user.username[0].toUpperCase() + user.username.slice(1).toLowerCase()
        }
    }

    const ScreenOne = ({ user }) => {
        return (
            <div>                
                <h1>{ loading() }</h1>
                <br/>
                <button onClick={() => toScreen('3')} >New time card</button>
                <ul>
                    {
                        user &&
                        user.hours.map(
                            hours =>
                            <li key={hours.id}>
                                <button onClick={() => handleGetHours(hours)}>
                                    <b>Period: {hours.month}</b>
                                    <b>Last update: {hours.date}</b>
                                </button>
                            </li>
                        )
                    }
                </ul>                
            </div>            
        )
    }
        
    const ScreenTwo = ({ hours }) => {
        return (
          <div>
              <h1>{ hours.month.toUpperCase()}</h1>
              <button onClick={() => toScreen('1')} >Back</button>
              <ul>
                  {
                      hours &&
                      hours.days.map(
                          day =>
                          <li key={day.dayNumber}>
                              <p>Day: {day.dayNumber} Job description: {day.jobDescription} Start: {day.startWork}, End: {day.endWork}</p>
                              <p>Total Hours: {hours.totalHours}</p>
                          </li>
                      )
                  }
              </ul>
              <p>Month total Hours: {hours.monthHours}</p>
              <p>Last update: { hours.date }</p>
          </div>
        )
    }
      
    const ScreenThree = () => {
        const [inputs, setInputs] = useState({finishTime: '00:00', startTime: '00:00'})
        
        const timeToDecimal = (t) => {
            var arr = t.split(':')
            var dec = parseInt((arr[1]/6)*10, 10)
        
            return parseFloat(parseInt(arr[0], 10) + '.' + (dec<10?'0':'') + dec)
        }

        const calculate = (startTime, endTime) => {
            let start = startTime
            let end = endTime
            let normal = 0
            let special = 0
            if (end < 4) {
                end += 24
            }
            const total = end - start
            
            if (end > 18) {
                special = end - 18
                normal = 18 - start
            }else {
                normal = total
            }

            // setInputs(values => ({...values, total: total, normal: normal, special: special}))
            // console.log('normal', normal, 'special', special)

            return {
                normal: normal,
                special: special,
                total: total
            }
        }
        

        const handleChange = (event) => {
            const name = event.target.name
            const value = event.target.value
            setInputs(values => ({...values,
                [name]: value,                
            }))
        }

        const addTimeCard = async (event) => {
            event.preventDefault()
            const {month, jobDescription, finishTime, startTime} = inputs
            if (!month) {
                return console.log('Month is a required field')
            }
            const object = {
                month: month,
                days: [
                    {
                        dayNumber: '21',
                        jobDescription: jobDescription,
                        startWork: startTime,
                        endWork: finishTime
                    }
                ]
            }
            console.log('uploaded', inputs)
            await hoursService
              .create(object)
              setInputs({ finishTime: '00:00', startTime: '00:00' })
              setErrorMessage('Time card created')
              setTimeout(() => {
                setErrorMessage(null)
              }, 5000)
          }

        // complete this function
        // const handleSubmit = (event) => {
        //     event.preventDefault()
        //     calculate(timeToDecimal(inputs.startTime), timeToDecimal(inputs.finishTime))
        //     console.log(inputs)
        // }

        return (
            <div>
                <h1>TIMESEDDEL / TIME CARD</h1>
                <br/>
                <button onClick={() => toScreen('1')} >Back</button>
                <br/>

                {/* https://www.w3schools.com/react/react_forms.asp */}

                {/* When the data is handled by the components, all the data is stored in the component state. */}

                {/* You can control changes by adding event handlers in the onChange attribute. */}

                {/* You can control the submit action by adding an event handler in the onSubmit attribute for the <form>: */}

                {/* You can control the values of more than one input field by adding a name attribute to each element.

                We will initialize our state with an empty object.

                To access the fields in the event handler use the event.target.name and event.target.value syntax.

                To update the state, use square brackets [bracket notation] around the property name. */}
                
                <form onSubmit={addTimeCard}>
                <p>MONTH/MÅNED</p>
                <input
                                type="text"
                                name="month"
                                value={inputs.month || ''}
                                onChange={handleChange}
                            />
                    <div className='timecard'>
                        
                            
                            <p className='left'>DATO / DATE</p>
                            <p className='left'>JOB DESCRIPTION</p>
                            <p className='left'>START: TIME</p>
                            <p className='left'>FINISH: TIME</p>
                            <p className='left'>TOTAL HOURS/TIMER</p>
                        
                        
                            <p className='dateright'>21</p>
                            
                            <input className='jobright'
                                type="text"
                                name="jobDescription"
                                value={inputs.jobDescription || ''}
                                onChange={handleChange}
                            />
                            <input className='startright'
                                type="time"
                                name="startTime"
                                value={inputs.startTime || ''}
                                onChange={handleChange}
                            />
                            <input className='finishright'
                                type="time"
                                name="finishTime"
                                value={inputs.finishTime || ''}
                                onChange={handleChange}
                            />
                            
                            
                            <p className='totalright'>{ inputs.startTime !== inputs.finishTime &&
                            JSON.stringify(calculate(timeToDecimal(inputs.startTime), timeToDecimal(inputs.finishTime))) }</p>
                        
                    </div>
                    <button className='uploadBtn' type="submit">Upload</button>
                </form>
            </div>
        )
    }
    

    const toScreen = (screen) => {
        setScreen(screen)
      }

    const handleGetHours = (hours) => {
        setHours(hours)
        toScreen('2')
    }

    const display = () => {
        if (screen === '1') {
            return <ScreenOne
                user={ user }
            />
          }else if (screen === '2') {
            return <ScreenTwo
                hours={ hours }
            />
          }else if (screen === '3') {
            return <ScreenThree/>
          }
    }
    


    
    return (
        <div>
            {display()}
        </div>    
    )
}

export default TimeCard