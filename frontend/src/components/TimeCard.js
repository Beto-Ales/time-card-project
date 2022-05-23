import React from 'react'
import { useState } from 'react'
import hoursService from '../services/hours'

// ------------------------------------------------------------------------------------------------------------------------------
// How to update state in a nested object in React with Hooks
// https://blog.logrocket.com/a-guide-to-usestate-in-react-ecb9952e406c/
// ------------------------------------------------------------------------------------------------------------------------------

const TimeCard = ({ user, setErrorMessage }) => {
    const [screen, setScreen] = useState('1')
    const [hours, setHours] = useState(null)

    const loading = () => {
        if (user === null) {
            return 'Loading...'
        } else {
            // name displayed in header
            // return user.username[0].toUpperCase() + user.username.slice(1).toLowerCase()
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
        
        // set timecard template
        const hours = {
            month: '',
            days:[],
            monthHours:'',    
        }
        const days = []
        // const startWork = []
        // const endWork = []
        // const jobDescription = []
        
        // set days
        for (let index = 0; index < 31; index++) {
            if (index < 11) {
                // hours.days.push({
                    days.push({
                    dayNumber: index + 21,  // day start from 21 'couse index is 0. once index is 10 day is 31
                    jobDescription: '',
                    startWork: '00:00',
                    endWork: '00:00',
                    totalHours: '',
                })    
            } else {
                // hours.days.push({
                    days.push({
                    dayNumber: index - 10,  // once index is 11 substract 10 to start from this point with day 1
                    jobDescription: '',
                    startWork: '00:00',
                    endWork: '00:00',
                    totalHours: '',
                })
            }
        }

        hours.days = days

        console.log('hours', hours)

        // console.log(hours);

        // set startWork, endWork & jobDescription
        
        // for (let index = 0; index < 31; index++) {
        //     startWork.push({
        //         [`startWork${index}`]: '00:00'
        //     })
        //     endWork.push({
        //         [`endWork${index}`]: '00:00'
        //     })
        //     jobDescription.push({
        //         [`jobDescription${index}`]: ''
        //     })
        // }

        // const [inputs, setInputs] = useState(hours)
        const [inputs, setInputs] = useState({})
        // const [monthDays, setMonthDays] = useState(days)
        const [start, setStart] = useState({})
        const [end, setEnd] = useState({})
        const [description, setDescription] = useState({})
        
        const timeToDecimal = (t) => {
            var arr = t.split(':')
            var dec = parseInt((arr[1]/6)*10, 10)
        
            return parseFloat(parseInt(arr[0], 10) + '.' + (dec<10?'0':'') + dec)
        }

        // fix trailing digits
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
            // good solution for state array with many values
            // ----------------------------------------------
            const name = event.target.name
            const value = event.target.value
            setInputs(values => ({...values,
                [name]: value,
            }))

            setStart(values => ({...values,
                [name]: value,
            }))

            setEnd(values => ({...values,
                [name]: value,
            }))

            setDescription(values => ({...values,
                [name]: value,
            }))
                

            console.log('inputs', inputs, 'start', start, 'end', end, 'description', description)
            console.log(event.target.id)
            // setInputs(days[days.indexOf({dayNumber: event.target.id})])


            
            // refactor
            // -------------
            // let updatedDays = days.map(day => 
            //     parseInt(day.dayNumber) === parseInt(event.target.id) ?
            //     {...day, [name]: value}
            //     : day
            // )

            // setMonthDays(prevState => ({
            //     ...prevState,
            //     days: updatedDays
            // } ))
            // console.log('updated', inputs)
            // console.log('months', monthDays)
            // -------------



            // setInputs(prevState => ({
            //     hours: {
            //         ...prevState.hours,
            //         month: value,
            //         days:[{
            //             ...prevState.days,
                        
            //         }]
            //     }

            // }))

            // ...prevState,
            //     days: [{
            //         ...prevState.days,
            //         hours.days[4]
            //     }]
            
            // console.log(inputs.days[event.target.id].dayNumber);
        }

        const addTimeCard = async (event) => {
            event.preventDefault()
            const {month} = inputs
            if (!month) {
                return console.log('Month is a required field')
            }

            const {
                startWork0,
                startWork1,
                // startWork2,
                // startWork3,
                // startWork4,
                // startWork5,
                // startWork6,
                // startWork7,
                // startWork8,
                // startWork9,
                // startWork10,
                // startWork11,
                // startWork12,
                // startWork13,
                // startWork14,
                // startWork15,
                // startWork16,
                // startWork17,
                // startWork18,
                // startWork19,
                // startWork20,
                // startWork21,
                // startWork22,
                // startWork23,
                // startWork24,
                // startWork25,
                // startWork26,
                // startWork27,
                // startWork28,
                // startWork29,
                // startWork30,
                
            } = start

            const {
                endWork0,
                endWork1,
                // endWork2,
                // endWork3,
                // endWork4,
                // endWork5,
                // endWork6,
                // endWork7,
                // endWork8,
                // endWork9,
                // endWork10,
                // endWork11,
                // endWork12,
                // endWork13,
                // endWork14,
                // endWork15,
                // endWork16,
                // endWork17,
                // endWork18,
                // endWork19,
                // endWork20,
                // endWork21,
                // endWork22,
                // endWork23,
                // endWork24,
                // endWork25,
                // endWork26,
                // endWork27,
                // endWork28,
                // endWork29,
                // endWork30,
                
            } = end

            const {
                jobDescription0,
                jobDescription1,
                // jobDescription2,
                // jobDescription3,
                // jobDescription4,
                // jobDescription5,
                // jobDescription6,
                // jobDescription7,
                // jobDescription8,
                // jobDescription9,
                // jobDescription10,
                // jobDescription11,
                // jobDescription12,
                // jobDescription13,
                // jobDescription14,
                // jobDescription15,
                // jobDescription16,
                // jobDescription17,
                // jobDescription18,
                // jobDescription19,
                // jobDescription20,
                // jobDescription21,
                // jobDescription22,
                // jobDescription23,
                // jobDescription24,
                // jobDescription25,
                // jobDescription26,
                // jobDescription27,
                // jobDescription28,
                // jobDescription29,
                // jobDescription30,
                
            } = description

            // const object = {
            //     month: month,
            //     days: [
            //         {
            //             dayNumber: '21',
            //             jobDescription: jobDescription,
            //             startWork: startTime,
            //             endWork: finishTime
            //         },
            //         {
            //             dayNumber: '22',
            //             jobDescription: jobDescription22,
            //             startWork: startTime22,
            //             endWork: finishTime22
            //         }
            //     ]
            // }

            // for (let index = 0; index < 31; index++) {
            //     hours.days[index].startWork = `startWork${index}`
            // }
            hours.days[0].startWork = startWork0
            hours.days[1].startWork = startWork1
            // hours.days[2].startWork = startWork2
            // hours.days[3].startWork = startWork3
            // hours.days[4].startWork = startWork4
            // hours.days[5].startWork = startWork5
            // hours.days[6].startWork = startWork6
            // hours.days[7].startWork = startWork7
            // hours.days[8].startWork = startWork8
            // hours.days[9].startWork = startWork9
            // hours.days[10].startWork = startWork10
            // hours.days[11].startWork = startWork11
            // hours.days[12].startWork = startWork12
            // hours.days[13].startWork = startWork13
            // hours.days[14].startWork = startWork14
            // hours.days[15].startWork = startWork15
            // hours.days[16].startWork = startWork16
            // hours.days[17].startWork = startWork17
            // hours.days[18].startWork = startWork18
            // hours.days[19].startWork = startWork19
            // hours.days[20].startWork = startWork20
            // hours.days[21].startWork = startWork21
            // hours.days[22].startWork = startWork22
            // hours.days[23].startWork = startWork23
            // hours.days[24].startWork = startWork24
            // hours.days[25].startWork = startWork25
            // hours.days[26].startWork = startWork26
            // hours.days[27].startWork = startWork27
            // hours.days[28].startWork = startWork28
            // hours.days[29].startWork = startWork29
            // hours.days[30].startWork = startWork30
            
            hours.days[0].endWork = endWork0
            hours.days[1].endWork = endWork1
            // hours.days[2].endWork = endWork2
            // hours.days[3].endWork = endWork3
            // hours.days[4].endWork = endWork4
            // hours.days[5].endWork = endWork5
            // hours.days[6].endWork = endWork6
            // hours.days[7].endWork = endWork7
            // hours.days[8].endWork = endWork8
            // hours.days[9].endWork = endWork9
            // hours.days[10].endWork = endWork10
            // hours.days[11].endWork = endWork11
            // hours.days[12].endWork = endWork12
            // hours.days[13].endWork = endWork13
            // hours.days[14].endWork = endWork14
            // hours.days[15].endWork = endWork15
            // hours.days[16].endWork = endWork16
            // hours.days[17].endWork = endWork17
            // hours.days[18].endWork = endWork18
            // hours.days[19].endWork = endWork19
            // hours.days[20].endWork = endWork20
            // hours.days[21].endWork = endWork21
            // hours.days[22].endWork = endWork22
            // hours.days[23].endWork = endWork23
            // hours.days[24].endWork = endWork24
            // hours.days[25].endWork = endWork25
            // hours.days[26].endWork = endWork26
            // hours.days[27].endWork = endWork27
            // hours.days[28].endWork = endWork28
            // hours.days[29].endWork = endWork29
            // hours.days[30].endWork = endWork30
            console.log('jobDescription0', jobDescription0);
            hours.days[0].jobDescription = jobDescription0
            hours.days[1].jobDescription = jobDescription1
            // hours.days[2].jobDescription = jobDescription2
            // hours.days[3].jobDescription = jobDescription3
            // hours.days[4].jobDescription = jobDescription4
            // hours.days[5].jobDescription = jobDescription5
            // hours.days[6].jobDescription = jobDescription6
            // hours.days[7].jobDescription = jobDescription7
            // hours.days[8].jobDescription = jobDescription8
            // hours.days[9].jobDescription = jobDescription9
            // hours.days[10].jobDescription = jobDescription10
            // hours.days[11].jobDescription = jobDescription11
            // hours.days[12].jobDescription = jobDescription12
            // hours.days[13].jobDescription = jobDescription13
            // hours.days[14].jobDescription = jobDescription14
            // hours.days[15].jobDescription = jobDescription15
            // hours.days[16].jobDescription = jobDescription16
            // hours.days[17].jobDescription = jobDescription17
            // hours.days[18].jobDescription = jobDescription18
            // hours.days[19].jobDescription = jobDescription19
            // hours.days[20].jobDescription = jobDescription20
            // hours.days[21].jobDescription = jobDescription21
            // hours.days[22].jobDescription = jobDescription22
            // hours.days[23].jobDescription = jobDescription23
            // hours.days[24].jobDescription = jobDescription24
            // hours.days[25].jobDescription = jobDescription25
            // hours.days[26].jobDescription = jobDescription26
            // hours.days[27].jobDescription = jobDescription27
            // hours.days[28].jobDescription = jobDescription28
            // hours.days[29].jobDescription = jobDescription29
            // hours.days[30].jobDescription = jobDescription30

            console.log('inputs', inputs);
            hours.month = inputs.month
            // hours.days = {...days, days}
            console.log('uploaded', hours)
            await hoursService
              .create(hours)
            //   setInputs({ finishTime: '00:00', startTime: '00:00', finishTime22: '00:00', startTime22: '00:00' })
            // setInputs(hours)
            console.log(inputs)
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
                        
                            <div className='timeCardHeader'>
                                <p className='left'>DATO / DATE</p>
                                <p className='left'>JOB DESCRIPTION</p>
                                <p className='left'>START: TIME</p>
                                <p className='left'>FINISH: TIME</p>
                                <p className='left'>TOTAL HOURS/TIMER</p>
                            </div>

                            <div>
                                <p>days[0].dayNumber</p>

                                <input 
                                    id='0'
                                    type="time"
                                    name="startWork0"
                                    value={start.startWork0 || '00:00'}
                                    onChange={handleChange}
                                />

                                <input 
                                    id='0'
                                    type="time"
                                    name="endWork0"
                                    value={end.endWork0 || '00:00'}
                                    onChange={handleChange}
                                />
                                

                                <input 
                                    id='0'
                                    type="text"
                                    name="jobDescription0"
                                    value={description.jobDescription0 || ''}
                                    onChange={handleChange}
                                />
                            </div>

                            <div>
                                <p>days[1].dayNumber</p>

                                <input 
                                    id='1'
                                    type="time"
                                    name="startWork1"
                                    value={start.startWork1 || '00:00'}
                                    onChange={handleChange}
                                />

                                <input 
                                    id='1'
                                    type="time"
                                    name="endWork1"
                                    value={end.endWork1 || '00:00'}
                                    onChange={handleChange}
                                />
                                

                                <input 
                                    id='1'
                                    type="text"
                                    name="jobDescription1"
                                    value={description.jobDescription1 || ''}
                                    onChange={handleChange}
                                />
                            </div>

                            

                            {/* {inputs.days.map( */}
                            {/* {days.map(
                                day =>
                                <div key={day.dayNumber} className='eachDay'>
                                    <p className='dateright'>{ day.dayNumber}</p>
                            
                                    <input className='jobright'
                                        id={day.dayNumber}
                                        type="text"
                                        name="jobDescription"
                                        value={inputs.jobDescription || ''}
                                        onChange={handleChange}
                                    />
                                    <input className='startright'
                                        id={day.dayNumber}
                                        type="time"
                                        name="startWork"
                                        value={inputs.startWork || ''}
                                        onChange={handleChange}
                                    />
                                    <input className='finishright'
                                        id={day.dayNumber}
                                        type="time"
                                        name="endWork"
                                        value={inputs.endWork || ''}
                                        onChange={handleChange}
                                    />                            

                                    <p className='totalright'>{ inputs.startTime !== inputs.finishTime &&
                                    JSON.stringify(calculate(timeToDecimal(inputs.startTime), timeToDecimal(inputs.finishTime))) }</p>
                            
                                </div>
                            ) } */}
                        
                        {/* this form format works
                        // ----------------------- */}
                            {/* <p className='dateright'>21</p>
                            
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
                            JSON.stringify(calculate(timeToDecimal(inputs.startTime), timeToDecimal(inputs.finishTime))) }</p> */}
                        
                    </div>
                    {/* <div className='timecard'>
                        
                            
                            <p className='left22'>DATO / DATE</p>
                            <p className='left22'>JOB DESCRIPTION</p>
                            <p className='left22'>START: TIME</p>
                            <p className='left22'>FINISH: TIME</p>
                            <p className='left22'>TOTAL HOURS/TIMER</p>
                        
                        
                            <p className='dateright'>22</p>
                            
                            <input className='jobright'
                                type="text"
                                name="jobDescription22"
                                value={inputs.jobDescription22 || ''}
                                onChange={handleChange}
                            />
                            <input className='startright'
                                type="time"
                                name="startTime22"
                                value={inputs.startTime22 || ''}
                                onChange={handleChange}
                            />
                            <input className='finishright'
                                type="time"
                                name="finishTime22"
                                value={inputs.finishTime22 || ''}
                                onChange={handleChange}
                            />
                                                        
                            <p className='totalright'>{ inputs.startTime22 !== inputs.finishTime22 &&
                            JSON.stringify(calculate(timeToDecimal(inputs.startTime22), timeToDecimal(inputs.finishTime22))) }</p>
                        
                    </div> */}
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