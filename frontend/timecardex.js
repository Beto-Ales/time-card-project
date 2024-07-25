// import React, { useEffect } from 'react'
import { useState, useEffect } from 'react'
import hoursService from '../services/hours'
import usersService from '../services/users'


// component containing inner components for each screen: employee list of time cards, specific time card,
// create time card & update time card 
const TimeCard = ({ user, setUser, setErrorMessage }) => {
    const [screen, setScreen] = useState('1')
    const [hours, setHours] = useState(null)

    useEffect(() => {
        if (user) {
            if (user.username !== 'jan') {
        try {
          usersService.getOne(user.id)
            .then(user => setUser(user))
        } catch (error) {
          setErrorMessage(error)
            setTimeout(() => {
              setErrorMessage(null)
            }, 5000)
        }
      }
        }
    }, [screen])

    const loading = () => {
        if (user === null) {
            return 'Loading...'
        }
    }

    const ScreenOne = ({ user }) => {        
        return (
            <div>                
                <h1>{ loading() }</h1>
                <br/>
                <button className='screenBtn' onClick={() => toScreen('3')} >New time card</button>
                <ul>
                    {
                        user &&
                        user.hours.map(
                            hours =>
                            <li key={hours.id}>
                                <button onClick={() => handleGetHours(hours)}>
                                    <p><b>Period: </b>{hours.month}</p>
                                    <p><b>Last update: </b>{hours.date}</p>                                    
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
      <h1>{hours.month.toUpperCase()}</h1>
      <button className='screenBtn' onClick={() => toScreen('1')} >Back</button>
        <button className='screenBtn' onClick={() => toScreen('4')} >Edit</button>
      
      <div className='userTable userTableHeader'>
          <span className='headerTitle date-column'>DATE</span>
          <span className='headerTitle holiday-column'>HOLYDAY</span>
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
      
    const ScreenThree = () => {
        
        // set timecard template
        const hours = {
            month: '',
            days:[],
            monthHours:'',    
        }
        const days = []
        
        // set days
        for (let index = 0; index < 31; index++) {
            if (index < 11) {
                // hours.days.push({
                    days.push({
                    dayNumber: index + 21,  // day start from 21 'couse index is 0. once index is 10 day is 31
                    jobDescription: '',
                    startWorkA: '00:00',
                    endWorkA: '00:00',
                    totalHours: '',
                })    
            } else {
                // hours.days.push({
                    days.push({
                    dayNumber: index - 10,  // once index is 11 substract 10 to start from this point with day 1
                    jobDescription: '',
                    startWorkA: '00:00',
                    endWorkA: '00:00',
                    totalHours: '',
                })
            }
        }

        hours.days = days
        
        const [inputs, setInputs] = useState({})        
        const [start, setStart] = useState({})
        const [end, setEnd] = useState({})
        const [description, setDescription] = useState({})
        const [day, setDay] = useState({})
        const [checked, setChecked] = useState({})
        
        const timeToDecimal = (t) => {
            var arr = t.split(':')
            var dec = parseInt((arr[1]/6)*10, 10)
        
            return parseFloat(parseInt(arr[0], 10) + '.' + (dec<10?'0':'') + dec)
        }

        
        const calculate = (startTimeA, endTimeA, startTimeB, endTimeB, isWeekend, holiday) => {
            let startA = startTimeA
            let endA = endTimeA
            let startB = startTimeB
            let endB = endTimeB

            let normal = 0
            let lateHours = 0
            let holidayHours = 0

            if (endA < 4) {
                endA += 24
            }

            if (endB < 4) {
                endB += 24
            }

            
            if(startTimeA === endTimeA) {
                startA = 0
                endA = 0
            }

            if(startTimeB === endTimeB) {
                startB = 0
                endB = 0
            }
            
            let total = endA - startA + endB - startB

            // monday to friday
            // ----------------

            // isWeekend !== 6 (saturday) || isWeekend !== 0 (sunday)
            
            if (isWeekend !== 6) {     
                
                if (startA >= 18) {
                    lateHours = endA - startA + endB - startB
                    normal = 0
                } else if (endA >= 18) {
                    lateHours = endA - 18 + endB - startB
                    normal = 18 - startA
                } else if (startB >= 18) {
                    lateHours = endB - startB
                    normal = endA - startA
                } else if (endB >= 18) {
                    lateHours = endB - 18
                    normal = 18 - startB + endA - startA
                } else {
                    lateHours = 0
                    normal = endA - startA + endB - startB
                }

            }
            // ----------------
            // monday to friday



            // saturday
            // --------

            // isWeekend === 6 (saturday)

            if (isWeekend === 6) {

                if (startA >= 14) {
                    lateHours = endA - startA + endB - startB
                    normal = 0
                } else if (endA >= 14) {
                    lateHours = endA - 14 + endB - startB
                    normal = 14 - startA
                } else if (startB >= 14) {
                    lateHours = endB - startB
                    normal = endA - startA
                } else if (endB >= 14) {
                    lateHours = endB - 14
                    normal = 14 - startB + endA - startA
                } else {
                    lateHours = 0
                    normal = endA - startA + endB - startB
                }

            }
            // --------
            // saturday
            
            

            normal = normal % 1 !== 0 ? normal.toFixed(2) : normal
            lateHours = lateHours % 1 !== 0 ? lateHours.toFixed(2) : lateHours
            total = total % 1 !== 0 ? total.toFixed(2) : total

            // isWeekend === 0 (sunday) or holiday (checkbox)
            if (isWeekend === 0 || holiday) {
                holidayHours = total
                lateHours = 0
                normal = 0
            }

            return {                
                normal: normal,
                lateHours: lateHours,
                holidayHours: holidayHours,
                total: total
            }
        }

        const handleChange = (event) => {

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

            setDay(values => ({...values,
                [name]: value,
            }))

            setChecked(values => ({...values,
                [name]: event.target.checked,}))
        }

        const addTimeCard = async (event) => {
            event.preventDefault()
            const {month} = inputs
            if (!month) {                
                setErrorMessage('Month is a required field')
                setTimeout(() => {
                setErrorMessage(null)
                }, 5000)
                return
            }

            const dayName = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"]
            
            hours.days.map((singleDay, index) => {

                // if startWorkA is not defined, leave default value time 00:00
                singleDay.startWorkA = inputs[`startWorkA${index}`] || '00:00'
                
                singleDay.startWorkB = inputs[`startWorkB${index}`] || '00:00'
                
                singleDay.endWorkA = inputs[`endWorkA${index}`] || '00:00'

                singleDay.endWorkB = inputs[`endWorkB${index}`] || '00:00'

                singleDay.jobDescription = inputs[`jobDescription${index}`] || ''

                singleDay.holiday = checked[`holiday${index}`] || false

                singleDay.dayNumber = `${inputs[`day${index}`]} ${dayName[new Date(inputs[`day${index}`]).getDay()]}` || ''

                singleDay.totalHours = calculate(timeToDecimal(singleDay.startWorkA), timeToDecimal(singleDay.endWorkA), timeToDecimal(singleDay.startWorkB), timeToDecimal(singleDay.endWorkB), new Date(inputs[`day${index}`]).getDay(), checked[`holiday${index}`])

            })
                        

            const normal = hours.days.map(day => day.totalHours && day.totalHours.normal)
            const lateHours = hours.days.map(day => day.totalHours && day.totalHours.lateHours)
            const holidayHours = hours.days.map(day => day.totalHours && day.totalHours.holidayHours)
            const total = hours.days.map(day => day.totalHours && day.totalHours.total)
            const allNormal = normal.filter(value => value !== undefined ).map(x => x = Number(x)).reduce((a,b) => a+b)
            const allLateHours = lateHours.filter(value => value !== undefined ).map(x => x = Number(x)).reduce((a,b) => a+b)
            const allHolidayHours = holidayHours.filter(value => value !== undefined ).map(x => x = Number(x)).reduce((a,b) => a+b)
            const allTotal = total.filter(value => value !== undefined ).map(x => x = Number(x)).reduce((a,b) => a+b)

            let numallNormal = allNormal % 1 !== 0 ? parseFloat(allNormal).toFixed(2) : allNormal
            let numallLateHours = allLateHours % 1 !== 0 ? parseFloat(allLateHours).toFixed(2) : allLateHours
            let numallHolidayHours = allHolidayHours % 1 !== 0 ? parseFloat(allHolidayHours).toFixed(2) : allHolidayHours
            let numallTotal = allTotal % 1 !== 0 ? parseFloat(allTotal).toFixed(2) : allTotal

            hours.monthHours = {
                totalHours: numallTotal,
                normalRate: numallNormal,
                lateHoursRate: numallLateHours,
                holidayHoursRate: numallHolidayHours,
            }

            hours.month = inputs.month
            
            await hoursService
            //   .create(hours)
            console.log(hours)
              setErrorMessage('Time card created')
              setTimeout(() => {
                setErrorMessage(null)
              }, 5000)
          }        

        return (
            <div>
                <h1>TIME CARD</h1>
                <br/>
                <button className='screenBtn' onClick={() => toScreen('1')} >Back</button>
                <br/>
                
                <form onSubmit={addTimeCard}>
                    <p>MONTH</p>
                    <input
                        type="text"
                        name="month"
                        value={inputs.month || ''}
                        onChange={handleChange}
                        // placeholder="Month"
                    />

                    <div className='timecard'>

                            {days.map((eachDay, index) => {
                                    
                                    return(
                                
                                            <div className={index === 0 ? 'eachDay topeachday' : 'eachDay'} key={index}>
                                                <p className={index === 0 ? 'topDay day' : 'day'}>{eachDay.dayNumber}</p>

                                                <div>
                                                    {index === 0 && <p className='mobileHide'>Date</p>}

                                                    <input
                                                        id={index}
                                                        type="date"
                                                        label='Date'
                                                        name={`day${index}`}
                                                        value={day[`day${index}`] || ''}
                                                        onChange={handleChange}
                                                        // placeholder="Date"
                                                    />                                                    
                                                </div>

                                                <div>
                                                    {index === 0 && <p className='mobileHide'>Holyday</p>}

                                                    <input className='holiday'
                                                        id={index}
                                                        type="checkbox"
                                                        name={`holiday${index}`}
                                                        value={inputs[`holiday${index}`] || ''}
                                                        onChange={handleChange}
                                                    />
                                                </div>

                                                <div>
                                                    {index === 0 && <p className='mobileHide'>Job Description</p>}

                                                    <input 
                                                        id={index}
                                                        type="text"
                                                        name={`jobDescription${index}`}
                                                        value={description[`jobDescription${index}`] || ''}
                                                        onChange={handleChange}
                                                        // placeholder="Job description"
                                                    />
                                                </div>
                                                
                                                <div>
                                                    {index === 0 && <p className='startA mobileHide'>Start</p>}

                                                    <input className='startA'
                                                        id={index}
                                                        type="time"
                                                        name={`startWorkA${index}`}
                                                        value={start[`startWorkA${index}`] || '00:00'}
                                                        onChange={handleChange}
                                                    />
                                                </div>
                                                
                                                <div>
                                                    {index === 0 && <p className='endA mobileHide'>End</p>}

                                                    <input className='endA'
                                                        id={index}
                                                        type="time"
                                                        name={`endWorkA${index}`}
                                                        value={end[`endWorkA${index}`] || '00:00'}
                                                        onChange={handleChange}
                                                    />
                                                </div>

                                                <div>
                                                    {index === 0 && <p className='startB mobileHide'>Start</p>}

                                                    <input  className='startB'
                                                        id={index}
                                                        type="time"
                                                        name={`startWorkB${index}`}
                                                        value={start[`startWorkB${index}`] || '00:00'}
                                                        onChange={handleChange}
                                                    />
                                                </div>

                                                <div>
                                                    {index === 0 && <p className='endB mobileHide'>End</p>}

                                                    <input  className='endB'
                                                        id={index}
                                                        type="time"
                                                        name={`endWorkB${index}`}
                                                        value={end[`endWorkB${index}`] || '00:00'}
                                                        onChange={handleChange}
                                                />
                                                </div>
                                            </div>   )} 
                            )}
                    </div>                    
                    <button className='uploadBtn screenBtn' type="submit">Upload</button>
                </form>
            </div>
        )
    }

    // edit and update time card
    const ScreenFour = ({ hours }) => {

        const hoursToUpdate = hours
        
        // from screenThree
        // ----------------
        // const [inputs, setInputs] = useState({
        //     month: hoursToUpdate.month
        // })

        const dayName = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"]

        // replace hardcoding
        const xx = []

        for (let index = 0; index < hoursToUpdate.days.length; index++) {
            xx.push({[`startWorkA${index}`]: hoursToUpdate.days[index].startWorkA})
            xx.push({[`startWorkB${index}`]: hoursToUpdate.days[index].startWorkB})
            xx.push({[`endWorkA${index}`]: hoursToUpdate.days[index].endWorkA})
            xx.push({[`endWorkB${index}`]: hoursToUpdate.days[index].endWorkB})
            xx.push({[`jobDescription${index}`]: hoursToUpdate.days[index].jobDescription})
            xx.push({[`day${index}`]: `${hoursToUpdate.days[index].dayNumber.split(" ")[0]} ${dayName[new Date(`day${index}`).getDay()]}` || ''})
        }

        xx.push({month: hoursToUpdate.month})

        const [inputs, setInputs] = useState(xx)

        // ----------------------------------------------------------
        // [`holiday${index}`]: hoursToUpdate.days[index].holiday,
        //         holiday0: hoursToUpdate.days[0].holiday || false,
        // ----------------------------------------------------------

        // another option for organizing the data
        // for (let index = 0; index < hoursToUpdate.days.length; index++) {
        //     xx.push(
        //         {
        //         [`startWorkA${index}`]: hoursToUpdate.days[index].startWorkA                
        //         },
        //         {
        //             [`startWorkB${index}`]: hoursToUpdate.days[index].startWorkB                
        //         },
        //         {
        //             [`endWorkA${index}`]: hoursToUpdate.days[index].endWorkA                
        //         },
        //         {
        //             [`endWorkB${index}`]: hoursToUpdate.days[index].endWorkB
        //         }
        //     )
            
        // }

        

        const [beto, setBeto] = useState(xx) 
        const [start, setStart] = useState({
            startWorkA0: hoursToUpdate.days[0].startWorkA,
            startWorkA1: hoursToUpdate.days[1].startWorkA,
            startWorkA2: hoursToUpdate.days[2].startWorkA,
            startWorkA3: hoursToUpdate.days[3].startWorkA,
            startWorkA4: hoursToUpdate.days[4].startWorkA,
            startWorkA5: hoursToUpdate.days[5].startWorkA,
            startWorkA6: hoursToUpdate.days[6].startWorkA,
            startWorkA7: hoursToUpdate.days[7].startWorkA,
            startWorkA8: hoursToUpdate.days[8].startWorkA,
            startWorkA9: hoursToUpdate.days[9].startWorkA,
            startWorkA10: hoursToUpdate.days[10].startWorkA,
            startWorkA11: hoursToUpdate.days[11].startWorkA,
            startWorkA12: hoursToUpdate.days[12].startWorkA,
            startWorkA13: hoursToUpdate.days[13].startWorkA,
            startWorkA14: hoursToUpdate.days[14].startWorkA,
            startWorkA15: hoursToUpdate.days[15].startWorkA,
            startWorkA16: hoursToUpdate.days[16].startWorkA,
            startWorkA17: hoursToUpdate.days[17].startWorkA,
            startWorkA18: hoursToUpdate.days[18].startWorkA,
            startWorkA19: hoursToUpdate.days[19].startWorkA,
            startWorkA20: hoursToUpdate.days[20].startWorkA,
            startWorkA21: hoursToUpdate.days[21].startWorkA,
            startWorkA22: hoursToUpdate.days[22].startWorkA,
            startWorkA23: hoursToUpdate.days[23].startWorkA,
            startWorkA24: hoursToUpdate.days[24].startWorkA,
            startWorkA25: hoursToUpdate.days[25].startWorkA,
            startWorkA26: hoursToUpdate.days[26].startWorkA,
            startWorkA27: hoursToUpdate.days[27].startWorkA,
            startWorkA28: hoursToUpdate.days[28].startWorkA,
            startWorkA29: hoursToUpdate.days[29].startWorkA,
            startWorkA30: hoursToUpdate.days[30].startWorkA,
            // ---------------------------------------------
            startWorkB0: hoursToUpdate.days[0].startWorkB,
            startWorkB1: hoursToUpdate.days[1].startWorkB,
            startWorkB2: hoursToUpdate.days[2].startWorkB,
            startWorkB3: hoursToUpdate.days[3].startWorkB,
            startWorkB4: hoursToUpdate.days[4].startWorkB,
            startWorkB5: hoursToUpdate.days[5].startWorkB,
            startWorkB6: hoursToUpdate.days[6].startWorkB,
            startWorkB7: hoursToUpdate.days[7].startWorkB,
            startWorkB8: hoursToUpdate.days[8].startWorkB,
            startWorkB9: hoursToUpdate.days[9].startWorkB,
            startWorkB10: hoursToUpdate.days[10].startWorkB,
            startWorkB11: hoursToUpdate.days[11].startWorkB,
            startWorkB12: hoursToUpdate.days[12].startWorkB,
            startWorkB13: hoursToUpdate.days[13].startWorkB,
            startWorkB14: hoursToUpdate.days[14].startWorkB,
            startWorkB15: hoursToUpdate.days[15].startWorkB,
            startWorkB16: hoursToUpdate.days[16].startWorkB,
            startWorkB17: hoursToUpdate.days[17].startWorkB,
            startWorkB18: hoursToUpdate.days[18].startWorkB,
            startWorkB19: hoursToUpdate.days[19].startWorkB,
            startWorkB20: hoursToUpdate.days[20].startWorkB,
            startWorkB21: hoursToUpdate.days[21].startWorkB,
            startWorkB22: hoursToUpdate.days[22].startWorkB,
            startWorkB23: hoursToUpdate.days[23].startWorkB,
            startWorkB24: hoursToUpdate.days[24].startWorkB,
            startWorkB25: hoursToUpdate.days[25].startWorkB,
            startWorkB26: hoursToUpdate.days[26].startWorkB,
            startWorkB27: hoursToUpdate.days[27].startWorkB,
            startWorkB28: hoursToUpdate.days[28].startWorkB,
            startWorkB29: hoursToUpdate.days[29].startWorkB,
            startWorkB30: hoursToUpdate.days[30].startWorkB,
        })
        const [end, setEnd] = useState({
            endWorkA0: hoursToUpdate.days[0].endWorkA,
            endWorkA1: hoursToUpdate.days[1].endWorkA,
            endWorkA2: hoursToUpdate.days[2].endWorkA,
            endWorkA3: hoursToUpdate.days[3].endWorkA,
            endWorkA4: hoursToUpdate.days[4].endWorkA,
            endWorkA5: hoursToUpdate.days[5].endWorkA,
            endWorkA6: hoursToUpdate.days[6].endWorkA,
            endWorkA7: hoursToUpdate.days[7].endWorkA,
            endWorkA8: hoursToUpdate.days[8].endWorkA,
            endWorkA9: hoursToUpdate.days[9].endWorkA,
            endWorkA10: hoursToUpdate.days[10].endWorkA,
            endWorkA11: hoursToUpdate.days[11].endWorkA,
            endWorkA12: hoursToUpdate.days[12].endWorkA,
            endWorkA13: hoursToUpdate.days[13].endWorkA,
            endWorkA14: hoursToUpdate.days[14].endWorkA,
            endWorkA15: hoursToUpdate.days[15].endWorkA,
            endWorkA16: hoursToUpdate.days[16].endWorkA,
            endWorkA17: hoursToUpdate.days[17].endWorkA,
            endWorkA18: hoursToUpdate.days[18].endWorkA,
            endWorkA19: hoursToUpdate.days[19].endWorkA,
            endWorkA20: hoursToUpdate.days[20].endWorkA,
            endWorkA21: hoursToUpdate.days[21].endWorkA,
            endWorkA22: hoursToUpdate.days[22].endWorkA,
            endWorkA23: hoursToUpdate.days[23].endWorkA,
            endWorkA24: hoursToUpdate.days[24].endWorkA,
            endWorkA25: hoursToUpdate.days[25].endWorkA,
            endWorkA26: hoursToUpdate.days[26].endWorkA,
            endWorkA27: hoursToUpdate.days[27].endWorkA,
            endWorkA28: hoursToUpdate.days[28].endWorkA,
            endWorkA29: hoursToUpdate.days[29].endWorkA,
            endWorkA30: hoursToUpdate.days[30].endWorkA,
            // -----------------------------------------
            endWorkB0: hoursToUpdate.days[0].endWorkB,
            endWorkB1: hoursToUpdate.days[1].endWorkB,
            endWorkB2: hoursToUpdate.days[2].endWorkB,
            endWorkB3: hoursToUpdate.days[3].endWorkB,
            endWorkB4: hoursToUpdate.days[4].endWorkB,
            endWorkB5: hoursToUpdate.days[5].endWorkB,
            endWorkB6: hoursToUpdate.days[6].endWorkB,
            endWorkB7: hoursToUpdate.days[7].endWorkB,
            endWorkB8: hoursToUpdate.days[8].endWorkB,
            endWorkB9: hoursToUpdate.days[9].endWorkB,
            endWorkB10: hoursToUpdate.days[10].endWorkB,
            endWorkB11: hoursToUpdate.days[11].endWorkB,
            endWorkB12: hoursToUpdate.days[12].endWorkB,
            endWorkB13: hoursToUpdate.days[13].endWorkB,
            endWorkB14: hoursToUpdate.days[14].endWorkB,
            endWorkB15: hoursToUpdate.days[15].endWorkB,
            endWorkB16: hoursToUpdate.days[16].endWorkB,
            endWorkB17: hoursToUpdate.days[17].endWorkB,
            endWorkB18: hoursToUpdate.days[18].endWorkB,
            endWorkB19: hoursToUpdate.days[19].endWorkB,
            endWorkB20: hoursToUpdate.days[20].endWorkB,
            endWorkB21: hoursToUpdate.days[21].endWorkB,
            endWorkB22: hoursToUpdate.days[22].endWorkB,
            endWorkB23: hoursToUpdate.days[23].endWorkB,
            endWorkB24: hoursToUpdate.days[24].endWorkB,
            endWorkB25: hoursToUpdate.days[25].endWorkB,
            endWorkB26: hoursToUpdate.days[26].endWorkB,
            endWorkB27: hoursToUpdate.days[27].endWorkB,
            endWorkB28: hoursToUpdate.days[28].endWorkB,
            endWorkB29: hoursToUpdate.days[29].endWorkB,
            endWorkB30: hoursToUpdate.days[30].endWorkB,
        })
        const [description, setDescription] = useState({
            jobDescription0: hoursToUpdate.days[0].jobDescription,
            jobDescription1: hoursToUpdate.days[1].jobDescription,
            jobDescription2: hoursToUpdate.days[2].jobDescription,
            jobDescription3: hoursToUpdate.days[3].jobDescription,
            jobDescription4: hoursToUpdate.days[4].jobDescription,
            jobDescription5: hoursToUpdate.days[5].jobDescription,
            jobDescription6: hoursToUpdate.days[6].jobDescription,
            jobDescription7: hoursToUpdate.days[7].jobDescription,
            jobDescription8: hoursToUpdate.days[8].jobDescription,
            jobDescription9: hoursToUpdate.days[9].jobDescription,
            jobDescription10: hoursToUpdate.days[10].jobDescription,
            jobDescription11: hoursToUpdate.days[11].jobDescription,
            jobDescription12: hoursToUpdate.days[12].jobDescription,
            jobDescription13: hoursToUpdate.days[13].jobDescription,
            jobDescription14: hoursToUpdate.days[14].jobDescription,
            jobDescription15: hoursToUpdate.days[15].jobDescription,
            jobDescription16: hoursToUpdate.days[16].jobDescription,
            jobDescription17: hoursToUpdate.days[17].jobDescription,
            jobDescription18: hoursToUpdate.days[18].jobDescription,
            jobDescription19: hoursToUpdate.days[19].jobDescription,
            jobDescription20: hoursToUpdate.days[20].jobDescription,
            jobDescription21: hoursToUpdate.days[21].jobDescription,
            jobDescription22: hoursToUpdate.days[22].jobDescription,
            jobDescription23: hoursToUpdate.days[23].jobDescription,
            jobDescription24: hoursToUpdate.days[24].jobDescription,
            jobDescription25: hoursToUpdate.days[25].jobDescription,
            jobDescription26: hoursToUpdate.days[26].jobDescription,
            jobDescription27: hoursToUpdate.days[27].jobDescription,
            jobDescription28: hoursToUpdate.days[28].jobDescription,
            jobDescription29: hoursToUpdate.days[29].jobDescription,
            jobDescription30: hoursToUpdate.days[30].jobDescription,
        })

        // hoursToUpdate.days[0].dayNumber has a string containing 2 values
        // date in format dd/mm/yyy and day name
        // split the string and get date dd/mm/yyy
        // splitDate0[0] = dd/mm/yyy. splitDate0[1] = 'Saturday'

        let splitDate0 = hoursToUpdate.days[0].dayNumber.split(" ")
        let splitDate1 = hoursToUpdate.days[1].dayNumber.split(" ")
        let splitDate2 = hoursToUpdate.days[2].dayNumber.split(" ")
        let splitDate3 = hoursToUpdate.days[3].dayNumber.split(" ")
        let splitDate4 = hoursToUpdate.days[4].dayNumber.split(" ")
        let splitDate5 = hoursToUpdate.days[5].dayNumber.split(" ")
        let splitDate6 = hoursToUpdate.days[6].dayNumber.split(" ")
        let splitDate7 = hoursToUpdate.days[7].dayNumber.split(" ")
        let splitDate8 = hoursToUpdate.days[8].dayNumber.split(" ")
        let splitDate9 = hoursToUpdate.days[9].dayNumber.split(" ")
        let splitDate10 = hoursToUpdate.days[10].dayNumber.split(" ")
        let splitDate11 = hoursToUpdate.days[11].dayNumber.split(" ")
        let splitDate12 = hoursToUpdate.days[12].dayNumber.split(" ")
        let splitDate13 = hoursToUpdate.days[13].dayNumber.split(" ")
        let splitDate14 = hoursToUpdate.days[14].dayNumber.split(" ")
        let splitDate15 = hoursToUpdate.days[15].dayNumber.split(" ")
        let splitDate16 = hoursToUpdate.days[16].dayNumber.split(" ")
        let splitDate17 = hoursToUpdate.days[17].dayNumber.split(" ")
        let splitDate18 = hoursToUpdate.days[18].dayNumber.split(" ")
        let splitDate19 = hoursToUpdate.days[19].dayNumber.split(" ")
        let splitDate20 = hoursToUpdate.days[20].dayNumber.split(" ")
        let splitDate21 = hoursToUpdate.days[21].dayNumber.split(" ")
        let splitDate22 = hoursToUpdate.days[22].dayNumber.split(" ")
        let splitDate23 = hoursToUpdate.days[23].dayNumber.split(" ")
        let splitDate24 = hoursToUpdate.days[24].dayNumber.split(" ")
        let splitDate25 = hoursToUpdate.days[25].dayNumber.split(" ")
        let splitDate26 = hoursToUpdate.days[26].dayNumber.split(" ")
        let splitDate27 = hoursToUpdate.days[27].dayNumber.split(" ")
        let splitDate28 = hoursToUpdate.days[28].dayNumber.split(" ")
        let splitDate29 = hoursToUpdate.days[29].dayNumber.split(" ")
        let splitDate30 = hoursToUpdate.days[30].dayNumber.split(" ")

        const [day, setDay] = useState({
            day0: splitDate0[0],
            day1: splitDate1[0],
            day2: splitDate2[0],
            day3: splitDate3[0],
            day4: splitDate4[0],
            day5: splitDate5[0],
            day6: splitDate6[0],
            day7: splitDate7[0],
            day8: splitDate8[0],
            day9: splitDate9[0],
            day10: splitDate10[0],
            day11: splitDate11[0],
            day12: splitDate12[0],
            day13: splitDate13[0],
            day14: splitDate14[0],
            day15: splitDate15[0],
            day16: splitDate16[0],
            day17: splitDate17[0],
            day18: splitDate18[0],
            day19: splitDate19[0],
            day20: splitDate20[0],
            day21: splitDate21[0],
            day22: splitDate22[0],
            day23: splitDate23[0],
            day24: splitDate24[0],
            day25: splitDate25[0],
            day26: splitDate26[0],
            day27: splitDate27[0],
            day28: splitDate28[0],
            day29: splitDate29[0],
            day30: splitDate30[0],
        })
        // const [days, setDays] = useState([])    // days is not defined
        // setDays(hoursToUpdate.days) // days is not defined

        const [checked, setChecked] = useState({
            holiday0: hoursToUpdate.days[0].holiday || false,
            holiday1: hoursToUpdate.days[1].holiday || false,
            holiday2: hoursToUpdate.days[2].holiday || false,
            holiday3: hoursToUpdate.days[3].holiday || false,
            holiday4: hoursToUpdate.days[4].holiday || false,
            holiday5: hoursToUpdate.days[5].holiday || false,
            holiday6: hoursToUpdate.days[6].holiday || false,
            holiday7: hoursToUpdate.days[7].holiday || false,
            holiday8: hoursToUpdate.days[8].holiday || false,
            holiday9: hoursToUpdate.days[9].holiday || false,
            holiday10: hoursToUpdate.days[10].holiday || false,
            holiday11: hoursToUpdate.days[11].holiday || false,
            holiday12: hoursToUpdate.days[12].holiday || false,
            holiday13: hoursToUpdate.days[13].holiday || false,
            holiday14: hoursToUpdate.days[14].holiday || false,
            holiday15: hoursToUpdate.days[15].holiday || false,
            holiday16: hoursToUpdate.days[16].holiday || false,
            holiday17: hoursToUpdate.days[17].holiday || false,
            holiday18: hoursToUpdate.days[18].holiday || false,
            holiday19: hoursToUpdate.days[19].holiday || false,
            holiday20: hoursToUpdate.days[20].holiday || false,
            holiday21: hoursToUpdate.days[21].holiday || false,
            holiday22: hoursToUpdate.days[22].holiday || false,
            holiday23: hoursToUpdate.days[23].holiday || false,
            holiday24: hoursToUpdate.days[24].holiday || false,
            holiday25: hoursToUpdate.days[25].holiday || false,
            holiday26: hoursToUpdate.days[26].holiday || false,
            holiday27: hoursToUpdate.days[27].holiday || false,
            holiday28: hoursToUpdate.days[28].holiday || false,
            holiday29: hoursToUpdate.days[29].holiday || false,
            holiday30: hoursToUpdate.days[30].holiday || false,
        })
        
        const timeToDecimal = (t) => {
            var arr = t.split(':')
            var dec = parseInt((arr[1]/6)*10, 10)
        
            return parseFloat(parseInt(arr[0], 10) + '.' + (dec<10?'0':'') + dec)
        }

        const calculate = (startTimeA, endTimeA, startTimeB, endTimeB, isWeekend, holiday) => {
            let startA = startTimeA
            let endA = endTimeA
            let startB = startTimeB
            let endB = endTimeB

            let normal = 0
            let lateHours = 0
            let holidayHours = 0

            if (endA < 4) {
                endA += 24
            }

            if (endB < 4) {
                endB += 24
            }

            if(startTimeA === endTimeA) {
                startA = 0
                endA = 0
            }

            if(startTimeB === endTimeB) {
                startB = 0
                endB = 0
            }
            
            let total = endA - startA + endB - startB

            // monday to friday
            // ----------------

            // isWeekend !== 6 (saturday) || isWeekend !== 0 (sunday)
            
            if (isWeekend !== 6) {     
                
                if (startA >= 18) {
                    lateHours = endA - startA + endB - startB
                    normal = 0
                } else if (endA >= 18) {
                    lateHours = endA - 18 + endB - startB
                    normal = 18 - startA
                } else if (startB >= 18) {
                    lateHours = endB - startB
                    normal = endA - startA
                } else if (endB >= 18) {
                    lateHours = endB - 18
                    normal = 18 - startB + endA - startA
                } else {
                    lateHours = 0
                    normal = endA - startA + endB - startB
                }

            }
            // ----------------
            // monday to friday



            // saturday
            // --------

            // isWeekend === 6 (saturday)

            if (isWeekend === 6) {

                if (startA >= 14) {
                    lateHours = endA - startA + endB - startB
                    normal = 0
                } else if (endA >= 14) {
                    lateHours = endA - 14 + endB - startB
                    normal = 14 - startA
                } else if (startB >= 14) {
                    lateHours = endB - startB
                    normal = endA - startA
                } else if (endB >= 14) {
                    lateHours = endB - 14
                    normal = 14 - startB + endA - startA
                } else {
                    lateHours = 0
                    normal = endA - startA + endB - startB
                }

            }
            // --------
            // saturday
            
            

            normal = normal % 1 !== 0 ? normal.toFixed(2) : normal
            lateHours = lateHours % 1 !== 0 ? lateHours.toFixed(2) : lateHours
            total = total % 1 !== 0 ? total.toFixed(2) : total

            // isWeekend === 0 (sunday) or holiday (checkbox)
            if (isWeekend === 0 || holiday) {
                holidayHours = total
                lateHours = 0
                normal = 0
            }

            return {                
                normal: normal,
                lateHours: lateHours,
                holidayHours: holidayHours,
                total: total
            }
        }

        const handleChange = (event) => {

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

            setDay(values => ({...values,
                [name]: value,
            }))

            setChecked(values => ({...values,
                [name]: event.target.checked,}))
        }

        // update
        const addTimeCard = async (event) => {
            event.preventDefault()
            const {month} = inputs
            if (!month) {
                setErrorMessage('Month is a required field')
                setTimeout(() => {
                setErrorMessage(null)
                }, 5000)
                return
            }

            const dayName = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"]

            hoursToUpdate.days.map((singleDay, index) => {

                // if startWorkA is not defined, leave default value time 00:00
                singleDay.startWorkA = inputs[`startWorkA${index}`] || '00:00'
                
                singleDay.startWorkB = inputs[`startWorkB${index}`] || '00:00'
                
                singleDay.endWorkA = inputs[`endWorkA${index}`] || '00:00'

                singleDay.endWorkB = inputs[`endWorkB${index}`] || '00:00'

                singleDay.jobDescription = inputs[`jobDescription${index}`] || ''

                singleDay.holiday = checked[`holiday${index}`] || false

                // singleDay.dayNumber = `${beto[`day${index}`]} ${dayName[new Date(`${beto[`day${index}`]}`).getDay()]}` || ''
                singleDay.dayNumber =    `${beto[index].day0} ${dayName[`${new Date(`${beto[`day${index}`]}`).getDay()}`]}` || ''
                // console.log(singleDay.dayNumber)

                singleDay.totalHours = calculate(timeToDecimal(singleDay.startWorkA), timeToDecimal(singleDay.endWorkA), timeToDecimal(singleDay.startWorkB), timeToDecimal(singleDay.endWorkB), new Date(inputs[`day${index}`]).getDay(), checked[`holiday${index}`])

            })

            // to be replaced
            // const {
            //     startWorkA0,
            //     startWorkA1,
            //     startWorkA2,
            //     startWorkA3,
            //     startWorkA4,
            //     startWorkA5,
            //     startWorkA6,
            //     startWorkA7,
            //     startWorkA8,
            //     startWorkA9,
            //     startWorkA10,
            //     startWorkA11,
            //     startWorkA12,
            //     startWorkA13,
            //     startWorkA14,
            //     startWorkA15,
            //     startWorkA16,
            //     startWorkA17,
            //     startWorkA18,
            //     startWorkA19,
            //     startWorkA20,
            //     startWorkA21,
            //     startWorkA22,
            //     startWorkA23,
            //     startWorkA24,
            //     startWorkA25,
            //     startWorkA26,
            //     startWorkA27,
            //     startWorkA28,
            //     startWorkA29,
            //     startWorkA30,
            //     // ----------
            //     startWorkB0,
            //     startWorkB1,
            //     startWorkB2,
            //     startWorkB3,
            //     startWorkB4,
            //     startWorkB5,
            //     startWorkB6,
            //     startWorkB7,
            //     startWorkB8,
            //     startWorkB9,
            //     startWorkB10,
            //     startWorkB11,
            //     startWorkB12,
            //     startWorkB13,
            //     startWorkB14,
            //     startWorkB15,
            //     startWorkB16,
            //     startWorkB17,
            //     startWorkB18,
            //     startWorkB19,
            //     startWorkB20,
            //     startWorkB21,
            //     startWorkB22,
            //     startWorkB23,
            //     startWorkB24,
            //     startWorkB25,
            //     startWorkB26,
            //     startWorkB27,
            //     startWorkB28,
            //     startWorkB29,
            //     startWorkB30,
                
            // } = start

            // const {
            //     endWorkA0,
            //     endWorkA1,
            //     endWorkA2,
            //     endWorkA3,
            //     endWorkA4,
            //     endWorkA5,
            //     endWorkA6,
            //     endWorkA7,
            //     endWorkA8,
            //     endWorkA9,
            //     endWorkA10,
            //     endWorkA11,
            //     endWorkA12,
            //     endWorkA13,
            //     endWorkA14,
            //     endWorkA15,
            //     endWorkA16,
            //     endWorkA17,
            //     endWorkA18,
            //     endWorkA19,
            //     endWorkA20,
            //     endWorkA21,
            //     endWorkA22,
            //     endWorkA23,
            //     endWorkA24,
            //     endWorkA25,
            //     endWorkA26,
            //     endWorkA27,
            //     endWorkA28,
            //     endWorkA29,
            //     endWorkA30,
            //     // --------
            //     endWorkB0,
            //     endWorkB1,
            //     endWorkB2,
            //     endWorkB3,
            //     endWorkB4,
            //     endWorkB5,
            //     endWorkB6,
            //     endWorkB7,
            //     endWorkB8,
            //     endWorkB9,
            //     endWorkB10,
            //     endWorkB11,
            //     endWorkB12,
            //     endWorkB13,
            //     endWorkB14,
            //     endWorkB15,
            //     endWorkB16,
            //     endWorkB17,
            //     endWorkB18,
            //     endWorkB19,
            //     endWorkB20,
            //     endWorkB21,
            //     endWorkB22,
            //     endWorkB23,
            //     endWorkB24,
            //     endWorkB25,
            //     endWorkB26,
            //     endWorkB27,
            //     endWorkB28,
            //     endWorkB29,
            //     endWorkB30,
                
            // } = end

            // const {
            //     jobDescription0,
            //     jobDescription1,
            //     jobDescription2,
            //     jobDescription3,
            //     jobDescription4,
            //     jobDescription5,
            //     jobDescription6,
            //     jobDescription7,
            //     jobDescription8,
            //     jobDescription9,
            //     jobDescription10,
            //     jobDescription11,
            //     jobDescription12,
            //     jobDescription13,
            //     jobDescription14,
            //     jobDescription15,
            //     jobDescription16,
            //     jobDescription17,
            //     jobDescription18,
            //     jobDescription19,
            //     jobDescription20,
            //     jobDescription21,
            //     jobDescription22,
            //     jobDescription23,
            //     jobDescription24,
            //     jobDescription25,
            //     jobDescription26,
            //     jobDescription27,
            //     jobDescription28,
            //     jobDescription29,
            //     jobDescription30,
                
            // } = description

            // const {
            //     day0,
            //     day1,
            //     day2,
            //     day3,
            //     day4,
            //     day5,
            //     day6,
            //     day7,
            //     day8,
            //     day9,
            //     day10,
            //     day11,
            //     day12,
            //     day13,
            //     day14,
            //     day15,
            //     day16,
            //     day17,
            //     day18,
            //     day19,
            //     day20,
            //     day21,
            //     day22,
            //     day23,
            //     day24,
            //     day25,
            //     day26,
            //     day27,
            //     day28,
            //     day29,
            //     day30,
            // } = day

            // const {
            //     holiday0,
            //     holiday1,
            //     holiday2,
            //     holiday3,
            //     holiday4,
            //     holiday5,
            //     holiday6,
            //     holiday7,
            //     holiday8,
            //     holiday9,
            //     holiday10,
            //     holiday11,
            //     holiday12,
            //     holiday13,
            //     holiday14,
            //     holiday15,
            //     holiday16,
            //     holiday17,
            //     holiday18,
            //     holiday19,
            //     holiday20,
            //     holiday21,
            //     holiday22,
            //     holiday23,
            //     holiday24,
            //     holiday25,
            //     holiday26,
            //     holiday27,
            //     holiday28,
            //     holiday29,
            //     holiday30,
            // } = checked

            // hoursToUpdate.days[0].holiday = holiday0 ? holiday0 : false
            // hoursToUpdate.days[1].holiday = holiday1 ? holiday1 : false
            // hoursToUpdate.days[2].holiday = holiday2 ? holiday2 : false
            // hoursToUpdate.days[3].holiday = holiday3 ? holiday3 : false
            // hoursToUpdate.days[4].holiday = holiday4 ? holiday4 : false
            // hoursToUpdate.days[5].holiday = holiday5 ? holiday5 : false
            // hoursToUpdate.days[6].holiday = holiday6 ? holiday6 : false
            // hoursToUpdate.days[7].holiday = holiday7 ? holiday7 : false
            // hoursToUpdate.days[8].holiday = holiday8 ? holiday8 : false
            // hoursToUpdate.days[9].holiday = holiday9 ? holiday9 : false
            // hoursToUpdate.days[10].holiday = holiday10 ? holiday10 : false
            // hoursToUpdate.days[11].holiday = holiday11 ? holiday11 : false
            // hoursToUpdate.days[12].holiday = holiday12 ? holiday12 : false
            // hoursToUpdate.days[13].holiday = holiday13 ? holiday13 : false
            // hoursToUpdate.days[14].holiday = holiday14 ? holiday14 : false
            // hoursToUpdate.days[15].holiday = holiday15 ? holiday15 : false
            // hoursToUpdate.days[16].holiday = holiday16 ? holiday16 : false
            // hoursToUpdate.days[17].holiday = holiday17 ? holiday17 : false
            // hoursToUpdate.days[18].holiday = holiday18 ? holiday18 : false
            // hoursToUpdate.days[19].holiday = holiday19 ? holiday19 : false
            // hoursToUpdate.days[20].holiday = holiday20 ? holiday20 : false
            // hoursToUpdate.days[21].holiday = holiday21 ? holiday21 : false
            // hoursToUpdate.days[22].holiday = holiday22 ? holiday22 : false
            // hoursToUpdate.days[23].holiday = holiday23 ? holiday23 : false
            // hoursToUpdate.days[24].holiday = holiday24 ? holiday24 : false
            // hoursToUpdate.days[25].holiday = holiday25 ? holiday25 : false
            // hoursToUpdate.days[26].holiday = holiday26 ? holiday26 : false
            // hoursToUpdate.days[27].holiday = holiday27 ? holiday27 : false
            // hoursToUpdate.days[28].holiday = holiday28 ? holiday28 : false
            // hoursToUpdate.days[29].holiday = holiday29 ? holiday29 : false
            // hoursToUpdate.days[30].holiday = holiday30 ? holiday30 : false
            
            // // if startWorkA is not defined, leave default value time 00:00
            // hoursToUpdate.days[0].startWorkA = startWorkA0 ? startWorkA0 : '00:00'
            // hoursToUpdate.days[1].startWorkA = startWorkA1 ? startWorkA1 : '00:00'
            // hoursToUpdate.days[2].startWorkA = startWorkA2 ? startWorkA2 : '00:00'
            // hoursToUpdate.days[3].startWorkA = startWorkA3 ? startWorkA3 : '00:00'
            // hoursToUpdate.days[4].startWorkA = startWorkA4 ? startWorkA4 : '00:00'
            // hoursToUpdate.days[5].startWorkA = startWorkA5 ? startWorkA5 : '00:00'
            // hoursToUpdate.days[6].startWorkA = startWorkA6 ? startWorkA6 : '00:00'
            // hoursToUpdate.days[7].startWorkA = startWorkA7 ? startWorkA7 : '00:00'
            // hoursToUpdate.days[8].startWorkA = startWorkA8 ? startWorkA8 : '00:00'
            // hoursToUpdate.days[9].startWorkA = startWorkA9 ? startWorkA9 : '00:00'
            // hoursToUpdate.days[10].startWorkA = startWorkA10 ? startWorkA10 : '00:00'
            // hoursToUpdate.days[11].startWorkA = startWorkA11 ? startWorkA11 : '00:00'
            // hoursToUpdate.days[12].startWorkA = startWorkA12 ? startWorkA12 : '00:00'
            // hoursToUpdate.days[13].startWorkA = startWorkA13 ? startWorkA13 : '00:00'
            // hoursToUpdate.days[14].startWorkA = startWorkA14 ? startWorkA14 : '00:00'
            // hoursToUpdate.days[15].startWorkA = startWorkA15 ? startWorkA15 : '00:00'
            // hoursToUpdate.days[16].startWorkA = startWorkA16 ? startWorkA16 : '00:00'
            // hoursToUpdate.days[17].startWorkA = startWorkA17 ? startWorkA17 : '00:00'
            // hoursToUpdate.days[18].startWorkA = startWorkA18 ? startWorkA18 : '00:00'
            // hoursToUpdate.days[19].startWorkA = startWorkA19 ? startWorkA19 : '00:00'
            // hoursToUpdate.days[20].startWorkA = startWorkA20 ? startWorkA20 : '00:00'
            // hoursToUpdate.days[21].startWorkA = startWorkA21 ? startWorkA21 : '00:00'
            // hoursToUpdate.days[22].startWorkA = startWorkA22 ? startWorkA22 : '00:00'
            // hoursToUpdate.days[23].startWorkA = startWorkA23 ? startWorkA23 : '00:00'
            // hoursToUpdate.days[24].startWorkA = startWorkA24 ? startWorkA24 : '00:00'
            // hoursToUpdate.days[25].startWorkA = startWorkA25 ? startWorkA25 : '00:00'
            // hoursToUpdate.days[26].startWorkA = startWorkA26 ? startWorkA26 : '00:00'
            // hoursToUpdate.days[27].startWorkA = startWorkA27 ? startWorkA27 : '00:00'
            // hoursToUpdate.days[28].startWorkA = startWorkA28 ? startWorkA28 : '00:00'
            // hoursToUpdate.days[29].startWorkA = startWorkA29 ? startWorkA29 : '00:00'
            // hoursToUpdate.days[30].startWorkA = startWorkA30 ? startWorkA30 : '00:00'

            // hoursToUpdate.days[0].startWorkB = startWorkB0 ? startWorkB0 : '00:00'
            // hoursToUpdate.days[1].startWorkB = startWorkB1 ? startWorkB1 : '00:00'
            // hoursToUpdate.days[2].startWorkB = startWorkB2 ? startWorkB2 : '00:00'
            // hoursToUpdate.days[3].startWorkB = startWorkB3 ? startWorkB3 : '00:00'
            // hoursToUpdate.days[4].startWorkB = startWorkB4 ? startWorkB4 : '00:00'
            // hoursToUpdate.days[5].startWorkB = startWorkB5 ? startWorkB5 : '00:00'
            // hoursToUpdate.days[6].startWorkB = startWorkB6 ? startWorkB6 : '00:00'
            // hoursToUpdate.days[7].startWorkB = startWorkB7 ? startWorkB7 : '00:00'
            // hoursToUpdate.days[8].startWorkB = startWorkB8 ? startWorkB8 : '00:00'
            // hoursToUpdate.days[9].startWorkB = startWorkB9 ? startWorkB9 : '00:00'
            // hoursToUpdate.days[10].startWorkB = startWorkB10 ? startWorkB10 : '00:00'
            // hoursToUpdate.days[11].startWorkB = startWorkB11 ? startWorkB11 : '00:00'
            // hoursToUpdate.days[12].startWorkB = startWorkB12 ? startWorkB12 : '00:00'
            // hoursToUpdate.days[13].startWorkB = startWorkB13 ? startWorkB13 : '00:00'
            // hoursToUpdate.days[14].startWorkB = startWorkB14 ? startWorkB14 : '00:00'
            // hoursToUpdate.days[15].startWorkB = startWorkB15 ? startWorkB15 : '00:00'
            // hoursToUpdate.days[16].startWorkB = startWorkB16 ? startWorkB16 : '00:00'
            // hoursToUpdate.days[17].startWorkB = startWorkB17 ? startWorkB17 : '00:00'
            // hoursToUpdate.days[18].startWorkB = startWorkB18 ? startWorkB18 : '00:00'
            // hoursToUpdate.days[19].startWorkB = startWorkB19 ? startWorkB19 : '00:00'
            // hoursToUpdate.days[20].startWorkB = startWorkB20 ? startWorkB20 : '00:00'
            // hoursToUpdate.days[21].startWorkB = startWorkB21 ? startWorkB21 : '00:00'
            // hoursToUpdate.days[22].startWorkB = startWorkB22 ? startWorkB22 : '00:00'
            // hoursToUpdate.days[23].startWorkB = startWorkB23 ? startWorkB23 : '00:00'
            // hoursToUpdate.days[24].startWorkB = startWorkB24 ? startWorkB24 : '00:00'
            // hoursToUpdate.days[25].startWorkB = startWorkB25 ? startWorkB25 : '00:00'
            // hoursToUpdate.days[26].startWorkB = startWorkB26 ? startWorkB26 : '00:00'
            // hoursToUpdate.days[27].startWorkB = startWorkB27 ? startWorkB27 : '00:00'
            // hoursToUpdate.days[28].startWorkB = startWorkB28 ? startWorkB28 : '00:00'
            // hoursToUpdate.days[29].startWorkB = startWorkB29 ? startWorkB29 : '00:00'
            // hoursToUpdate.days[30].startWorkB = startWorkB30 ? startWorkB30 : '00:00'
            
            // // if endWorkA is not defined, leave default value time 00:00
            // hoursToUpdate.days[0].endWorkA = endWorkA0 ? endWorkA0 : '00:00'
            // hoursToUpdate.days[1].endWorkA = endWorkA1 ? endWorkA1 : '00:00'
            // hoursToUpdate.days[2].endWorkA = endWorkA2 ? endWorkA2 : '00:00'
            // hoursToUpdate.days[3].endWorkA = endWorkA3 ? endWorkA3 : '00:00'
            // hoursToUpdate.days[4].endWorkA = endWorkA4 ? endWorkA4 : '00:00'
            // hoursToUpdate.days[5].endWorkA = endWorkA5 ? endWorkA5 : '00:00'
            // hoursToUpdate.days[6].endWorkA = endWorkA6 ? endWorkA6 : '00:00'
            // hoursToUpdate.days[7].endWorkA = endWorkA7 ? endWorkA7 : '00:00'
            // hoursToUpdate.days[8].endWorkA = endWorkA8 ? endWorkA8 : '00:00'
            // hoursToUpdate.days[9].endWorkA = endWorkA9 ? endWorkA9 : '00:00'
            // hoursToUpdate.days[10].endWorkA = endWorkA10 ? endWorkA10 : '00:00'
            // hoursToUpdate.days[11].endWorkA = endWorkA11 ? endWorkA11 : '00:00'
            // hoursToUpdate.days[12].endWorkA = endWorkA12 ? endWorkA12 : '00:00'
            // hoursToUpdate.days[13].endWorkA = endWorkA13 ? endWorkA13 : '00:00'
            // hoursToUpdate.days[14].endWorkA = endWorkA14 ? endWorkA14 : '00:00'
            // hoursToUpdate.days[15].endWorkA = endWorkA15 ? endWorkA15 : '00:00'
            // hoursToUpdate.days[16].endWorkA = endWorkA16 ? endWorkA16 : '00:00'
            // hoursToUpdate.days[17].endWorkA = endWorkA17 ? endWorkA17 : '00:00'
            // hoursToUpdate.days[18].endWorkA = endWorkA18 ? endWorkA18 : '00:00'
            // hoursToUpdate.days[19].endWorkA = endWorkA19 ? endWorkA19 : '00:00'
            // hoursToUpdate.days[20].endWorkA = endWorkA20 ? endWorkA20 : '00:00'
            // hoursToUpdate.days[21].endWorkA = endWorkA21 ? endWorkA21 : '00:00'
            // hoursToUpdate.days[22].endWorkA = endWorkA22 ? endWorkA22 : '00:00'
            // hoursToUpdate.days[23].endWorkA = endWorkA23 ? endWorkA23 : '00:00'
            // hoursToUpdate.days[24].endWorkA = endWorkA24 ? endWorkA24 : '00:00'
            // hoursToUpdate.days[25].endWorkA = endWorkA25 ? endWorkA25 : '00:00'
            // hoursToUpdate.days[26].endWorkA = endWorkA26 ? endWorkA26 : '00:00'
            // hoursToUpdate.days[27].endWorkA = endWorkA27 ? endWorkA27 : '00:00'
            // hoursToUpdate.days[28].endWorkA = endWorkA28 ? endWorkA28 : '00:00'
            // hoursToUpdate.days[29].endWorkA = endWorkA29 ? endWorkA29 : '00:00'
            // hoursToUpdate.days[30].endWorkA = endWorkA30 ? endWorkA30 : '00:00'

            // hoursToUpdate.days[0].endWorkB = endWorkB0 ? endWorkB0 : '00:00'
            // hoursToUpdate.days[1].endWorkB = endWorkB1 ? endWorkB1 : '00:00'
            // hoursToUpdate.days[2].endWorkB = endWorkB2 ? endWorkB2 : '00:00'
            // hoursToUpdate.days[3].endWorkB = endWorkB3 ? endWorkB3 : '00:00'
            // hoursToUpdate.days[4].endWorkB = endWorkB4 ? endWorkB4 : '00:00'
            // hoursToUpdate.days[5].endWorkB = endWorkB5 ? endWorkB5 : '00:00'
            // hoursToUpdate.days[6].endWorkB = endWorkB6 ? endWorkB6 : '00:00'
            // hoursToUpdate.days[7].endWorkB = endWorkB7 ? endWorkB7 : '00:00'
            // hoursToUpdate.days[8].endWorkB = endWorkB8 ? endWorkB8 : '00:00'
            // hoursToUpdate.days[9].endWorkB = endWorkB9 ? endWorkB9 : '00:00'
            // hoursToUpdate.days[10].endWorkB = endWorkB10 ? endWorkB10 : '00:00'
            // hoursToUpdate.days[11].endWorkB = endWorkB11 ? endWorkB11 : '00:00'
            // hoursToUpdate.days[12].endWorkB = endWorkB12 ? endWorkB12 : '00:00'
            // hoursToUpdate.days[13].endWorkB = endWorkB13 ? endWorkB13 : '00:00'
            // hoursToUpdate.days[14].endWorkB = endWorkB14 ? endWorkB14 : '00:00'
            // hoursToUpdate.days[15].endWorkB = endWorkB15 ? endWorkB15 : '00:00'
            // hoursToUpdate.days[16].endWorkB = endWorkB16 ? endWorkB16 : '00:00'
            // hoursToUpdate.days[17].endWorkB = endWorkB17 ? endWorkB17 : '00:00'
            // hoursToUpdate.days[18].endWorkB = endWorkB18 ? endWorkB18 : '00:00'
            // hoursToUpdate.days[19].endWorkB = endWorkB19 ? endWorkB19 : '00:00'
            // hoursToUpdate.days[20].endWorkB = endWorkB20 ? endWorkB20 : '00:00'
            // hoursToUpdate.days[21].endWorkB = endWorkB21 ? endWorkB21 : '00:00'
            // hoursToUpdate.days[22].endWorkB = endWorkB22 ? endWorkB22 : '00:00'
            // hoursToUpdate.days[23].endWorkB = endWorkB23 ? endWorkB23 : '00:00'
            // hoursToUpdate.days[24].endWorkB = endWorkB24 ? endWorkB24 : '00:00'
            // hoursToUpdate.days[25].endWorkB = endWorkB25 ? endWorkB25 : '00:00'
            // hoursToUpdate.days[26].endWorkB = endWorkB26 ? endWorkB26 : '00:00'
            // hoursToUpdate.days[27].endWorkB = endWorkB27 ? endWorkB27 : '00:00'
            // hoursToUpdate.days[28].endWorkB = endWorkB28 ? endWorkB28 : '00:00'
            // hoursToUpdate.days[29].endWorkB = endWorkB29 ? endWorkB29 : '00:00'
            // hoursToUpdate.days[30].endWorkB = endWorkB30 ? endWorkB30 : '00:00'
            
            // hoursToUpdate.days[0].jobDescription = jobDescription0
            // hoursToUpdate.days[1].jobDescription = jobDescription1
            // hoursToUpdate.days[2].jobDescription = jobDescription2
            // hoursToUpdate.days[3].jobDescription = jobDescription3
            // hoursToUpdate.days[4].jobDescription = jobDescription4
            // hoursToUpdate.days[5].jobDescription = jobDescription5
            // hoursToUpdate.days[6].jobDescription = jobDescription6
            // hoursToUpdate.days[7].jobDescription = jobDescription7
            // hoursToUpdate.days[8].jobDescription = jobDescription8
            // hoursToUpdate.days[9].jobDescription = jobDescription9
            // hoursToUpdate.days[10].jobDescription = jobDescription10
            // hoursToUpdate.days[11].jobDescription = jobDescription11
            // hoursToUpdate.days[12].jobDescription = jobDescription12
            // hoursToUpdate.days[13].jobDescription = jobDescription13
            // hoursToUpdate.days[14].jobDescription = jobDescription14
            // hoursToUpdate.days[15].jobDescription = jobDescription15
            // hoursToUpdate.days[16].jobDescription = jobDescription16
            // hoursToUpdate.days[17].jobDescription = jobDescription17
            // hoursToUpdate.days[18].jobDescription = jobDescription18
            // hoursToUpdate.days[19].jobDescription = jobDescription19
            // hoursToUpdate.days[20].jobDescription = jobDescription20
            // hoursToUpdate.days[21].jobDescription = jobDescription21
            // hoursToUpdate.days[22].jobDescription = jobDescription22
            // hoursToUpdate.days[23].jobDescription = jobDescription23
            // hoursToUpdate.days[24].jobDescription = jobDescription24
            // hoursToUpdate.days[25].jobDescription = jobDescription25
            // hoursToUpdate.days[26].jobDescription = jobDescription26
            // hoursToUpdate.days[27].jobDescription = jobDescription27
            // hoursToUpdate.days[28].jobDescription = jobDescription28
            // hoursToUpdate.days[29].jobDescription = jobDescription29
            // hoursToUpdate.days[30].jobDescription = jobDescription30

            // const dayName = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"]

            // hoursToUpdate.days[0].dayNumber = day0 ? `${day0} ${dayName[new Date(day0).getDay()]}` : ''
            // hoursToUpdate.days[1].dayNumber = day1 ? `${day1} ${dayName[new Date(day1).getDay()]}` : ''
            // hoursToUpdate.days[2].dayNumber = day2 ? `${day2} ${dayName[new Date(day2).getDay()]}` : ''
            // hoursToUpdate.days[3].dayNumber = day3 ? `${day3} ${dayName[new Date(day3).getDay()]}` : ''
            // hoursToUpdate.days[4].dayNumber = day4 ? `${day4} ${dayName[new Date(day4).getDay()]}` : ''
            // hoursToUpdate.days[5].dayNumber = day5 ? `${day5} ${dayName[new Date(day5).getDay()]}` : ''
            // hoursToUpdate.days[6].dayNumber = day6 ? `${day6} ${dayName[new Date(day6).getDay()]}` : ''
            // hoursToUpdate.days[7].dayNumber = day7 ? `${day7} ${dayName[new Date(day7).getDay()]}` : ''
            // hoursToUpdate.days[8].dayNumber = day8 ? `${day8} ${dayName[new Date(day8).getDay()]}` : ''
            // hoursToUpdate.days[9].dayNumber = day9 ? `${day9} ${dayName[new Date(day9).getDay()]}` : ''
            // hoursToUpdate.days[10].dayNumber = day10 ? `${day10} ${dayName[new Date(day10).getDay()]}` : ''
            // hoursToUpdate.days[11].dayNumber = day11 ? `${day11} ${dayName[new Date(day11).getDay()]}` : ''
            // hoursToUpdate.days[12].dayNumber = day12 ? `${day12} ${dayName[new Date(day12).getDay()]}` : ''
            // hoursToUpdate.days[13].dayNumber = day13 ? `${day13} ${dayName[new Date(day13).getDay()]}` : ''
            // hoursToUpdate.days[14].dayNumber = day14 ? `${day14} ${dayName[new Date(day14).getDay()]}` : ''
            // hoursToUpdate.days[15].dayNumber = day15 ? `${day15} ${dayName[new Date(day15).getDay()]}` : ''
            // hoursToUpdate.days[16].dayNumber = day16 ? `${day16} ${dayName[new Date(day16).getDay()]}` : ''
            // hoursToUpdate.days[17].dayNumber = day17 ? `${day17} ${dayName[new Date(day17).getDay()]}` : ''
            // hoursToUpdate.days[18].dayNumber = day18 ? `${day18} ${dayName[new Date(day18).getDay()]}` : ''
            // hoursToUpdate.days[19].dayNumber = day19 ? `${day19} ${dayName[new Date(day19).getDay()]}` : ''
            // hoursToUpdate.days[20].dayNumber = day20 ? `${day20} ${dayName[new Date(day20).getDay()]}` : ''
            // hoursToUpdate.days[21].dayNumber = day21 ? `${day21} ${dayName[new Date(day21).getDay()]}` : ''
            // hoursToUpdate.days[22].dayNumber = day22 ? `${day22} ${dayName[new Date(day22).getDay()]}` : ''
            // hoursToUpdate.days[23].dayNumber = day23 ? `${day23} ${dayName[new Date(day23).getDay()]}` : ''
            // hoursToUpdate.days[24].dayNumber = day24 ? `${day24} ${dayName[new Date(day24).getDay()]}` : ''
            // hoursToUpdate.days[25].dayNumber = day25 ? `${day25} ${dayName[new Date(day25).getDay()]}` : ''
            // hoursToUpdate.days[26].dayNumber = day26 ? `${day26} ${dayName[new Date(day26).getDay()]}` : ''
            // hoursToUpdate.days[27].dayNumber = day27 ? `${day27} ${dayName[new Date(day27).getDay()]}` : ''
            // hoursToUpdate.days[28].dayNumber = day28 ? `${day28} ${dayName[new Date(day28).getDay()]}` : ''
            // hoursToUpdate.days[29].dayNumber = day29 ? `${day29} ${dayName[new Date(day29).getDay()]}` : ''
            // hoursToUpdate.days[30].dayNumber = day30 ? `${day30} ${dayName[new Date(day30).getDay()]}` : ''

            // // use default value time 00:00
            // hoursToUpdate.days[0].totalHours = calculate(timeToDecimal(hoursToUpdate.days[0].startWorkA), timeToDecimal(hoursToUpdate.days[0].endWorkA), timeToDecimal(hoursToUpdate.days[0].startWorkB), timeToDecimal(hoursToUpdate.days[0].endWorkB), new Date(day0).getDay(), holiday0)
            // hoursToUpdate.days[1].totalHours = calculate(timeToDecimal(hoursToUpdate.days[1].startWorkA), timeToDecimal(hoursToUpdate.days[1].endWorkA), timeToDecimal(hoursToUpdate.days[1].startWorkB), timeToDecimal(hoursToUpdate.days[1].endWorkB), new Date(day1).getDay(), holiday1)
            // hoursToUpdate.days[2].totalHours = calculate(timeToDecimal(hoursToUpdate.days[2].startWorkA), timeToDecimal(hoursToUpdate.days[2].endWorkA), timeToDecimal(hoursToUpdate.days[2].startWorkB), timeToDecimal(hoursToUpdate.days[2].endWorkB), new Date(day2).getDay(), holiday2)
            // hoursToUpdate.days[3].totalHours = calculate(timeToDecimal(hoursToUpdate.days[3].startWorkA), timeToDecimal(hoursToUpdate.days[3].endWorkA), timeToDecimal(hoursToUpdate.days[3].startWorkB), timeToDecimal(hoursToUpdate.days[3].endWorkB), new Date(day3).getDay(), holiday3)
            // hoursToUpdate.days[4].totalHours = calculate(timeToDecimal(hoursToUpdate.days[4].startWorkA), timeToDecimal(hoursToUpdate.days[4].endWorkA), timeToDecimal(hoursToUpdate.days[4].startWorkB), timeToDecimal(hoursToUpdate.days[4].endWorkB), new Date(day4).getDay(), holiday4)
            // hoursToUpdate.days[5].totalHours = calculate(timeToDecimal(hoursToUpdate.days[5].startWorkA), timeToDecimal(hoursToUpdate.days[5].endWorkA), timeToDecimal(hoursToUpdate.days[5].startWorkB), timeToDecimal(hoursToUpdate.days[5].endWorkB), new Date(day5).getDay(), holiday5)
            // hoursToUpdate.days[6].totalHours = calculate(timeToDecimal(hoursToUpdate.days[6].startWorkA), timeToDecimal(hoursToUpdate.days[6].endWorkA), timeToDecimal(hoursToUpdate.days[6].startWorkB), timeToDecimal(hoursToUpdate.days[6].endWorkB), new Date(day6).getDay(), holiday6)
            // hoursToUpdate.days[7].totalHours = calculate(timeToDecimal(hoursToUpdate.days[7].startWorkA), timeToDecimal(hoursToUpdate.days[7].endWorkA), timeToDecimal(hoursToUpdate.days[7].startWorkB), timeToDecimal(hoursToUpdate.days[7].endWorkB), new Date(day7).getDay(), holiday7)
            // hoursToUpdate.days[8].totalHours = calculate(timeToDecimal(hoursToUpdate.days[8].startWorkA), timeToDecimal(hoursToUpdate.days[8].endWorkA), timeToDecimal(hoursToUpdate.days[8].startWorkB), timeToDecimal(hoursToUpdate.days[8].endWorkB), new Date(day8).getDay(), holiday8)
            // hoursToUpdate.days[9].totalHours = calculate(timeToDecimal(hoursToUpdate.days[9].startWorkA), timeToDecimal(hoursToUpdate.days[9].endWorkA), timeToDecimal(hoursToUpdate.days[9].startWorkB), timeToDecimal(hoursToUpdate.days[9].endWorkB), new Date(day9).getDay(), holiday9)
            // hoursToUpdate.days[10].totalHours = calculate(timeToDecimal(hoursToUpdate.days[10].startWorkA), timeToDecimal(hoursToUpdate.days[10].endWorkA), timeToDecimal(hoursToUpdate.days[10].startWorkB), timeToDecimal(hoursToUpdate.days[10].endWorkB), new Date(day10).getDay(), holiday10)
            // hoursToUpdate.days[11].totalHours = calculate(timeToDecimal(hoursToUpdate.days[11].startWorkA), timeToDecimal(hoursToUpdate.days[11].endWorkA), timeToDecimal(hoursToUpdate.days[11].startWorkB), timeToDecimal(hoursToUpdate.days[11].endWorkB), new Date(day11).getDay(), holiday11)
            // hoursToUpdate.days[12].totalHours = calculate(timeToDecimal(hoursToUpdate.days[12].startWorkA), timeToDecimal(hoursToUpdate.days[12].endWorkA), timeToDecimal(hoursToUpdate.days[12].startWorkB), timeToDecimal(hoursToUpdate.days[12].endWorkB), new Date(day12).getDay(), holiday12)
            // hoursToUpdate.days[13].totalHours = calculate(timeToDecimal(hoursToUpdate.days[13].startWorkA), timeToDecimal(hoursToUpdate.days[13].endWorkA), timeToDecimal(hoursToUpdate.days[13].startWorkB), timeToDecimal(hoursToUpdate.days[13].endWorkB), new Date(day13).getDay(), holiday13)
            // hoursToUpdate.days[14].totalHours = calculate(timeToDecimal(hoursToUpdate.days[14].startWorkA), timeToDecimal(hoursToUpdate.days[14].endWorkA), timeToDecimal(hoursToUpdate.days[14].startWorkB), timeToDecimal(hoursToUpdate.days[14].endWorkB), new Date(day14).getDay(), holiday14)
            // hoursToUpdate.days[15].totalHours = calculate(timeToDecimal(hoursToUpdate.days[15].startWorkA), timeToDecimal(hoursToUpdate.days[15].endWorkA), timeToDecimal(hoursToUpdate.days[15].startWorkB), timeToDecimal(hoursToUpdate.days[15].endWorkB), new Date(day15).getDay(), holiday15)
            // hoursToUpdate.days[16].totalHours = calculate(timeToDecimal(hoursToUpdate.days[16].startWorkA), timeToDecimal(hoursToUpdate.days[16].endWorkA), timeToDecimal(hoursToUpdate.days[16].startWorkB), timeToDecimal(hoursToUpdate.days[16].endWorkB), new Date(day16).getDay(), holiday16)
            // hoursToUpdate.days[17].totalHours = calculate(timeToDecimal(hoursToUpdate.days[17].startWorkA), timeToDecimal(hoursToUpdate.days[17].endWorkA), timeToDecimal(hoursToUpdate.days[17].startWorkB), timeToDecimal(hoursToUpdate.days[17].endWorkB), new Date(day17).getDay(), holiday17)
            // hoursToUpdate.days[18].totalHours = calculate(timeToDecimal(hoursToUpdate.days[18].startWorkA), timeToDecimal(hoursToUpdate.days[18].endWorkA), timeToDecimal(hoursToUpdate.days[18].startWorkB), timeToDecimal(hoursToUpdate.days[18].endWorkB), new Date(day18).getDay(), holiday18)
            // hoursToUpdate.days[19].totalHours = calculate(timeToDecimal(hoursToUpdate.days[19].startWorkA), timeToDecimal(hoursToUpdate.days[19].endWorkA), timeToDecimal(hoursToUpdate.days[19].startWorkB), timeToDecimal(hoursToUpdate.days[19].endWorkB), new Date(day19).getDay(), holiday19)
            // hoursToUpdate.days[20].totalHours = calculate(timeToDecimal(hoursToUpdate.days[20].startWorkA), timeToDecimal(hoursToUpdate.days[20].endWorkA), timeToDecimal(hoursToUpdate.days[20].startWorkB), timeToDecimal(hoursToUpdate.days[20].endWorkB), new Date(day20).getDay(), holiday20)
            // hoursToUpdate.days[21].totalHours = calculate(timeToDecimal(hoursToUpdate.days[21].startWorkA), timeToDecimal(hoursToUpdate.days[21].endWorkA), timeToDecimal(hoursToUpdate.days[21].startWorkB), timeToDecimal(hoursToUpdate.days[21].endWorkB), new Date(day21).getDay(), holiday21)
            // hoursToUpdate.days[22].totalHours = calculate(timeToDecimal(hoursToUpdate.days[22].startWorkA), timeToDecimal(hoursToUpdate.days[22].endWorkA), timeToDecimal(hoursToUpdate.days[22].startWorkB), timeToDecimal(hoursToUpdate.days[22].endWorkB), new Date(day22).getDay(), holiday22)
            // hoursToUpdate.days[23].totalHours = calculate(timeToDecimal(hoursToUpdate.days[23].startWorkA), timeToDecimal(hoursToUpdate.days[23].endWorkA), timeToDecimal(hoursToUpdate.days[23].startWorkB), timeToDecimal(hoursToUpdate.days[23].endWorkB), new Date(day23).getDay(), holiday23)
            // hoursToUpdate.days[24].totalHours = calculate(timeToDecimal(hoursToUpdate.days[24].startWorkA), timeToDecimal(hoursToUpdate.days[24].endWorkA), timeToDecimal(hoursToUpdate.days[24].startWorkB), timeToDecimal(hoursToUpdate.days[24].endWorkB), new Date(day24).getDay(), holiday24)
            // hoursToUpdate.days[25].totalHours = calculate(timeToDecimal(hoursToUpdate.days[25].startWorkA), timeToDecimal(hoursToUpdate.days[25].endWorkA), timeToDecimal(hoursToUpdate.days[25].startWorkB), timeToDecimal(hoursToUpdate.days[25].endWorkB), new Date(day25).getDay(), holiday25)
            // hoursToUpdate.days[26].totalHours = calculate(timeToDecimal(hoursToUpdate.days[26].startWorkA), timeToDecimal(hoursToUpdate.days[26].endWorkA), timeToDecimal(hoursToUpdate.days[26].startWorkB), timeToDecimal(hoursToUpdate.days[26].endWorkB), new Date(day26).getDay(), holiday26)
            // hoursToUpdate.days[27].totalHours = calculate(timeToDecimal(hoursToUpdate.days[27].startWorkA), timeToDecimal(hoursToUpdate.days[27].endWorkA), timeToDecimal(hoursToUpdate.days[27].startWorkB), timeToDecimal(hoursToUpdate.days[27].endWorkB), new Date(day27).getDay(), holiday27)
            // hoursToUpdate.days[28].totalHours = calculate(timeToDecimal(hoursToUpdate.days[28].startWorkA), timeToDecimal(hoursToUpdate.days[28].endWorkA), timeToDecimal(hoursToUpdate.days[28].startWorkB), timeToDecimal(hoursToUpdate.days[28].endWorkB), new Date(day28).getDay(), holiday28)
            // hoursToUpdate.days[29].totalHours = calculate(timeToDecimal(hoursToUpdate.days[29].startWorkA), timeToDecimal(hoursToUpdate.days[29].endWorkA), timeToDecimal(hoursToUpdate.days[29].startWorkB), timeToDecimal(hoursToUpdate.days[29].endWorkB), new Date(day29).getDay(), holiday29)
            // hoursToUpdate.days[30].totalHours = calculate(timeToDecimal(hoursToUpdate.days[30].startWorkA), timeToDecimal(hoursToUpdate.days[30].endWorkA), timeToDecimal(hoursToUpdate.days[30].startWorkB), timeToDecimal(hoursToUpdate.days[30].endWorkB), new Date(day30).getDay(), holiday30)
            
          

            const normal = hoursToUpdate.days.map(day => day.totalHours && day.totalHours.normal)
            const lateHours = hoursToUpdate.days.map(day => day.totalHours && day.totalHours.lateHours)
            const holidayHours = hoursToUpdate.days.map(day => day.totalHours && day.totalHours.holidayHours)
            const total = hoursToUpdate.days.map(day => day.totalHours && day.totalHours.total)
            const allNormal = normal.filter(value => value !== undefined ).map(x => x = Number(x)).reduce((a,b) => a+b)
            const allLateHours = lateHours.filter(value => value !== undefined ).map(x => x = Number(x)).reduce((a,b) => a+b)
            const allHolidayHours = holidayHours.filter(value => value !== undefined ).map(x => x = Number(x)).reduce((a,b) => a+b)
            const allTotal = total.filter(value => value !== undefined ).map(x => x = Number(x)).reduce((a,b) => a+b)

            let numallNormal = allNormal % 1 !== 0 ? parseFloat(allNormal).toFixed(2) : allNormal
            let numallLateHours = allLateHours % 1 !== 0 ? parseFloat(allLateHours).toFixed(2) : allLateHours
            let numallHolidayHours = allHolidayHours % 1 !== 0 ? parseFloat(allHolidayHours).toFixed(2) : allHolidayHours
            let numallTotal = allTotal % 1 !== 0 ? parseFloat(allTotal).toFixed(2) : allTotal

            hoursToUpdate.monthHours = {
                totalHours: numallTotal,
                normalRate: numallNormal,
                lateHoursRate: numallLateHours,
                holidayHoursRate: numallHolidayHours,
            }
            

            hoursToUpdate.month = inputs.month
            console.log(beto)            
            
            await hoursService
            //   .update(hours.id, hoursToUpdate)
              setErrorMessage('Time card updated')
              setTimeout(() => {
                setErrorMessage(null)
              }, 5000)
        }

        return (
            <div>
                <h1>TIME CARD</h1>
                <br/>
                <button className='screenBtn' onClick={() => toScreen('1')} >Back</button>
                <br/>
                
                <form onSubmit={addTimeCard}>

                    <p>MONTH</p>

                    <input
                        type="text"
                        name="month"
                        value={inputs['month'] || ''}
                        onChange={handleChange}
                    />

                    <div className='timecard'>

                        {hours.days.map((eachDay, index) => {

                            return(

                                <div className={index === 0 ? 'eachDay topeachday' : 'eachDay'} key={index}>

                                    <p className={index === 0 ? 'topDay date' : 'date'}>{eachDay.dayNumber || '----------------------'}</p>
                                    
                                    <div>

                                        {index === 0 && <p className='mobileHide'>Date</p>}

                                        <input
                                                    id={index}
                                                    type="date"
                                                    label='Date'
                                                    name={`day${index}`}
                                                    value={inputs[`day${index}`] || ''}
                                                    onChange={handleChange}
                                                    // placeholder="Date"
                                        />

                                    </div>

                                    <div>

                                        {index === 0 && <p className='mobileHide'>Holyday</p>}

                                        <input className='holiday'
                                            id={index}
                                            type="checkbox"
                                            name={`holiday${index}`}
                                            checked={checked[`holiday${index}`] || ''}
                                            onChange={handleChange}
                                        />

                                    </div>

                                    <div>

                                        {index === 0 && <p className='mobileHide'>Job Description</p>}

                                        <input 
                                            id={index}
                                            type="text"
                                            name={`jobDescription${index}`}
                                            value={description[`jobDescription${index}`] || ''}
                                            onChange={handleChange}
                                            // placeholder="Job description"
                                        />

                                    </div>

                                    <div>

                                        {index === 0 && <p className='startA mobileHide'>Start</p>}

                                        <input className='startA'
                                            id={index}
                                            type="time"
                                            name={`startWorkA${index}`}
                                            value={start[`startWorkA${index}`] || '00:00'}
                                            onChange={handleChange}
                                        />

                                    </div>

                                    <div>

                                        {index === 0 && <p className='endA mobileHide'>End</p>}

                                        <input className='endA'
                                            id={index}
                                            type="time"
                                            name={`endWorkA${index}`}
                                            value={end[`endWorkA${index}`] || '00:00'}
                                            onChange={handleChange}
                                        />

                                    </div>

                                    <div>

                                        {index === 0 && <p className='startB mobileHide'>Start</p>}

                                        <input  className='startB'
                                            id={index}
                                            type="time"
                                            name={`startWorkB${index}`}
                                            value={start[`startWorkB${index}`] || '00:00'}
                                            onChange={handleChange}
                                        />

                                    </div>

                                    <div>

                                        {index === 0 && <p className='endB mobileHide'>End</p>}

                                        <input  className='endB'
                                            id={index}
                                            type="time"
                                            name={`endWorkB${index}`}
                                            value={end[`endWorkB${index}`] || '00:00'}
                                            onChange={handleChange}
                                    />

                                    </div>

                                </div>

                            )
                            
                        })}
                    </div>

                    <button className='uploadBtn screenBtn' type="submit">Upload</button>

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
          }else if (screen === '4') {
            return <ScreenFour
                hours={ hours }
            />
          }
    }
    


    
    return (
        <div>
            {display()}
        </div>    
    )
}

export default TimeCard





















































// import React from 'react'
// import { useState } from 'react'
// import hoursService from '../services/hours'

// const TimeCard = ({ user }) => {
//     const [screen, setScreen] = useState('1')
//     const [hours, setHours] = useState(null)

//     const loading = () => {
//         if (user === null) {
//             return 'Loading...'
//         } else {
//             return user.username[0].toUpperCase() + user.username.slice(1).toLowerCase()
//         }
//     }

//     const ScreenOne = ({ user }) => {
//         return (
//             <div>                
//                 <h1>{ loading() }</h1>
//                 <br/>
//                 <button onClick={() => toScreen('3')} >New time card</button>
//                 <ul>
//                     {
//                         user &&
//                         user.hours.map(
//                             hours =>
//                             <li key={hours.id}>
//                                 <button onClick={() => handleGetHours(hours)}>
//                                     <b>Period: {hours.month}</b>
//                                     <b>Last update: {hours.date}</b>
//                                 </button>
//                             </li>
//                         )
//                     }
//                 </ul>                
//             </div>            
//         )
//     }
        
//     const ScreenTwo = ({ hours }) => {
//         return (
//           <div>
//               <h1>{ hours.month.toUpperCase()}</h1>
//               <button onClick={() => toScreen('1')} >Back</button>
//               <ul>
//                   {
//                       hours &&
//                       hours.days.map(
//                           day =>
//                           <li key={day.dayNumber}>
//                               <p>Day: {day.dayNumber} Start: {day.startWork}, End: {day.endWork}</p>
//                               <p>Total Hours: {hours.totalHours}</p>
//                           </li>
//                       )
//                   }
//               </ul>
//               <p>Month total Hours: {hours.monthHours}</p>
//               <p>Last update: { hours.date }</p>
//           </div>
//         )
//     }
      
//     const ScreenThree = () => {
//         const [inputs, setInputs] = useState({finishTime: '00:00', startTime: '00:00'})

//         // const styles = {
//         //     display: 'grid',
//         //     // gridTemplateColumns: '1fr 1fr 1fr 1fr 1fr 1fr',
//         //     gridTemplateArea: `'... ... month ... ...'
//         //                        'date job start finish total'`,
//         //     margin: '5em 0'
//         // }
        
//         const timeToDecimal = (t) => {
//             var arr = t.split(':')
//             var dec = parseInt((arr[1]/6)*10, 10)
        
//             return parseFloat(parseInt(arr[0], 10) + '.' + (dec<10?'0':'') + dec)
//         }

//         const calculate = (startTime, endTime) => {
//             let start = startTime
//             let end = endTime
//             let normal = 0
//             let special = 0
//             if (end < 4) {
//                 end += 24
//             }
//             const total = end - start
            
//             if (end > 18) {
//                 special = end - 18
//                 normal = 18 - start
//             }else {
//                 normal = total
//             }

//             // setInputs(values => ({...values, total: total, normal: normal, special: special}))
//             // console.log('normal', normal, 'special', special)

//             return {
//                 normal: normal,
//                 special: special,
//                 total: total
//             }
//         }
        

//         const handleChange = (event) => {
//             const name = event.target.name
//             const value = event.target.value
//             setInputs(values => ({...values,
//                 [name]: value,                
//             }))
//         }

//         const addTimeCard = async (event) => {
//             event.preventDefault()
//             const {month, finishTime, startTime} = inputs
//             if (!month) {
//                 return console.log('Month is a required field')
//             }
//             const object = {
//                 month: month,
//                 days: [
//                     {
//                         dayNumber: '21',
//                         startWork: startTime,
//                         endWork: finishTime
//                     }
//                 ]
//             }
//             console.log('uploaded', inputs)
//             await hoursService
//               .create(object)
//               setInputs({ finishTime: '00:00', startTime: '00:00' })
//             //   setErrorMessage('Time card created')
//           }

//         // complete this function
//         // const handleSubmit = (event) => {
//         //     event.preventDefault()
//         //     calculate(timeToDecimal(inputs.startTime), timeToDecimal(inputs.finishTime))
//         //     console.log(inputs)
//         // }

//         return (
//             <div>
//                 <h1>TIMESEDDEL / TIME CARD</h1>
//                 <br/>
//                 <button onClick={() => toScreen('1')} >Back</button>
//                 <br/>

//                 {/* https://www.w3schools.com/react/react_forms.asp */}

//                 {/* When the data is handled by the components, all the data is stored in the component state. */}

//                 {/* You can control changes by adding event handlers in the onChange attribute. */}

//                 {/* You can control the submit action by adding an event handler in the onSubmit attribute for the <form>: */}

//                 {/* You can control the values of more than one input field by adding a name attribute to each element.

//                 We will initialize our state with an empty object.

//                 To access the fields in the event handler use the event.target.name and event.target.value syntax.

//                 To update the state, use square brackets [bracket notation] around the property name. */}
                
//                 <form onSubmit={addTimeCard}>
//                     {/* <div id='container'> */}
//                         {/* <div className='row'> */}
//                             <p className='monthT'>MONTH/MÅNED</p>
//                             <input
//                                 className='monthD'
//                                 type="text"
//                                 name="month"
//                                 value={inputs.month || ''}
//                                 onChange={handleChange}
//                             />
//                             <div className='form'>
//                             <p className='dateT'>DATO / DATE</p>
//                             <p className='jobT'>JOB DESCRIPTION</p>
//                             <p className='startT'>START: TIME</p>
//                             <p className='finishT'>FINISH: TIME</p>
//                             <p className='totalT'>TOTAL HOURS/TIMER</p>
//                         {/* </div> */}
//                         {/* <div className='row'> */}                            
                            
//                             <p>21</p>
//                             <input
//                                 className='jobD'
//                                 type="text"
//                                 name="jobDescription"
//                                 value={inputs.jobDescription || ''}
//                                 onChange={handleChange}
//                             />
//                             <input
//                                 className='startD'
//                                 type="time"
//                                 name="startTime"
//                                 value={inputs.startTime || ''}
//                                 onChange={handleChange}
//                             />
//                             <input
//                                 className='finishD'
//                                 type="time"
//                                 name="finishTime"
//                                 value={inputs.finishTime || ''}
//                                 onChange={handleChange}
//                             />
                            
                            
//                             <p>{ inputs.startTime !== inputs.finishTime &&
//                             JSON.stringify(calculate(timeToDecimal(inputs.startTime), timeToDecimal(inputs.finishTime))) }</p>
//                             </div>
//                         {/* </div>
//                     </div> */}
//                 </form>
//                 <button type="submit">Upload</button>
//             </div>
//         )
//     }
    

//     const toScreen = (screen) => {
//         setScreen(screen)
//       }

//     const handleGetHours = (hours) => {
//         setHours(hours)
//         toScreen('2')
//     }

//     const display = () => {
//         if (screen === '1') {
//             return <ScreenOne
//                 user={ user }
//             />
//           }else if (screen === '2') {
//             return <ScreenTwo
//                 hours={ hours }
//             />
//           }else if (screen === '3') {
//             return <ScreenThree/>
//           }
//     }
    


    
//     return (
//         <div>
//             {display()}
//         </div>    
//     )
// }

// export default TimeCard