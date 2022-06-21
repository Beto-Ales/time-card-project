// import React, { useEffect } from 'react'
import { useState, useEffect } from 'react'
import hoursService from '../services/hours'
import usersService from '../services/users'

// ------------------------------------------------------------------------------------------------------------------------------
// How to update state in a nested object in React with Hooks
// https://blog.logrocket.com/a-guide-to-usestate-in-react-ecb9952e406c/
// ------------------------------------------------------------------------------------------------------------------------------

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
          <span className='headerTitle'>HOLIDAY</span>
          <span className='headerTitle jobdescription'>JOB DESCRIPTION</span>
          <span className='headerTitle startA'>START</span>
          <span className='headerTitle endA'>FINISH</span>
          <span className='headerTitle startB'>START</span>
          <span className='headerTitle endB'>FINISH</span>
          <span className='headerTitle hours-min-width'>TOTAL</span>
          <span className='headerTitle hours-min-width'>NORMAL</span>
          <span className='headerTitle hours-min-width'>SPECIAL</span>
          {/* <p className='left'>TOTAL HOURS/TIMER</p> */}
      </div>
      
      
      <ul className='freeWidth'>
        {
          hours &&
          hours.days.map(day => 
            <li key={day.dayNumber}>
              {/* <p>Day: {day.dayNumber} Job description: {day.jobDescription} Start: {day.startWorkA}, End: {day.endWorkA} Total Hours: {day.totalHours && day.totalHours.total} Normal rate: {day.totalHours && day.totalHours.normal} Special rate: {day.totalHours && day.totalHours.special}</p> */}
              <div className='userTable'>
                <span className='userSpan date-column'>{day.dayNumber}</span>
                <span className='userSpan'>{day.holiday ? '✔' : ''}</span>
                <span className='userSpan jobdescription'>{day.jobDescription}</span>
                <span className='userSpan startA'>{day.startWorkA}</span>
                <span className='userSpan endA'>{day.endWorkA}</span>
                <span className='userSpan startB'>{day.startWorkB}</span>
                <span className='userSpan endB'>{day.endWorkB}</span>
                <span className='userSpan hours-min-width'>{day.totalHours && day.totalHours.total}</span>
                <span className='userSpan hours-min-width'>{day.totalHours && day.totalHours.normal}</span>
                <span className='userSpan hours-min-width'>{day.totalHours && day.totalHours.special}</span>
              </div>
              {/* <p>Total Hours: {hours.totalHours}</p> */}
            </li>
          )
        }
      </ul>      
      {/* <h3>Month total Hours: <span className='totalHoursStyle'>{allTotal}</span>, Normal rate: <span className='totalHoursStyle'>{allNormal}</span>, Special rate: <span className='totalHoursStyle'>{allSpecial}</span></h3> */}
      <h3>Month total Hours: <span className='totalHoursStyle'>{hours.monthHours.totalHours}</span>, Normal rate: <span className='totalHoursStyle'>{hours.monthHours.normalRate}</span>, Special rate: <span className='totalHoursStyle'>{hours.monthHours.specialRate}</span></h3>
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

            // let startA = startTimeA ? startTimeA : 0
            // let endA = endTimeA ? endTimeA : 0
            // let startB = startTimeB ? startTimeB : 0
            // let endB = endTimeB ? endTimeB : 0

            let normal = 0
            let special = 0

            

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
            
            if (endA > 18) {
                special += endA - 18
                normal += 18 - startA
            }
            
            if (endB > 18) {
                special += endB - 18
                normal += 18 - startB
            }

            if (endA < 18) {
                normal += endA - startA
            }

            if (endB < 18) {
                normal += endB - startB
            }

            normal = normal % 1 !== 0 ? normal.toFixed(2) : normal
            special = special % 1 !== 0 ? special.toFixed(2) : special
            total = total % 1 !== 0 ? total.toFixed(2) : total

            if (isWeekend === 0 || isWeekend === 6 || holiday) {
                special = total
                normal = 0
            }

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
                // return console.log('Month is a required field')
                setErrorMessage('Month is a required field')
                setTimeout(() => {
                setErrorMessage(null)
                }, 5000)
                return
            }

            const {
                startWorkA0,
                startWorkA1,
                startWorkA2,
                startWorkA3,
                startWorkA4,
                startWorkA5,
                startWorkA6,
                startWorkA7,
                startWorkA8,
                startWorkA9,
                startWorkA10,
                startWorkA11,
                startWorkA12,
                startWorkA13,
                startWorkA14,
                startWorkA15,
                startWorkA16,
                startWorkA17,
                startWorkA18,
                startWorkA19,
                startWorkA20,
                startWorkA21,
                startWorkA22,
                startWorkA23,
                startWorkA24,
                startWorkA25,
                startWorkA26,
                startWorkA27,
                startWorkA28,
                startWorkA29,
                startWorkA30,
                
            } = start

            const {
                endWorkA0,
                endWorkA1,
                endWorkA2,
                endWorkA3,
                endWorkA4,
                endWorkA5,
                endWorkA6,
                endWorkA7,
                endWorkA8,
                endWorkA9,
                endWorkA10,
                endWorkA11,
                endWorkA12,
                endWorkA13,
                endWorkA14,
                endWorkA15,
                endWorkA16,
                endWorkA17,
                endWorkA18,
                endWorkA19,
                endWorkA20,
                endWorkA21,
                endWorkA22,
                endWorkA23,
                endWorkA24,
                endWorkA25,
                endWorkA26,
                endWorkA27,
                endWorkA28,
                endWorkA29,
                endWorkA30,
                
            } = end

            const {
                startWorkB0,
                startWorkB1,
                startWorkB2,
                startWorkB3,
                startWorkB4,
                startWorkB5,
                startWorkB6,
                startWorkB7,
                startWorkB8,
                startWorkB9,
                startWorkB10,
                startWorkB11,
                startWorkB12,
                startWorkB13,
                startWorkB14,
                startWorkB15,
                startWorkB16,
                startWorkB17,
                startWorkB18,
                startWorkB19,
                startWorkB20,
                startWorkB21,
                startWorkB22,
                startWorkB23,
                startWorkB24,
                startWorkB25,
                startWorkB26,
                startWorkB27,
                startWorkB28,
                startWorkB29,
                startWorkB30,
                
            } = start

            const {
                endWorkB0,
                endWorkB1,
                endWorkB2,
                endWorkB3,
                endWorkB4,
                endWorkB5,
                endWorkB6,
                endWorkB7,
                endWorkB8,
                endWorkB9,
                endWorkB10,
                endWorkB11,
                endWorkB12,
                endWorkB13,
                endWorkB14,
                endWorkB15,
                endWorkB16,
                endWorkB17,
                endWorkB18,
                endWorkB19,
                endWorkB20,
                endWorkB21,
                endWorkB22,
                endWorkB23,
                endWorkB24,
                endWorkB25,
                endWorkB26,
                endWorkB27,
                endWorkB28,
                endWorkB29,
                endWorkB30,
                
            } = end
            
            const {
                jobDescription0,
                jobDescription1,
                jobDescription2,
                jobDescription3,
                jobDescription4,
                jobDescription5,
                jobDescription6,
                jobDescription7,
                jobDescription8,
                jobDescription9,
                jobDescription10,
                jobDescription11,
                jobDescription12,
                jobDescription13,
                jobDescription14,
                jobDescription15,
                jobDescription16,
                jobDescription17,
                jobDescription18,
                jobDescription19,
                jobDescription20,
                jobDescription21,
                jobDescription22,
                jobDescription23,
                jobDescription24,
                jobDescription25,
                jobDescription26,
                jobDescription27,
                jobDescription28,
                jobDescription29,
                jobDescription30,
                
            } = description

            const {
                day0,
                day1,
                day2,
                day3,
                day4,
                day5,
                day6,
                day7,
                day8,
                day9,
                day10,
                day11,
                day12,
                day13,
                day14,
                day15,
                day16,
                day17,
                day18,
                day19,
                day20,
                day21,
                day22,
                day23,
                day24,
                day25,
                day26,
                day27,
                day28,
                day29,
                day30,
            } = day

            const {
                holiday0,
                holiday1,
                holiday2,
                holiday3,
                holiday4,
                holiday5,
                holiday6,
                holiday7,
                holiday8,
                holiday9,
                holiday10,
                holiday11,
                holiday12,
                holiday13,
                holiday14,
                holiday15,
                holiday16,
                holiday17,
                holiday18,
                holiday19,
                holiday20,
                holiday21,
                holiday22,
                holiday23,
                holiday24,
                holiday25,
                holiday26,
                holiday27,
                holiday28,
                holiday29,
                holiday30,
            } = checked

            hours.days[0].holiday = holiday0 ? holiday0 : false
            hours.days[1].holiday = holiday1 ? holiday1 : false
            hours.days[2].holiday = holiday2 ? holiday2 : false
            hours.days[3].holiday = holiday3 ? holiday3 : false
            hours.days[4].holiday = holiday4 ? holiday4 : false
            hours.days[5].holiday = holiday5 ? holiday5 : false
            hours.days[6].holiday = holiday6 ? holiday6 : false
            hours.days[7].holiday = holiday7 ? holiday7 : false
            hours.days[8].holiday = holiday8 ? holiday8 : false
            hours.days[9].holiday = holiday9 ? holiday9 : false
            hours.days[10].holiday = holiday10 ? holiday10 : false
            hours.days[11].holiday = holiday11 ? holiday11 : false
            hours.days[12].holiday = holiday12 ? holiday12 : false
            hours.days[13].holiday = holiday13 ? holiday13 : false
            hours.days[14].holiday = holiday14 ? holiday14 : false
            hours.days[15].holiday = holiday15 ? holiday15 : false
            hours.days[16].holiday = holiday16 ? holiday16 : false
            hours.days[17].holiday = holiday17 ? holiday17 : false
            hours.days[18].holiday = holiday18 ? holiday18 : false
            hours.days[19].holiday = holiday19 ? holiday19 : false
            hours.days[20].holiday = holiday20 ? holiday20 : false
            hours.days[21].holiday = holiday21 ? holiday21 : false
            hours.days[22].holiday = holiday22 ? holiday22 : false
            hours.days[23].holiday = holiday23 ? holiday23 : false
            hours.days[24].holiday = holiday24 ? holiday24 : false
            hours.days[25].holiday = holiday25 ? holiday25 : false
            hours.days[26].holiday = holiday26 ? holiday26 : false
            hours.days[27].holiday = holiday27 ? holiday27 : false
            hours.days[28].holiday = holiday28 ? holiday28 : false
            hours.days[29].holiday = holiday29 ? holiday29 : false
            hours.days[30].holiday = holiday30 ? holiday30 : false
            
            // if startWorkA is not defined, leave default value time 00:00
            hours.days[0].startWorkA = startWorkA0 ? startWorkA0 : '00:00'
            hours.days[1].startWorkA = startWorkA1 ? startWorkA1 : '00:00'
            hours.days[2].startWorkA = startWorkA2 ? startWorkA2 : '00:00'
            hours.days[3].startWorkA = startWorkA3 ? startWorkA3 : '00:00'
            hours.days[4].startWorkA = startWorkA4 ? startWorkA4 : '00:00'
            hours.days[5].startWorkA = startWorkA5 ? startWorkA5 : '00:00'
            hours.days[6].startWorkA = startWorkA6 ? startWorkA6 : '00:00'
            hours.days[7].startWorkA = startWorkA7 ? startWorkA7 : '00:00'
            hours.days[8].startWorkA = startWorkA8 ? startWorkA8 : '00:00'
            hours.days[9].startWorkA = startWorkA9 ? startWorkA9 : '00:00'
            hours.days[10].startWorkA = startWorkA10 ? startWorkA10 : '00:00'
            hours.days[11].startWorkA = startWorkA11 ? startWorkA11 : '00:00'
            hours.days[12].startWorkA = startWorkA12 ? startWorkA12 : '00:00'
            hours.days[13].startWorkA = startWorkA13 ? startWorkA13 : '00:00'
            hours.days[14].startWorkA = startWorkA14 ? startWorkA14 : '00:00'
            hours.days[15].startWorkA = startWorkA15 ? startWorkA15 : '00:00'
            hours.days[16].startWorkA = startWorkA16 ? startWorkA16 : '00:00'
            hours.days[17].startWorkA = startWorkA17 ? startWorkA17 : '00:00'
            hours.days[18].startWorkA = startWorkA18 ? startWorkA18 : '00:00'
            hours.days[19].startWorkA = startWorkA19 ? startWorkA19 : '00:00'
            hours.days[20].startWorkA = startWorkA20 ? startWorkA20 : '00:00'
            hours.days[21].startWorkA = startWorkA21 ? startWorkA21 : '00:00'
            hours.days[22].startWorkA = startWorkA22 ? startWorkA22 : '00:00'
            hours.days[23].startWorkA = startWorkA23 ? startWorkA23 : '00:00'
            hours.days[24].startWorkA = startWorkA24 ? startWorkA24 : '00:00'
            hours.days[25].startWorkA = startWorkA25 ? startWorkA25 : '00:00'
            hours.days[26].startWorkA = startWorkA26 ? startWorkA26 : '00:00'
            hours.days[27].startWorkA = startWorkA27 ? startWorkA27 : '00:00'
            hours.days[28].startWorkA = startWorkA28 ? startWorkA28 : '00:00'
            hours.days[29].startWorkA = startWorkA29 ? startWorkA29 : '00:00'
            hours.days[30].startWorkA = startWorkA30 ? startWorkA30 : '00:00'
            
            // if endWorkA is not defined, leave default value time 00:00
            hours.days[0].endWorkA = endWorkA0 ? endWorkA0 : '00:00'
            hours.days[1].endWorkA = endWorkA1 ? endWorkA1 : '00:00'
            hours.days[2].endWorkA = endWorkA2 ? endWorkA2 : '00:00'
            hours.days[3].endWorkA = endWorkA3 ? endWorkA3 : '00:00'
            hours.days[4].endWorkA = endWorkA4 ? endWorkA4 : '00:00'
            hours.days[5].endWorkA = endWorkA5 ? endWorkA5 : '00:00'
            hours.days[6].endWorkA = endWorkA6 ? endWorkA6 : '00:00'
            hours.days[7].endWorkA = endWorkA7 ? endWorkA7 : '00:00'
            hours.days[8].endWorkA = endWorkA8 ? endWorkA8 : '00:00'
            hours.days[9].endWorkA = endWorkA9 ? endWorkA9 : '00:00'
            hours.days[10].endWorkA = endWorkA10 ? endWorkA10 : '00:00'
            hours.days[11].endWorkA = endWorkA11 ? endWorkA11 : '00:00'
            hours.days[12].endWorkA = endWorkA12 ? endWorkA12 : '00:00'
            hours.days[13].endWorkA = endWorkA13 ? endWorkA13 : '00:00'
            hours.days[14].endWorkA = endWorkA14 ? endWorkA14 : '00:00'
            hours.days[15].endWorkA = endWorkA15 ? endWorkA15 : '00:00'
            hours.days[16].endWorkA = endWorkA16 ? endWorkA16 : '00:00'
            hours.days[17].endWorkA = endWorkA17 ? endWorkA17 : '00:00'
            hours.days[18].endWorkA = endWorkA18 ? endWorkA18 : '00:00'
            hours.days[19].endWorkA = endWorkA19 ? endWorkA19 : '00:00'
            hours.days[20].endWorkA = endWorkA20 ? endWorkA20 : '00:00'
            hours.days[21].endWorkA = endWorkA21 ? endWorkA21 : '00:00'
            hours.days[22].endWorkA = endWorkA22 ? endWorkA22 : '00:00'
            hours.days[23].endWorkA = endWorkA23 ? endWorkA23 : '00:00'
            hours.days[24].endWorkA = endWorkA24 ? endWorkA24 : '00:00'
            hours.days[25].endWorkA = endWorkA25 ? endWorkA25 : '00:00'
            hours.days[26].endWorkA = endWorkA26 ? endWorkA26 : '00:00'
            hours.days[27].endWorkA = endWorkA27 ? endWorkA27 : '00:00'
            hours.days[28].endWorkA = endWorkA28 ? endWorkA28 : '00:00'
            hours.days[29].endWorkA = endWorkA29 ? endWorkA29 : '00:00'
            hours.days[30].endWorkA = endWorkA30 ? endWorkA30 : '00:00'

            // if startWorkA is not defined, leave default value time 00:00
            hours.days[0].startWorkB = startWorkB0 ? startWorkB0 : '00:00'
            hours.days[1].startWorkB = startWorkB1 ? startWorkB1 : '00:00'
            hours.days[2].startWorkB = startWorkB2 ? startWorkB2 : '00:00'
            hours.days[3].startWorkB = startWorkB3 ? startWorkB3 : '00:00'
            hours.days[4].startWorkB = startWorkB4 ? startWorkB4 : '00:00'
            hours.days[5].startWorkB = startWorkB5 ? startWorkB5 : '00:00'
            hours.days[6].startWorkB = startWorkB6 ? startWorkB6 : '00:00'
            hours.days[7].startWorkB = startWorkB7 ? startWorkB7 : '00:00'
            hours.days[8].startWorkB = startWorkB8 ? startWorkB8 : '00:00'
            hours.days[9].startWorkB = startWorkB9 ? startWorkB9 : '00:00'
            hours.days[10].startWorkB = startWorkB10 ? startWorkB10 : '00:00'
            hours.days[11].startWorkB = startWorkB11 ? startWorkB11 : '00:00'
            hours.days[12].startWorkB = startWorkB12 ? startWorkB12 : '00:00'
            hours.days[13].startWorkB = startWorkB13 ? startWorkB13 : '00:00'
            hours.days[14].startWorkB = startWorkB14 ? startWorkB14 : '00:00'
            hours.days[15].startWorkB = startWorkB15 ? startWorkB15 : '00:00'
            hours.days[16].startWorkB = startWorkB16 ? startWorkB16 : '00:00'
            hours.days[17].startWorkB = startWorkB17 ? startWorkB17 : '00:00'
            hours.days[18].startWorkB = startWorkB18 ? startWorkB18 : '00:00'
            hours.days[19].startWorkB = startWorkB19 ? startWorkB19 : '00:00'
            hours.days[20].startWorkB = startWorkB20 ? startWorkB20 : '00:00'
            hours.days[21].startWorkB = startWorkB21 ? startWorkB21 : '00:00'
            hours.days[22].startWorkB = startWorkB22 ? startWorkB22 : '00:00'
            hours.days[23].startWorkB = startWorkB23 ? startWorkB23 : '00:00'
            hours.days[24].startWorkB = startWorkB24 ? startWorkB24 : '00:00'
            hours.days[25].startWorkB = startWorkB25 ? startWorkB25 : '00:00'
            hours.days[26].startWorkB = startWorkB26 ? startWorkB26 : '00:00'
            hours.days[27].startWorkB = startWorkB27 ? startWorkB27 : '00:00'
            hours.days[28].startWorkB = startWorkB28 ? startWorkB28 : '00:00'
            hours.days[29].startWorkB = startWorkB29 ? startWorkB29 : '00:00'
            hours.days[30].startWorkB = startWorkB30 ? startWorkB30 : '00:00'
            
            // if endWorkA is not defined, leave default value time 00:00
            hours.days[0].endWorkB = endWorkB0 ? endWorkB0 : '00:00'
            hours.days[1].endWorkB = endWorkB1 ? endWorkB1 : '00:00'
            hours.days[2].endWorkB = endWorkB2 ? endWorkB2 : '00:00'
            hours.days[3].endWorkB = endWorkB3 ? endWorkB3 : '00:00'
            hours.days[4].endWorkB = endWorkB4 ? endWorkB4 : '00:00'
            hours.days[5].endWorkB = endWorkB5 ? endWorkB5 : '00:00'
            hours.days[6].endWorkB = endWorkB6 ? endWorkB6 : '00:00'
            hours.days[7].endWorkB = endWorkB7 ? endWorkB7 : '00:00'
            hours.days[8].endWorkB = endWorkB8 ? endWorkB8 : '00:00'
            hours.days[9].endWorkB = endWorkB9 ? endWorkB9 : '00:00'
            hours.days[10].endWorkB = endWorkB10 ? endWorkB10 : '00:00'
            hours.days[11].endWorkB = endWorkB11 ? endWorkB11 : '00:00'
            hours.days[12].endWorkB = endWorkB12 ? endWorkB12 : '00:00'
            hours.days[13].endWorkB = endWorkB13 ? endWorkB13 : '00:00'
            hours.days[14].endWorkB = endWorkB14 ? endWorkB14 : '00:00'
            hours.days[15].endWorkB = endWorkB15 ? endWorkB15 : '00:00'
            hours.days[16].endWorkB = endWorkB16 ? endWorkB16 : '00:00'
            hours.days[17].endWorkB = endWorkB17 ? endWorkB17 : '00:00'
            hours.days[18].endWorkB = endWorkB18 ? endWorkB18 : '00:00'
            hours.days[19].endWorkB = endWorkB19 ? endWorkB19 : '00:00'
            hours.days[20].endWorkB = endWorkB20 ? endWorkB20 : '00:00'
            hours.days[21].endWorkB = endWorkB21 ? endWorkB21 : '00:00'
            hours.days[22].endWorkB = endWorkB22 ? endWorkB22 : '00:00'
            hours.days[23].endWorkB = endWorkB23 ? endWorkB23 : '00:00'
            hours.days[24].endWorkB = endWorkB24 ? endWorkB24 : '00:00'
            hours.days[25].endWorkB = endWorkB25 ? endWorkB25 : '00:00'
            hours.days[26].endWorkB = endWorkB26 ? endWorkB26 : '00:00'
            hours.days[27].endWorkB = endWorkB27 ? endWorkB27 : '00:00'
            hours.days[28].endWorkB = endWorkB28 ? endWorkB28 : '00:00'
            hours.days[29].endWorkB = endWorkB29 ? endWorkB29 : '00:00'
            hours.days[30].endWorkB = endWorkB30 ? endWorkB30 : '00:00'
            
            hours.days[0].jobDescription = jobDescription0
            hours.days[1].jobDescription = jobDescription1
            hours.days[2].jobDescription = jobDescription2
            hours.days[3].jobDescription = jobDescription3
            hours.days[4].jobDescription = jobDescription4
            hours.days[5].jobDescription = jobDescription5
            hours.days[6].jobDescription = jobDescription6
            hours.days[7].jobDescription = jobDescription7
            hours.days[8].jobDescription = jobDescription8
            hours.days[9].jobDescription = jobDescription9
            hours.days[10].jobDescription = jobDescription10
            hours.days[11].jobDescription = jobDescription11
            hours.days[12].jobDescription = jobDescription12
            hours.days[13].jobDescription = jobDescription13
            hours.days[14].jobDescription = jobDescription14
            hours.days[15].jobDescription = jobDescription15
            hours.days[16].jobDescription = jobDescription16
            hours.days[17].jobDescription = jobDescription17
            hours.days[18].jobDescription = jobDescription18
            hours.days[19].jobDescription = jobDescription19
            hours.days[20].jobDescription = jobDescription20
            hours.days[21].jobDescription = jobDescription21
            hours.days[22].jobDescription = jobDescription22
            hours.days[23].jobDescription = jobDescription23
            hours.days[24].jobDescription = jobDescription24
            hours.days[25].jobDescription = jobDescription25
            hours.days[26].jobDescription = jobDescription26
            hours.days[27].jobDescription = jobDescription27
            hours.days[28].jobDescription = jobDescription28
            hours.days[29].jobDescription = jobDescription29
            hours.days[30].jobDescription = jobDescription30
            
            const dayName = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"]

            hours.days[0].dayNumber = day0 ? `${day0} ${dayName[new Date(day0).getDay()]}` : ''
            hours.days[1].dayNumber = day1 ? `${day1} ${dayName[new Date(day1).getDay()]}` : ''
            hours.days[2].dayNumber = day2 ? `${day2} ${dayName[new Date(day2).getDay()]}` : ''
            hours.days[3].dayNumber = day3 ? `${day3} ${dayName[new Date(day3).getDay()]}` : ''
            hours.days[4].dayNumber = day4 ? `${day4} ${dayName[new Date(day4).getDay()]}` : ''
            hours.days[5].dayNumber = day5 ? `${day5} ${dayName[new Date(day5).getDay()]}` : ''
            hours.days[6].dayNumber = day6 ? `${day6} ${dayName[new Date(day6).getDay()]}` : ''
            hours.days[7].dayNumber = day7 ? `${day7} ${dayName[new Date(day7).getDay()]}` : ''
            hours.days[8].dayNumber = day8 ? `${day8} ${dayName[new Date(day8).getDay()]}` : ''
            hours.days[9].dayNumber = day9 ? `${day9} ${dayName[new Date(day9).getDay()]}` : ''
            hours.days[10].dayNumber = day10 ? `${day10} ${dayName[new Date(day10).getDay()]}` : ''
            hours.days[11].dayNumber = day11 ? `${day11} ${dayName[new Date(day11).getDay()]}` : ''
            hours.days[12].dayNumber = day12 ? `${day12} ${dayName[new Date(day12).getDay()]}` : ''
            hours.days[13].dayNumber = day13 ? `${day13} ${dayName[new Date(day13).getDay()]}` : ''
            hours.days[14].dayNumber = day14 ? `${day14} ${dayName[new Date(day14).getDay()]}` : ''
            hours.days[15].dayNumber = day15 ? `${day15} ${dayName[new Date(day15).getDay()]}` : ''
            hours.days[16].dayNumber = day16 ? `${day16} ${dayName[new Date(day16).getDay()]}` : ''
            hours.days[17].dayNumber = day17 ? `${day17} ${dayName[new Date(day17).getDay()]}` : ''
            hours.days[18].dayNumber = day18 ? `${day18} ${dayName[new Date(day18).getDay()]}` : ''
            hours.days[19].dayNumber = day19 ? `${day19} ${dayName[new Date(day19).getDay()]}` : ''
            hours.days[20].dayNumber = day20 ? `${day20} ${dayName[new Date(day20).getDay()]}` : ''
            hours.days[21].dayNumber = day21 ? `${day21} ${dayName[new Date(day21).getDay()]}` : ''
            hours.days[22].dayNumber = day22 ? `${day22} ${dayName[new Date(day22).getDay()]}` : ''
            hours.days[23].dayNumber = day23 ? `${day23} ${dayName[new Date(day23).getDay()]}` : ''
            hours.days[24].dayNumber = day24 ? `${day24} ${dayName[new Date(day24).getDay()]}` : ''
            hours.days[25].dayNumber = day25 ? `${day25} ${dayName[new Date(day25).getDay()]}` : ''
            hours.days[26].dayNumber = day26 ? `${day26} ${dayName[new Date(day26).getDay()]}` : ''
            hours.days[27].dayNumber = day27 ? `${day27} ${dayName[new Date(day27).getDay()]}` : ''
            hours.days[28].dayNumber = day28 ? `${day28} ${dayName[new Date(day28).getDay()]}` : ''
            hours.days[29].dayNumber = day29 ? `${day29} ${dayName[new Date(day29).getDay()]}` : ''
            hours.days[30].dayNumber = day30 ? `${day30} ${dayName[new Date(day30).getDay()]}` : ''

            

            // use default value time 00:00
            // simulate
            // --------
            hours.days[0].totalHours = calculate(timeToDecimal(hours.days[0].startWorkA), timeToDecimal(hours.days[0].endWorkA), timeToDecimal(hours.days[0].startWorkB), timeToDecimal(hours.days[0].endWorkB), new Date(day0).getDay(), holiday0)
            hours.days[1].totalHours = calculate(timeToDecimal(hours.days[1].startWorkA), timeToDecimal(hours.days[1].endWorkA), timeToDecimal(hours.days[1].startWorkB), timeToDecimal(hours.days[1].endWorkB), new Date(day1).getDay(), holiday1)
            hours.days[2].totalHours = calculate(timeToDecimal(hours.days[2].startWorkA), timeToDecimal(hours.days[2].endWorkA), timeToDecimal(hours.days[2].startWorkB), timeToDecimal(hours.days[2].endWorkB), new Date(day2).getDay(), holiday2)
            hours.days[3].totalHours = calculate(timeToDecimal(hours.days[3].startWorkA), timeToDecimal(hours.days[3].endWorkA), timeToDecimal(hours.days[3].startWorkB), timeToDecimal(hours.days[3].endWorkB), new Date(day3).getDay(), holiday3)
            hours.days[4].totalHours = calculate(timeToDecimal(hours.days[4].startWorkA), timeToDecimal(hours.days[4].endWorkA), timeToDecimal(hours.days[4].startWorkB), timeToDecimal(hours.days[4].endWorkB), new Date(day4).getDay(), holiday4)
            hours.days[5].totalHours = calculate(timeToDecimal(hours.days[5].startWorkA), timeToDecimal(hours.days[5].endWorkA), timeToDecimal(hours.days[5].startWorkB), timeToDecimal(hours.days[5].endWorkB), new Date(day5).getDay(), holiday5)
            hours.days[6].totalHours = calculate(timeToDecimal(hours.days[6].startWorkA), timeToDecimal(hours.days[6].endWorkA), timeToDecimal(hours.days[6].startWorkB), timeToDecimal(hours.days[6].endWorkB), new Date(day6).getDay(), holiday6)
            hours.days[7].totalHours = calculate(timeToDecimal(hours.days[7].startWorkA), timeToDecimal(hours.days[7].endWorkA), timeToDecimal(hours.days[7].startWorkB), timeToDecimal(hours.days[7].endWorkB), new Date(day7).getDay(), holiday7)
            hours.days[8].totalHours = calculate(timeToDecimal(hours.days[8].startWorkA), timeToDecimal(hours.days[8].endWorkA), timeToDecimal(hours.days[8].startWorkB), timeToDecimal(hours.days[8].endWorkB), new Date(day8).getDay(), holiday8)
            hours.days[9].totalHours = calculate(timeToDecimal(hours.days[9].startWorkA), timeToDecimal(hours.days[9].endWorkA), timeToDecimal(hours.days[9].startWorkB), timeToDecimal(hours.days[9].endWorkB), new Date(day9).getDay(), holiday9)
            hours.days[10].totalHours = calculate(timeToDecimal(hours.days[10].startWorkA), timeToDecimal(hours.days[10].endWorkA), timeToDecimal(hours.days[10].startWorkB), timeToDecimal(hours.days[10].endWorkB), new Date(day10).getDay(), holiday10)
            hours.days[11].totalHours = calculate(timeToDecimal(hours.days[11].startWorkA), timeToDecimal(hours.days[11].endWorkA), timeToDecimal(hours.days[11].startWorkB), timeToDecimal(hours.days[11].endWorkB), new Date(day11).getDay(), holiday11)
            hours.days[12].totalHours = calculate(timeToDecimal(hours.days[12].startWorkA), timeToDecimal(hours.days[12].endWorkA), timeToDecimal(hours.days[12].startWorkB), timeToDecimal(hours.days[12].endWorkB), new Date(day12).getDay(), holiday12)
            hours.days[13].totalHours = calculate(timeToDecimal(hours.days[13].startWorkA), timeToDecimal(hours.days[13].endWorkA), timeToDecimal(hours.days[13].startWorkB), timeToDecimal(hours.days[13].endWorkB), new Date(day13).getDay(), holiday13)
            hours.days[14].totalHours = calculate(timeToDecimal(hours.days[14].startWorkA), timeToDecimal(hours.days[14].endWorkA), timeToDecimal(hours.days[14].startWorkB), timeToDecimal(hours.days[14].endWorkB), new Date(day14).getDay(), holiday14)
            hours.days[15].totalHours = calculate(timeToDecimal(hours.days[15].startWorkA), timeToDecimal(hours.days[15].endWorkA), timeToDecimal(hours.days[15].startWorkB), timeToDecimal(hours.days[15].endWorkB), new Date(day15).getDay(), holiday15)
            hours.days[16].totalHours = calculate(timeToDecimal(hours.days[16].startWorkA), timeToDecimal(hours.days[16].endWorkA), timeToDecimal(hours.days[16].startWorkB), timeToDecimal(hours.days[16].endWorkB), new Date(day16).getDay(), holiday16)
            hours.days[17].totalHours = calculate(timeToDecimal(hours.days[17].startWorkA), timeToDecimal(hours.days[17].endWorkA), timeToDecimal(hours.days[17].startWorkB), timeToDecimal(hours.days[17].endWorkB), new Date(day17).getDay(), holiday17)
            hours.days[18].totalHours = calculate(timeToDecimal(hours.days[18].startWorkA), timeToDecimal(hours.days[18].endWorkA), timeToDecimal(hours.days[18].startWorkB), timeToDecimal(hours.days[18].endWorkB), new Date(day18).getDay(), holiday18)
            hours.days[19].totalHours = calculate(timeToDecimal(hours.days[19].startWorkA), timeToDecimal(hours.days[19].endWorkA), timeToDecimal(hours.days[19].startWorkB), timeToDecimal(hours.days[19].endWorkB), new Date(day19).getDay(), holiday19)
            hours.days[20].totalHours = calculate(timeToDecimal(hours.days[20].startWorkA), timeToDecimal(hours.days[20].endWorkA), timeToDecimal(hours.days[20].startWorkB), timeToDecimal(hours.days[20].endWorkB), new Date(day20).getDay(), holiday20)
            hours.days[21].totalHours = calculate(timeToDecimal(hours.days[21].startWorkA), timeToDecimal(hours.days[21].endWorkA), timeToDecimal(hours.days[21].startWorkB), timeToDecimal(hours.days[21].endWorkB), new Date(day21).getDay(), holiday21)
            hours.days[22].totalHours = calculate(timeToDecimal(hours.days[22].startWorkA), timeToDecimal(hours.days[22].endWorkA), timeToDecimal(hours.days[22].startWorkB), timeToDecimal(hours.days[22].endWorkB), new Date(day22).getDay(), holiday22)
            hours.days[23].totalHours = calculate(timeToDecimal(hours.days[23].startWorkA), timeToDecimal(hours.days[23].endWorkA), timeToDecimal(hours.days[23].startWorkB), timeToDecimal(hours.days[23].endWorkB), new Date(day23).getDay(), holiday23)
            hours.days[24].totalHours = calculate(timeToDecimal(hours.days[24].startWorkA), timeToDecimal(hours.days[24].endWorkA), timeToDecimal(hours.days[24].startWorkB), timeToDecimal(hours.days[24].endWorkB), new Date(day24).getDay(), holiday24)
            hours.days[25].totalHours = calculate(timeToDecimal(hours.days[25].startWorkA), timeToDecimal(hours.days[25].endWorkA), timeToDecimal(hours.days[25].startWorkB), timeToDecimal(hours.days[25].endWorkB), new Date(day25).getDay(), holiday25)
            hours.days[26].totalHours = calculate(timeToDecimal(hours.days[26].startWorkA), timeToDecimal(hours.days[26].endWorkA), timeToDecimal(hours.days[26].startWorkB), timeToDecimal(hours.days[26].endWorkB), new Date(day26).getDay(), holiday26)
            hours.days[27].totalHours = calculate(timeToDecimal(hours.days[27].startWorkA), timeToDecimal(hours.days[27].endWorkA), timeToDecimal(hours.days[27].startWorkB), timeToDecimal(hours.days[27].endWorkB), new Date(day27).getDay(), holiday27)
            hours.days[28].totalHours = calculate(timeToDecimal(hours.days[28].startWorkA), timeToDecimal(hours.days[28].endWorkA), timeToDecimal(hours.days[28].startWorkB), timeToDecimal(hours.days[28].endWorkB), new Date(day28).getDay(), holiday28)
            hours.days[29].totalHours = calculate(timeToDecimal(hours.days[29].startWorkA), timeToDecimal(hours.days[29].endWorkA), timeToDecimal(hours.days[29].startWorkB), timeToDecimal(hours.days[29].endWorkB), new Date(day29).getDay(), holiday29)
            hours.days[30].totalHours = calculate(timeToDecimal(hours.days[30].startWorkA), timeToDecimal(hours.days[30].endWorkA), timeToDecimal(hours.days[30].startWorkB), timeToDecimal(hours.days[30].endWorkB), new Date(day30).getDay(), holiday30)
            
                        

            const normal = hours.days.map(day => day.totalHours && day.totalHours.normal)
            const special = hours.days.map(day => day.totalHours && day.totalHours.special)
            const total = hours.days.map(day => day.totalHours && day.totalHours.total)
            const allNormal = normal.filter(value => value !== undefined ).map(x => x = Number(x)).reduce((a,b) => a+b)
            const allSpecial = special.filter(value => value !== undefined ).map(x => x = Number(x)).reduce((a,b) => a+b)
            const allTotal = total.filter(value => value !== undefined ).map(x => x = Number(x)).reduce((a,b) => a+b)

            let numallNormal = allNormal % 1 !== 0 ? parseFloat(allNormal).toFixed(2) : allNormal
            let numallSpecial = allSpecial % 1 !== 0 ? parseFloat(allSpecial).toFixed(2) : allSpecial
            let numallTotal = allTotal % 1 !== 0 ? parseFloat(allTotal).toFixed(2) : allTotal

            hours.monthHours = {
                totalHours: numallTotal,
                normalRate: numallNormal,
                specialRate: numallSpecial,
            }

            hours.month = inputs.month

            console.log(hours)
            
            await hoursService
              .create(hours)
            console.log('hours created')
            console.log('checked', checked)
              setErrorMessage('Time card created')
              setTimeout(() => {
                setErrorMessage(null)
              }, 5000)
          }        

        return (
            <div>
                <h1>TIMESEDDEL / TIME CARD</h1>
                <br/>
                <button className='screenBtn' onClick={() => toScreen('1')} >Back</button>
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
                <p>MONTH</p>
                <input
                    type="text"
                    name="month"
                    value={inputs.month || ''}
                    onChange={handleChange}
                />
                    <div className='timecard'>
                        
                            {/* <div className='timeCardHeader'>
                                <p className='left'>DATE</p>
                                <p className='left'>JOB DESCRIPTION</p>
                                <p className='left'>START</p>
                                <p className='left'>FINISH</p> */}
                                {/* <p className='left'>TOTAL HOURS/TIMER</p> */}
                            {/* </div> */}

                            <div className='eachDay topeachday'>
                                <p className='topDay day'>{days[0].dayNumber}</p>

                                <div>
                                    <p>Date</p>
                                    <input
                                        id='0'
                                        type="date"
                                        label='Date'
                                        name="day0"
                                        value={day.day0 || ''}
                                        onChange={handleChange}
                                    />
                                </div>

                                <div>
                                    <p>Holiday</p>
                                    <input className='holiday'
                                        id='0'
                                        type="checkbox"
                                        name="holiday0"
                                        value={inputs.holiday0 || ''}
                                        onChange={handleChange}
                                    />
                                </div>
                                
                                <div>
                                    <p>Job Description</p>
                                    <input 
                                        id='0'
                                        type="text"
                                        name="jobDescription0"
                                        value={description.jobDescription0 || ''}
                                        onChange={handleChange}
                                    />
                                </div>

                                {/* <div style={{backgroundColor: '#4caf50'}}> */}
                                <div>
                                    <p className='startA'>Start</p>
                                    <input className='startA'
                                        id='0'
                                        type="time"
                                        name="startWorkA0"
                                        value={start.startWorkA0 || '00:00'}
                                        onChange={handleChange}
                                    />
                                </div>

                                {/* <div style={{backgroundColor: '#4caf50'}}> */}
                                <div>
                                    <p className='endA'>End</p>
                                    <input className='endA'
                                        id='0'
                                        type="time"
                                        name="endWorkA0"
                                        value={end.endWorkA0 || '00:00'}
                                        onChange={handleChange}
                                    />
                                </div>

                                <div>
                                    <p className='startB'>Start</p>
                                    <input  className='startB'
                                        id='0'
                                        type="time"
                                        name="startWorkB0"
                                        value={start.startWorkB0 || '00:00'}
                                        onChange={handleChange}
                                    />
                                </div>

                                <div>
                                    <p className='endB'>End</p>
                                    <input  className='endB'
                                        id='0'
                                        type="time"
                                        name="endWorkB0"
                                        value={end.endWorkB0 || '00:00'}
                                        onChange={handleChange}
                                />
                                </div>

                                {/* <p>{ start.startWorkA0 !== end.endWorkA0 &&
                                    JSON.stringify(calculate(timeToDecimal(start.startWorkA0), timeToDecimal(end.endWorkA0))) }</p> */}
                            </div>

                            <div className='eachDay'>
                                <p className='day'>{days[1].dayNumber}</p>

                                <input 
                                    id='1'
                                    type="date"
                                    name="day1"
                                    value={day.day1 || ''}
                                    onChange={handleChange}
                                />

                                <div>                                    
                                    <input className='holiday'
                                        id='1'
                                        type="checkbox"
                                        name="holiday1"
                                        value={inputs.holiday1 || ''}
                                        onChange={handleChange}
                                    />
                                </div>

                                <input 
                                    id='1'
                                    type="text"
                                    name="jobDescription1"
                                    value={description.jobDescription1 || ''}
                                    onChange={handleChange}
                                />

                                <input className='startA'
                                    id='1'
                                    type="time"
                                    name="startWorkA1"
                                    value={start.startWorkA1 || '00:00'}
                                    onChange={handleChange}
                                />

                                <input className='endA'
                                    id='1'
                                    type="time"
                                    name="endWorkA1"
                                    value={end.endWorkA1 || '00:00'}
                                    onChange={handleChange}
                                />

                                <input className='startB'
                                    id='1'
                                    type="time"
                                    name="startWorkB1"
                                    value={start.startWorkB1 || '00:00'}
                                    onChange={handleChange}
                                />

                                <input className='endB'
                                    id='1'
                                    type="time"
                                    name="endWorkB1"
                                    value={end.endWorkB1 || '00:00'}
                                    onChange={handleChange}
                                />
                            </div>

                            <div className='eachDay'>
                                <p className='day'>{days[2].dayNumber}</p>

                                <input 
                                    id='2'
                                    type="date"
                                    name="day2"
                                    value={day.day2 || ''}
                                    onChange={handleChange}
                                />

                                <div>                                    
                                    <input className='holiday'
                                        id='2'
                                        type="checkbox"
                                        name="holiday2"
                                        value={inputs.holiday2 || ''}
                                        onChange={handleChange}
                                    />
                                </div>

                                <input 
                                    id='2'
                                    type="text"
                                    name="jobDescription2"
                                    value={description.jobDescription2 || ''}
                                    onChange={handleChange}
                                />

                                <input className='startA'
                                    id='2'
                                    type="time"
                                    name="startWorkA2"
                                    value={start.startWorkA2 || '00:00'}
                                    onChange={handleChange}
                                />

                                <input className='endA'
                                    id='2'
                                    type="time"
                                    name="endWorkA2"
                                    value={end.endWorkA2 || '00:00'}
                                    onChange={handleChange}
                                />

                                <input className='startB'
                                    id='2'
                                    type="time"
                                    name="startWorkB2"
                                    value={start.startWorkB2 || '00:00'}
                                    onChange={handleChange}
                                />

                                <input className='endB'
                                    id='2'
                                    type="time"
                                    name="endWorkB2"
                                    value={end.endWorkB2 || '00:00'}
                                    onChange={handleChange}
                                />
                            </div>

                            <div className='eachDay'>
                                <p className='day'>{days[3].dayNumber}</p>

                                <input 
                                    id='3'
                                    type="date"
                                    name="day3"
                                    value={day.day3 || ''}
                                    onChange={handleChange}
                                />

                                <div>                                    
                                    <input className='holiday'
                                        id='3'
                                        type="checkbox"
                                        name="holiday3"
                                        value={inputs.holiday3 || ''}
                                        onChange={handleChange}
                                    />
                                </div>

                                <input 
                                    id='3'
                                    type="text"
                                    name="jobDescription3"
                                    value={description.jobDescription3 || ''}
                                    onChange={handleChange}
                                />

                                <input className='startA'
                                    id='3'
                                    type="time"
                                    name="startWorkA3"
                                    value={start.startWorkA3 || '00:00'}
                                    onChange={handleChange}
                                />

                                <input className='endA'
                                    id='3'
                                    type="time"
                                    name="endWorkA3"
                                    value={end.endWorkA3 || '00:00'}
                                    onChange={handleChange}
                                />

                                <input className='startB'
                                    id='3'
                                    type="time"
                                    name="startWorkB3"
                                    value={start.startWorkB3 || '00:00'}
                                    onChange={handleChange}
                                />

                                <input className='endB'
                                    id='3'
                                    type="time"
                                    name="endWorkB3"
                                    value={end.endWorkB3 || '00:00'}
                                    onChange={handleChange}
                                />
                            </div>

                            <div className='eachDay'>
                                <p className='day'>{days[4].dayNumber}</p>

                                <input 
                                    id='4'
                                    type="date"
                                    name="day4"
                                    value={day.day4 || ''}
                                    onChange={handleChange}
                                />

                                <div>                                    
                                    <input className='holiday'
                                        id='4'
                                        type="checkbox"
                                        name="holiday4"
                                        value={inputs.holiday4 || ''}
                                        onChange={handleChange}
                                    />
                                </div>

                                <input 
                                    id='4'
                                    type="text"
                                    name="jobDescription4"
                                    value={description.jobDescription4 || ''}
                                    onChange={handleChange}
                                />

                                <input className='startA'
                                    id='4'
                                    type="time"
                                    name="startWorkA4"
                                    value={start.startWorkA4 || '00:00'}
                                    onChange={handleChange}
                                />

                                <input className='endA'
                                    id='4'
                                    type="time"
                                    name="endWorkA4"
                                    value={end.endWorkA4 || '00:00'}
                                    onChange={handleChange}
                                />

                                <input className='startB'
                                    id='4'
                                    type="time"
                                    name="startWorkB4"
                                    value={start.startWorkB4 || '00:00'}
                                    onChange={handleChange}
                                />

                                <input className='endB'
                                    id='4'
                                    type="time"
                                    name="endWorkB4"
                                    value={end.endWorkB4 || '00:00'}
                                    onChange={handleChange}
                                />
                            </div>

                            <div className='eachDay'>
                                <p className='day'>{days[5].dayNumber}</p>

                                <input 
                                    id='5'
                                    type="date"
                                    name="day5"
                                    value={day.day5 || ''}
                                    onChange={handleChange}
                                />

                                <div>                                    
                                    <input className='holiday'
                                        id='5'
                                        type="checkbox"
                                        name="holiday5"
                                        value={inputs.holiday5 || ''}
                                        onChange={handleChange}
                                    />
                                </div>

                                <input 
                                    id='5'
                                    type="text"
                                    name="jobDescription5"
                                    value={description.jobDescription5 || ''}
                                    onChange={handleChange}
                                />

                                <input className='startA'
                                    id='5'
                                    type="time"
                                    name="startWorkA5"
                                    value={start.startWorkA5 || '00:00'}
                                    onChange={handleChange}
                                />

                                <input className='endA'
                                    id='5'
                                    type="time"
                                    name="endWorkA5"
                                    value={end.endWorkA5 || '00:00'}
                                    onChange={handleChange}
                                />

                                <input className='startB'
                                    id='5'
                                    type="time"
                                    name="startWorkB5"
                                    value={start.startWorkB5 || '00:00'}
                                    onChange={handleChange}
                                />

                                <input className='endB'
                                    id='5'
                                    type="time"
                                    name="endWorkB5"
                                    value={end.endWorkB5 || '00:00'}
                                    onChange={handleChange}
                                />
                            </div>

                            <div className='eachDay'>
                                <p className='day'>{days[6].dayNumber}</p>

                                <input 
                                    id='6'
                                    type="date"
                                    name="day6"
                                    value={day.day6 || ''}
                                    onChange={handleChange}
                                />

                                <div>                                    
                                    <input className='holiday'
                                        id='6'
                                        type="checkbox"
                                        name="holiday6"
                                        value={inputs.holiday6 || ''}
                                        onChange={handleChange}
                                    />
                                </div>

                                <input 
                                    id='6'
                                    type="text"
                                    name="jobDescription6"
                                    value={description.jobDescription6 || ''}
                                    onChange={handleChange}
                                />

                                <input className='startA'
                                    id='6'
                                    type="time"
                                    name="startWorkA6"
                                    value={start.startWorkA6 || '00:00'}
                                    onChange={handleChange}
                                />

                                <input className='endA'
                                    id='6'
                                    type="time"
                                    name="endWorkA6"
                                    value={end.endWorkA6 || '00:00'}
                                    onChange={handleChange}
                                />

                                <input className='startB'
                                    id='6'
                                    type="time"
                                    name="startWorkB6"
                                    value={start.startWorkB6 || '00:00'}
                                    onChange={handleChange}
                                />

                                <input className='endB'
                                    id='6'
                                    type="time"
                                    name="endWorkB6"
                                    value={end.endWorkB6 || '00:00'}
                                    onChange={handleChange}
                                />
                            </div>

                            <div className='eachDay'>
                                <p className='day'>{days[7].dayNumber}</p>

                                <input 
                                    id='7'
                                    type="date"
                                    name="day7"
                                    value={day.day7 || ''}
                                    onChange={handleChange}
                                />

                                <div>                                    
                                    <input className='holiday'
                                        id='7'
                                        type="checkbox"
                                        name="holiday7"
                                        value={inputs.holiday7 || ''}
                                        onChange={handleChange}
                                    />
                                </div>

                                <input 
                                    id='7'
                                    type="text"
                                    name="jobDescription7"
                                    value={description.jobDescription7 || ''}
                                    onChange={handleChange}
                                />

                                <input className='startA'
                                    id='7'
                                    type="time"
                                    name="startWorkA7"
                                    value={start.startWorkA7 || '00:00'}
                                    onChange={handleChange}
                                />

                                <input className='endA'
                                    id='7'
                                    type="time"
                                    name="endWorkA7"
                                    value={end.endWorkA7 || '00:00'}
                                    onChange={handleChange}
                                />

                                <input className='startB'
                                    id='7'
                                    type="time"
                                    name="startWorkB7"
                                    value={start.startWorkB7 || '00:00'}
                                    onChange={handleChange}
                                />

                                <input className='endB'
                                    id='7'
                                    type="time"
                                    name="endWorkB7"
                                    value={end.endWorkB7 || '00:00'}
                                    onChange={handleChange}
                                />
                            </div>

                            <div className='eachDay'>
                                <p className='day'>{days[8].dayNumber}</p>

                                <input 
                                    id='8'
                                    type="date"
                                    name="day8"
                                    value={day.day8 || ''}
                                    onChange={handleChange}
                                />

                                <div>                                    
                                    <input className='holiday'
                                        id='8'
                                        type="checkbox"
                                        name="holiday8"
                                        value={inputs.holiday8 || ''}
                                        onChange={handleChange}
                                    />
                                </div>

                                <input 
                                    id='8'
                                    type="text"
                                    name="jobDescription8"
                                    value={description.jobDescription8 || ''}
                                    onChange={handleChange}
                                />

                                <input className='startA'
                                    id='8'
                                    type="time"
                                    name="startWorkA8"
                                    value={start.startWorkA8 || '00:00'}
                                    onChange={handleChange}
                                />

                                <input className='endA'
                                    id='8'
                                    type="time"
                                    name="endWorkA8"
                                    value={end.endWorkA8 || '00:00'}
                                    onChange={handleChange}
                                />

                                <input className='startB'
                                    id='8'
                                    type="time"
                                    name="startWorkB8"
                                    value={start.startWorkB8 || '00:00'}
                                    onChange={handleChange}
                                />

                                <input className='endB'
                                    id='8'
                                    type="time"
                                    name="endWorkB8"
                                    value={end.endWorkB8 || '00:00'}
                                    onChange={handleChange}
                                />
                            </div>

                            <div className='eachDay'>
                                <p className='day'>{days[9].dayNumber}</p>

                                <input 
                                    id='9'
                                    type="date"
                                    name="day9"
                                    value={day.day9 || ''}
                                    onChange={handleChange}
                                />

                                <div>                                    
                                    <input className='holiday'
                                        id='9'
                                        type="checkbox"
                                        name="holiday9"
                                        value={inputs.holiday9 || ''}
                                        onChange={handleChange}
                                    />
                                </div>

                                <input 
                                    id='9'
                                    type="text"
                                    name="jobDescription9"
                                    value={description.jobDescription9 || ''}
                                    onChange={handleChange}
                                />

                                <input className='startA'
                                    id='9'
                                    type="time"
                                    name="startWorkA9"
                                    value={start.startWorkA9 || '00:00'}
                                    onChange={handleChange}
                                />

                                <input className='endA'
                                    id='9'
                                    type="time"
                                    name="endWorkA9"
                                    value={end.endWorkA9 || '00:00'}
                                    onChange={handleChange}
                                />

                                <input className='startB'
                                    id='9'
                                    type="time"
                                    name="startWorkB9"
                                    value={start.startWorkB9 || '00:00'}
                                    onChange={handleChange}
                                />

                                <input className='endB'
                                    id='9'
                                    type="time"
                                    name="endWorkB9"
                                    value={end.endWorkB9 || '00:00'}
                                    onChange={handleChange}
                                />
                            </div>

                            <div className='eachDay'>
                                <p className='day'>{days[10].dayNumber}</p>

                                <input 
                                    id='10'
                                    type="date"
                                    name="day10"
                                    value={day.day10 || ''}
                                    onChange={handleChange}
                                />

                                <div>                                    
                                    <input className='holiday'
                                        id='10'
                                        type="checkbox"
                                        name="holiday10"
                                        value={inputs.holiday10 || ''}
                                        onChange={handleChange}
                                    />
                                </div>

                                <input 
                                    id='10'
                                    type="text"
                                    name="jobDescription10"
                                    value={description.jobDescription10 || ''}
                                    onChange={handleChange}
                                />

                                <input className='startA'
                                    id='10'
                                    type="time"
                                    name="startWorkA10"
                                    value={start.startWorkA10 || '00:00'}
                                    onChange={handleChange}
                                />

                                <input className='endA'
                                    id='10'
                                    type="time"
                                    name="endWorkA10"
                                    value={end.endWorkA10 || '00:00'}
                                    onChange={handleChange}
                                />

                                <input className='startB'
                                    id='10'
                                    type="time"
                                    name="startWorkB10"
                                    value={start.startWorkB10 || '00:00'}
                                    onChange={handleChange}
                                />

                                <input className='endB'
                                    id='10'
                                    type="time"
                                    name="endWorkB10"
                                    value={end.endWorkB10 || '00:00'}
                                    onChange={handleChange}
                                />
                            </div>

                            <div className='eachDay'>
                                <p className='day'>{days[11].dayNumber}</p>

                                <input 
                                    id='11'
                                    type="date"
                                    name="day11"
                                    value={day.day11 || ''}
                                    onChange={handleChange}
                                />

                                <div>                                    
                                    <input className='holiday'
                                        id='11'
                                        type="checkbox"
                                        name="holiday11"
                                        value={inputs.holiday11 || ''}
                                        onChange={handleChange}
                                    />
                                </div>

                                <input 
                                    id='11'
                                    type="text"
                                    name="jobDescription11"
                                    value={description.jobDescription11 || ''}
                                    onChange={handleChange}
                                />

                                <input className='startA'
                                    id='11'
                                    type="time"
                                    name="startWorkA11"
                                    value={start.startWorkA11 || '00:00'}
                                    onChange={handleChange}
                                />

                                <input className='endA'
                                    id='11'
                                    type="time"
                                    name="endWorkA11"
                                    value={end.endWorkA11 || '00:00'}
                                    onChange={handleChange}
                                />

                                <input className='startB'
                                    id='11'
                                    type="time"
                                    name="startWorkB11"
                                    value={start.startWorkB11 || '00:00'}
                                    onChange={handleChange}
                                />

                                <input className='endB'
                                    id='11'
                                    type="time"
                                    name="endWorkB11"
                                    value={end.endWorkB11 || '00:00'}
                                    onChange={handleChange}
                                />
                            </div>

                            <div className='eachDay'>
                                <p className='day'>{days[12].dayNumber}</p>

                                <input 
                                    id='12'
                                    type="date"
                                    name="day12"
                                    value={day.day12 || ''}
                                    onChange={handleChange}
                                />

                                <div>                                    
                                    <input className='holiday'
                                        id='12'
                                        type="checkbox"
                                        name="holiday12"
                                        value={inputs.holiday12 || ''}
                                        onChange={handleChange}
                                    />
                                </div>

                                <input 
                                    id='12'
                                    type="text"
                                    name="jobDescription12"
                                    value={description.jobDescription12 || ''}
                                    onChange={handleChange}
                                />

                                <input className='startA'
                                    id='12'
                                    type="time"
                                    name="startWorkA12"
                                    value={start.startWorkA12 || '00:00'}
                                    onChange={handleChange}
                                />

                                <input className='endA'
                                    id='12'
                                    type="time"
                                    name="endWorkA12"
                                    value={end.endWorkA12 || '00:00'}
                                    onChange={handleChange}
                                />

                                <input className='startB'
                                    id='12'
                                    type="time"
                                    name="startWorkB12"
                                    value={start.startWorkB12 || '00:00'}
                                    onChange={handleChange}
                                />

                                <input className='endB'
                                    id='12'
                                    type="time"
                                    name="endWorkB12"
                                    value={end.endWorkB12 || '00:00'}
                                    onChange={handleChange}
                                />
                            </div>

                            <div className='eachDay'>
                                <p className='day'>{days[13].dayNumber}</p>

                                <input 
                                    id='13'
                                    type="date"
                                    name="day13"
                                    value={day.day13 || ''}
                                    onChange={handleChange}
                                />

                                <div>                                    
                                    <input className='holiday'
                                        id='13'
                                        type="checkbox"
                                        name="holiday13"
                                        value={inputs.holiday13 || ''}
                                        onChange={handleChange}
                                    />
                                </div>

                                <input 
                                    id='13'
                                    type="text"
                                    name="jobDescription13"
                                    value={description.jobDescription13 || ''}
                                    onChange={handleChange}
                                />

                                <input className='startA'
                                    id='13'
                                    type="time"
                                    name="startWorkA13"
                                    value={start.startWorkA13 || '00:00'}
                                    onChange={handleChange}
                                />

                                <input className='endA'
                                    id='13'
                                    type="time"
                                    name="endWorkA13"
                                    value={end.endWorkA13 || '00:00'}
                                    onChange={handleChange}
                                />

                                <input className='startB'
                                    id='13'
                                    type="time"
                                    name="startWorkB13"
                                    value={start.startWorkB13 || '00:00'}
                                    onChange={handleChange}
                                />

                                <input className='endB'
                                    id='13'
                                    type="time"
                                    name="endWorkB13"
                                    value={end.endWorkB13 || '00:00'}
                                    onChange={handleChange}
                                />
                            </div>

                            <div className='eachDay'>
                                <p className='day'>{days[14].dayNumber}</p>

                                <input 
                                    id='14'
                                    type="date"
                                    name="day14"
                                    value={day.day14 || ''}
                                    onChange={handleChange}
                                />

                                <div>                                    
                                    <input className='holiday'
                                        id='14'
                                        type="checkbox"
                                        name="holiday14"
                                        value={inputs.holiday14 || ''}
                                        onChange={handleChange}
                                    />
                                </div>

                                <input 
                                    id='14'
                                    type="text"
                                    name="jobDescription14"
                                    value={description.jobDescription14 || ''}
                                    onChange={handleChange}
                                />

                                <input className='startA'
                                    id='14'
                                    type="time"
                                    name="startWorkA14"
                                    value={start.startWorkA14 || '00:00'}
                                    onChange={handleChange}
                                />

                                <input className='endA'
                                    id='14'
                                    type="time"
                                    name="endWorkA14"
                                    value={end.endWorkA14 || '00:00'}
                                    onChange={handleChange}
                                />

                                <input className='startB'
                                    id='14'
                                    type="time"
                                    name="startWorkB14"
                                    value={start.startWorkB14 || '00:00'}
                                    onChange={handleChange}
                                />

                                <input className='endB'
                                    id='14'
                                    type="time"
                                    name="endWorkB14"
                                    value={end.endWorkB14 || '00:00'}
                                    onChange={handleChange}
                                />
                            </div>

                            <div className='eachDay'>
                                <p className='day'>{days[15].dayNumber}</p>

                                <input 
                                    id='15'
                                    type="date"
                                    name="day15"
                                    value={day.day15 || ''}
                                    onChange={handleChange}
                                />

                                <div>                                    
                                    <input className='holiday'
                                        id='15'
                                        type="checkbox"
                                        name="holiday15"
                                        value={inputs.holiday15 || ''}
                                        onChange={handleChange}
                                    />
                                </div>

                                <input 
                                    id='15'
                                    type="text"
                                    name="jobDescription15"
                                    value={description.jobDescription15 || ''}
                                    onChange={handleChange}
                                />

                                <input className='startA'
                                    id='15'
                                    type="time"
                                    name="startWorkA15"
                                    value={start.startWorkA15 || '00:00'}
                                    onChange={handleChange}
                                />

                                <input className='endA'
                                    id='15'
                                    type="time"
                                    name="endWorkA15"
                                    value={end.endWorkA15 || '00:00'}
                                    onChange={handleChange}
                                />

                                <input className='startB'
                                    id='15'
                                    type="time"
                                    name="startWorkB15"
                                    value={start.startWorkB15 || '00:00'}
                                    onChange={handleChange}
                                />

                                <input className='endB'
                                    id='15'
                                    type="time"
                                    name="endWorkB15"
                                    value={end.endWorkB15 || '00:00'}
                                    onChange={handleChange}
                                />
                            </div>

                            <div className='eachDay'>
                                <p className='day'>{days[16].dayNumber}</p>

                                <input 
                                    id='16'
                                    type="date"
                                    name="day16"
                                    value={day.day16 || ''}
                                    onChange={handleChange}
                                />

                                <div>                                    
                                    <input className='holiday'
                                        id='16'
                                        type="checkbox"
                                        name="holiday16"
                                        value={inputs.holiday16 || ''}
                                        onChange={handleChange}
                                    />
                                </div>

                                <input 
                                    id='16'
                                    type="text"
                                    name="jobDescription16"
                                    value={description.jobDescription16 || ''}
                                    onChange={handleChange}
                                />

                                <input className='startA'
                                    id='16'
                                    type="time"
                                    name="startWorkA16"
                                    value={start.startWorkA16 || '00:00'}
                                    onChange={handleChange}
                                />

                                <input className='endA'
                                    id='16'
                                    type="time"
                                    name="endWorkA16"
                                    value={end.endWorkA16 || '00:00'}
                                    onChange={handleChange}
                                />

                                <input className='startB'
                                    id='16'
                                    type="time"
                                    name="startWorkB16"
                                    value={start.startWorkB16 || '00:00'}
                                    onChange={handleChange}
                                />

                                <input className='endB'
                                    id='16'
                                    type="time"
                                    name="endWorkB16"
                                    value={end.endWorkB16 || '00:00'}
                                    onChange={handleChange}
                                />
                            </div>

                            <div className='eachDay'>
                                <p className='day'>{days[17].dayNumber}</p>

                                <input 
                                    id='17'
                                    type="date"
                                    name="day17"
                                    value={day.day17 || ''}
                                    onChange={handleChange}
                                />

                                <div>                                    
                                    <input className='holiday'
                                        id='17'
                                        type="checkbox"
                                        name="holiday17"
                                        value={inputs.holiday17 || ''}
                                        onChange={handleChange}
                                    />
                                </div>

                                <input 
                                    id='17'
                                    type="text"
                                    name="jobDescription17"
                                    value={description.jobDescription17 || ''}
                                    onChange={handleChange}
                                />

                                <input className='startA'
                                    id='17'
                                    type="time"
                                    name="startWorkA17"
                                    value={start.startWorkA17 || '00:00'}
                                    onChange={handleChange}
                                />

                                <input className='endA'
                                    id='17'
                                    type="time"
                                    name="endWorkA17"
                                    value={end.endWorkA17 || '00:00'}
                                    onChange={handleChange}
                                />

                                <input className='startB'
                                    id='17'
                                    type="time"
                                    name="startWorkB17"
                                    value={start.startWorkB17 || '00:00'}
                                    onChange={handleChange}
                                />

                                <input className='endB'
                                    id='17'
                                    type="time"
                                    name="endWorkB17"
                                    value={end.endWorkB17 || '00:00'}
                                    onChange={handleChange}
                                />
                            </div>

                            <div className='eachDay'>
                                <p className='day'>{days[18].dayNumber}</p>

                                <input 
                                    id='18'
                                    type="date"
                                    name="day18"
                                    value={day.day18 || ''}
                                    onChange={handleChange}
                                />

                                <div>                                    
                                    <input className='holiday'
                                        id='18'
                                        type="checkbox"
                                        name="holiday18"
                                        value={inputs.holiday18 || ''}
                                        onChange={handleChange}
                                    />
                                </div>

                                <input 
                                    id='18'
                                    type="text"
                                    name="jobDescription18"
                                    value={description.jobDescription18 || ''}
                                    onChange={handleChange}
                                />

                                <input className='startA'
                                    id='18'
                                    type="time"
                                    name="startWorkA18"
                                    value={start.startWorkA18 || '00:00'}
                                    onChange={handleChange}
                                />

                                <input className='endA'
                                    id='18'
                                    type="time"
                                    name="endWorkA18"
                                    value={end.endWorkA18 || '00:00'}
                                    onChange={handleChange}
                                />

                                <input className='startB'
                                    id='18'
                                    type="time"
                                    name="startWorkB18"
                                    value={start.startWorkB18 || '00:00'}
                                    onChange={handleChange}
                                />

                                <input className='endB'
                                    id='18'
                                    type="time"
                                    name="endWorkB18"
                                    value={end.endWorkB18 || '00:00'}
                                    onChange={handleChange}
                                />
                            </div>

                            <div className='eachDay'>
                                <p className='day'>{days[19].dayNumber}</p>

                                <input 
                                    id='19'
                                    type="date"
                                    name="day19"
                                    value={day.day19 || ''}
                                    onChange={handleChange}
                                />

                                <div>                                    
                                    <input className='holiday'
                                        id='19'
                                        type="checkbox"
                                        name="holiday19"
                                        value={inputs.holiday19 || ''}
                                        onChange={handleChange}
                                    />
                                </div>

                                <input 
                                    id='19'
                                    type="text"
                                    name="jobDescription19"
                                    value={description.jobDescription19 || ''}
                                    onChange={handleChange}
                                />

                                <input className='startA'
                                    id='19'
                                    type="time"
                                    name="startWorkA19"
                                    value={start.startWorkA19 || '00:00'}
                                    onChange={handleChange}
                                />

                                <input className='endA'
                                    id='19'
                                    type="time"
                                    name="endWorkA19"
                                    value={end.endWorkA19 || '00:00'}
                                    onChange={handleChange}
                                />

                                <input className='startB'
                                    id='19'
                                    type="time"
                                    name="startWorkB19"
                                    value={start.startWorkB19 || '00:00'}
                                    onChange={handleChange}
                                />

                                <input className='endB'
                                    id='19'
                                    type="time"
                                    name="endWorkB19"
                                    value={end.endWorkB19 || '00:00'}
                                    onChange={handleChange}
                                />
                            </div>

                            <div className='eachDay'>
                                <p className='day'>{days[20].dayNumber}</p>

                                <input 
                                    id='20'
                                    type="date"
                                    name="day20"
                                    value={day.day20 || ''}
                                    onChange={handleChange}
                                />

                                <div>                                    
                                    <input className='holiday'
                                        id='20'
                                        type="checkbox"
                                        name="holiday20"
                                        value={inputs.holiday20 || ''}
                                        onChange={handleChange}
                                    />
                                </div>

                                <input 
                                    id='20'
                                    type="text"
                                    name="jobDescription20"
                                    value={description.jobDescription20 || ''}
                                    onChange={handleChange}
                                />

                                <input className='startA'
                                    id='20'
                                    type="time"
                                    name="startWorkA20"
                                    value={start.startWorkA20 || '00:00'}
                                    onChange={handleChange}
                                />

                                <input className='endA'
                                    id='20'
                                    type="time"
                                    name="endWorkA20"
                                    value={end.endWorkA20 || '00:00'}
                                    onChange={handleChange}
                                />

                                <input className='startB'
                                    id='20'
                                    type="time"
                                    name="startWorkB20"
                                    value={start.startWorkB20 || '00:00'}
                                    onChange={handleChange}
                                />

                                <input className='endB'
                                    id='20'
                                    type="time"
                                    name="endWorkB20"
                                    value={end.endWorkB20 || '00:00'}
                                    onChange={handleChange}
                                />
                            </div>

                            <div className='eachDay'>
                                <p className='day'>{days[21].dayNumber}</p>

                                <input 
                                    id='21'
                                    type="date"
                                    name="day21"
                                    value={day.day21 || ''}
                                    onChange={handleChange}
                                />

                                <div>                                    
                                    <input className='holiday'
                                        id='21'
                                        type="checkbox"
                                        name="holiday21"
                                        value={inputs.holiday21 || ''}
                                        onChange={handleChange}
                                    />
                                </div>

                                <input 
                                    id='21'
                                    type="text"
                                    name="jobDescription21"
                                    value={description.jobDescription21 || ''}
                                    onChange={handleChange}
                                />

                                <input className='startA'
                                    id='21'
                                    type="time"
                                    name="startWorkA21"
                                    value={start.startWorkA21 || '00:00'}
                                    onChange={handleChange}
                                />

                                <input className='endA'
                                    id='21'
                                    type="time"
                                    name="endWorkA21"
                                    value={end.endWorkA21 || '00:00'}
                                    onChange={handleChange}
                                />

                                <input className='startB'
                                    id='21'
                                    type="time"
                                    name="startWorkB21"
                                    value={start.startWorkB21 || '00:00'}
                                    onChange={handleChange}
                                />

                                <input className='endB'
                                    id='21'
                                    type="time"
                                    name="endWorkB21"
                                    value={end.endWorkB21 || '00:00'}
                                    onChange={handleChange}
                                />
                            </div>

                            <div className='eachDay'>
                                <p className='day'>{days[22].dayNumber}</p>

                                <input 
                                    id='22'
                                    type="date"
                                    name="day22"
                                    value={day.day22 || ''}
                                    onChange={handleChange}
                                />

                                <div>                                    
                                    <input className='holiday'
                                        id='22'
                                        type="checkbox"
                                        name="holiday22"
                                        value={inputs.holiday22 || ''}
                                        onChange={handleChange}
                                    />
                                </div>

                                <input 
                                    id='22'
                                    type="text"
                                    name="jobDescription22"
                                    value={description.jobDescription22 || ''}
                                    onChange={handleChange}
                                />

                                <input className='startA'
                                    id='22'
                                    type="time"
                                    name="startWorkA22"
                                    value={start.startWorkA22 || '00:00'}
                                    onChange={handleChange}
                                />

                                <input className='endA'
                                    id='22'
                                    type="time"
                                    name="endWorkA22"
                                    value={end.endWorkA22 || '00:00'}
                                    onChange={handleChange}
                                />

                                <input className='startB'
                                    id='22'
                                    type="time"
                                    name="startWorkB22"
                                    value={start.startWorkB22 || '00:00'}
                                    onChange={handleChange}
                                />

                                <input className='endB'
                                    id='22'
                                    type="time"
                                    name="endWorkB22"
                                    value={end.endWorkB22 || '00:00'}
                                    onChange={handleChange}
                                />
                            </div>

                            <div className='eachDay'>
                                <p className='day'>{days[23].dayNumber}</p>

                                <input 
                                    id='23'
                                    type="date"
                                    name="day23"
                                    value={day.day23 || ''}
                                    onChange={handleChange}
                                />

                                <div>                                    
                                    <input className='holiday'
                                        id='23'
                                        type="checkbox"
                                        name="holiday23"
                                        value={inputs.holiday23 || ''}
                                        onChange={handleChange}
                                    />
                                </div>

                                <input 
                                    id='23'
                                    type="text"
                                    name="jobDescription23"
                                    value={description.jobDescription23 || ''}
                                    onChange={handleChange}
                                />

                                <input className='startA'
                                    id='23'
                                    type="time"
                                    name="startWorkA23"
                                    value={start.startWorkA23 || '00:00'}
                                    onChange={handleChange}
                                />

                                <input className='endA'
                                    id='23'
                                    type="time"
                                    name="endWorkA23"
                                    value={end.endWorkA23 || '00:00'}
                                    onChange={handleChange}
                                />

                                <input className='startB'
                                    id='23'
                                    type="time"
                                    name="startWorkB23"
                                    value={start.startWorkB23 || '00:00'}
                                    onChange={handleChange}
                                />

                                <input className='endB'
                                    id='23'
                                    type="time"
                                    name="endWorkB23"
                                    value={end.endWorkB23 || '00:00'}
                                    onChange={handleChange}
                                />
                            </div>

                            <div className='eachDay'>
                                <p className='day'>{days[24].dayNumber}</p>

                                <input 
                                    id='24'
                                    type="date"
                                    name="day24"
                                    value={day.day24 || ''}
                                    onChange={handleChange}
                                />

                                <div>                                    
                                    <input className='holiday'
                                        id='24'
                                        type="checkbox"
                                        name="holiday24"
                                        value={inputs.holiday24 || ''}
                                        onChange={handleChange}
                                    />
                                </div>

                                <input 
                                    id='24'
                                    type="text"
                                    name="jobDescription24"
                                    value={description.jobDescription24 || ''}
                                    onChange={handleChange}
                                />

                                <input className='startA'
                                    id='24'
                                    type="time"
                                    name="startWorkA24"
                                    value={start.startWorkA24 || '00:00'}
                                    onChange={handleChange}
                                />

                                <input className='endA'
                                    id='24'
                                    type="time"
                                    name="endWorkA24"
                                    value={end.endWorkA24 || '00:00'}
                                    onChange={handleChange}
                                />

                                <input className='startB'
                                    id='24'
                                    type="time"
                                    name="startWorkB24"
                                    value={start.startWorkB24 || '00:00'}
                                    onChange={handleChange}
                                />

                                <input className='endB'
                                    id='24'
                                    type="time"
                                    name="endWorkB24"
                                    value={end.endWorkB24 || '00:00'}
                                    onChange={handleChange}
                                />
                            </div>

                            <div className='eachDay'>
                                <p className='day'>{days[25].dayNumber}</p>

                                <input 
                                    id='25'
                                    type="date"
                                    name="day25"
                                    value={day.day25 || ''}
                                    onChange={handleChange}
                                />

                                <div>                                    
                                    <input className='holiday'
                                        id='25'
                                        type="checkbox"
                                        name="holiday25"
                                        value={inputs.holiday25 || ''}
                                        onChange={handleChange}
                                    />
                                </div>

                                <input 
                                    id='25'
                                    type="text"
                                    name="jobDescription25"
                                    value={description.jobDescription25 || ''}
                                    onChange={handleChange}
                                />

                                <input className='startA'
                                    id='25'
                                    type="time"
                                    name="startWorkA25"
                                    value={start.startWorkA25 || '00:00'}
                                    onChange={handleChange}
                                />

                                <input className='endA'
                                    id='25'
                                    type="time"
                                    name="endWorkA25"
                                    value={end.endWorkA25 || '00:00'}
                                    onChange={handleChange}
                                />

                                <input className='startB'
                                    id='25'
                                    type="time"
                                    name="startWorkB25"
                                    value={start.startWorkB25 || '00:00'}
                                    onChange={handleChange}
                                />

                                <input className='endB'
                                    id='25'
                                    type="time"
                                    name="endWorkB25"
                                    value={end.endWorkB25 || '00:00'}
                                    onChange={handleChange}
                                />
                            </div>

                            <div className='eachDay'>
                                <p className='day'>{days[26].dayNumber}</p>

                                <input 
                                    id='26'
                                    type="date"
                                    name="day26"
                                    value={day.day26 || ''}
                                    onChange={handleChange}
                                />

                                <div>                                    
                                    <input className='holiday'
                                        id='26'
                                        type="checkbox"
                                        name="holiday26"
                                        value={inputs.holiday26 || ''}
                                        onChange={handleChange}
                                    />
                                </div>

                                <input 
                                    id='26'
                                    type="text"
                                    name="jobDescription26"
                                    value={description.jobDescription26 || ''}
                                    onChange={handleChange}
                                />

                                <input className='startA'
                                    id='26'
                                    type="time"
                                    name="startWorkA26"
                                    value={start.startWorkA26 || '00:00'}
                                    onChange={handleChange}
                                />

                                <input className='endA'
                                    id='26'
                                    type="time"
                                    name="endWorkA26"
                                    value={end.endWorkA26 || '00:00'}
                                    onChange={handleChange}
                                />

                                <input className='startB'
                                    id='26'
                                    type="time"
                                    name="startWorkB26"
                                    value={start.startWorkB26 || '00:00'}
                                    onChange={handleChange}
                                />

                                <input className='endB'
                                    id='26'
                                    type="time"
                                    name="endWorkB26"
                                    value={end.endWorkB26 || '00:00'}
                                    onChange={handleChange}
                                />
                            </div>

                            <div className='eachDay'>
                                <p className='day'>{days[27].dayNumber}</p>

                                <input 
                                    id='27'
                                    type="date"
                                    name="day27"
                                    value={day.day27 || ''}
                                    onChange={handleChange}
                                />

                                <div>                                    
                                    <input className='holiday'
                                        id='27'
                                        type="checkbox"
                                        name="holiday27"
                                        value={inputs.holiday27 || ''}
                                        onChange={handleChange}
                                    />
                                </div>

                                <input 
                                    id='27'
                                    type="text"
                                    name="jobDescription27"
                                    value={description.jobDescription27 || ''}
                                    onChange={handleChange}
                                />

                                <input className='startA'
                                    id='27'
                                    type="time"
                                    name="startWorkA27"
                                    value={start.startWorkA27 || '00:00'}
                                    onChange={handleChange}
                                />

                                <input className='endA'
                                    id='27'
                                    type="time"
                                    name="endWorkA27"
                                    value={end.endWorkA27 || '00:00'}
                                    onChange={handleChange}
                                />

                                <input className='startB'
                                    id='27'
                                    type="time"
                                    name="startWorkB27"
                                    value={start.startWorkB27 || '00:00'}
                                    onChange={handleChange}
                                />

                                <input className='endB'
                                    id='27'
                                    type="time"
                                    name="endWorkB27"
                                    value={end.endWorkB27 || '00:00'}
                                    onChange={handleChange}
                                />
                            </div>

                            <div className='eachDay'>
                                <p className='day'>{days[28].dayNumber}</p>

                                <input 
                                    id='28'
                                    type="date"
                                    name="day28"
                                    value={day.day28 || ''}
                                    onChange={handleChange}
                                />

                                <div>                                    
                                    <input className='holiday'
                                        id='28'
                                        type="checkbox"
                                        name="holiday28"
                                        value={inputs.holiday28 || ''}
                                        onChange={handleChange}
                                    />
                                </div>

                                <input 
                                    id='28'
                                    type="text"
                                    name="jobDescription28"
                                    value={description.jobDescription28 || ''}
                                    onChange={handleChange}
                                />

                                <input className='startA'
                                    id='28'
                                    type="time"
                                    name="startWorkA28"
                                    value={start.startWorkA28 || '00:00'}
                                    onChange={handleChange}
                                />

                                <input className='endA'
                                    id='28'
                                    type="time"
                                    name="endWorkA28"
                                    value={end.endWorkA28 || '00:00'}
                                    onChange={handleChange}
                                />

                                <input className='startB'
                                    id='28'
                                    type="time"
                                    name="startWorkB28"
                                    value={start.startWorkB28 || '00:00'}
                                    onChange={handleChange}
                                />

                                <input className='endB'
                                    id='28'
                                    type="time"
                                    name="endWorkB28"
                                    value={end.endWorkB28 || '00:00'}
                                    onChange={handleChange}
                                />
                            </div>

                            <div className='eachDay'>
                                <p className='day'>{days[29].dayNumber}</p>

                                <input 
                                    id='29'
                                    type="date"
                                    name="day29"
                                    value={day.day29 || ''}
                                    onChange={handleChange}
                                />

                                <div>                                    
                                    <input className='holiday'
                                        id='29'
                                        type="checkbox"
                                        name="holiday29"
                                        value={inputs.holiday29 || ''}
                                        onChange={handleChange}
                                    />
                                </div>

                                <input 
                                    id='29'
                                    type="text"
                                    name="jobDescription29"
                                    value={description.jobDescription29 || ''}
                                    onChange={handleChange}
                                />

                                <input className='startA'
                                    id='29'
                                    type="time"
                                    name="startWorkA29"
                                    value={start.startWorkA29 || '00:00'}
                                    onChange={handleChange}
                                />

                                <input className='endA'
                                    id='29'
                                    type="time"
                                    name="endWorkA29"
                                    value={end.endWorkA29 || '00:00'}
                                    onChange={handleChange}
                                />

                                <input className='startB'
                                    id='29'
                                    type="time"
                                    name="startWorkB29"
                                    value={start.startWorkB29 || '00:00'}
                                    onChange={handleChange}
                                />

                                <input className='endB'
                                    id='29'
                                    type="time"
                                    name="endWorkB29"
                                    value={end.endWorkB29 || '00:00'}
                                    onChange={handleChange}
                                />
                            </div>

                            <div className='eachDay'>
                                <p className='day'>{days[30].dayNumber}</p>

                                <input 
                                    id='30'
                                    type="date"
                                    name="day30"
                                    value={day.day30 || ''}
                                    onChange={handleChange}
                                />

                                <div>                                    
                                    <input className='holiday'
                                        id='30'
                                        type="checkbox"
                                        name="holiday30"
                                        value={inputs.holiday30 || ''}
                                        onChange={handleChange}
                                    />
                                </div>

                                <input 
                                    id='30'
                                    type="text"
                                    name="jobDescription30"
                                    value={description.jobDescription30 || ''}
                                    onChange={handleChange}
                                />

                                <input className='startA'
                                    id='30'
                                    type="time"
                                    name="startWorkA30"
                                    value={start.startWorkA30 || '00:00'}
                                    onChange={handleChange}
                                />

                                <input className='endA'
                                    id='30'
                                    type="time"
                                    name="endWorkA30"
                                    value={end.endWorkA30 || '00:00'}
                                    onChange={handleChange}
                                />

                                <input className='startB'
                                    id='30'
                                    type="time"
                                    name="startWorkB30"
                                    value={start.startWorkB30 || '00:00'}
                                    onChange={handleChange}
                                />

                                <input className='endB'
                                    id='30'
                                    type="time"
                                    name="endWorkB30"
                                    value={end.endWorkB30 || '00:00'}
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
                                        name="startWorkA"
                                        value={inputs.startWorkA || ''}
                                        onChange={handleChange}
                                    />
                                    <input className='finishright'
                                        id={day.dayNumber}
                                        type="time"
                                        name="endWorkA"
                                        value={inputs.endWorkA || ''}
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
                    <button className='uploadBtn screenBtn' type="submit">Upload</button>
                </form>
            </div>
        )
    }

    // edit and update time card
    const ScreenFour = ({ hours }) => {

        const hoursToUpdate = hours

        // let days
        // if (hours) {
        //     days = hours.days
        // }
        
        
        // from screenThree
        // ----------------
        const [inputs, setInputs] = useState({
            month: hoursToUpdate.month
        })        
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

            // let startA = startTimeA ? startTimeA : 0
            // let endA = endTimeA ? endTimeA : 0
            // let startB = startTimeB ? startTimeB : 0
            // let endB = endTimeB ? endTimeB : 0

            let normal = 0
            let special = 0

            

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
            
            if (endA > 18) {
                special += endA - 18
                normal += 18 - startA
            }
            
            if (endB > 18) {
                special += endB - 18
                normal += 18 - startB
            }

            if (endA < 18) {
                normal += endA - startA
            }

            if (endB < 18) {
                normal += endB - startB
            }

            normal = normal % 1 !== 0 ? normal.toFixed(2) : normal
            special = special % 1 !== 0 ? special.toFixed(2) : special
            total = total % 1 !== 0 ? total.toFixed(2) : total

            if (isWeekend === 0 || isWeekend === 6 || holiday) {
                special = total
                normal = 0
            }

            return {                
                normal: normal,
                special: special,
                total: total
            }
        }

        // works but need to be updated
        // const calculate = (startTime, endTime) => {
        //     let start = startTime
        //     let end = endTime
        //     let normal = 0
        //     let special = 0

        //     if (end < 4) {
        //         end += 24
        //     }

        //     // check if it works
        //     if(startTime === endTime) {
        //         start = 0
        //         end = 0
        //     }
            
        //     let total = end - start
            
        //     if (end > 18) {
        //         special = end - 18
        //         normal = 18 - start
        //     }else {
        //         normal = total
        //     }

        //     normal = normal % 1 !== 0 ? normal.toFixed(2) : normal
        //     special = special % 1 !== 0 ? special.toFixed(2) : special
        //     total = total % 1 !== 0 ? total.toFixed(2) : total

        //     return {                
        //         normal: normal,
        //         special: special,
        //         total: total
        //     }
        // }

        // set the inputs with the time card details from state hoursToUpdate
        // doesn't work becouse every time set is called it rerender the component
        // use state default in declaration intead
        // setStart(values => ({...values,
        //         startWorkA0: hoursToUpdate.days[0].startWorkA,
        //         startWorkA1: hoursToUpdate.days[1].startWorkA,
        //         startWorkA2: hoursToUpdate.days[2].startWorkA,
        //         startWorkA3: hoursToUpdate.days[3].startWorkA,
        //         startWorkA4: hoursToUpdate.days[4].startWorkA,
        //         startWorkA5: hoursToUpdate.days[5].startWorkA,
        //         startWorkA6: hoursToUpdate.days[6].startWorkA,
        //         startWorkA7: hoursToUpdate.days[7].startWorkA,
        //         startWorkA8: hoursToUpdate.days[8].startWorkA,
        //         startWorkA9: hoursToUpdate.days[9].startWorkA,
        //         startWorkA10: hoursToUpdate.days[10].startWorkA,
        //         startWorkA11: hoursToUpdate.days[11].startWorkA,
        //         startWorkA12: hoursToUpdate.days[12].startWorkA,
        //         startWorkA13: hoursToUpdate.days[13].startWorkA,
        //         startWorkA14: hoursToUpdate.days[14].startWorkA,
        //         startWorkA15: hoursToUpdate.days[15].startWorkA,
        //         startWorkA16: hoursToUpdate.days[16].startWorkA,
        //         startWorkA17: hoursToUpdate.days[17].startWorkA,
        //         startWorkA18: hoursToUpdate.days[18].startWorkA,
        //         startWorkA19: hoursToUpdate.days[19].startWorkA,
        //         startWorkA20: hoursToUpdate.days[20].startWorkA,
        //         startWorkA21: hoursToUpdate.days[21].startWorkA,
        //         startWorkA22: hoursToUpdate.days[22].startWorkA,
        //         startWorkA23: hoursToUpdate.days[23].startWorkA,
        //         startWorkA24: hoursToUpdate.days[24].startWorkA,
        //         startWorkA25: hoursToUpdate.days[25].startWorkA,
        //         startWorkA26: hoursToUpdate.days[26].startWorkA,
        //         startWorkA27: hoursToUpdate.days[27].startWorkA,
        //         startWorkA28: hoursToUpdate.days[28].startWorkA,
        //         startWorkA29: hoursToUpdate.days[29].startWorkA,
        //         startWorkA30: hoursToUpdate.days[30].startWorkA,
        //     }))

            

        const handleChange = (event) => {

            console.log(hoursToUpdate.days)

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

            const {
                startWorkA0,
                startWorkA1,
                startWorkA2,
                startWorkA3,
                startWorkA4,
                startWorkA5,
                startWorkA6,
                startWorkA7,
                startWorkA8,
                startWorkA9,
                startWorkA10,
                startWorkA11,
                startWorkA12,
                startWorkA13,
                startWorkA14,
                startWorkA15,
                startWorkA16,
                startWorkA17,
                startWorkA18,
                startWorkA19,
                startWorkA20,
                startWorkA21,
                startWorkA22,
                startWorkA23,
                startWorkA24,
                startWorkA25,
                startWorkA26,
                startWorkA27,
                startWorkA28,
                startWorkA29,
                startWorkA30,
                // ----------
                startWorkB0,
                startWorkB1,
                startWorkB2,
                startWorkB3,
                startWorkB4,
                startWorkB5,
                startWorkB6,
                startWorkB7,
                startWorkB8,
                startWorkB9,
                startWorkB10,
                startWorkB11,
                startWorkB12,
                startWorkB13,
                startWorkB14,
                startWorkB15,
                startWorkB16,
                startWorkB17,
                startWorkB18,
                startWorkB19,
                startWorkB20,
                startWorkB21,
                startWorkB22,
                startWorkB23,
                startWorkB24,
                startWorkB25,
                startWorkB26,
                startWorkB27,
                startWorkB28,
                startWorkB29,
                startWorkB30,
                
            } = start

            const {
                endWorkA0,
                endWorkA1,
                endWorkA2,
                endWorkA3,
                endWorkA4,
                endWorkA5,
                endWorkA6,
                endWorkA7,
                endWorkA8,
                endWorkA9,
                endWorkA10,
                endWorkA11,
                endWorkA12,
                endWorkA13,
                endWorkA14,
                endWorkA15,
                endWorkA16,
                endWorkA17,
                endWorkA18,
                endWorkA19,
                endWorkA20,
                endWorkA21,
                endWorkA22,
                endWorkA23,
                endWorkA24,
                endWorkA25,
                endWorkA26,
                endWorkA27,
                endWorkA28,
                endWorkA29,
                endWorkA30,
                // --------
                endWorkB0,
                endWorkB1,
                endWorkB2,
                endWorkB3,
                endWorkB4,
                endWorkB5,
                endWorkB6,
                endWorkB7,
                endWorkB8,
                endWorkB9,
                endWorkB10,
                endWorkB11,
                endWorkB12,
                endWorkB13,
                endWorkB14,
                endWorkB15,
                endWorkB16,
                endWorkB17,
                endWorkB18,
                endWorkB19,
                endWorkB20,
                endWorkB21,
                endWorkB22,
                endWorkB23,
                endWorkB24,
                endWorkB25,
                endWorkB26,
                endWorkB27,
                endWorkB28,
                endWorkB29,
                endWorkB30,
                
            } = end

            const {
                jobDescription0,
                jobDescription1,
                jobDescription2,
                jobDescription3,
                jobDescription4,
                jobDescription5,
                jobDescription6,
                jobDescription7,
                jobDescription8,
                jobDescription9,
                jobDescription10,
                jobDescription11,
                jobDescription12,
                jobDescription13,
                jobDescription14,
                jobDescription15,
                jobDescription16,
                jobDescription17,
                jobDescription18,
                jobDescription19,
                jobDescription20,
                jobDescription21,
                jobDescription22,
                jobDescription23,
                jobDescription24,
                jobDescription25,
                jobDescription26,
                jobDescription27,
                jobDescription28,
                jobDescription29,
                jobDescription30,
                
            } = description

            const {
                day0,
                day1,
                day2,
                day3,
                day4,
                day5,
                day6,
                day7,
                day8,
                day9,
                day10,
                day11,
                day12,
                day13,
                day14,
                day15,
                day16,
                day17,
                day18,
                day19,
                day20,
                day21,
                day22,
                day23,
                day24,
                day25,
                day26,
                day27,
                day28,
                day29,
                day30,
            } = day

            const {
                holiday0,
                holiday1,
                holiday2,
                holiday3,
                holiday4,
                holiday5,
                holiday6,
                holiday7,
                holiday8,
                holiday9,
                holiday10,
                holiday11,
                holiday12,
                holiday13,
                holiday14,
                holiday15,
                holiday16,
                holiday17,
                holiday18,
                holiday19,
                holiday20,
                holiday21,
                holiday22,
                holiday23,
                holiday24,
                holiday25,
                holiday26,
                holiday27,
                holiday28,
                holiday29,
                holiday30,
            } = checked

            hoursToUpdate.days[0].holiday = holiday0 ? holiday0 : false
            hoursToUpdate.days[1].holiday = holiday1 ? holiday1 : false
            hoursToUpdate.days[2].holiday = holiday2 ? holiday2 : false
            hoursToUpdate.days[3].holiday = holiday3 ? holiday3 : false
            hoursToUpdate.days[4].holiday = holiday4 ? holiday4 : false
            hoursToUpdate.days[5].holiday = holiday5 ? holiday5 : false
            hoursToUpdate.days[6].holiday = holiday6 ? holiday6 : false
            hoursToUpdate.days[7].holiday = holiday7 ? holiday7 : false
            hoursToUpdate.days[8].holiday = holiday8 ? holiday8 : false
            hoursToUpdate.days[9].holiday = holiday9 ? holiday9 : false
            hoursToUpdate.days[10].holiday = holiday10 ? holiday10 : false
            hoursToUpdate.days[11].holiday = holiday11 ? holiday11 : false
            hoursToUpdate.days[12].holiday = holiday12 ? holiday12 : false
            hoursToUpdate.days[13].holiday = holiday13 ? holiday13 : false
            hoursToUpdate.days[14].holiday = holiday14 ? holiday14 : false
            hoursToUpdate.days[15].holiday = holiday15 ? holiday15 : false
            hoursToUpdate.days[16].holiday = holiday16 ? holiday16 : false
            hoursToUpdate.days[17].holiday = holiday17 ? holiday17 : false
            hoursToUpdate.days[18].holiday = holiday18 ? holiday18 : false
            hoursToUpdate.days[19].holiday = holiday19 ? holiday19 : false
            hoursToUpdate.days[20].holiday = holiday20 ? holiday20 : false
            hoursToUpdate.days[21].holiday = holiday21 ? holiday21 : false
            hoursToUpdate.days[22].holiday = holiday22 ? holiday22 : false
            hoursToUpdate.days[23].holiday = holiday23 ? holiday23 : false
            hoursToUpdate.days[24].holiday = holiday24 ? holiday24 : false
            hoursToUpdate.days[25].holiday = holiday25 ? holiday25 : false
            hoursToUpdate.days[26].holiday = holiday26 ? holiday26 : false
            hoursToUpdate.days[27].holiday = holiday27 ? holiday27 : false
            hoursToUpdate.days[28].holiday = holiday28 ? holiday28 : false
            hoursToUpdate.days[29].holiday = holiday29 ? holiday29 : false
            hoursToUpdate.days[30].holiday = holiday30 ? holiday30 : false
            
            // if startWorkA is not defined, leave default value time 00:00
            hoursToUpdate.days[0].startWorkA = startWorkA0 ? startWorkA0 : '00:00'
            hoursToUpdate.days[1].startWorkA = startWorkA1 ? startWorkA1 : '00:00'
            hoursToUpdate.days[2].startWorkA = startWorkA2 ? startWorkA2 : '00:00'
            hoursToUpdate.days[3].startWorkA = startWorkA3 ? startWorkA3 : '00:00'
            hoursToUpdate.days[4].startWorkA = startWorkA4 ? startWorkA4 : '00:00'
            hoursToUpdate.days[5].startWorkA = startWorkA5 ? startWorkA5 : '00:00'
            hoursToUpdate.days[6].startWorkA = startWorkA6 ? startWorkA6 : '00:00'
            hoursToUpdate.days[7].startWorkA = startWorkA7 ? startWorkA7 : '00:00'
            hoursToUpdate.days[8].startWorkA = startWorkA8 ? startWorkA8 : '00:00'
            hoursToUpdate.days[9].startWorkA = startWorkA9 ? startWorkA9 : '00:00'
            hoursToUpdate.days[10].startWorkA = startWorkA10 ? startWorkA10 : '00:00'
            hoursToUpdate.days[11].startWorkA = startWorkA11 ? startWorkA11 : '00:00'
            hoursToUpdate.days[12].startWorkA = startWorkA12 ? startWorkA12 : '00:00'
            hoursToUpdate.days[13].startWorkA = startWorkA13 ? startWorkA13 : '00:00'
            hoursToUpdate.days[14].startWorkA = startWorkA14 ? startWorkA14 : '00:00'
            hoursToUpdate.days[15].startWorkA = startWorkA15 ? startWorkA15 : '00:00'
            hoursToUpdate.days[16].startWorkA = startWorkA16 ? startWorkA16 : '00:00'
            hoursToUpdate.days[17].startWorkA = startWorkA17 ? startWorkA17 : '00:00'
            hoursToUpdate.days[18].startWorkA = startWorkA18 ? startWorkA18 : '00:00'
            hoursToUpdate.days[19].startWorkA = startWorkA19 ? startWorkA19 : '00:00'
            hoursToUpdate.days[20].startWorkA = startWorkA20 ? startWorkA20 : '00:00'
            hoursToUpdate.days[21].startWorkA = startWorkA21 ? startWorkA21 : '00:00'
            hoursToUpdate.days[22].startWorkA = startWorkA22 ? startWorkA22 : '00:00'
            hoursToUpdate.days[23].startWorkA = startWorkA23 ? startWorkA23 : '00:00'
            hoursToUpdate.days[24].startWorkA = startWorkA24 ? startWorkA24 : '00:00'
            hoursToUpdate.days[25].startWorkA = startWorkA25 ? startWorkA25 : '00:00'
            hoursToUpdate.days[26].startWorkA = startWorkA26 ? startWorkA26 : '00:00'
            hoursToUpdate.days[27].startWorkA = startWorkA27 ? startWorkA27 : '00:00'
            hoursToUpdate.days[28].startWorkA = startWorkA28 ? startWorkA28 : '00:00'
            hoursToUpdate.days[29].startWorkA = startWorkA29 ? startWorkA29 : '00:00'
            hoursToUpdate.days[30].startWorkA = startWorkA30 ? startWorkA30 : '00:00'

            hoursToUpdate.days[0].startWorkB = startWorkB0 ? startWorkB0 : '00:00'
            hoursToUpdate.days[1].startWorkB = startWorkB1 ? startWorkB1 : '00:00'
            hoursToUpdate.days[2].startWorkB = startWorkB2 ? startWorkB2 : '00:00'
            hoursToUpdate.days[3].startWorkB = startWorkB3 ? startWorkB3 : '00:00'
            hoursToUpdate.days[4].startWorkB = startWorkB4 ? startWorkB4 : '00:00'
            hoursToUpdate.days[5].startWorkB = startWorkB5 ? startWorkB5 : '00:00'
            hoursToUpdate.days[6].startWorkB = startWorkB6 ? startWorkB6 : '00:00'
            hoursToUpdate.days[7].startWorkB = startWorkB7 ? startWorkB7 : '00:00'
            hoursToUpdate.days[8].startWorkB = startWorkB8 ? startWorkB8 : '00:00'
            hoursToUpdate.days[9].startWorkB = startWorkB9 ? startWorkB9 : '00:00'
            hoursToUpdate.days[10].startWorkB = startWorkB10 ? startWorkB10 : '00:00'
            hoursToUpdate.days[11].startWorkB = startWorkB11 ? startWorkB11 : '00:00'
            hoursToUpdate.days[12].startWorkB = startWorkB12 ? startWorkB12 : '00:00'
            hoursToUpdate.days[13].startWorkB = startWorkB13 ? startWorkB13 : '00:00'
            hoursToUpdate.days[14].startWorkB = startWorkB14 ? startWorkB14 : '00:00'
            hoursToUpdate.days[15].startWorkB = startWorkB15 ? startWorkB15 : '00:00'
            hoursToUpdate.days[16].startWorkB = startWorkB16 ? startWorkB16 : '00:00'
            hoursToUpdate.days[17].startWorkB = startWorkB17 ? startWorkB17 : '00:00'
            hoursToUpdate.days[18].startWorkB = startWorkB18 ? startWorkB18 : '00:00'
            hoursToUpdate.days[19].startWorkB = startWorkB19 ? startWorkB19 : '00:00'
            hoursToUpdate.days[20].startWorkB = startWorkB20 ? startWorkB20 : '00:00'
            hoursToUpdate.days[21].startWorkB = startWorkB21 ? startWorkB21 : '00:00'
            hoursToUpdate.days[22].startWorkB = startWorkB22 ? startWorkB22 : '00:00'
            hoursToUpdate.days[23].startWorkB = startWorkB23 ? startWorkB23 : '00:00'
            hoursToUpdate.days[24].startWorkB = startWorkB24 ? startWorkB24 : '00:00'
            hoursToUpdate.days[25].startWorkB = startWorkB25 ? startWorkB25 : '00:00'
            hoursToUpdate.days[26].startWorkB = startWorkB26 ? startWorkB26 : '00:00'
            hoursToUpdate.days[27].startWorkB = startWorkB27 ? startWorkB27 : '00:00'
            hoursToUpdate.days[28].startWorkB = startWorkB28 ? startWorkB28 : '00:00'
            hoursToUpdate.days[29].startWorkB = startWorkB29 ? startWorkB29 : '00:00'
            hoursToUpdate.days[30].startWorkB = startWorkB30 ? startWorkB30 : '00:00'
            
            // if endWorkA is not defined, leave default value time 00:00
            hoursToUpdate.days[0].endWorkA = endWorkA0 ? endWorkA0 : '00:00'
            hoursToUpdate.days[1].endWorkA = endWorkA1 ? endWorkA1 : '00:00'
            hoursToUpdate.days[2].endWorkA = endWorkA2 ? endWorkA2 : '00:00'
            hoursToUpdate.days[3].endWorkA = endWorkA3 ? endWorkA3 : '00:00'
            hoursToUpdate.days[4].endWorkA = endWorkA4 ? endWorkA4 : '00:00'
            hoursToUpdate.days[5].endWorkA = endWorkA5 ? endWorkA5 : '00:00'
            hoursToUpdate.days[6].endWorkA = endWorkA6 ? endWorkA6 : '00:00'
            hoursToUpdate.days[7].endWorkA = endWorkA7 ? endWorkA7 : '00:00'
            hoursToUpdate.days[8].endWorkA = endWorkA8 ? endWorkA8 : '00:00'
            hoursToUpdate.days[9].endWorkA = endWorkA9 ? endWorkA9 : '00:00'
            hoursToUpdate.days[10].endWorkA = endWorkA10 ? endWorkA10 : '00:00'
            hoursToUpdate.days[11].endWorkA = endWorkA11 ? endWorkA11 : '00:00'
            hoursToUpdate.days[12].endWorkA = endWorkA12 ? endWorkA12 : '00:00'
            hoursToUpdate.days[13].endWorkA = endWorkA13 ? endWorkA13 : '00:00'
            hoursToUpdate.days[14].endWorkA = endWorkA14 ? endWorkA14 : '00:00'
            hoursToUpdate.days[15].endWorkA = endWorkA15 ? endWorkA15 : '00:00'
            hoursToUpdate.days[16].endWorkA = endWorkA16 ? endWorkA16 : '00:00'
            hoursToUpdate.days[17].endWorkA = endWorkA17 ? endWorkA17 : '00:00'
            hoursToUpdate.days[18].endWorkA = endWorkA18 ? endWorkA18 : '00:00'
            hoursToUpdate.days[19].endWorkA = endWorkA19 ? endWorkA19 : '00:00'
            hoursToUpdate.days[20].endWorkA = endWorkA20 ? endWorkA20 : '00:00'
            hoursToUpdate.days[21].endWorkA = endWorkA21 ? endWorkA21 : '00:00'
            hoursToUpdate.days[22].endWorkA = endWorkA22 ? endWorkA22 : '00:00'
            hoursToUpdate.days[23].endWorkA = endWorkA23 ? endWorkA23 : '00:00'
            hoursToUpdate.days[24].endWorkA = endWorkA24 ? endWorkA24 : '00:00'
            hoursToUpdate.days[25].endWorkA = endWorkA25 ? endWorkA25 : '00:00'
            hoursToUpdate.days[26].endWorkA = endWorkA26 ? endWorkA26 : '00:00'
            hoursToUpdate.days[27].endWorkA = endWorkA27 ? endWorkA27 : '00:00'
            hoursToUpdate.days[28].endWorkA = endWorkA28 ? endWorkA28 : '00:00'
            hoursToUpdate.days[29].endWorkA = endWorkA29 ? endWorkA29 : '00:00'
            hoursToUpdate.days[30].endWorkA = endWorkA30 ? endWorkA30 : '00:00'

            hoursToUpdate.days[0].endWorkB = endWorkB0 ? endWorkB0 : '00:00'
            hoursToUpdate.days[1].endWorkB = endWorkB1 ? endWorkB1 : '00:00'
            hoursToUpdate.days[2].endWorkB = endWorkB2 ? endWorkB2 : '00:00'
            hoursToUpdate.days[3].endWorkB = endWorkB3 ? endWorkB3 : '00:00'
            hoursToUpdate.days[4].endWorkB = endWorkB4 ? endWorkB4 : '00:00'
            hoursToUpdate.days[5].endWorkB = endWorkB5 ? endWorkB5 : '00:00'
            hoursToUpdate.days[6].endWorkB = endWorkB6 ? endWorkB6 : '00:00'
            hoursToUpdate.days[7].endWorkB = endWorkB7 ? endWorkB7 : '00:00'
            hoursToUpdate.days[8].endWorkB = endWorkB8 ? endWorkB8 : '00:00'
            hoursToUpdate.days[9].endWorkB = endWorkB9 ? endWorkB9 : '00:00'
            hoursToUpdate.days[10].endWorkB = endWorkB10 ? endWorkB10 : '00:00'
            hoursToUpdate.days[11].endWorkB = endWorkB11 ? endWorkB11 : '00:00'
            hoursToUpdate.days[12].endWorkB = endWorkB12 ? endWorkB12 : '00:00'
            hoursToUpdate.days[13].endWorkB = endWorkB13 ? endWorkB13 : '00:00'
            hoursToUpdate.days[14].endWorkB = endWorkB14 ? endWorkB14 : '00:00'
            hoursToUpdate.days[15].endWorkB = endWorkB15 ? endWorkB15 : '00:00'
            hoursToUpdate.days[16].endWorkB = endWorkB16 ? endWorkB16 : '00:00'
            hoursToUpdate.days[17].endWorkB = endWorkB17 ? endWorkB17 : '00:00'
            hoursToUpdate.days[18].endWorkB = endWorkB18 ? endWorkB18 : '00:00'
            hoursToUpdate.days[19].endWorkB = endWorkB19 ? endWorkB19 : '00:00'
            hoursToUpdate.days[20].endWorkB = endWorkB20 ? endWorkB20 : '00:00'
            hoursToUpdate.days[21].endWorkB = endWorkB21 ? endWorkB21 : '00:00'
            hoursToUpdate.days[22].endWorkB = endWorkB22 ? endWorkB22 : '00:00'
            hoursToUpdate.days[23].endWorkB = endWorkB23 ? endWorkB23 : '00:00'
            hoursToUpdate.days[24].endWorkB = endWorkB24 ? endWorkB24 : '00:00'
            hoursToUpdate.days[25].endWorkB = endWorkB25 ? endWorkB25 : '00:00'
            hoursToUpdate.days[26].endWorkB = endWorkB26 ? endWorkB26 : '00:00'
            hoursToUpdate.days[27].endWorkB = endWorkB27 ? endWorkB27 : '00:00'
            hoursToUpdate.days[28].endWorkB = endWorkB28 ? endWorkB28 : '00:00'
            hoursToUpdate.days[29].endWorkB = endWorkB29 ? endWorkB29 : '00:00'
            hoursToUpdate.days[30].endWorkB = endWorkB30 ? endWorkB30 : '00:00'
            
            hoursToUpdate.days[0].jobDescription = jobDescription0
            hoursToUpdate.days[1].jobDescription = jobDescription1
            hoursToUpdate.days[2].jobDescription = jobDescription2
            hoursToUpdate.days[3].jobDescription = jobDescription3
            hoursToUpdate.days[4].jobDescription = jobDescription4
            hoursToUpdate.days[5].jobDescription = jobDescription5
            hoursToUpdate.days[6].jobDescription = jobDescription6
            hoursToUpdate.days[7].jobDescription = jobDescription7
            hoursToUpdate.days[8].jobDescription = jobDescription8
            hoursToUpdate.days[9].jobDescription = jobDescription9
            hoursToUpdate.days[10].jobDescription = jobDescription10
            hoursToUpdate.days[11].jobDescription = jobDescription11
            hoursToUpdate.days[12].jobDescription = jobDescription12
            hoursToUpdate.days[13].jobDescription = jobDescription13
            hoursToUpdate.days[14].jobDescription = jobDescription14
            hoursToUpdate.days[15].jobDescription = jobDescription15
            hoursToUpdate.days[16].jobDescription = jobDescription16
            hoursToUpdate.days[17].jobDescription = jobDescription17
            hoursToUpdate.days[18].jobDescription = jobDescription18
            hoursToUpdate.days[19].jobDescription = jobDescription19
            hoursToUpdate.days[20].jobDescription = jobDescription20
            hoursToUpdate.days[21].jobDescription = jobDescription21
            hoursToUpdate.days[22].jobDescription = jobDescription22
            hoursToUpdate.days[23].jobDescription = jobDescription23
            hoursToUpdate.days[24].jobDescription = jobDescription24
            hoursToUpdate.days[25].jobDescription = jobDescription25
            hoursToUpdate.days[26].jobDescription = jobDescription26
            hoursToUpdate.days[27].jobDescription = jobDescription27
            hoursToUpdate.days[28].jobDescription = jobDescription28
            hoursToUpdate.days[29].jobDescription = jobDescription29
            hoursToUpdate.days[30].jobDescription = jobDescription30

            const dayName = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"]

            hoursToUpdate.days[0].dayNumber = day0 ? `${day0} ${dayName[new Date(day0).getDay()]}` : ''
            hoursToUpdate.days[1].dayNumber = day1 ? `${day1} ${dayName[new Date(day1).getDay()]}` : ''
            hoursToUpdate.days[2].dayNumber = day2 ? `${day2} ${dayName[new Date(day2).getDay()]}` : ''
            hoursToUpdate.days[3].dayNumber = day3 ? `${day3} ${dayName[new Date(day3).getDay()]}` : ''
            hoursToUpdate.days[4].dayNumber = day4 ? `${day4} ${dayName[new Date(day4).getDay()]}` : ''
            hoursToUpdate.days[5].dayNumber = day5 ? `${day5} ${dayName[new Date(day5).getDay()]}` : ''
            hoursToUpdate.days[6].dayNumber = day6 ? `${day6} ${dayName[new Date(day6).getDay()]}` : ''
            hoursToUpdate.days[7].dayNumber = day7 ? `${day7} ${dayName[new Date(day7).getDay()]}` : ''
            hoursToUpdate.days[8].dayNumber = day8 ? `${day8} ${dayName[new Date(day8).getDay()]}` : ''
            hoursToUpdate.days[9].dayNumber = day9 ? `${day9} ${dayName[new Date(day9).getDay()]}` : ''
            hoursToUpdate.days[10].dayNumber = day10 ? `${day10} ${dayName[new Date(day10).getDay()]}` : ''
            hoursToUpdate.days[11].dayNumber = day11 ? `${day11} ${dayName[new Date(day11).getDay()]}` : ''
            hoursToUpdate.days[12].dayNumber = day12 ? `${day12} ${dayName[new Date(day12).getDay()]}` : ''
            hoursToUpdate.days[13].dayNumber = day13 ? `${day13} ${dayName[new Date(day13).getDay()]}` : ''
            hoursToUpdate.days[14].dayNumber = day14 ? `${day14} ${dayName[new Date(day14).getDay()]}` : ''
            hoursToUpdate.days[15].dayNumber = day15 ? `${day15} ${dayName[new Date(day15).getDay()]}` : ''
            hoursToUpdate.days[16].dayNumber = day16 ? `${day16} ${dayName[new Date(day16).getDay()]}` : ''
            hoursToUpdate.days[17].dayNumber = day17 ? `${day17} ${dayName[new Date(day17).getDay()]}` : ''
            hoursToUpdate.days[18].dayNumber = day18 ? `${day18} ${dayName[new Date(day18).getDay()]}` : ''
            hoursToUpdate.days[19].dayNumber = day19 ? `${day19} ${dayName[new Date(day19).getDay()]}` : ''
            hoursToUpdate.days[20].dayNumber = day20 ? `${day20} ${dayName[new Date(day20).getDay()]}` : ''
            hoursToUpdate.days[21].dayNumber = day21 ? `${day21} ${dayName[new Date(day21).getDay()]}` : ''
            hoursToUpdate.days[22].dayNumber = day22 ? `${day22} ${dayName[new Date(day22).getDay()]}` : ''
            hoursToUpdate.days[23].dayNumber = day23 ? `${day23} ${dayName[new Date(day23).getDay()]}` : ''
            hoursToUpdate.days[24].dayNumber = day24 ? `${day24} ${dayName[new Date(day24).getDay()]}` : ''
            hoursToUpdate.days[25].dayNumber = day25 ? `${day25} ${dayName[new Date(day25).getDay()]}` : ''
            hoursToUpdate.days[26].dayNumber = day26 ? `${day26} ${dayName[new Date(day26).getDay()]}` : ''
            hoursToUpdate.days[27].dayNumber = day27 ? `${day27} ${dayName[new Date(day27).getDay()]}` : ''
            hoursToUpdate.days[28].dayNumber = day28 ? `${day28} ${dayName[new Date(day28).getDay()]}` : ''
            hoursToUpdate.days[29].dayNumber = day29 ? `${day29} ${dayName[new Date(day29).getDay()]}` : ''
            hoursToUpdate.days[30].dayNumber = day30 ? `${day30} ${dayName[new Date(day30).getDay()]}` : ''

            // use default value time 00:00
            hoursToUpdate.days[0].totalHours = calculate(timeToDecimal(hoursToUpdate.days[0].startWorkA), timeToDecimal(hoursToUpdate.days[0].endWorkA), timeToDecimal(hoursToUpdate.days[0].startWorkB), timeToDecimal(hoursToUpdate.days[0].endWorkB), new Date(day0).getDay(), holiday0)
            hoursToUpdate.days[1].totalHours = calculate(timeToDecimal(hoursToUpdate.days[1].startWorkA), timeToDecimal(hoursToUpdate.days[1].endWorkA), timeToDecimal(hoursToUpdate.days[1].startWorkB), timeToDecimal(hoursToUpdate.days[1].endWorkB), new Date(day0).getDay(), holiday1)
            hoursToUpdate.days[2].totalHours = calculate(timeToDecimal(hoursToUpdate.days[2].startWorkA), timeToDecimal(hoursToUpdate.days[2].endWorkA), timeToDecimal(hoursToUpdate.days[2].startWorkB), timeToDecimal(hoursToUpdate.days[2].endWorkB), new Date(day0).getDay(), holiday2)
            hoursToUpdate.days[3].totalHours = calculate(timeToDecimal(hoursToUpdate.days[3].startWorkA), timeToDecimal(hoursToUpdate.days[3].endWorkA), timeToDecimal(hoursToUpdate.days[3].startWorkB), timeToDecimal(hoursToUpdate.days[3].endWorkB), new Date(day0).getDay(), holiday3)
            hoursToUpdate.days[4].totalHours = calculate(timeToDecimal(hoursToUpdate.days[4].startWorkA), timeToDecimal(hoursToUpdate.days[4].endWorkA), timeToDecimal(hoursToUpdate.days[4].startWorkB), timeToDecimal(hoursToUpdate.days[4].endWorkB), new Date(day0).getDay(), holiday4)
            hoursToUpdate.days[5].totalHours = calculate(timeToDecimal(hoursToUpdate.days[5].startWorkA), timeToDecimal(hoursToUpdate.days[5].endWorkA), timeToDecimal(hoursToUpdate.days[5].startWorkB), timeToDecimal(hoursToUpdate.days[5].endWorkB), new Date(day0).getDay(), holiday5)
            hoursToUpdate.days[6].totalHours = calculate(timeToDecimal(hoursToUpdate.days[6].startWorkA), timeToDecimal(hoursToUpdate.days[6].endWorkA), timeToDecimal(hoursToUpdate.days[6].startWorkB), timeToDecimal(hoursToUpdate.days[6].endWorkB), new Date(day0).getDay(), holiday6)
            hoursToUpdate.days[7].totalHours = calculate(timeToDecimal(hoursToUpdate.days[7].startWorkA), timeToDecimal(hoursToUpdate.days[7].endWorkA), timeToDecimal(hoursToUpdate.days[7].startWorkB), timeToDecimal(hoursToUpdate.days[7].endWorkB), new Date(day0).getDay(), holiday7)
            hoursToUpdate.days[8].totalHours = calculate(timeToDecimal(hoursToUpdate.days[8].startWorkA), timeToDecimal(hoursToUpdate.days[8].endWorkA), timeToDecimal(hoursToUpdate.days[8].startWorkB), timeToDecimal(hoursToUpdate.days[8].endWorkB), new Date(day0).getDay(), holiday8)
            hoursToUpdate.days[9].totalHours = calculate(timeToDecimal(hoursToUpdate.days[9].startWorkA), timeToDecimal(hoursToUpdate.days[9].endWorkA), timeToDecimal(hoursToUpdate.days[9].startWorkB), timeToDecimal(hoursToUpdate.days[9].endWorkB), new Date(day0).getDay(), holiday9)
            hoursToUpdate.days[10].totalHours = calculate(timeToDecimal(hoursToUpdate.days[10].startWorkA), timeToDecimal(hoursToUpdate.days[10].endWorkA), timeToDecimal(hoursToUpdate.days[10].startWorkB), timeToDecimal(hoursToUpdate.days[10].endWorkB), new Date(day0).getDay(), holiday10)
            hoursToUpdate.days[11].totalHours = calculate(timeToDecimal(hoursToUpdate.days[11].startWorkA), timeToDecimal(hoursToUpdate.days[11].endWorkA), timeToDecimal(hoursToUpdate.days[11].startWorkB), timeToDecimal(hoursToUpdate.days[11].endWorkB), new Date(day0).getDay(), holiday11)
            hoursToUpdate.days[12].totalHours = calculate(timeToDecimal(hoursToUpdate.days[12].startWorkA), timeToDecimal(hoursToUpdate.days[12].endWorkA), timeToDecimal(hoursToUpdate.days[12].startWorkB), timeToDecimal(hoursToUpdate.days[12].endWorkB), new Date(day0).getDay(), holiday12)
            hoursToUpdate.days[13].totalHours = calculate(timeToDecimal(hoursToUpdate.days[13].startWorkA), timeToDecimal(hoursToUpdate.days[13].endWorkA), timeToDecimal(hoursToUpdate.days[13].startWorkB), timeToDecimal(hoursToUpdate.days[13].endWorkB), new Date(day0).getDay(), holiday13)
            hoursToUpdate.days[14].totalHours = calculate(timeToDecimal(hoursToUpdate.days[14].startWorkA), timeToDecimal(hoursToUpdate.days[14].endWorkA), timeToDecimal(hoursToUpdate.days[14].startWorkB), timeToDecimal(hoursToUpdate.days[14].endWorkB), new Date(day0).getDay(), holiday14)
            hoursToUpdate.days[15].totalHours = calculate(timeToDecimal(hoursToUpdate.days[15].startWorkA), timeToDecimal(hoursToUpdate.days[15].endWorkA), timeToDecimal(hoursToUpdate.days[15].startWorkB), timeToDecimal(hoursToUpdate.days[15].endWorkB), new Date(day0).getDay(), holiday15)
            hoursToUpdate.days[16].totalHours = calculate(timeToDecimal(hoursToUpdate.days[16].startWorkA), timeToDecimal(hoursToUpdate.days[16].endWorkA), timeToDecimal(hoursToUpdate.days[16].startWorkB), timeToDecimal(hoursToUpdate.days[16].endWorkB), new Date(day0).getDay(), holiday16)
            hoursToUpdate.days[17].totalHours = calculate(timeToDecimal(hoursToUpdate.days[17].startWorkA), timeToDecimal(hoursToUpdate.days[17].endWorkA), timeToDecimal(hoursToUpdate.days[17].startWorkB), timeToDecimal(hoursToUpdate.days[17].endWorkB), new Date(day0).getDay(), holiday17)
            hoursToUpdate.days[18].totalHours = calculate(timeToDecimal(hoursToUpdate.days[18].startWorkA), timeToDecimal(hoursToUpdate.days[18].endWorkA), timeToDecimal(hoursToUpdate.days[18].startWorkB), timeToDecimal(hoursToUpdate.days[18].endWorkB), new Date(day0).getDay(), holiday18)
            hoursToUpdate.days[19].totalHours = calculate(timeToDecimal(hoursToUpdate.days[19].startWorkA), timeToDecimal(hoursToUpdate.days[19].endWorkA), timeToDecimal(hoursToUpdate.days[19].startWorkB), timeToDecimal(hoursToUpdate.days[19].endWorkB), new Date(day0).getDay(), holiday19)
            hoursToUpdate.days[20].totalHours = calculate(timeToDecimal(hoursToUpdate.days[20].startWorkA), timeToDecimal(hoursToUpdate.days[20].endWorkA), timeToDecimal(hoursToUpdate.days[20].startWorkB), timeToDecimal(hoursToUpdate.days[20].endWorkB), new Date(day0).getDay(), holiday20)
            hoursToUpdate.days[21].totalHours = calculate(timeToDecimal(hoursToUpdate.days[21].startWorkA), timeToDecimal(hoursToUpdate.days[21].endWorkA), timeToDecimal(hoursToUpdate.days[21].startWorkB), timeToDecimal(hoursToUpdate.days[21].endWorkB), new Date(day0).getDay(), holiday21)
            hoursToUpdate.days[22].totalHours = calculate(timeToDecimal(hoursToUpdate.days[22].startWorkA), timeToDecimal(hoursToUpdate.days[22].endWorkA), timeToDecimal(hoursToUpdate.days[22].startWorkB), timeToDecimal(hoursToUpdate.days[22].endWorkB), new Date(day0).getDay(), holiday22)
            hoursToUpdate.days[23].totalHours = calculate(timeToDecimal(hoursToUpdate.days[23].startWorkA), timeToDecimal(hoursToUpdate.days[23].endWorkA), timeToDecimal(hoursToUpdate.days[23].startWorkB), timeToDecimal(hoursToUpdate.days[23].endWorkB), new Date(day0).getDay(), holiday23)
            hoursToUpdate.days[24].totalHours = calculate(timeToDecimal(hoursToUpdate.days[24].startWorkA), timeToDecimal(hoursToUpdate.days[24].endWorkA), timeToDecimal(hoursToUpdate.days[24].startWorkB), timeToDecimal(hoursToUpdate.days[24].endWorkB), new Date(day0).getDay(), holiday24)
            hoursToUpdate.days[25].totalHours = calculate(timeToDecimal(hoursToUpdate.days[25].startWorkA), timeToDecimal(hoursToUpdate.days[25].endWorkA), timeToDecimal(hoursToUpdate.days[25].startWorkB), timeToDecimal(hoursToUpdate.days[25].endWorkB), new Date(day0).getDay(), holiday25)
            hoursToUpdate.days[26].totalHours = calculate(timeToDecimal(hoursToUpdate.days[26].startWorkA), timeToDecimal(hoursToUpdate.days[26].endWorkA), timeToDecimal(hoursToUpdate.days[26].startWorkB), timeToDecimal(hoursToUpdate.days[26].endWorkB), new Date(day0).getDay(), holiday26)
            hoursToUpdate.days[27].totalHours = calculate(timeToDecimal(hoursToUpdate.days[27].startWorkA), timeToDecimal(hoursToUpdate.days[27].endWorkA), timeToDecimal(hoursToUpdate.days[27].startWorkB), timeToDecimal(hoursToUpdate.days[27].endWorkB), new Date(day0).getDay(), holiday27)
            hoursToUpdate.days[28].totalHours = calculate(timeToDecimal(hoursToUpdate.days[28].startWorkA), timeToDecimal(hoursToUpdate.days[28].endWorkA), timeToDecimal(hoursToUpdate.days[28].startWorkB), timeToDecimal(hoursToUpdate.days[28].endWorkB), new Date(day0).getDay(), holiday28)
            hoursToUpdate.days[29].totalHours = calculate(timeToDecimal(hoursToUpdate.days[29].startWorkA), timeToDecimal(hoursToUpdate.days[29].endWorkA), timeToDecimal(hoursToUpdate.days[29].startWorkB), timeToDecimal(hoursToUpdate.days[29].endWorkB), new Date(day0).getDay(), holiday29)
            hoursToUpdate.days[30].totalHours = calculate(timeToDecimal(hoursToUpdate.days[30].startWorkA), timeToDecimal(hoursToUpdate.days[30].endWorkA), timeToDecimal(hoursToUpdate.days[30].startWorkB), timeToDecimal(hoursToUpdate.days[30].endWorkB), new Date(day0).getDay(), holiday30)
            
          

            const normal = hoursToUpdate.days.map(day => day.totalHours && day.totalHours.normal)
            const special = hoursToUpdate.days.map(day => day.totalHours && day.totalHours.special)
            const total = hoursToUpdate.days.map(day => day.totalHours && day.totalHours.total)
            const allNormal = normal.filter(value => value !== undefined ).map(x => x = Number(x)).reduce((a,b) => a+b)
            const allSpecial = special.filter(value => value !== undefined ).map(x => x = Number(x)).reduce((a,b) => a+b)
            const allTotal = total.filter(value => value !== undefined ).map(x => x = Number(x)).reduce((a,b) => a+b)

            let numallNormal = allNormal % 1 !== 0 ? parseFloat(allNormal).toFixed(2) : allNormal
            let numallSpecial = allSpecial % 1 !== 0 ? parseFloat(allSpecial).toFixed(2) : allSpecial
            let numallTotal = allTotal % 1 !== 0 ? parseFloat(allTotal).toFixed(2) : allTotal

            hoursToUpdate.monthHours = {
                totalHours: numallTotal,
                normalRate: numallNormal,
                specialRate: numallSpecial,
            }

            // console.log('normal', normal, 'allNormal', allNormal, 'numallNormal', numallNormal, 'hoursToUpdate.monthHours.normalRate', hoursToUpdate.monthHours.normalRate);
            

            

            hoursToUpdate.month = inputs.month

            console.log('checked', checked)

            console.log(hoursToUpdate)
            
            await hoursService
              .update(hours.id, hoursToUpdate)
            // console.log(inputs)
              setErrorMessage('Time card created')
              setTimeout(() => {
                setErrorMessage(null)
              }, 5000)
        }

        return (
            <div>
                <h1>TIMESEDDEL / TIME CARD</h1>
                <br/>
                <button className='screenBtn' onClick={() => toScreen('1')} >Back</button>
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
                <p>MONTH</p>
                <input
                    type="text"
                    name="month"
                    value={inputs.month || ''}
                    onChange={handleChange}
                />
                    <div className='timecard'>
                        
                            {/* <div className='timeCardHeader'>
                                <p className='left'>DATE</p>
                                <p className='left'>JOB DESCRIPTION</p>
                                <p className='left'>START</p>
                                <p className='left'>FINISH</p> */}
                                {/* <p className='left'>TOTAL HOURS/TIMER</p> */}
                            {/* </div> */}

                            <div className='eachDay topeachday'>
                                <p className='topDay date'>{hours.days[0].dayNumber}</p>

                                <div>
                                    <p>Date</p>
                                    <input
                                        id='0'
                                        type="date"
                                        label='Date'
                                        name="day0"
                                        value={day.day0 || ''}
                                        onChange={handleChange}
                                    />
                                </div>

                                <div>
                                    <p>Holiday</p>
                                    <input className='holiday'
                                        id='0'
                                        type="checkbox"
                                        name="holiday0"
                                        checked={checked.holiday0}
                                        onChange={handleChange}
                                    />
                                </div>
                                
                                <div>
                                    <p>Job Description</p>
                                    <input 
                                        id='0'
                                        type="text"
                                        name="jobDescription0"
                                        value={description.jobDescription0 || ''}
                                        onChange={handleChange}
                                    />
                                </div>

                                {/* <div style={{backgroundColor: '#4caf50'}}> */}
                                <div>
                                    <p className='startA'>Start</p>
                                    <input className='startA'
                                        id='0'
                                        type="time"
                                        name="startWorkA0"
                                        value={start.startWorkA0 || '00:00'}
                                        onChange={handleChange}
                                    />
                                </div>

                                {/* <div style={{backgroundColor: '#4caf50'}}> */}
                                <div>
                                    <p className='endA'>End</p>
                                    <input className='endA'
                                        id='0'
                                        type="time"
                                        name="endWorkA0"
                                        value={end.endWorkA0 || '00:00'}
                                        onChange={handleChange}
                                    />
                                </div>

                                <div>
                                    <p className='startB'>Start</p>
                                    <input  className='startB'
                                        id='0'
                                        type="time"
                                        name="startWorkB0"
                                        value={start.startWorkB0 || '00:00'}
                                        onChange={handleChange}
                                    />
                                </div>

                                <div>
                                    <p className='endB'>End</p>
                                    <input  className='endB'
                                        id='0'
                                        type="time"
                                        name="endWorkB0"
                                        value={end.endWorkB0 || '00:00'}
                                        onChange={handleChange}
                                />
                                </div>

                                {/* <p>{ start.startWorkA0 !== end.endWorkA0 &&
                                    JSON.stringify(calculate(timeToDecimal(start.startWorkA0), timeToDecimal(end.endWorkA0))) }</p> */}
                            </div>

                            <div className='eachDay'>
                                <p className='date'>{hours.days[1].dayNumber || '----------------------'}</p>

                                <input 
                                    id='1'
                                    type="date"
                                    name="day1"
                                    value={day.day1 || ''}
                                    onChange={handleChange}
                                />

                                <div>                                    
                                    <input className='holiday'
                                        id='1'
                                        type="checkbox"
                                        name="holiday1"
                                        checked={checked.holiday1 || false}
                                        onChange={handleChange}
                                    />
                                </div>

                                <input 
                                    id='1'
                                    type="text"
                                    name="jobDescription1"
                                    value={description.jobDescription1 || ''}
                                    onChange={handleChange}
                                />

                                <input className='startA'
                                    id='1'
                                    type="time"
                                    name="startWorkA1"
                                    value={start.startWorkA1 || '00:00'}
                                    onChange={handleChange}
                                />

                                <input className='endA'
                                    id='1'
                                    type="time"
                                    name="endWorkA1"
                                    value={end.endWorkA1 || '00:00'}
                                    onChange={handleChange}
                                />

                                <input className='startB'
                                    id='1'
                                    type="time"
                                    name="startWorkB1"
                                    value={start.startWorkB1 || '00:00'}
                                    onChange={handleChange}
                                />

                                <input className='endB'
                                    id='1'
                                    type="time"
                                    name="endWorkB1"
                                    value={end.endWorkB1 || '00:00'}
                                    onChange={handleChange}
                                />
                            </div>

                            <div className='eachDay'>
                                <p className='date'>{hours.days[2].dayNumber || '----------------------'}</p>

                                <input 
                                    id='2'
                                    type="date"
                                    name="day2"
                                    value={day.day2 || ''}
                                    onChange={handleChange}
                                />

                                <div>                                    
                                    <input className='holiday'
                                        id='2'
                                        type="checkbox"
                                        name="holiday2"
                                        checked={checked.holiday2 || false}
                                        onChange={handleChange}
                                    />
                                </div>

                                <input 
                                    id='2'
                                    type="text"
                                    name="jobDescription2"
                                    value={description.jobDescription2 || ''}
                                    onChange={handleChange}
                                />

                                <input className='startA'
                                    id='2'
                                    type="time"
                                    name="startWorkA2"
                                    value={start.startWorkA2 || '00:00'}
                                    onChange={handleChange}
                                />

                                <input className='endA'
                                    id='2'
                                    type="time"
                                    name="endWorkA2"
                                    value={end.endWorkA2 || '00:00'}
                                    onChange={handleChange}
                                />

                                <input className='startB'
                                    id='2'
                                    type="time"
                                    name="startWorkB2"
                                    value={start.startWorkB2 || '00:00'}
                                    onChange={handleChange}
                                />

                                <input className='endB'
                                    id='2'
                                    type="time"
                                    name="endWorkB2"
                                    value={end.endWorkB2 || '00:00'}
                                    onChange={handleChange}
                                />
                            </div>

                            <div className='eachDay'>
                                <p className='date'>{hours.days[3].dayNumber || '----------------------'}</p>

                                <input 
                                    id='3'
                                    type="date"
                                    name="day3"
                                    value={day.day3 || ''}
                                    onChange={handleChange}
                                />

                                <div>                                    
                                    <input className='holiday'
                                        id='3'
                                        type="checkbox"
                                        name="holiday3"
                                        checked={checked.holiday3 || false}
                                        onChange={handleChange}
                                    />
                                </div>

                                <input 
                                    id='3'
                                    type="text"
                                    name="jobDescription3"
                                    value={description.jobDescription3 || ''}
                                    onChange={handleChange}
                                />

                                <input className='startA'
                                    id='3'
                                    type="time"
                                    name="startWorkA3"
                                    value={start.startWorkA3 || '00:00'}
                                    onChange={handleChange}
                                />

                                <input className='endA'
                                    id='3'
                                    type="time"
                                    name="endWorkA3"
                                    value={end.endWorkA3 || '00:00'}
                                    onChange={handleChange}
                                />

                                <input className='startB'
                                    id='3'
                                    type="time"
                                    name="startWorkB3"
                                    value={start.startWorkB3 || '00:00'}
                                    onChange={handleChange}
                                />

                                <input className='endB'
                                    id='3'
                                    type="time"
                                    name="endWorkB3"
                                    value={end.endWorkB3 || '00:00'}
                                    onChange={handleChange}
                                />
                            </div>

                            <div className='eachDay'>
                                <p className='date'>{hours.days[4].dayNumber || '----------------------'}</p>

                                <input 
                                    id='4'
                                    type="date"
                                    name="day4"
                                    value={day.day4 || ''}
                                    onChange={handleChange}
                                />

                                <div>                                    
                                    <input className='holiday'
                                        id='4'
                                        type="checkbox"
                                        name="holiday4"
                                        checked={checked.holiday4 || false}
                                        onChange={handleChange}
                                    />
                                </div>

                                <input 
                                    id='4'
                                    type="text"
                                    name="jobDescription4"
                                    value={description.jobDescription4 || ''}
                                    onChange={handleChange}
                                />

                                <input className='startA'
                                    id='4'
                                    type="time"
                                    name="startWorkA4"
                                    value={start.startWorkA4 || '00:00'}
                                    onChange={handleChange}
                                />

                                <input className='endA'
                                    id='4'
                                    type="time"
                                    name="endWorkA4"
                                    value={end.endWorkA4 || '00:00'}
                                    onChange={handleChange}
                                />

                                <input className='startB'
                                    id='4'
                                    type="time"
                                    name="startWorkB4"
                                    value={start.startWorkB4 || '00:00'}
                                    onChange={handleChange}
                                />

                                <input className='endB'
                                    id='4'
                                    type="time"
                                    name="endWorkB4"
                                    value={end.endWorkB4 || '00:00'}
                                    onChange={handleChange}
                                />
                            </div>

                            <div className='eachDay'>
                                <p className='date'>{hours.days[5].dayNumber || '----------------------'}</p>

                                <input 
                                    id='5'
                                    type="date"
                                    name="day5"
                                    value={day.day5 || ''}
                                    onChange={handleChange}
                                />

                                <div>                                    
                                    <input className='holiday'
                                        id='5'
                                        type="checkbox"
                                        name="holiday5"
                                        checked={checked.holiday5 || false}
                                        onChange={handleChange}
                                    />
                                </div>

                                <input 
                                    id='5'
                                    type="text"
                                    name="jobDescription5"
                                    value={description.jobDescription5 || ''}
                                    onChange={handleChange}
                                />

                                <input className='startA'
                                    id='5'
                                    type="time"
                                    name="startWorkA5"
                                    value={start.startWorkA5 || '00:00'}
                                    onChange={handleChange}
                                />

                                <input className='endA'
                                    id='5'
                                    type="time"
                                    name="endWorkA5"
                                    value={end.endWorkA5 || '00:00'}
                                    onChange={handleChange}
                                />

                                <input className='startB'
                                    id='5'
                                    type="time"
                                    name="startWorkB5"
                                    value={start.startWorkB5 || '00:00'}
                                    onChange={handleChange}
                                />

                                <input className='endB'
                                    id='5'
                                    type="time"
                                    name="endWorkB5"
                                    value={end.endWorkB5 || '00:00'}
                                    onChange={handleChange}
                                />
                            </div>

                            <div className='eachDay'>
                                <p className='date'>{hours.days[6].dayNumber || '----------------------'}</p>

                                <input 
                                    id='6'
                                    type="date"
                                    name="day6"
                                    value={day.day6 || ''}
                                    onChange={handleChange}
                                />

                                <div>                                    
                                    <input className='holiday'
                                        id='6'
                                        type="checkbox"
                                        name="holiday6"
                                        checked={checked.holiday6 || false}
                                        onChange={handleChange}
                                    />
                                </div>

                                <input 
                                    id='6'
                                    type="text"
                                    name="jobDescription6"
                                    value={description.jobDescription6 || ''}
                                    onChange={handleChange}
                                />

                                <input className='startA'
                                    id='6'
                                    type="time"
                                    name="startWorkA6"
                                    value={start.startWorkA6 || '00:00'}
                                    onChange={handleChange}
                                />

                                <input className='endA'
                                    id='6'
                                    type="time"
                                    name="endWorkA6"
                                    value={end.endWorkA6 || '00:00'}
                                    onChange={handleChange}
                                />

                                <input className='startB'
                                    id='6'
                                    type="time"
                                    name="startWorkB6"
                                    value={start.startWorkB6 || '00:00'}
                                    onChange={handleChange}
                                />

                                <input className='endB'
                                    id='6'
                                    type="time"
                                    name="endWorkB6"
                                    value={end.endWorkB6 || '00:00'}
                                    onChange={handleChange}
                                />
                            </div>

                            <div className='eachDay'>
                                <p className='date'>{hours.days[7].dayNumber || '----------------------'}</p>

                                <input 
                                    id='7'
                                    type="date"
                                    name="day7"
                                    value={day.day7 || ''}
                                    onChange={handleChange}
                                />

                                <div>                                    
                                    <input className='holiday'
                                        id='7'
                                        type="checkbox"
                                        name="holiday7"
                                        checked={checked.holiday7 || false}
                                        onChange={handleChange}
                                    />
                                </div>

                                <input 
                                    id='7'
                                    type="text"
                                    name="jobDescription7"
                                    value={description.jobDescription7 || ''}
                                    onChange={handleChange}
                                />

                                <input className='startA'
                                    id='7'
                                    type="time"
                                    name="startWorkA7"
                                    value={start.startWorkA7 || '00:00'}
                                    onChange={handleChange}
                                />

                                <input className='endA'
                                    id='7'
                                    type="time"
                                    name="endWorkA7"
                                    value={end.endWorkA7 || '00:00'}
                                    onChange={handleChange}
                                />

                                <input className='startB'
                                    id='7'
                                    type="time"
                                    name="startWorkB7"
                                    value={start.startWorkB7 || '00:00'}
                                    onChange={handleChange}
                                />

                                <input className='endB'
                                    id='7'
                                    type="time"
                                    name="endWorkB7"
                                    value={end.endWorkB7 || '00:00'}
                                    onChange={handleChange}
                                />
                            </div>

                            <div className='eachDay'>
                                <p className='date'>{hours.days[8].dayNumber || '----------------------'}</p>

                                <input 
                                    id='8'
                                    type="date"
                                    name="day8"
                                    value={day.day8 || ''}
                                    onChange={handleChange}
                                />

                                <div>                                    
                                    <input className='holiday'
                                        id='8'
                                        type="checkbox"
                                        name="holiday8"
                                        checked={checked.holiday8 || false}
                                        onChange={handleChange}
                                    />
                                </div>

                                <input 
                                    id='8'
                                    type="text"
                                    name="jobDescription8"
                                    value={description.jobDescription8 || ''}
                                    onChange={handleChange}
                                />

                                <input className='startA'
                                    id='8'
                                    type="time"
                                    name="startWorkA8"
                                    value={start.startWorkA8 || '00:00'}
                                    onChange={handleChange}
                                />

                                <input className='endA'
                                    id='8'
                                    type="time"
                                    name="endWorkA8"
                                    value={end.endWorkA8 || '00:00'}
                                    onChange={handleChange}
                                />

                                <input className='startB'
                                    id='8'
                                    type="time"
                                    name="startWorkB8"
                                    value={start.startWorkB8 || '00:00'}
                                    onChange={handleChange}
                                />

                                <input className='endB'
                                    id='8'
                                    type="time"
                                    name="endWorkB8"
                                    value={end.endWorkB8 || '00:00'}
                                    onChange={handleChange}
                                />
                            </div>

                            <div className='eachDay'>
                                <p className='date'>{hours.days[9].dayNumber || '----------------------'}</p>

                                <input 
                                    id='9'
                                    type="date"
                                    name="day9"
                                    value={day.day9 || ''}
                                    onChange={handleChange}
                                />

                                <div>                                    
                                    <input className='holiday'
                                        id='9'
                                        type="checkbox"
                                        name="holiday9"
                                        checked={checked.holiday9 || false}
                                        onChange={handleChange}
                                    />
                                </div>

                                <input 
                                    id='9'
                                    type="text"
                                    name="jobDescription9"
                                    value={description.jobDescription9 || ''}
                                    onChange={handleChange}
                                />

                                <input className='startA'
                                    id='9'
                                    type="time"
                                    name="startWorkA9"
                                    value={start.startWorkA9 || '00:00'}
                                    onChange={handleChange}
                                />

                                <input className='endA'
                                    id='9'
                                    type="time"
                                    name="endWorkA9"
                                    value={end.endWorkA9 || '00:00'}
                                    onChange={handleChange}
                                />

                                <input className='startB'
                                    id='9'
                                    type="time"
                                    name="startWorkB9"
                                    value={start.startWorkB9 || '00:00'}
                                    onChange={handleChange}
                                />

                                <input className='endB'
                                    id='9'
                                    type="time"
                                    name="endWorkB9"
                                    value={end.endWorkB9 || '00:00'}
                                    onChange={handleChange}
                                />
                            </div>

                            <div className='eachDay'>
                                <p className='date'>{hours.days[10].dayNumber || '----------------------'}</p>

                                <input 
                                    id='10'
                                    type="date"
                                    name="day10"
                                    value={day.day10 || ''}
                                    onChange={handleChange}
                                />

                                <div>                                    
                                    <input className='holiday'
                                        id='10'
                                        type="checkbox"
                                        name="holiday10"
                                        checked={checked.holiday10 || false}
                                        onChange={handleChange}
                                    />
                                </div>

                                <input 
                                    id='10'
                                    type="text"
                                    name="jobDescription10"
                                    value={description.jobDescription10 || ''}
                                    onChange={handleChange}
                                />

                                <input className='startA'
                                    id='10'
                                    type="time"
                                    name="startWorkA10"
                                    value={start.startWorkA10 || '00:00'}
                                    onChange={handleChange}
                                />

                                <input className='endA'
                                    id='10'
                                    type="time"
                                    name="endWorkA10"
                                    value={end.endWorkA10 || '00:00'}
                                    onChange={handleChange}
                                />

                                <input className='startB'
                                    id='10'
                                    type="time"
                                    name="startWorkB10"
                                    value={start.startWorkB10 || '00:00'}
                                    onChange={handleChange}
                                />

                                <input className='endB'
                                    id='10'
                                    type="time"
                                    name="endWorkB10"
                                    value={end.endWorkB10 || '00:00'}
                                    onChange={handleChange}
                                />
                            </div>

                            <div className='eachDay'>
                                <p className='date'>{hours.days[11].dayNumber || '----------------------'}</p>

                                <input 
                                    id='11'
                                    type="date"
                                    name="day11"
                                    value={day.day11 || ''}
                                    onChange={handleChange}
                                />

                                <div>                                    
                                    <input className='holiday'
                                        id='11'
                                        type="checkbox"
                                        name="holiday11"
                                        checked={checked.holiday11 || false}
                                        onChange={handleChange}
                                    />
                                </div>

                                <input 
                                    id='11'
                                    type="text"
                                    name="jobDescription11"
                                    value={description.jobDescription11 || ''}
                                    onChange={handleChange}
                                />

                                <input className='startA'
                                    id='11'
                                    type="time"
                                    name="startWorkA11"
                                    value={start.startWorkA11 || '00:00'}
                                    onChange={handleChange}
                                />

                                <input className='endA'
                                    id='11'
                                    type="time"
                                    name="endWorkA11"
                                    value={end.endWorkA11 || '00:00'}
                                    onChange={handleChange}
                                />

                                <input className='startB'
                                    id='11'
                                    type="time"
                                    name="startWorkB11"
                                    value={start.startWorkB11 || '00:00'}
                                    onChange={handleChange}
                                />

                                <input className='endB'
                                    id='11'
                                    type="time"
                                    name="endWorkB11"
                                    value={end.endWorkB11 || '00:00'}
                                    onChange={handleChange}
                                />
                            </div>

                            <div className='eachDay'>
                                <p className='date'>{hours.days[12].dayNumber || '----------------------'}</p>

                                <input 
                                    id='12'
                                    type="date"
                                    name="day12"
                                    value={day.day12 || ''}
                                    onChange={handleChange}
                                />

                                <div>                                    
                                    <input className='holiday'
                                        id='12'
                                        type="checkbox"
                                        name="holiday12"
                                        checked={checked.holiday12 || false}
                                        onChange={handleChange}
                                    />
                                </div>

                                <input 
                                    id='12'
                                    type="text"
                                    name="jobDescription12"
                                    value={description.jobDescription12 || ''}
                                    onChange={handleChange}
                                />

                                <input className='startA'
                                    id='12'
                                    type="time"
                                    name="startWorkA12"
                                    value={start.startWorkA12 || '00:00'}
                                    onChange={handleChange}
                                />

                                <input className='endA'
                                    id='12'
                                    type="time"
                                    name="endWorkA12"
                                    value={end.endWorkA12 || '00:00'}
                                    onChange={handleChange}
                                />

                                <input className='startB'
                                    id='12'
                                    type="time"
                                    name="startWorkB12"
                                    value={start.startWorkB12 || '00:00'}
                                    onChange={handleChange}
                                />

                                <input className='endB'
                                    id='12'
                                    type="time"
                                    name="endWorkB12"
                                    value={end.endWorkB12 || '00:00'}
                                    onChange={handleChange}
                                />
                            </div>

                            <div className='eachDay'>
                                <p className='date'>{hours.days[13].dayNumber || '----------------------'}</p>

                                <input 
                                    id='13'
                                    type="date"
                                    name="day13"
                                    value={day.day13 || ''}
                                    onChange={handleChange}
                                />

                                <div>                                    
                                    <input className='holiday'
                                        id='13'
                                        type="checkbox"
                                        name="holiday13"
                                        checked={checked.holiday13 || false}
                                        onChange={handleChange}
                                    />
                                </div>

                                <input 
                                    id='13'
                                    type="text"
                                    name="jobDescription13"
                                    value={description.jobDescription13 || ''}
                                    onChange={handleChange}
                                />

                                <input className='startA'
                                    id='13'
                                    type="time"
                                    name="startWorkA13"
                                    value={start.startWorkA13 || '00:00'}
                                    onChange={handleChange}
                                />

                                <input className='endA'
                                    id='13'
                                    type="time"
                                    name="endWorkA13"
                                    value={end.endWorkA13 || '00:00'}
                                    onChange={handleChange}
                                />

                                <input className='startB'
                                    id='13'
                                    type="time"
                                    name="startWorkB13"
                                    value={start.startWorkB13 || '00:00'}
                                    onChange={handleChange}
                                />

                                <input className='endB'
                                    id='13'
                                    type="time"
                                    name="endWorkB13"
                                    value={end.endWorkB13 || '00:00'}
                                    onChange={handleChange}
                                />
                            </div>

                            <div className='eachDay'>
                                <p className='date'>{hours.days[14].dayNumber || '----------------------'}</p>

                                <input 
                                    id='14'
                                    type="date"
                                    name="day14"
                                    value={day.day14 || ''}
                                    onChange={handleChange}
                                />

                                <div>                                    
                                    <input className='holiday'
                                        id='14'
                                        type="checkbox"
                                        name="holiday14"
                                        checked={checked.holiday14 || false}
                                        onChange={handleChange}
                                    />
                                </div>

                                <input 
                                    id='14'
                                    type="text"
                                    name="jobDescription14"
                                    value={description.jobDescription14 || ''}
                                    onChange={handleChange}
                                />

                                <input className='startA'
                                    id='14'
                                    type="time"
                                    name="startWorkA14"
                                    value={start.startWorkA14 || '00:00'}
                                    onChange={handleChange}
                                />

                                <input className='endA'
                                    id='14'
                                    type="time"
                                    name="endWorkA14"
                                    value={end.endWorkA14 || '00:00'}
                                    onChange={handleChange}
                                />

                                <input className='startB'
                                    id='14'
                                    type="time"
                                    name="startWorkB14"
                                    value={start.startWorkB14 || '00:00'}
                                    onChange={handleChange}
                                />

                                <input className='endB'
                                    id='14'
                                    type="time"
                                    name="endWorkB14"
                                    value={end.endWorkB14 || '00:00'}
                                    onChange={handleChange}
                                />
                            </div>

                            <div className='eachDay'>
                                <p className='date'>{hours.days[15].dayNumber || '----------------------'}</p>

                                <input 
                                    id='15'
                                    type="date"
                                    name="day15"
                                    value={day.day15 || ''}
                                    onChange={handleChange}
                                />

                                <div>                                    
                                    <input className='holiday'
                                        id='15'
                                        type="checkbox"
                                        name="holiday15"
                                        checked={checked.holiday15 || false}
                                        onChange={handleChange}
                                    />
                                </div>

                                <input 
                                    id='15'
                                    type="text"
                                    name="jobDescription15"
                                    value={description.jobDescription15 || ''}
                                    onChange={handleChange}
                                />

                                <input className='startA'
                                    id='15'
                                    type="time"
                                    name="startWorkA15"
                                    value={start.startWorkA15 || '00:00'}
                                    onChange={handleChange}
                                />

                                <input className='endA'
                                    id='15'
                                    type="time"
                                    name="endWorkA15"
                                    value={end.endWorkA15 || '00:00'}
                                    onChange={handleChange}
                                />

                                <input className='startB'
                                    id='15'
                                    type="time"
                                    name="startWorkB15"
                                    value={start.startWorkB15 || '00:00'}
                                    onChange={handleChange}
                                />

                                <input className='endB'
                                    id='15'
                                    type="time"
                                    name="endWorkB15"
                                    value={end.endWorkB15 || '00:00'}
                                    onChange={handleChange}
                                />
                            </div>

                            <div className='eachDay'>
                                <p className='date'>{hours.days[16].dayNumber || '----------------------'}</p>

                                <input 
                                    id='16'
                                    type="date"
                                    name="day16"
                                    value={day.day16 || ''}
                                    onChange={handleChange}
                                />

                                <div>                                    
                                    <input className='holiday'
                                        id='16'
                                        type="checkbox"
                                        name="holiday16"
                                        checked={checked.holiday16 || false}
                                        onChange={handleChange}
                                    />
                                </div>

                                <input 
                                    id='16'
                                    type="text"
                                    name="jobDescription16"
                                    value={description.jobDescription16 || ''}
                                    onChange={handleChange}
                                />

                                <input className='startA'
                                    id='16'
                                    type="time"
                                    name="startWorkA16"
                                    value={start.startWorkA16 || '00:00'}
                                    onChange={handleChange}
                                />

                                <input className='endA'
                                    id='16'
                                    type="time"
                                    name="endWorkA16"
                                    value={end.endWorkA16 || '00:00'}
                                    onChange={handleChange}
                                />

                                <input className='startB'
                                    id='16'
                                    type="time"
                                    name="startWorkB16"
                                    value={start.startWorkB16 || '00:00'}
                                    onChange={handleChange}
                                />

                                <input className='endB'
                                    id='16'
                                    type="time"
                                    name="endWorkB16"
                                    value={end.endWorkB16 || '00:00'}
                                    onChange={handleChange}
                                />
                            </div>

                            <div className='eachDay'>
                                <p className='date'>{hours.days[17].dayNumber || '----------------------'}</p>

                                <input 
                                    id='17'
                                    type="date"
                                    name="day17"
                                    value={day.day17 || ''}
                                    onChange={handleChange}
                                />

                                <div>                                    
                                    <input className='holiday'
                                        id='17'
                                        type="checkbox"
                                        name="holiday17"
                                        checked={checked.holiday17 || false}
                                        onChange={handleChange}
                                    />
                                </div>

                                <input 
                                    id='17'
                                    type="text"
                                    name="jobDescription17"
                                    value={description.jobDescription17 || ''}
                                    onChange={handleChange}
                                />

                                <input className='startA'
                                    id='17'
                                    type="time"
                                    name="startWorkA17"
                                    value={start.startWorkA17 || '00:00'}
                                    onChange={handleChange}
                                />

                                <input className='endA'
                                    id='17'
                                    type="time"
                                    name="endWorkA17"
                                    value={end.endWorkA17 || '00:00'}
                                    onChange={handleChange}
                                />

                                <input className='startB'
                                    id='17'
                                    type="time"
                                    name="startWorkB17"
                                    value={start.startWorkB17 || '00:00'}
                                    onChange={handleChange}
                                />

                                <input className='endB'
                                    id='17'
                                    type="time"
                                    name="endWorkB17"
                                    value={end.endWorkB17 || '00:00'}
                                    onChange={handleChange}
                                />
                            </div>

                            <div className='eachDay'>
                                <p className='date'>{hours.days[18].dayNumber || '----------------------'}</p>

                                <input 
                                    id='18'
                                    type="date"
                                    name="day18"
                                    value={day.day18 || ''}
                                    onChange={handleChange}
                                />

                                <div>                                    
                                    <input className='holiday'
                                        id='18'
                                        type="checkbox"
                                        name="holiday18"
                                        checked={checked.holiday18 || false}
                                        onChange={handleChange}
                                    />
                                </div>

                                <input 
                                    id='18'
                                    type="text"
                                    name="jobDescription18"
                                    value={description.jobDescription18 || ''}
                                    onChange={handleChange}
                                />

                                <input className='startA'
                                    id='18'
                                    type="time"
                                    name="startWorkA18"
                                    value={start.startWorkA18 || '00:00'}
                                    onChange={handleChange}
                                />

                                <input className='endA'
                                    id='18'
                                    type="time"
                                    name="endWorkA18"
                                    value={end.endWorkA18 || '00:00'}
                                    onChange={handleChange}
                                />

                                <input className='startB'
                                    id='18'
                                    type="time"
                                    name="startWorkB18"
                                    value={start.startWorkB18 || '00:00'}
                                    onChange={handleChange}
                                />

                                <input className='endB'
                                    id='18'
                                    type="time"
                                    name="endWorkB18"
                                    value={end.endWorkB18 || '00:00'}
                                    onChange={handleChange}
                                />
                            </div>

                            <div className='eachDay'>
                                <p className='date'>{hours.days[19].dayNumber || '----------------------'}</p>

                                <input 
                                    id='19'
                                    type="date"
                                    name="day19"
                                    value={day.day19 || ''}
                                    onChange={handleChange}
                                />

                                <div>                                    
                                    <input className='holiday'
                                        id='19'
                                        type="checkbox"
                                        name="holiday19"
                                        checked={checked.holiday19 || false}
                                        onChange={handleChange}
                                    />
                                </div>

                                <input 
                                    id='19'
                                    type="text"
                                    name="jobDescription19"
                                    value={description.jobDescription19 || ''}
                                    onChange={handleChange}
                                />

                                <input className='startA'
                                    id='19'
                                    type="time"
                                    name="startWorkA19"
                                    value={start.startWorkA19 || '00:00'}
                                    onChange={handleChange}
                                />

                                <input className='endA'
                                    id='19'
                                    type="time"
                                    name="endWorkA19"
                                    value={end.endWorkA19 || '00:00'}
                                    onChange={handleChange}
                                />

                                <input className='startB'
                                    id='19'
                                    type="time"
                                    name="startWorkB19"
                                    value={start.startWorkB19 || '00:00'}
                                    onChange={handleChange}
                                />

                                <input className='endB'
                                    id='19'
                                    type="time"
                                    name="endWorkB19"
                                    value={end.endWorkB19 || '00:00'}
                                    onChange={handleChange}
                                />
                            </div>

                            <div className='eachDay'>
                                <p className='date'>{hours.days[20].dayNumber || '----------------------'}</p>

                                <input 
                                    id='20'
                                    type="date"
                                    name="day20"
                                    value={day.day20 || ''}
                                    onChange={handleChange}
                                />

                                <div>                                    
                                    <input className='holiday'
                                        id='20'
                                        type="checkbox"
                                        name="holiday20"
                                        checked={checked.holiday20 || false}
                                        onChange={handleChange}
                                    />
                                </div>

                                <input 
                                    id='20'
                                    type="text"
                                    name="jobDescription20"
                                    value={description.jobDescription20 || ''}
                                    onChange={handleChange}
                                />

                                <input className='startA'
                                    id='20'
                                    type="time"
                                    name="startWorkA20"
                                    value={start.startWorkA20 || '00:00'}
                                    onChange={handleChange}
                                />

                                <input className='endA'
                                    id='20'
                                    type="time"
                                    name="endWorkA20"
                                    value={end.endWorkA20 || '00:00'}
                                    onChange={handleChange}
                                />

                                <input className='startB'
                                    id='20'
                                    type="time"
                                    name="startWorkB20"
                                    value={start.startWorkB20 || '00:00'}
                                    onChange={handleChange}
                                />

                                <input className='endB'
                                    id='20'
                                    type="time"
                                    name="endWorkB20"
                                    value={end.endWorkB20 || '00:00'}
                                    onChange={handleChange}
                                />
                            </div>

                            <div className='eachDay'>
                                <p className='date'>{hours.days[21].dayNumber || '----------------------'}</p>

                                <input 
                                    id='21'
                                    type="date"
                                    name="day21"
                                    value={day.day21 || ''}
                                    onChange={handleChange}
                                />

                                <div>                                    
                                    <input className='holiday'
                                        id='21'
                                        type="checkbox"
                                        name="holiday21"
                                        checked={checked.holiday21 || false}
                                        onChange={handleChange}
                                    />
                                </div>

                                <input 
                                    id='21'
                                    type="text"
                                    name="jobDescription21"
                                    value={description.jobDescription21 || ''}
                                    onChange={handleChange}
                                />

                                <input className='startA'
                                    id='21'
                                    type="time"
                                    name="startWorkA21"
                                    value={start.startWorkA21 || '00:00'}
                                    onChange={handleChange}
                                />

                                <input className='endA'
                                    id='21'
                                    type="time"
                                    name="endWorkA21"
                                    value={end.endWorkA21 || '00:00'}
                                    onChange={handleChange}
                                />

                                <input className='startB'
                                    id='21'
                                    type="time"
                                    name="startWorkB21"
                                    value={start.startWorkB21 || '00:00'}
                                    onChange={handleChange}
                                />

                                <input className='endB'
                                    id='21'
                                    type="time"
                                    name="endWorkB21"
                                    value={end.endWorkB21 || '00:00'}
                                    onChange={handleChange}
                                />
                            </div>

                            <div className='eachDay'>
                                <p className='date'>{hours.days[22].dayNumber || '----------------------'}</p>

                                <input 
                                    id='22'
                                    type="date"
                                    name="day22"
                                    value={day.day22 || ''}
                                    onChange={handleChange}
                                />

                                <div>                                    
                                    <input className='holiday'
                                        id='22'
                                        type="checkbox"
                                        name="holiday22"
                                        checked={checked.holiday22 || false}
                                        onChange={handleChange}
                                    />
                                </div>

                                <input 
                                    id='22'
                                    type="text"
                                    name="jobDescription22"
                                    value={description.jobDescription22 || ''}
                                    onChange={handleChange}
                                />

                                <input className='startA'
                                    id='22'
                                    type="time"
                                    name="startWorkA22"
                                    value={start.startWorkA22 || '00:00'}
                                    onChange={handleChange}
                                />

                                <input className='endA'
                                    id='22'
                                    type="time"
                                    name="endWorkA22"
                                    value={end.endWorkA22 || '00:00'}
                                    onChange={handleChange}
                                />

                                <input className='startB'
                                    id='22'
                                    type="time"
                                    name="startWorkB22"
                                    value={start.startWorkB22 || '00:00'}
                                    onChange={handleChange}
                                />

                                <input className='endB'
                                    id='22'
                                    type="time"
                                    name="endWorkB22"
                                    value={end.endWorkB22 || '00:00'}
                                    onChange={handleChange}
                                />
                            </div>

                            <div className='eachDay'>
                                <p className='date'>{hours.days[23].dayNumber || '----------------------'}</p>

                                <input 
                                    id='23'
                                    type="date"
                                    name="day23"
                                    value={day.day23 || ''}
                                    onChange={handleChange}
                                />

                                <div>                                    
                                    <input className='holiday'
                                        id='23'
                                        type="checkbox"
                                        name="holiday23"
                                        checked={checked.holiday23 || false}
                                        onChange={handleChange}
                                    />
                                </div>

                                <input 
                                    id='23'
                                    type="text"
                                    name="jobDescription23"
                                    value={description.jobDescription23 || ''}
                                    onChange={handleChange}
                                />

                                <input className='startA'
                                    id='23'
                                    type="time"
                                    name="startWorkA23"
                                    value={start.startWorkA23 || '00:00'}
                                    onChange={handleChange}
                                />

                                <input className='endA'
                                    id='23'
                                    type="time"
                                    name="endWorkA23"
                                    value={end.endWorkA23 || '00:00'}
                                    onChange={handleChange}
                                />

                                <input className='startB'
                                    id='23'
                                    type="time"
                                    name="startWorkB23"
                                    value={start.startWorkB23 || '00:00'}
                                    onChange={handleChange}
                                />

                                <input className='endB'
                                    id='23'
                                    type="time"
                                    name="endWorkB23"
                                    value={end.endWorkB23 || '00:00'}
                                    onChange={handleChange}
                                />
                            </div>

                            <div className='eachDay'>
                                <p className='date'>{hours.days[24].dayNumber || '----------------------'}</p>

                                <input 
                                    id='24'
                                    type="date"
                                    name="day24"
                                    value={day.day24 || ''}
                                    onChange={handleChange}
                                />

                                <div>                                    
                                    <input className='holiday'
                                        id='24'
                                        type="checkbox"
                                        name="holiday24"
                                        checked={checked.holiday24 || false}
                                        onChange={handleChange}
                                    />
                                </div>

                                <input 
                                    id='24'
                                    type="text"
                                    name="jobDescription24"
                                    value={description.jobDescription24 || ''}
                                    onChange={handleChange}
                                />

                                <input className='startA'
                                    id='24'
                                    type="time"
                                    name="startWorkA24"
                                    value={start.startWorkA24 || '00:00'}
                                    onChange={handleChange}
                                />

                                <input className='endA'
                                    id='24'
                                    type="time"
                                    name="endWorkA24"
                                    value={end.endWorkA24 || '00:00'}
                                    onChange={handleChange}
                                />

                                <input className='startB'
                                    id='24'
                                    type="time"
                                    name="startWorkB24"
                                    value={start.startWorkB24 || '00:00'}
                                    onChange={handleChange}
                                />

                                <input className='endB'
                                    id='24'
                                    type="time"
                                    name="endWorkB24"
                                    value={end.endWorkB24 || '00:00'}
                                    onChange={handleChange}
                                />
                            </div>

                            <div className='eachDay'>
                                <p className='date'>{hours.days[25].dayNumber || '----------------------'}</p>

                                <input 
                                    id='25'
                                    type="date"
                                    name="day25"
                                    value={day.day25 || ''}
                                    onChange={handleChange}
                                />

                                <div>                                    
                                    <input className='holiday'
                                        id='25'
                                        type="checkbox"
                                        name="holiday25"
                                        checked={checked.holiday25 || false}
                                        onChange={handleChange}
                                    />
                                </div>

                                <input 
                                    id='25'
                                    type="text"
                                    name="jobDescription25"
                                    value={description.jobDescription25 || ''}
                                    onChange={handleChange}
                                />

                                <input className='startA'
                                    id='25'
                                    type="time"
                                    name="startWorkA25"
                                    value={start.startWorkA25 || '00:00'}
                                    onChange={handleChange}
                                />

                                <input className='endA'
                                    id='25'
                                    type="time"
                                    name="endWorkA25"
                                    value={end.endWorkA25 || '00:00'}
                                    onChange={handleChange}
                                />

                                <input className='startB'
                                    id='25'
                                    type="time"
                                    name="startWorkB25"
                                    value={start.startWorkB25 || '00:00'}
                                    onChange={handleChange}
                                />

                                <input className='endB'
                                    id='25'
                                    type="time"
                                    name="endWorkB25"
                                    value={end.endWorkB25 || '00:00'}
                                    onChange={handleChange}
                                />
                            </div>

                            <div className='eachDay'>
                                <p className='date'>{hours.days[26].dayNumber || '----------------------'}</p>

                                <input 
                                    id='26'
                                    type="date"
                                    name="day26"
                                    value={day.day26 || ''}
                                    onChange={handleChange}
                                />

                                <div>                                    
                                    <input className='holiday'
                                        id='26'
                                        type="checkbox"
                                        name="holiday26"
                                        checked={checked.holiday26 || false}
                                        onChange={handleChange}
                                    />
                                </div>

                                <input 
                                    id='26'
                                    type="text"
                                    name="jobDescription26"
                                    value={description.jobDescription26 || ''}
                                    onChange={handleChange}
                                />

                                <input className='startA'
                                    id='26'
                                    type="time"
                                    name="startWorkA26"
                                    value={start.startWorkA26 || '00:00'}
                                    onChange={handleChange}
                                />

                                <input className='endA'
                                    id='26'
                                    type="time"
                                    name="endWorkA26"
                                    value={end.endWorkA26 || '00:00'}
                                    onChange={handleChange}
                                />

                                <input className='startB'
                                    id='26'
                                    type="time"
                                    name="startWorkB26"
                                    value={start.startWorkB26 || '00:00'}
                                    onChange={handleChange}
                                />

                                <input className='endB'
                                    id='26'
                                    type="time"
                                    name="endWorkB26"
                                    value={end.endWorkB26 || '00:00'}
                                    onChange={handleChange}
                                />
                            </div>

                            <div className='eachDay'>
                                <p className='date'>{hours.days[27].dayNumber || '----------------------'}</p>

                                <input 
                                    id='27'
                                    type="date"
                                    name="day27"
                                    value={day.day27 || ''}
                                    onChange={handleChange}
                                />

                                <div>                                    
                                    <input className='holiday'
                                        id='27'
                                        type="checkbox"
                                        name="holiday27"
                                        checked={checked.holiday27 || false}
                                        onChange={handleChange}
                                    />
                                </div>

                                <input 
                                    id='27'
                                    type="text"
                                    name="jobDescription27"
                                    value={description.jobDescription27 || ''}
                                    onChange={handleChange}
                                />

                                <input className='startA'
                                    id='27'
                                    type="time"
                                    name="startWorkA27"
                                    value={start.startWorkA27 || '00:00'}
                                    onChange={handleChange}
                                />

                                <input className='endA'
                                    id='27'
                                    type="time"
                                    name="endWorkA27"
                                    value={end.endWorkA27 || '00:00'}
                                    onChange={handleChange}
                                />

                                <input className='startB'
                                    id='27'
                                    type="time"
                                    name="startWorkB27"
                                    value={start.startWorkB27 || '00:00'}
                                    onChange={handleChange}
                                />

                                <input className='endB'
                                    id='27'
                                    type="time"
                                    name="endWorkB27"
                                    value={end.endWorkB27 || '00:00'}
                                    onChange={handleChange}
                                />
                            </div>

                            <div className='eachDay'>
                                <p className='date'>{hours.days[28].dayNumber || '----------------------'}</p>

                                <input 
                                    id='28'
                                    type="date"
                                    name="day28"
                                    value={day.day28 || ''}
                                    onChange={handleChange}
                                />

                                <div>                                    
                                    <input className='holiday'
                                        id='28'
                                        type="checkbox"
                                        name="holiday28"
                                        checked={checked.holiday28 || false}
                                        onChange={handleChange}
                                    />
                                </div>

                                <input 
                                    id='28'
                                    type="text"
                                    name="jobDescription28"
                                    value={description.jobDescription28 || ''}
                                    onChange={handleChange}
                                />

                                <input className='startA'
                                    id='28'
                                    type="time"
                                    name="startWorkA28"
                                    value={start.startWorkA28 || '00:00'}
                                    onChange={handleChange}
                                />

                                <input className='endA'
                                    id='28'
                                    type="time"
                                    name="endWorkA28"
                                    value={end.endWorkA28 || '00:00'}
                                    onChange={handleChange}
                                />

                                <input className='startB'
                                    id='28'
                                    type="time"
                                    name="startWorkB28"
                                    value={start.startWorkB28 || '00:00'}
                                    onChange={handleChange}
                                />

                                <input className='endB'
                                    id='28'
                                    type="time"
                                    name="endWorkB28"
                                    value={end.endWorkB28 || '00:00'}
                                    onChange={handleChange}
                                />
                            </div>

                            <div className='eachDay'>
                                <p className='date'>{hours.days[29].dayNumber || '----------------------'}</p>

                                <input 
                                    id='29'
                                    type="date"
                                    name="day29"
                                    value={day.day29 || ''}
                                    onChange={handleChange}
                                />

                                <div>                                    
                                    <input className='holiday'
                                        id='29'
                                        type="checkbox"
                                        name="holiday29"
                                        checked={checked.holiday29 || false}
                                        onChange={handleChange}
                                    />
                                </div>

                                <input 
                                    id='29'
                                    type="text"
                                    name="jobDescription29"
                                    value={description.jobDescription29 || ''}
                                    onChange={handleChange}
                                />

                                <input className='startA'
                                    id='29'
                                    type="time"
                                    name="startWorkA29"
                                    value={start.startWorkA29 || '00:00'}
                                    onChange={handleChange}
                                />

                                <input className='endA'
                                    id='29'
                                    type="time"
                                    name="endWorkA29"
                                    value={end.endWorkA29 || '00:00'}
                                    onChange={handleChange}
                                />

                                <input className='startB'
                                    id='29'
                                    type="time"
                                    name="startWorkB29"
                                    value={start.startWorkB29 || '00:00'}
                                    onChange={handleChange}
                                />

                                <input className='endB'
                                    id='29'
                                    type="time"
                                    name="endWorkB29"
                                    value={end.endWorkB29 || '00:00'}
                                    onChange={handleChange}
                                />
                            </div>

                            <div className='eachDay'>
                                <p className='date'>{hours.days[30].dayNumber || '----------------------'}</p>

                                <input 
                                    id='30'
                                    type="date"
                                    name="day30"
                                    value={day.day30 || ''}
                                    onChange={handleChange}
                                />

                                <div>                                    
                                    <input className='holiday'
                                        id='30'
                                        type="checkbox"
                                        name="holiday30"
                                        checked={checked.holiday30 || false}
                                        onChange={handleChange}
                                    />
                                </div>

                                <input 
                                    id='30'
                                    type="text"
                                    name="jobDescription30"
                                    value={description.jobDescription30 || ''}
                                    onChange={handleChange}
                                />

                                <input className='startA'
                                    id='30'
                                    type="time"
                                    name="startWorkA30"
                                    value={start.startWorkA30 || '00:00'}
                                    onChange={handleChange}
                                />

                                <input className='endA'
                                    id='30'
                                    type="time"
                                    name="endWorkA30"
                                    value={end.endWorkA30 || '00:00'}
                                    onChange={handleChange}
                                />

                                <input className='startB'
                                    id='30'
                                    type="time"
                                    name="startWorkB30"
                                    value={start.startWorkB30 || '00:00'}
                                    onChange={handleChange}
                                />

                                <input className='endB'
                                    id='30'
                                    type="time"
                                    name="endWorkB30"
                                    value={end.endWorkB30 || '00:00'}
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
                                        name="startWorkA"
                                        value={inputs.startWorkA || ''}
                                        onChange={handleChange}
                                    />
                                    <input className='finishright'
                                        id={day.dayNumber}
                                        type="time"
                                        name="endWorkA"
                                        value={inputs.endWorkA || ''}
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