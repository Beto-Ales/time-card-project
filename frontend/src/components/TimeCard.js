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
            if (user.username !== 'beto') {
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

        // const normal = hours.days.map(day => day.totalHours && day.totalHours.normal)
        // const special = hours.days.map(day => day.totalHours && day.totalHours.special)
        // const total = hours.days.map(day => day.totalHours && day.totalHours.total)
        // const allNormal = normal.filter(value => value !== undefined ).reduce((a,b) => a+b)
        // const allSpecial = special.filter(value => value !== undefined ).reduce((a,b) => a+b)
        // const allTotal = total.filter(value => value !== undefined ).reduce((a,b) => a+b)        
        // console.log('allNormal', allNormal)

  

  return (
    <div>
      <h1>{hours.month.toUpperCase()}</h1>
      <button className='screenBtn' onClick={() => toScreen('1')} >Back</button>
        <button className='screenBtn' onClick={() => toScreen('4')} >Edit</button>
      
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
        
        const [inputs, setInputs] = useState({})        
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

            // check if it works
            if(startTime === endTime) {
                start = 0
                end = 0
            }
            
            let total = end - start
            
            if (end > 18) {
                special = end - 18
                normal = 18 - start
            }else {
                normal = total
            }

            normal = normal % 1 !== 0 ? normal.toFixed(1) : normal
            special = special % 1 !== 0 ? special.toFixed(1) : special
            total = total % 1 !== 0 ? total.toFixed(1) : total

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
                startWork0,
                startWork1,
                startWork2,
                startWork3,
                startWork4,
                startWork5,
                startWork6,
                startWork7,
                startWork8,
                startWork9,
                startWork10,
                startWork11,
                startWork12,
                startWork13,
                startWork14,
                startWork15,
                startWork16,
                startWork17,
                startWork18,
                startWork19,
                startWork20,
                startWork21,
                startWork22,
                startWork23,
                startWork24,
                startWork25,
                startWork26,
                startWork27,
                startWork28,
                startWork29,
                startWork30,
                
            } = start

            const {
                endWork0,
                endWork1,
                endWork2,
                endWork3,
                endWork4,
                endWork5,
                endWork6,
                endWork7,
                endWork8,
                endWork9,
                endWork10,
                endWork11,
                endWork12,
                endWork13,
                endWork14,
                endWork15,
                endWork16,
                endWork17,
                endWork18,
                endWork19,
                endWork20,
                endWork21,
                endWork22,
                endWork23,
                endWork24,
                endWork25,
                endWork26,
                endWork27,
                endWork28,
                endWork29,
                endWork30,
                
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
            
            // if startWork is not defined, leave default value time 00:00
            hours.days[0].startWork = startWork0 ? startWork0 : '00:00'
            hours.days[1].startWork = startWork1 ? startWork1 : '00:00'
            hours.days[2].startWork = startWork2 ? startWork2 : '00:00'
            hours.days[3].startWork = startWork3 ? startWork3 : '00:00'
            hours.days[4].startWork = startWork4 ? startWork4 : '00:00'
            hours.days[5].startWork = startWork5 ? startWork5 : '00:00'
            hours.days[6].startWork = startWork6 ? startWork6 : '00:00'
            hours.days[7].startWork = startWork7 ? startWork7 : '00:00'
            hours.days[8].startWork = startWork8 ? startWork8 : '00:00'
            hours.days[9].startWork = startWork9 ? startWork9 : '00:00'
            hours.days[10].startWork = startWork10 ? startWork10 : '00:00'
            hours.days[11].startWork = startWork11 ? startWork11 : '00:00'
            hours.days[12].startWork = startWork12 ? startWork12 : '00:00'
            hours.days[13].startWork = startWork13 ? startWork13 : '00:00'
            hours.days[14].startWork = startWork14 ? startWork14 : '00:00'
            hours.days[15].startWork = startWork15 ? startWork15 : '00:00'
            hours.days[16].startWork = startWork16 ? startWork16 : '00:00'
            hours.days[17].startWork = startWork17 ? startWork17 : '00:00'
            hours.days[18].startWork = startWork18 ? startWork18 : '00:00'
            hours.days[19].startWork = startWork19 ? startWork19 : '00:00'
            hours.days[20].startWork = startWork20 ? startWork20 : '00:00'
            hours.days[21].startWork = startWork21 ? startWork21 : '00:00'
            hours.days[22].startWork = startWork22 ? startWork22 : '00:00'
            hours.days[23].startWork = startWork23 ? startWork23 : '00:00'
            hours.days[24].startWork = startWork24 ? startWork24 : '00:00'
            hours.days[25].startWork = startWork25 ? startWork25 : '00:00'
            hours.days[26].startWork = startWork26 ? startWork26 : '00:00'
            hours.days[27].startWork = startWork27 ? startWork27 : '00:00'
            hours.days[28].startWork = startWork28 ? startWork28 : '00:00'
            hours.days[29].startWork = startWork29 ? startWork29 : '00:00'
            hours.days[30].startWork = startWork30 ? startWork30 : '00:00'
            
            // if endWork is not defined, leave default value time 00:00
            hours.days[0].endWork = endWork0 ? endWork0 : '00:00'
            hours.days[1].endWork = endWork1 ? endWork1 : '00:00'
            hours.days[2].endWork = endWork2 ? endWork2 : '00:00'
            hours.days[3].endWork = endWork3 ? endWork3 : '00:00'
            hours.days[4].endWork = endWork4 ? endWork4 : '00:00'
            hours.days[5].endWork = endWork5 ? endWork5 : '00:00'
            hours.days[6].endWork = endWork6 ? endWork6 : '00:00'
            hours.days[7].endWork = endWork7 ? endWork7 : '00:00'
            hours.days[8].endWork = endWork8 ? endWork8 : '00:00'
            hours.days[9].endWork = endWork9 ? endWork9 : '00:00'
            hours.days[10].endWork = endWork10 ? endWork10 : '00:00'
            hours.days[11].endWork = endWork11 ? endWork11 : '00:00'
            hours.days[12].endWork = endWork12 ? endWork12 : '00:00'
            hours.days[13].endWork = endWork13 ? endWork13 : '00:00'
            hours.days[14].endWork = endWork14 ? endWork14 : '00:00'
            hours.days[15].endWork = endWork15 ? endWork15 : '00:00'
            hours.days[16].endWork = endWork16 ? endWork16 : '00:00'
            hours.days[17].endWork = endWork17 ? endWork17 : '00:00'
            hours.days[18].endWork = endWork18 ? endWork18 : '00:00'
            hours.days[19].endWork = endWork19 ? endWork19 : '00:00'
            hours.days[20].endWork = endWork20 ? endWork20 : '00:00'
            hours.days[21].endWork = endWork21 ? endWork21 : '00:00'
            hours.days[22].endWork = endWork22 ? endWork22 : '00:00'
            hours.days[23].endWork = endWork23 ? endWork23 : '00:00'
            hours.days[24].endWork = endWork24 ? endWork24 : '00:00'
            hours.days[25].endWork = endWork25 ? endWork25 : '00:00'
            hours.days[26].endWork = endWork26 ? endWork26 : '00:00'
            hours.days[27].endWork = endWork27 ? endWork27 : '00:00'
            hours.days[28].endWork = endWork28 ? endWork28 : '00:00'
            hours.days[29].endWork = endWork29 ? endWork29 : '00:00'
            hours.days[30].endWork = endWork30 ? endWork30 : '00:00'
            
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

            // hours.days[0].totalHours = JSON.stringify(calculate(timeToDecimal(startWork0), timeToDecimal(endWork0)))

            // hours.days[0].totalHours = startWork0 && endWork0 && calculate(timeToDecimal(startWork0), timeToDecimal(endWork0))            
            // hours.days[1].totalHours = startWork1 && endWork1 && calculate(timeToDecimal(startWork1), timeToDecimal(endWork1))
            // hours.days[2].totalHours = startWork2 && endWork2 && calculate(timeToDecimal(startWork2), timeToDecimal(endWork2))
            // hours.days[3].totalHours = startWork3 && endWork3 && calculate(timeToDecimal(startWork3), timeToDecimal(endWork3))
            // hours.days[4].totalHours = startWork4 && endWork4 && calculate(timeToDecimal(startWork4), timeToDecimal(endWork4))
            // hours.days[5].totalHours = startWork5 && endWork5 && calculate(timeToDecimal(startWork5), timeToDecimal(endWork5))
            // hours.days[6].totalHours = startWork6 && endWork6 && calculate(timeToDecimal(startWork6), timeToDecimal(endWork6))
            // hours.days[7].totalHours = startWork7 && endWork7 && calculate(timeToDecimal(startWork7), timeToDecimal(endWork7))
            // hours.days[8].totalHours = startWork8 && endWork8 && calculate(timeToDecimal(startWork8), timeToDecimal(endWork8))
            // hours.days[9].totalHours = startWork9 && endWork9 && calculate(timeToDecimal(startWork9), timeToDecimal(endWork9))
            // hours.days[10].totalHours = startWork10 && endWork10 && calculate(timeToDecimal(startWork10), timeToDecimal(endWork10))
            // hours.days[11].totalHours = startWork11 && endWork11 && calculate(timeToDecimal(startWork11), timeToDecimal(endWork11))
            // hours.days[12].totalHours = startWork12 && endWork12 && calculate(timeToDecimal(startWork12), timeToDecimal(endWork12))
            // hours.days[13].totalHours = startWork13 && endWork13 && calculate(timeToDecimal(startWork13), timeToDecimal(endWork13))
            // hours.days[14].totalHours = startWork14 && endWork14 && calculate(timeToDecimal(startWork14), timeToDecimal(endWork14))
            // hours.days[15].totalHours = startWork15 && endWork15 && calculate(timeToDecimal(startWork15), timeToDecimal(endWork15))
            // hours.days[16].totalHours = startWork16 && endWork16 && calculate(timeToDecimal(startWork16), timeToDecimal(endWork16))
            // hours.days[17].totalHours = startWork17 && endWork17 && calculate(timeToDecimal(startWork17), timeToDecimal(endWork17))
            // hours.days[18].totalHours = startWork18 && endWork18 && calculate(timeToDecimal(startWork18), timeToDecimal(endWork18))
            // hours.days[19].totalHours = startWork19 && endWork19 && calculate(timeToDecimal(startWork19), timeToDecimal(endWork19))
            // hours.days[20].totalHours = startWork20 && endWork20 && calculate(timeToDecimal(startWork20), timeToDecimal(endWork20))
            // hours.days[21].totalHours = startWork21 && endWork21 && calculate(timeToDecimal(startWork21), timeToDecimal(endWork21))
            // hours.days[22].totalHours = startWork22 && endWork22 && calculate(timeToDecimal(startWork22), timeToDecimal(endWork22))
            // hours.days[23].totalHours = startWork23 && endWork23 && calculate(timeToDecimal(startWork23), timeToDecimal(endWork23))
            // hours.days[24].totalHours = startWork24 && endWork24 && calculate(timeToDecimal(startWork24), timeToDecimal(endWork24))
            // hours.days[25].totalHours = startWork25 && endWork25 && calculate(timeToDecimal(startWork25), timeToDecimal(endWork25))
            // hours.days[26].totalHours = startWork26 && endWork26 && calculate(timeToDecimal(startWork26), timeToDecimal(endWork26))
            // hours.days[27].totalHours = startWork27 && endWork27 && calculate(timeToDecimal(startWork27), timeToDecimal(endWork27))
            // hours.days[28].totalHours = startWork28 && endWork28 && calculate(timeToDecimal(startWork28), timeToDecimal(endWork28))
            // hours.days[29].totalHours = startWork29 && endWork29 && calculate(timeToDecimal(startWork29), timeToDecimal(endWork29))
            // hours.days[30].totalHours = startWork30 && endWork30 && calculate(timeToDecimal(startWork30), timeToDecimal(endWork30))

            // use default value time 00:00
            hours.days[0].totalHours = calculate(timeToDecimal(hours.days[0].startWork), timeToDecimal(hours.days[0].endWork))
            hours.days[1].totalHours = calculate(timeToDecimal(hours.days[1].startWork), timeToDecimal(hours.days[1].endWork))
            hours.days[2].totalHours = calculate(timeToDecimal(hours.days[2].startWork), timeToDecimal(hours.days[2].endWork))
            hours.days[3].totalHours = calculate(timeToDecimal(hours.days[3].startWork), timeToDecimal(hours.days[3].endWork))
            hours.days[4].totalHours = calculate(timeToDecimal(hours.days[4].startWork), timeToDecimal(hours.days[4].endWork))
            hours.days[5].totalHours = calculate(timeToDecimal(hours.days[5].startWork), timeToDecimal(hours.days[5].endWork))
            hours.days[6].totalHours = calculate(timeToDecimal(hours.days[6].startWork), timeToDecimal(hours.days[6].endWork))
            hours.days[7].totalHours = calculate(timeToDecimal(hours.days[7].startWork), timeToDecimal(hours.days[7].endWork))
            hours.days[8].totalHours = calculate(timeToDecimal(hours.days[8].startWork), timeToDecimal(hours.days[8].endWork))
            hours.days[9].totalHours = calculate(timeToDecimal(hours.days[9].startWork), timeToDecimal(hours.days[9].endWork))
            hours.days[10].totalHours = calculate(timeToDecimal(hours.days[10].startWork), timeToDecimal(hours.days[10].endWork))
            hours.days[11].totalHours = calculate(timeToDecimal(hours.days[11].startWork), timeToDecimal(hours.days[11].endWork))
            hours.days[12].totalHours = calculate(timeToDecimal(hours.days[12].startWork), timeToDecimal(hours.days[12].endWork))
            hours.days[13].totalHours = calculate(timeToDecimal(hours.days[13].startWork), timeToDecimal(hours.days[13].endWork))
            hours.days[14].totalHours = calculate(timeToDecimal(hours.days[14].startWork), timeToDecimal(hours.days[14].endWork))
            hours.days[15].totalHours = calculate(timeToDecimal(hours.days[15].startWork), timeToDecimal(hours.days[15].endWork))
            hours.days[16].totalHours = calculate(timeToDecimal(hours.days[16].startWork), timeToDecimal(hours.days[16].endWork))
            hours.days[17].totalHours = calculate(timeToDecimal(hours.days[17].startWork), timeToDecimal(hours.days[17].endWork))
            hours.days[18].totalHours = calculate(timeToDecimal(hours.days[18].startWork), timeToDecimal(hours.days[18].endWork))
            hours.days[19].totalHours = calculate(timeToDecimal(hours.days[19].startWork), timeToDecimal(hours.days[19].endWork))
            hours.days[20].totalHours = calculate(timeToDecimal(hours.days[20].startWork), timeToDecimal(hours.days[20].endWork))
            hours.days[21].totalHours = calculate(timeToDecimal(hours.days[21].startWork), timeToDecimal(hours.days[21].endWork))
            hours.days[22].totalHours = calculate(timeToDecimal(hours.days[22].startWork), timeToDecimal(hours.days[22].endWork))
            hours.days[23].totalHours = calculate(timeToDecimal(hours.days[23].startWork), timeToDecimal(hours.days[23].endWork))
            hours.days[24].totalHours = calculate(timeToDecimal(hours.days[24].startWork), timeToDecimal(hours.days[24].endWork))
            hours.days[25].totalHours = calculate(timeToDecimal(hours.days[25].startWork), timeToDecimal(hours.days[25].endWork))
            hours.days[26].totalHours = calculate(timeToDecimal(hours.days[26].startWork), timeToDecimal(hours.days[26].endWork))
            hours.days[27].totalHours = calculate(timeToDecimal(hours.days[27].startWork), timeToDecimal(hours.days[27].endWork))
            hours.days[28].totalHours = calculate(timeToDecimal(hours.days[28].startWork), timeToDecimal(hours.days[28].endWork))
            hours.days[29].totalHours = calculate(timeToDecimal(hours.days[29].startWork), timeToDecimal(hours.days[29].endWork))
            hours.days[30].totalHours = calculate(timeToDecimal(hours.days[30].startWork), timeToDecimal(hours.days[30].endWork))
                        

            const normal = hours.days.map(day => day.totalHours && day.totalHours.normal)
            const special = hours.days.map(day => day.totalHours && day.totalHours.special)
            const total = hours.days.map(day => day.totalHours && day.totalHours.total)
            const allNormal = normal.filter(value => value !== undefined ).reduce((a,b) => a+b)
            const allSpecial = special.filter(value => value !== undefined ).reduce((a,b) => a+b)
            const allTotal = total.filter(value => value !== undefined ).reduce((a,b) => a+b)

            let numallNormal = allNormal % 1 !== 0 ? parseFloat(allNormal).toFixed(1) : allNormal
            let numallSpecial = allSpecial % 1 !== 0 ? parseFloat(allSpecial).toFixed(1) : allSpecial
            let numallTotal = allTotal % 1 !== 0 ? parseFloat(allTotal).toFixed(1) : allTotal

            hours.monthHours = {
                totalHours: numallTotal,
                normalRate: numallNormal,
                specialRate: numallSpecial,
            }

            hours.month = inputs.month
            
            await hoursService
              .create(hours)
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
                        
                            <div className='timeCardHeader'>
                                <p className='left'>DATE</p>
                                <p className='left'>JOB DESCRIPTION</p>
                                <p className='left'>START</p>
                                <p className='left'>FINISH</p>
                                {/* <p className='left'>TOTAL HOURS/TIMER</p> */}
                            </div>

                            <div className='eachDay'>
                                <p>{days[0].dayNumber}</p>

                                <input 
                                    id='0'
                                    type="text"
                                    name="jobDescription0"
                                    value={description.jobDescription0 || ''}
                                    onChange={handleChange}
                                />

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

                                {/* <p>{ start.startWork0 !== end.endWork0 &&
                                    JSON.stringify(calculate(timeToDecimal(start.startWork0), timeToDecimal(end.endWork0))) }</p> */}
                            </div>

                            <div className='eachDay'>
                                <p>{days[1].dayNumber}</p>

                                <input 
                                    id='1'
                                    type="text"
                                    name="jobDescription1"
                                    value={description.jobDescription1 || ''}
                                    onChange={handleChange}
                                />

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
                            </div>

                            <div className='eachDay'>
                                <p>{days[2].dayNumber}</p>

                                <input 
                                    id='2'
                                    type="text"
                                    name="jobDescription2"
                                    value={description.jobDescription2 || ''}
                                    onChange={handleChange}
                                />

                                <input 
                                    id='2'
                                    type="time"
                                    name="startWork2"
                                    value={start.startWork2 || '00:00'}
                                    onChange={handleChange}
                                />

                                <input 
                                    id='2'
                                    type="time"
                                    name="endWork2"
                                    value={end.endWork2 || '00:00'}
                                    onChange={handleChange}
                                />
                            </div>

                            <div className='eachDay'>
                                <p>{days[3].dayNumber}</p>

                                <input 
                                    id='3'
                                    type="text"
                                    name="jobDescription3"
                                    value={description.jobDescription3 || ''}
                                    onChange={handleChange}
                                />

                                <input 
                                    id='3'
                                    type="time"
                                    name="startWork3"
                                    value={start.startWork3 || '00:00'}
                                    onChange={handleChange}
                                />

                                <input 
                                    id='3'
                                    type="time"
                                    name="endWork3"
                                    value={end.endWork3 || '00:00'}
                                    onChange={handleChange}
                                />
                            </div>

                            <div className='eachDay'>
                                <p>{days[4].dayNumber}</p>

                                <input 
                                    id='4'
                                    type="text"
                                    name="jobDescription4"
                                    value={description.jobDescription4 || ''}
                                    onChange={handleChange}
                                />

                                <input 
                                    id='4'
                                    type="time"
                                    name="startWork4"
                                    value={start.startWork4 || '00:00'}
                                    onChange={handleChange}
                                />

                                <input 
                                    id='4'
                                    type="time"
                                    name="endWork4"
                                    value={end.endWork4 || '00:00'}
                                    onChange={handleChange}
                                />
                            </div>

                            <div className='eachDay'>
                                <p>{days[5].dayNumber}</p>

                                <input 
                                    id='5'
                                    type="text"
                                    name="jobDescription5"
                                    value={description.jobDescription5 || ''}
                                    onChange={handleChange}
                                />

                                <input 
                                    id='5'
                                    type="time"
                                    name="startWork5"
                                    value={start.startWork5 || '00:00'}
                                    onChange={handleChange}
                                />

                                <input 
                                    id='5'
                                    type="time"
                                    name="endWork5"
                                    value={end.endWork5 || '00:00'}
                                    onChange={handleChange}
                                />
                            </div>

                            <div className='eachDay'>
                                <p>{days[6].dayNumber}</p>

                                <input 
                                    id='6'
                                    type="text"
                                    name="jobDescription6"
                                    value={description.jobDescription6 || ''}
                                    onChange={handleChange}
                                />

                                <input 
                                    id='6'
                                    type="time"
                                    name="startWork6"
                                    value={start.startWork6 || '00:00'}
                                    onChange={handleChange}
                                />

                                <input 
                                    id='6'
                                    type="time"
                                    name="endWork6"
                                    value={end.endWork6 || '00:00'}
                                    onChange={handleChange}
                                />
                            </div>

                            <div className='eachDay'>
                                <p>{days[7].dayNumber}</p>

                                <input 
                                    id='7'
                                    type="text"
                                    name="jobDescription7"
                                    value={description.jobDescription7 || ''}
                                    onChange={handleChange}
                                />

                                <input 
                                    id='7'
                                    type="time"
                                    name="startWork7"
                                    value={start.startWork7 || '00:00'}
                                    onChange={handleChange}
                                />

                                <input 
                                    id='7'
                                    type="time"
                                    name="endWork7"
                                    value={end.endWork7 || '00:00'}
                                    onChange={handleChange}
                                />
                            </div>

                            <div className='eachDay'>
                                <p>{days[8].dayNumber}</p>

                                <input 
                                    id='8'
                                    type="text"
                                    name="jobDescription8"
                                    value={description.jobDescription8 || ''}
                                    onChange={handleChange}
                                />

                                <input 
                                    id='8'
                                    type="time"
                                    name="startWork8"
                                    value={start.startWork8 || '00:00'}
                                    onChange={handleChange}
                                />

                                <input 
                                    id='8'
                                    type="time"
                                    name="endWork8"
                                    value={end.endWork8 || '00:00'}
                                    onChange={handleChange}
                                />
                            </div>

                            <div className='eachDay'>
                                <p>{days[9].dayNumber}</p>

                                <input 
                                    id='9'
                                    type="text"
                                    name="jobDescription9"
                                    value={description.jobDescription9 || ''}
                                    onChange={handleChange}
                                />

                                <input 
                                    id='9'
                                    type="time"
                                    name="startWork9"
                                    value={start.startWork9 || '00:00'}
                                    onChange={handleChange}
                                />

                                <input 
                                    id='9'
                                    type="time"
                                    name="endWork9"
                                    value={end.endWork9 || '00:00'}
                                    onChange={handleChange}
                                />
                            </div>

                            <div className='eachDay'>
                                <p>{days[10].dayNumber}</p>

                                <input 
                                    id='10'
                                    type="text"
                                    name="jobDescription10"
                                    value={description.jobDescription10 || ''}
                                    onChange={handleChange}
                                />

                                <input 
                                    id='10'
                                    type="time"
                                    name="startWork10"
                                    value={start.startWork10 || '00:00'}
                                    onChange={handleChange}
                                />

                                <input 
                                    id='10'
                                    type="time"
                                    name="endWork10"
                                    value={end.endWork10 || '00:00'}
                                    onChange={handleChange}
                                />
                            </div>

                            <div className='eachDay'>
                                <p>{days[11].dayNumber}</p>

                                <input 
                                    id='11'
                                    type="text"
                                    name="jobDescription11"
                                    value={description.jobDescription11 || ''}
                                    onChange={handleChange}
                                />

                                <input 
                                    id='11'
                                    type="time"
                                    name="startWork11"
                                    value={start.startWork11 || '00:00'}
                                    onChange={handleChange}
                                />

                                <input 
                                    id='11'
                                    type="time"
                                    name="endWork11"
                                    value={end.endWork11 || '00:00'}
                                    onChange={handleChange}
                                />
                            </div>

                            <div className='eachDay'>
                                <p>{days[12].dayNumber}</p>

                                <input 
                                    id='12'
                                    type="text"
                                    name="jobDescription12"
                                    value={description.jobDescription12 || ''}
                                    onChange={handleChange}
                                />

                                <input 
                                    id='12'
                                    type="time"
                                    name="startWork12"
                                    value={start.startWork12 || '00:00'}
                                    onChange={handleChange}
                                />

                                <input 
                                    id='12'
                                    type="time"
                                    name="endWork12"
                                    value={end.endWork12 || '00:00'}
                                    onChange={handleChange}
                                />
                            </div>

                            <div className='eachDay'>
                                <p>{days[13].dayNumber}</p>

                                <input 
                                    id='13'
                                    type="text"
                                    name="jobDescription13"
                                    value={description.jobDescription13 || ''}
                                    onChange={handleChange}
                                />

                                <input 
                                    id='13'
                                    type="time"
                                    name="startWork13"
                                    value={start.startWork13 || '00:00'}
                                    onChange={handleChange}
                                />

                                <input 
                                    id='13'
                                    type="time"
                                    name="endWork13"
                                    value={end.endWork13 || '00:00'}
                                    onChange={handleChange}
                                />
                            </div>

                            <div className='eachDay'>
                                <p>{days[14].dayNumber}</p>

                                <input 
                                    id='14'
                                    type="text"
                                    name="jobDescription14"
                                    value={description.jobDescription14 || ''}
                                    onChange={handleChange}
                                />

                                <input 
                                    id='14'
                                    type="time"
                                    name="startWork14"
                                    value={start.startWork14 || '00:00'}
                                    onChange={handleChange}
                                />

                                <input 
                                    id='14'
                                    type="time"
                                    name="endWork14"
                                    value={end.endWork14 || '00:00'}
                                    onChange={handleChange}
                                />
                            </div>

                            <div className='eachDay'>
                                <p>{days[15].dayNumber}</p>

                                <input 
                                    id='15'
                                    type="text"
                                    name="jobDescription15"
                                    value={description.jobDescription15 || ''}
                                    onChange={handleChange}
                                />

                                <input 
                                    id='15'
                                    type="time"
                                    name="startWork15"
                                    value={start.startWork15 || '00:00'}
                                    onChange={handleChange}
                                />

                                <input 
                                    id='15'
                                    type="time"
                                    name="endWork15"
                                    value={end.endWork15 || '00:00'}
                                    onChange={handleChange}
                                />
                            </div>

                            <div className='eachDay'>
                                <p>{days[16].dayNumber}</p>

                                <input 
                                    id='16'
                                    type="text"
                                    name="jobDescription16"
                                    value={description.jobDescription16 || ''}
                                    onChange={handleChange}
                                />

                                <input 
                                    id='16'
                                    type="time"
                                    name="startWork16"
                                    value={start.startWork16 || '00:00'}
                                    onChange={handleChange}
                                />

                                <input 
                                    id='16'
                                    type="time"
                                    name="endWork16"
                                    value={end.endWork16 || '00:00'}
                                    onChange={handleChange}
                                />
                            </div>

                            <div className='eachDay'>
                                <p>{days[17].dayNumber}</p>

                                <input 
                                    id='17'
                                    type="text"
                                    name="jobDescription17"
                                    value={description.jobDescription17 || ''}
                                    onChange={handleChange}
                                />

                                <input 
                                    id='17'
                                    type="time"
                                    name="startWork17"
                                    value={start.startWork17 || '00:00'}
                                    onChange={handleChange}
                                />

                                <input 
                                    id='17'
                                    type="time"
                                    name="endWork17"
                                    value={end.endWork17 || '00:00'}
                                    onChange={handleChange}
                                />
                            </div>

                            <div className='eachDay'>
                                <p>{days[18].dayNumber}</p>

                                <input 
                                    id='18'
                                    type="text"
                                    name="jobDescription18"
                                    value={description.jobDescription18 || ''}
                                    onChange={handleChange}
                                />

                                <input 
                                    id='18'
                                    type="time"
                                    name="startWork18"
                                    value={start.startWork18 || '00:00'}
                                    onChange={handleChange}
                                />

                                <input 
                                    id='18'
                                    type="time"
                                    name="endWork18"
                                    value={end.endWork18 || '00:00'}
                                    onChange={handleChange}
                                />
                            </div>

                            <div className='eachDay'>
                                <p>{days[19].dayNumber}</p>

                                <input 
                                    id='19'
                                    type="text"
                                    name="jobDescription19"
                                    value={description.jobDescription19 || ''}
                                    onChange={handleChange}
                                />

                                <input 
                                    id='19'
                                    type="time"
                                    name="startWork19"
                                    value={start.startWork19 || '00:00'}
                                    onChange={handleChange}
                                />

                                <input 
                                    id='19'
                                    type="time"
                                    name="endWork19"
                                    value={end.endWork19 || '00:00'}
                                    onChange={handleChange}
                                />
                            </div>

                            <div className='eachDay'>
                                <p>{days[20].dayNumber}</p>

                                <input 
                                    id='20'
                                    type="text"
                                    name="jobDescription20"
                                    value={description.jobDescription20 || ''}
                                    onChange={handleChange}
                                />

                                <input 
                                    id='20'
                                    type="time"
                                    name="startWork20"
                                    value={start.startWork20 || '00:00'}
                                    onChange={handleChange}
                                />

                                <input 
                                    id='20'
                                    type="time"
                                    name="endWork20"
                                    value={end.endWork20 || '00:00'}
                                    onChange={handleChange}
                                />
                            </div>

                            <div className='eachDay'>
                                <p>{days[21].dayNumber}</p>

                                <input 
                                    id='21'
                                    type="text"
                                    name="jobDescription21"
                                    value={description.jobDescription21 || ''}
                                    onChange={handleChange}
                                />

                                <input 
                                    id='21'
                                    type="time"
                                    name="startWork21"
                                    value={start.startWork21 || '00:00'}
                                    onChange={handleChange}
                                />

                                <input 
                                    id='21'
                                    type="time"
                                    name="endWork21"
                                    value={end.endWork21 || '00:00'}
                                    onChange={handleChange}
                                />
                            </div>

                            <div className='eachDay'>
                                <p>{days[22].dayNumber}</p>

                                <input 
                                    id='22'
                                    type="text"
                                    name="jobDescription22"
                                    value={description.jobDescription22 || ''}
                                    onChange={handleChange}
                                />

                                <input 
                                    id='22'
                                    type="time"
                                    name="startWork22"
                                    value={start.startWork22 || '00:00'}
                                    onChange={handleChange}
                                />

                                <input 
                                    id='22'
                                    type="time"
                                    name="endWork22"
                                    value={end.endWork22 || '00:00'}
                                    onChange={handleChange}
                                />
                            </div>

                            <div className='eachDay'>
                                <p>{days[23].dayNumber}</p>

                                <input 
                                    id='23'
                                    type="text"
                                    name="jobDescription23"
                                    value={description.jobDescription23 || ''}
                                    onChange={handleChange}
                                />

                                <input 
                                    id='23'
                                    type="time"
                                    name="startWork23"
                                    value={start.startWork23 || '00:00'}
                                    onChange={handleChange}
                                />

                                <input 
                                    id='23'
                                    type="time"
                                    name="endWork23"
                                    value={end.endWork23 || '00:00'}
                                    onChange={handleChange}
                                />
                            </div>

                            <div className='eachDay'>
                                <p>{days[24].dayNumber}</p>

                                <input 
                                    id='24'
                                    type="text"
                                    name="jobDescription24"
                                    value={description.jobDescription24 || ''}
                                    onChange={handleChange}
                                />

                                <input 
                                    id='24'
                                    type="time"
                                    name="startWork24"
                                    value={start.startWork24 || '00:00'}
                                    onChange={handleChange}
                                />

                                <input 
                                    id='24'
                                    type="time"
                                    name="endWork24"
                                    value={end.endWork24 || '00:00'}
                                    onChange={handleChange}
                                />
                            </div>

                            <div className='eachDay'>
                                <p>{days[25].dayNumber}</p>

                                <input 
                                    id='25'
                                    type="text"
                                    name="jobDescription25"
                                    value={description.jobDescription25 || ''}
                                    onChange={handleChange}
                                />

                                <input 
                                    id='25'
                                    type="time"
                                    name="startWork25"
                                    value={start.startWork25 || '00:00'}
                                    onChange={handleChange}
                                />

                                <input 
                                    id='25'
                                    type="time"
                                    name="endWork25"
                                    value={end.endWork25 || '00:00'}
                                    onChange={handleChange}
                                />
                            </div>

                            <div className='eachDay'>
                                <p>{days[26].dayNumber}</p>

                                <input 
                                    id='26'
                                    type="text"
                                    name="jobDescription26"
                                    value={description.jobDescription26 || ''}
                                    onChange={handleChange}
                                />

                                <input 
                                    id='26'
                                    type="time"
                                    name="startWork26"
                                    value={start.startWork26 || '00:00'}
                                    onChange={handleChange}
                                />

                                <input 
                                    id='26'
                                    type="time"
                                    name="endWork26"
                                    value={end.endWork26 || '00:00'}
                                    onChange={handleChange}
                                />
                            </div>

                            <div className='eachDay'>
                                <p>{days[27].dayNumber}</p>

                                <input 
                                    id='27'
                                    type="text"
                                    name="jobDescription27"
                                    value={description.jobDescription27 || ''}
                                    onChange={handleChange}
                                />

                                <input 
                                    id='27'
                                    type="time"
                                    name="startWork27"
                                    value={start.startWork27 || '00:00'}
                                    onChange={handleChange}
                                />

                                <input 
                                    id='27'
                                    type="time"
                                    name="endWork27"
                                    value={end.endWork27 || '00:00'}
                                    onChange={handleChange}
                                />
                            </div>

                            <div className='eachDay'>
                                <p>{days[28].dayNumber}</p>

                                <input 
                                    id='28'
                                    type="text"
                                    name="jobDescription28"
                                    value={description.jobDescription28 || ''}
                                    onChange={handleChange}
                                />

                                <input 
                                    id='28'
                                    type="time"
                                    name="startWork28"
                                    value={start.startWork28 || '00:00'}
                                    onChange={handleChange}
                                />

                                <input 
                                    id='28'
                                    type="time"
                                    name="endWork28"
                                    value={end.endWork28 || '00:00'}
                                    onChange={handleChange}
                                />
                            </div>

                            <div className='eachDay'>
                                <p>{days[29].dayNumber}</p>

                                <input 
                                    id='29'
                                    type="text"
                                    name="jobDescription29"
                                    value={description.jobDescription29 || ''}
                                    onChange={handleChange}
                                />

                                <input 
                                    id='29'
                                    type="time"
                                    name="startWork29"
                                    value={start.startWork29 || '00:00'}
                                    onChange={handleChange}
                                />

                                <input 
                                    id='29'
                                    type="time"
                                    name="endWork29"
                                    value={end.endWork29 || '00:00'}
                                    onChange={handleChange}
                                />
                            </div>

                            <div className='eachDay'>
                                <p>{days[30].dayNumber}</p>

                                <input 
                                    id='30'
                                    type="text"
                                    name="jobDescription30"
                                    value={description.jobDescription30 || ''}
                                    onChange={handleChange}
                                />

                                <input 
                                    id='30'
                                    type="time"
                                    name="startWork30"
                                    value={start.startWork30 || '00:00'}
                                    onChange={handleChange}
                                />

                                <input 
                                    id='30'
                                    type="time"
                                    name="endWork30"
                                    value={end.endWork30 || '00:00'}
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
            startWork0: hoursToUpdate.days[0].startWork,
            startWork1: hoursToUpdate.days[1].startWork,
            startWork2: hoursToUpdate.days[2].startWork,
            startWork3: hoursToUpdate.days[3].startWork,
            startWork4: hoursToUpdate.days[4].startWork,
            startWork5: hoursToUpdate.days[5].startWork,
            startWork6: hoursToUpdate.days[6].startWork,
            startWork7: hoursToUpdate.days[7].startWork,
            startWork8: hoursToUpdate.days[8].startWork,
            startWork9: hoursToUpdate.days[9].startWork,
            startWork10: hoursToUpdate.days[10].startWork,
            startWork11: hoursToUpdate.days[11].startWork,
            startWork12: hoursToUpdate.days[12].startWork,
            startWork13: hoursToUpdate.days[13].startWork,
            startWork14: hoursToUpdate.days[14].startWork,
            startWork15: hoursToUpdate.days[15].startWork,
            startWork16: hoursToUpdate.days[16].startWork,
            startWork17: hoursToUpdate.days[17].startWork,
            startWork18: hoursToUpdate.days[18].startWork,
            startWork19: hoursToUpdate.days[19].startWork,
            startWork20: hoursToUpdate.days[20].startWork,
            startWork21: hoursToUpdate.days[21].startWork,
            startWork22: hoursToUpdate.days[22].startWork,
            startWork23: hoursToUpdate.days[23].startWork,
            startWork24: hoursToUpdate.days[24].startWork,
            startWork25: hoursToUpdate.days[25].startWork,
            startWork26: hoursToUpdate.days[26].startWork,
            startWork27: hoursToUpdate.days[27].startWork,
            startWork28: hoursToUpdate.days[28].startWork,
            startWork29: hoursToUpdate.days[29].startWork,
            startWork30: hoursToUpdate.days[30].startWork,
        })
        const [end, setEnd] = useState({
            endWork0: hoursToUpdate.days[0].endWork,
            endWork1: hoursToUpdate.days[1].endWork,
            endWork2: hoursToUpdate.days[2].endWork,
            endWork3: hoursToUpdate.days[3].endWork,
            endWork4: hoursToUpdate.days[4].endWork,
            endWork5: hoursToUpdate.days[5].endWork,
            endWork6: hoursToUpdate.days[6].endWork,
            endWork7: hoursToUpdate.days[7].endWork,
            endWork8: hoursToUpdate.days[8].endWork,
            endWork9: hoursToUpdate.days[9].endWork,
            endWork10: hoursToUpdate.days[10].endWork,
            endWork11: hoursToUpdate.days[11].endWork,
            endWork12: hoursToUpdate.days[12].endWork,
            endWork13: hoursToUpdate.days[13].endWork,
            endWork14: hoursToUpdate.days[14].endWork,
            endWork15: hoursToUpdate.days[15].endWork,
            endWork16: hoursToUpdate.days[16].endWork,
            endWork17: hoursToUpdate.days[17].endWork,
            endWork18: hoursToUpdate.days[18].endWork,
            endWork19: hoursToUpdate.days[19].endWork,
            endWork20: hoursToUpdate.days[20].endWork,
            endWork21: hoursToUpdate.days[21].endWork,
            endWork22: hoursToUpdate.days[22].endWork,
            endWork23: hoursToUpdate.days[23].endWork,
            endWork24: hoursToUpdate.days[24].endWork,
            endWork25: hoursToUpdate.days[25].endWork,
            endWork26: hoursToUpdate.days[26].endWork,
            endWork27: hoursToUpdate.days[27].endWork,
            endWork28: hoursToUpdate.days[28].endWork,
            endWork29: hoursToUpdate.days[29].endWork,
            endWork30: hoursToUpdate.days[30].endWork,
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
        // const [days, setDays] = useState([])    // days is not defined
        // setDays(hoursToUpdate.days) // days is not defined
        
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

            // check if it works
            if(startTime === endTime) {
                start = 0
                end = 0
            }
            
            let total = end - start
            
            if (end > 18) {
                special = end - 18
                normal = 18 - start
            }else {
                normal = total
            }

            normal = normal % 1 !== 0 ? normal.toFixed(1) : normal
            special = special % 1 !== 0 ? special.toFixed(1) : special
            total = total % 1 !== 0 ? total.toFixed(1) : total

            return {                
                normal: normal,
                special: special,
                total: total
            }
        }

        // set the inputs with the time card details from state hoursToUpdate
        // doesn't work becouse every time set is called it rerender the component
        // use state default in declaration intead
        // setStart(values => ({...values,
        //         startWork0: hoursToUpdate.days[0].startWork,
        //         startWork1: hoursToUpdate.days[1].startWork,
        //         startWork2: hoursToUpdate.days[2].startWork,
        //         startWork3: hoursToUpdate.days[3].startWork,
        //         startWork4: hoursToUpdate.days[4].startWork,
        //         startWork5: hoursToUpdate.days[5].startWork,
        //         startWork6: hoursToUpdate.days[6].startWork,
        //         startWork7: hoursToUpdate.days[7].startWork,
        //         startWork8: hoursToUpdate.days[8].startWork,
        //         startWork9: hoursToUpdate.days[9].startWork,
        //         startWork10: hoursToUpdate.days[10].startWork,
        //         startWork11: hoursToUpdate.days[11].startWork,
        //         startWork12: hoursToUpdate.days[12].startWork,
        //         startWork13: hoursToUpdate.days[13].startWork,
        //         startWork14: hoursToUpdate.days[14].startWork,
        //         startWork15: hoursToUpdate.days[15].startWork,
        //         startWork16: hoursToUpdate.days[16].startWork,
        //         startWork17: hoursToUpdate.days[17].startWork,
        //         startWork18: hoursToUpdate.days[18].startWork,
        //         startWork19: hoursToUpdate.days[19].startWork,
        //         startWork20: hoursToUpdate.days[20].startWork,
        //         startWork21: hoursToUpdate.days[21].startWork,
        //         startWork22: hoursToUpdate.days[22].startWork,
        //         startWork23: hoursToUpdate.days[23].startWork,
        //         startWork24: hoursToUpdate.days[24].startWork,
        //         startWork25: hoursToUpdate.days[25].startWork,
        //         startWork26: hoursToUpdate.days[26].startWork,
        //         startWork27: hoursToUpdate.days[27].startWork,
        //         startWork28: hoursToUpdate.days[28].startWork,
        //         startWork29: hoursToUpdate.days[29].startWork,
        //         startWork30: hoursToUpdate.days[30].startWork,
        //     }))

            console.log(start)

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
                startWork0,
                startWork1,
                startWork2,
                startWork3,
                startWork4,
                startWork5,
                startWork6,
                startWork7,
                startWork8,
                startWork9,
                startWork10,
                startWork11,
                startWork12,
                startWork13,
                startWork14,
                startWork15,
                startWork16,
                startWork17,
                startWork18,
                startWork19,
                startWork20,
                startWork21,
                startWork22,
                startWork23,
                startWork24,
                startWork25,
                startWork26,
                startWork27,
                startWork28,
                startWork29,
                startWork30,
                
            } = start

            const {
                endWork0,
                endWork1,
                endWork2,
                endWork3,
                endWork4,
                endWork5,
                endWork6,
                endWork7,
                endWork8,
                endWork9,
                endWork10,
                endWork11,
                endWork12,
                endWork13,
                endWork14,
                endWork15,
                endWork16,
                endWork17,
                endWork18,
                endWork19,
                endWork20,
                endWork21,
                endWork22,
                endWork23,
                endWork24,
                endWork25,
                endWork26,
                endWork27,
                endWork28,
                endWork29,
                endWork30,
                
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
            
            // if startWork is not defined, leave default value time 00:00
            hoursToUpdate.days[0].startWork = startWork0 ? startWork0 : '00:00'
            hoursToUpdate.days[1].startWork = startWork1 ? startWork1 : '00:00'
            hoursToUpdate.days[2].startWork = startWork2 ? startWork2 : '00:00'
            hoursToUpdate.days[3].startWork = startWork3 ? startWork3 : '00:00'
            hoursToUpdate.days[4].startWork = startWork4 ? startWork4 : '00:00'
            hoursToUpdate.days[5].startWork = startWork5 ? startWork5 : '00:00'
            hoursToUpdate.days[6].startWork = startWork6 ? startWork6 : '00:00'
            hoursToUpdate.days[7].startWork = startWork7 ? startWork7 : '00:00'
            hoursToUpdate.days[8].startWork = startWork8 ? startWork8 : '00:00'
            hoursToUpdate.days[9].startWork = startWork9 ? startWork9 : '00:00'
            hoursToUpdate.days[10].startWork = startWork10 ? startWork10 : '00:00'
            hoursToUpdate.days[11].startWork = startWork11 ? startWork11 : '00:00'
            hoursToUpdate.days[12].startWork = startWork12 ? startWork12 : '00:00'
            hoursToUpdate.days[13].startWork = startWork13 ? startWork13 : '00:00'
            hoursToUpdate.days[14].startWork = startWork14 ? startWork14 : '00:00'
            hoursToUpdate.days[15].startWork = startWork15 ? startWork15 : '00:00'
            hoursToUpdate.days[16].startWork = startWork16 ? startWork16 : '00:00'
            hoursToUpdate.days[17].startWork = startWork17 ? startWork17 : '00:00'
            hoursToUpdate.days[18].startWork = startWork18 ? startWork18 : '00:00'
            hoursToUpdate.days[19].startWork = startWork19 ? startWork19 : '00:00'
            hoursToUpdate.days[20].startWork = startWork20 ? startWork20 : '00:00'
            hoursToUpdate.days[21].startWork = startWork21 ? startWork21 : '00:00'
            hoursToUpdate.days[22].startWork = startWork22 ? startWork22 : '00:00'
            hoursToUpdate.days[23].startWork = startWork23 ? startWork23 : '00:00'
            hoursToUpdate.days[24].startWork = startWork24 ? startWork24 : '00:00'
            hoursToUpdate.days[25].startWork = startWork25 ? startWork25 : '00:00'
            hoursToUpdate.days[26].startWork = startWork26 ? startWork26 : '00:00'
            hoursToUpdate.days[27].startWork = startWork27 ? startWork27 : '00:00'
            hoursToUpdate.days[28].startWork = startWork28 ? startWork28 : '00:00'
            hoursToUpdate.days[29].startWork = startWork29 ? startWork29 : '00:00'
            hoursToUpdate.days[30].startWork = startWork30 ? startWork30 : '00:00'
            
            // if endWork is not defined, leave default value time 00:00
            hoursToUpdate.days[0].endWork = endWork0 ? endWork0 : '00:00'
            hoursToUpdate.days[1].endWork = endWork1 ? endWork1 : '00:00'
            hoursToUpdate.days[2].endWork = endWork2 ? endWork2 : '00:00'
            hoursToUpdate.days[3].endWork = endWork3 ? endWork3 : '00:00'
            hoursToUpdate.days[4].endWork = endWork4 ? endWork4 : '00:00'
            hoursToUpdate.days[5].endWork = endWork5 ? endWork5 : '00:00'
            hoursToUpdate.days[6].endWork = endWork6 ? endWork6 : '00:00'
            hoursToUpdate.days[7].endWork = endWork7 ? endWork7 : '00:00'
            hoursToUpdate.days[8].endWork = endWork8 ? endWork8 : '00:00'
            hoursToUpdate.days[9].endWork = endWork9 ? endWork9 : '00:00'
            hoursToUpdate.days[10].endWork = endWork10 ? endWork10 : '00:00'
            hoursToUpdate.days[11].endWork = endWork11 ? endWork11 : '00:00'
            hoursToUpdate.days[12].endWork = endWork12 ? endWork12 : '00:00'
            hoursToUpdate.days[13].endWork = endWork13 ? endWork13 : '00:00'
            hoursToUpdate.days[14].endWork = endWork14 ? endWork14 : '00:00'
            hoursToUpdate.days[15].endWork = endWork15 ? endWork15 : '00:00'
            hoursToUpdate.days[16].endWork = endWork16 ? endWork16 : '00:00'
            hoursToUpdate.days[17].endWork = endWork17 ? endWork17 : '00:00'
            hoursToUpdate.days[18].endWork = endWork18 ? endWork18 : '00:00'
            hoursToUpdate.days[19].endWork = endWork19 ? endWork19 : '00:00'
            hoursToUpdate.days[20].endWork = endWork20 ? endWork20 : '00:00'
            hoursToUpdate.days[21].endWork = endWork21 ? endWork21 : '00:00'
            hoursToUpdate.days[22].endWork = endWork22 ? endWork22 : '00:00'
            hoursToUpdate.days[23].endWork = endWork23 ? endWork23 : '00:00'
            hoursToUpdate.days[24].endWork = endWork24 ? endWork24 : '00:00'
            hoursToUpdate.days[25].endWork = endWork25 ? endWork25 : '00:00'
            hoursToUpdate.days[26].endWork = endWork26 ? endWork26 : '00:00'
            hoursToUpdate.days[27].endWork = endWork27 ? endWork27 : '00:00'
            hoursToUpdate.days[28].endWork = endWork28 ? endWork28 : '00:00'
            hoursToUpdate.days[29].endWork = endWork29 ? endWork29 : '00:00'
            hoursToUpdate.days[30].endWork = endWork30 ? endWork30 : '00:00'
            
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

            // use default value time 00:00
            hoursToUpdate.days[0].totalHours = calculate(timeToDecimal(hoursToUpdate.days[0].startWork), timeToDecimal(hoursToUpdate.days[0].endWork))
            hoursToUpdate.days[1].totalHours = calculate(timeToDecimal(hoursToUpdate.days[1].startWork), timeToDecimal(hoursToUpdate.days[1].endWork))
            hoursToUpdate.days[2].totalHours = calculate(timeToDecimal(hoursToUpdate.days[2].startWork), timeToDecimal(hoursToUpdate.days[2].endWork))
            hoursToUpdate.days[3].totalHours = calculate(timeToDecimal(hoursToUpdate.days[3].startWork), timeToDecimal(hoursToUpdate.days[3].endWork))
            hoursToUpdate.days[4].totalHours = calculate(timeToDecimal(hoursToUpdate.days[4].startWork), timeToDecimal(hoursToUpdate.days[4].endWork))
            hoursToUpdate.days[5].totalHours = calculate(timeToDecimal(hoursToUpdate.days[5].startWork), timeToDecimal(hoursToUpdate.days[5].endWork))
            hoursToUpdate.days[6].totalHours = calculate(timeToDecimal(hoursToUpdate.days[6].startWork), timeToDecimal(hoursToUpdate.days[6].endWork))
            hoursToUpdate.days[7].totalHours = calculate(timeToDecimal(hoursToUpdate.days[7].startWork), timeToDecimal(hoursToUpdate.days[7].endWork))
            hoursToUpdate.days[8].totalHours = calculate(timeToDecimal(hoursToUpdate.days[8].startWork), timeToDecimal(hoursToUpdate.days[8].endWork))
            hoursToUpdate.days[9].totalHours = calculate(timeToDecimal(hoursToUpdate.days[9].startWork), timeToDecimal(hoursToUpdate.days[9].endWork))
            hoursToUpdate.days[10].totalHours = calculate(timeToDecimal(hoursToUpdate.days[10].startWork), timeToDecimal(hoursToUpdate.days[10].endWork))
            hoursToUpdate.days[11].totalHours = calculate(timeToDecimal(hoursToUpdate.days[11].startWork), timeToDecimal(hoursToUpdate.days[11].endWork))
            hoursToUpdate.days[12].totalHours = calculate(timeToDecimal(hoursToUpdate.days[12].startWork), timeToDecimal(hoursToUpdate.days[12].endWork))
            hoursToUpdate.days[13].totalHours = calculate(timeToDecimal(hoursToUpdate.days[13].startWork), timeToDecimal(hoursToUpdate.days[13].endWork))
            hoursToUpdate.days[14].totalHours = calculate(timeToDecimal(hoursToUpdate.days[14].startWork), timeToDecimal(hoursToUpdate.days[14].endWork))
            hoursToUpdate.days[15].totalHours = calculate(timeToDecimal(hoursToUpdate.days[15].startWork), timeToDecimal(hoursToUpdate.days[15].endWork))
            hoursToUpdate.days[16].totalHours = calculate(timeToDecimal(hoursToUpdate.days[16].startWork), timeToDecimal(hoursToUpdate.days[16].endWork))
            hoursToUpdate.days[17].totalHours = calculate(timeToDecimal(hoursToUpdate.days[17].startWork), timeToDecimal(hoursToUpdate.days[17].endWork))
            hoursToUpdate.days[18].totalHours = calculate(timeToDecimal(hoursToUpdate.days[18].startWork), timeToDecimal(hoursToUpdate.days[18].endWork))
            hoursToUpdate.days[19].totalHours = calculate(timeToDecimal(hoursToUpdate.days[19].startWork), timeToDecimal(hoursToUpdate.days[19].endWork))
            hoursToUpdate.days[20].totalHours = calculate(timeToDecimal(hoursToUpdate.days[20].startWork), timeToDecimal(hoursToUpdate.days[20].endWork))
            hoursToUpdate.days[21].totalHours = calculate(timeToDecimal(hoursToUpdate.days[21].startWork), timeToDecimal(hoursToUpdate.days[21].endWork))
            hoursToUpdate.days[22].totalHours = calculate(timeToDecimal(hoursToUpdate.days[22].startWork), timeToDecimal(hoursToUpdate.days[22].endWork))
            hoursToUpdate.days[23].totalHours = calculate(timeToDecimal(hoursToUpdate.days[23].startWork), timeToDecimal(hoursToUpdate.days[23].endWork))
            hoursToUpdate.days[24].totalHours = calculate(timeToDecimal(hoursToUpdate.days[24].startWork), timeToDecimal(hoursToUpdate.days[24].endWork))
            hoursToUpdate.days[25].totalHours = calculate(timeToDecimal(hoursToUpdate.days[25].startWork), timeToDecimal(hoursToUpdate.days[25].endWork))
            hoursToUpdate.days[26].totalHours = calculate(timeToDecimal(hoursToUpdate.days[26].startWork), timeToDecimal(hoursToUpdate.days[26].endWork))
            hoursToUpdate.days[27].totalHours = calculate(timeToDecimal(hoursToUpdate.days[27].startWork), timeToDecimal(hoursToUpdate.days[27].endWork))
            hoursToUpdate.days[28].totalHours = calculate(timeToDecimal(hoursToUpdate.days[28].startWork), timeToDecimal(hoursToUpdate.days[28].endWork))
            hoursToUpdate.days[29].totalHours = calculate(timeToDecimal(hoursToUpdate.days[29].startWork), timeToDecimal(hoursToUpdate.days[29].endWork))
            hoursToUpdate.days[30].totalHours = calculate(timeToDecimal(hoursToUpdate.days[30].startWork), timeToDecimal(hoursToUpdate.days[30].endWork))
            
          

            const normal = hoursToUpdate.days.map(day => day.totalHours && day.totalHours.normal)
            const special = hoursToUpdate.days.map(day => day.totalHours && day.totalHours.special)
            const total = hoursToUpdate.days.map(day => day.totalHours && day.totalHours.total)
            const allNormal = normal.filter(value => value !== undefined ).map(x => x = Number(x)).reduce((a,b) => a+b)
            const allSpecial = special.filter(value => value !== undefined ).map(x => x = Number(x)).reduce((a,b) => a+b)
            const allTotal = total.filter(value => value !== undefined ).map(x => x = Number(x)).reduce((a,b) => a+b)

            let numallNormal = allNormal % 1 !== 0 ? parseFloat(allNormal).toFixed(1) : allNormal
            let numallSpecial = allSpecial % 1 !== 0 ? parseFloat(allSpecial).toFixed(1) : allSpecial
            let numallTotal = allTotal % 1 !== 0 ? parseFloat(allTotal).toFixed(1) : allTotal

            hoursToUpdate.monthHours = {
                totalHours: numallTotal,
                normalRate: numallNormal,
                specialRate: numallSpecial,
            }

            console.log('normal', normal, 'allNormal', allNormal, 'numallNormal', numallNormal, 'hoursToUpdate.monthHours.normalRate', hoursToUpdate.monthHours.normalRate);
            

            

            hoursToUpdate.month = inputs.month
            
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
                
                <form onSubmit={addTimeCard}>
                <p>MONTH</p>
                <input
                    type="text"
                    name="month"
                    value={inputs.month || ''}
                    onChange={handleChange}
                />
                    <div className='timecard'>
                        
                            <div className='timeCardHeader'>
                                <p className='left'>DATE</p>
                                <p className='left'>JOB DESCRIPTION</p>
                                <p className='left'>START</p>
                                <p className='left'>FINISH</p>
                                {/* <p className='left'>TOTAL HOURS/TIMER</p> */}
                            </div>

                            <div className='eachDay'>
                                <p>{hours.days[0].dayNumber}</p>

                                <input 
                                    id='0'
                                    type="text"
                                    name="jobDescription0"
                                    value={description.jobDescription0 || ''}
                                    onChange={handleChange}
                                />

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
                                
                            </div>

                            <div className='eachDay'>
                                <p>{hours.days[1].dayNumber}</p>

                                <input 
                                    id='1'
                                    type="text"
                                    name="jobDescription1"
                                    value={description.jobDescription1 || ''}
                                    onChange={handleChange}
                                />

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
                            </div>

                            <div className='eachDay'>
                                <p>{hours.days[2].dayNumber}</p>

                                <input 
                                    id='2'
                                    type="text"
                                    name="jobDescription2"
                                    value={description.jobDescription2 || ''}
                                    onChange={handleChange}
                                />

                                <input 
                                    id='2'
                                    type="time"
                                    name="startWork2"
                                    value={start.startWork2 || '00:00'}
                                    onChange={handleChange}
                                />

                                <input 
                                    id='2'
                                    type="time"
                                    name="endWork2"
                                    value={end.endWork2 || '00:00'}
                                    onChange={handleChange}
                                />
                            </div>

                            <div className='eachDay'>
                                <p>{hours.days[3].dayNumber}</p>

                                <input 
                                    id='3'
                                    type="text"
                                    name="jobDescription3"
                                    value={description.jobDescription3 || ''}
                                    onChange={handleChange}
                                />

                                <input 
                                    id='3'
                                    type="time"
                                    name="startWork3"
                                    value={start.startWork3 || '00:00'}
                                    onChange={handleChange}
                                />

                                <input 
                                    id='3'
                                    type="time"
                                    name="endWork3"
                                    value={end.endWork3 || '00:00'}
                                    onChange={handleChange}
                                />
                            </div>

                            <div className='eachDay'>
                                <p>{hours.days[4].dayNumber}</p>

                                <input 
                                    id='4'
                                    type="text"
                                    name="jobDescription4"
                                    value={description.jobDescription4 || ''}
                                    onChange={handleChange}
                                />

                                <input 
                                    id='4'
                                    type="time"
                                    name="startWork4"
                                    value={start.startWork4 || '00:00'}
                                    onChange={handleChange}
                                />

                                <input 
                                    id='4'
                                    type="time"
                                    name="endWork4"
                                    value={end.endWork4 || '00:00'}
                                    onChange={handleChange}
                                />
                            </div>

                            <div className='eachDay'>
                                <p>{hours.days[5].dayNumber}</p>

                                <input 
                                    id='5'
                                    type="text"
                                    name="jobDescription5"
                                    value={description.jobDescription5 || ''}
                                    onChange={handleChange}
                                />

                                <input 
                                    id='5'
                                    type="time"
                                    name="startWork5"
                                    value={start.startWork5 || '00:00'}
                                    onChange={handleChange}
                                />

                                <input 
                                    id='5'
                                    type="time"
                                    name="endWork5"
                                    value={end.endWork5 || '00:00'}
                                    onChange={handleChange}
                                />
                            </div>

                            <div className='eachDay'>
                                <p>{hours.days[6].dayNumber}</p>

                                <input 
                                    id='6'
                                    type="text"
                                    name="jobDescription6"
                                    value={description.jobDescription6 || ''}
                                    onChange={handleChange}
                                />

                                <input 
                                    id='6'
                                    type="time"
                                    name="startWork6"
                                    value={start.startWork6 || '00:00'}
                                    onChange={handleChange}
                                />

                                <input 
                                    id='6'
                                    type="time"
                                    name="endWork6"
                                    value={end.endWork6 || '00:00'}
                                    onChange={handleChange}
                                />
                            </div>

                            <div className='eachDay'>
                                <p>{hours.days[7].dayNumber}</p>

                                <input 
                                    id='7'
                                    type="text"
                                    name="jobDescription7"
                                    value={description.jobDescription7 || ''}
                                    onChange={handleChange}
                                />

                                <input 
                                    id='7'
                                    type="time"
                                    name="startWork7"
                                    value={start.startWork7 || '00:00'}
                                    onChange={handleChange}
                                />

                                <input 
                                    id='7'
                                    type="time"
                                    name="endWork7"
                                    value={end.endWork7 || '00:00'}
                                    onChange={handleChange}
                                />
                            </div>

                            <div className='eachDay'>
                                <p>{hours.days[8].dayNumber}</p>

                                <input 
                                    id='8'
                                    type="text"
                                    name="jobDescription8"
                                    value={description.jobDescription8 || ''}
                                    onChange={handleChange}
                                />

                                <input 
                                    id='8'
                                    type="time"
                                    name="startWork8"
                                    value={start.startWork8 || '00:00'}
                                    onChange={handleChange}
                                />

                                <input 
                                    id='8'
                                    type="time"
                                    name="endWork8"
                                    value={end.endWork8 || '00:00'}
                                    onChange={handleChange}
                                />
                            </div>

                            <div className='eachDay'>
                                <p>{hours.days[9].dayNumber}</p>

                                <input 
                                    id='9'
                                    type="text"
                                    name="jobDescription9"
                                    value={description.jobDescription9 || ''}
                                    onChange={handleChange}
                                />

                                <input 
                                    id='9'
                                    type="time"
                                    name="startWork9"
                                    value={start.startWork9 || '00:00'}
                                    onChange={handleChange}
                                />

                                <input 
                                    id='9'
                                    type="time"
                                    name="endWork9"
                                    value={end.endWork9 || '00:00'}
                                    onChange={handleChange}
                                />
                            </div>

                            <div className='eachDay'>
                                <p>{hours.days[10].dayNumber}</p>

                                <input 
                                    id='10'
                                    type="text"
                                    name="jobDescription10"
                                    value={description.jobDescription10 || ''}
                                    onChange={handleChange}
                                />

                                <input 
                                    id='10'
                                    type="time"
                                    name="startWork10"
                                    value={start.startWork10 || '00:00'}
                                    onChange={handleChange}
                                />

                                <input 
                                    id='10'
                                    type="time"
                                    name="endWork10"
                                    value={end.endWork10 || '00:00'}
                                    onChange={handleChange}
                                />
                            </div>

                            <div className='eachDay'>
                                <p>{hours.days[11].dayNumber}</p>

                                <input 
                                    id='11'
                                    type="text"
                                    name="jobDescription11"
                                    value={description.jobDescription11 || ''}
                                    onChange={handleChange}
                                />

                                <input 
                                    id='11'
                                    type="time"
                                    name="startWork11"
                                    value={start.startWork11 || '00:00'}
                                    onChange={handleChange}
                                />

                                <input 
                                    id='11'
                                    type="time"
                                    name="endWork11"
                                    value={end.endWork11 || '00:00'}
                                    onChange={handleChange}
                                />
                            </div>

                            <div className='eachDay'>
                                <p>{hours.days[12].dayNumber}</p>

                                <input 
                                    id='12'
                                    type="text"
                                    name="jobDescription12"
                                    value={description.jobDescription12 || ''}
                                    onChange={handleChange}
                                />

                                <input 
                                    id='12'
                                    type="time"
                                    name="startWork12"
                                    value={start.startWork12 || '00:00'}
                                    onChange={handleChange}
                                />

                                <input 
                                    id='12'
                                    type="time"
                                    name="endWork12"
                                    value={end.endWork12 || '00:00'}
                                    onChange={handleChange}
                                />
                            </div>

                            <div className='eachDay'>
                                <p>{hours.days[13].dayNumber}</p>

                                <input 
                                    id='13'
                                    type="text"
                                    name="jobDescription13"
                                    value={description.jobDescription13 || ''}
                                    onChange={handleChange}
                                />

                                <input 
                                    id='13'
                                    type="time"
                                    name="startWork13"
                                    value={start.startWork13 || '00:00'}
                                    onChange={handleChange}
                                />

                                <input 
                                    id='13'
                                    type="time"
                                    name="endWork13"
                                    value={end.endWork13 || '00:00'}
                                    onChange={handleChange}
                                />
                            </div>

                            <div className='eachDay'>
                                <p>{hours.days[14].dayNumber}</p>

                                <input 
                                    id='14'
                                    type="text"
                                    name="jobDescription14"
                                    value={description.jobDescription14 || ''}
                                    onChange={handleChange}
                                />

                                <input 
                                    id='14'
                                    type="time"
                                    name="startWork14"
                                    value={start.startWork14 || '00:00'}
                                    onChange={handleChange}
                                />

                                <input 
                                    id='14'
                                    type="time"
                                    name="endWork14"
                                    value={end.endWork14 || '00:00'}
                                    onChange={handleChange}
                                />
                            </div>

                            <div className='eachDay'>
                                <p>{hours.days[15].dayNumber}</p>

                                <input 
                                    id='15'
                                    type="text"
                                    name="jobDescription15"
                                    value={description.jobDescription15 || ''}
                                    onChange={handleChange}
                                />

                                <input 
                                    id='15'
                                    type="time"
                                    name="startWork15"
                                    value={start.startWork15 || '00:00'}
                                    onChange={handleChange}
                                />

                                <input 
                                    id='15'
                                    type="time"
                                    name="endWork15"
                                    value={end.endWork15 || '00:00'}
                                    onChange={handleChange}
                                />
                            </div>

                            <div className='eachDay'>
                                <p>{hours.days[16].dayNumber}</p>

                                <input 
                                    id='16'
                                    type="text"
                                    name="jobDescription16"
                                    value={description.jobDescription16 || ''}
                                    onChange={handleChange}
                                />

                                <input 
                                    id='16'
                                    type="time"
                                    name="startWork16"
                                    value={start.startWork16 || '00:00'}
                                    onChange={handleChange}
                                />

                                <input 
                                    id='16'
                                    type="time"
                                    name="endWork16"
                                    value={end.endWork16 || '00:00'}
                                    onChange={handleChange}
                                />
                            </div>

                            <div className='eachDay'>
                                <p>{hours.days[17].dayNumber}</p>

                                <input 
                                    id='17'
                                    type="text"
                                    name="jobDescription17"
                                    value={description.jobDescription17 || ''}
                                    onChange={handleChange}
                                />

                                <input 
                                    id='17'
                                    type="time"
                                    name="startWork17"
                                    value={start.startWork17 || '00:00'}
                                    onChange={handleChange}
                                />

                                <input 
                                    id='17'
                                    type="time"
                                    name="endWork17"
                                    value={end.endWork17 || '00:00'}
                                    onChange={handleChange}
                                />
                            </div>

                            <div className='eachDay'>
                                <p>{hours.days[18].dayNumber}</p>

                                <input 
                                    id='18'
                                    type="text"
                                    name="jobDescription18"
                                    value={description.jobDescription18 || ''}
                                    onChange={handleChange}
                                />

                                <input 
                                    id='18'
                                    type="time"
                                    name="startWork18"
                                    value={start.startWork18 || '00:00'}
                                    onChange={handleChange}
                                />

                                <input 
                                    id='18'
                                    type="time"
                                    name="endWork18"
                                    value={end.endWork18 || '00:00'}
                                    onChange={handleChange}
                                />
                            </div>

                            <div className='eachDay'>
                                <p>{hours.days[19].dayNumber}</p>

                                <input 
                                    id='19'
                                    type="text"
                                    name="jobDescription19"
                                    value={description.jobDescription19 || ''}
                                    onChange={handleChange}
                                />

                                <input 
                                    id='19'
                                    type="time"
                                    name="startWork19"
                                    value={start.startWork19 || '00:00'}
                                    onChange={handleChange}
                                />

                                <input 
                                    id='19'
                                    type="time"
                                    name="endWork19"
                                    value={end.endWork19 || '00:00'}
                                    onChange={handleChange}
                                />
                            </div>

                            <div className='eachDay'>
                                <p>{hours.days[20].dayNumber}</p>

                                <input 
                                    id='20'
                                    type="text"
                                    name="jobDescription20"
                                    value={description.jobDescription20 || ''}
                                    onChange={handleChange}
                                />

                                <input 
                                    id='20'
                                    type="time"
                                    name="startWork20"
                                    value={start.startWork20 || '00:00'}
                                    onChange={handleChange}
                                />

                                <input 
                                    id='20'
                                    type="time"
                                    name="endWork20"
                                    value={end.endWork20 || '00:00'}
                                    onChange={handleChange}
                                />
                            </div>

                            <div className='eachDay'>
                                <p>{hours.days[21].dayNumber}</p>

                                <input 
                                    id='21'
                                    type="text"
                                    name="jobDescription21"
                                    value={description.jobDescription21 || ''}
                                    onChange={handleChange}
                                />

                                <input 
                                    id='21'
                                    type="time"
                                    name="startWork21"
                                    value={start.startWork21 || '00:00'}
                                    onChange={handleChange}
                                />

                                <input 
                                    id='21'
                                    type="time"
                                    name="endWork21"
                                    value={end.endWork21 || '00:00'}
                                    onChange={handleChange}
                                />
                            </div>

                            <div className='eachDay'>
                                <p>{hours.days[22].dayNumber}</p>

                                <input 
                                    id='22'
                                    type="text"
                                    name="jobDescription22"
                                    value={description.jobDescription22 || ''}
                                    onChange={handleChange}
                                />

                                <input 
                                    id='22'
                                    type="time"
                                    name="startWork22"
                                    value={start.startWork22 || '00:00'}
                                    onChange={handleChange}
                                />

                                <input 
                                    id='22'
                                    type="time"
                                    name="endWork22"
                                    value={end.endWork22 || '00:00'}
                                    onChange={handleChange}
                                />
                            </div>

                            <div className='eachDay'>
                                <p>{hours.days[23].dayNumber}</p>

                                <input 
                                    id='23'
                                    type="text"
                                    name="jobDescription23"
                                    value={description.jobDescription23 || ''}
                                    onChange={handleChange}
                                />

                                <input 
                                    id='23'
                                    type="time"
                                    name="startWork23"
                                    value={start.startWork23 || '00:00'}
                                    onChange={handleChange}
                                />

                                <input 
                                    id='23'
                                    type="time"
                                    name="endWork23"
                                    value={end.endWork23 || '00:00'}
                                    onChange={handleChange}
                                />
                            </div>

                            <div className='eachDay'>
                                <p>{hours.days[24].dayNumber}</p>

                                <input 
                                    id='24'
                                    type="text"
                                    name="jobDescription24"
                                    value={description.jobDescription24 || ''}
                                    onChange={handleChange}
                                />

                                <input 
                                    id='24'
                                    type="time"
                                    name="startWork24"
                                    value={start.startWork24 || '00:00'}
                                    onChange={handleChange}
                                />

                                <input 
                                    id='24'
                                    type="time"
                                    name="endWork24"
                                    value={end.endWork24 || '00:00'}
                                    onChange={handleChange}
                                />
                            </div>

                            <div className='eachDay'>
                                <p>{hours.days[25].dayNumber}</p>

                                <input 
                                    id='25'
                                    type="text"
                                    name="jobDescription25"
                                    value={description.jobDescription25 || ''}
                                    onChange={handleChange}
                                />

                                <input 
                                    id='25'
                                    type="time"
                                    name="startWork25"
                                    value={start.startWork25 || '00:00'}
                                    onChange={handleChange}
                                />

                                <input 
                                    id='25'
                                    type="time"
                                    name="endWork25"
                                    value={end.endWork25 || '00:00'}
                                    onChange={handleChange}
                                />
                            </div>

                            <div className='eachDay'>
                                <p>{hours.days[26].dayNumber}</p>

                                <input 
                                    id='26'
                                    type="text"
                                    name="jobDescription26"
                                    value={description.jobDescription26 || ''}
                                    onChange={handleChange}
                                />

                                <input 
                                    id='26'
                                    type="time"
                                    name="startWork26"
                                    value={start.startWork26 || '00:00'}
                                    onChange={handleChange}
                                />

                                <input 
                                    id='26'
                                    type="time"
                                    name="endWork26"
                                    value={end.endWork26 || '00:00'}
                                    onChange={handleChange}
                                />
                            </div>

                            <div className='eachDay'>
                                <p>{hours.days[27].dayNumber}</p>

                                <input 
                                    id='27'
                                    type="text"
                                    name="jobDescription27"
                                    value={description.jobDescription27 || ''}
                                    onChange={handleChange}
                                />

                                <input 
                                    id='27'
                                    type="time"
                                    name="startWork27"
                                    value={start.startWork27 || '00:00'}
                                    onChange={handleChange}
                                />

                                <input 
                                    id='27'
                                    type="time"
                                    name="endWork27"
                                    value={end.endWork27 || '00:00'}
                                    onChange={handleChange}
                                />
                            </div>

                            <div className='eachDay'>
                                <p>{hours.days[28].dayNumber}</p>

                                <input 
                                    id='28'
                                    type="text"
                                    name="jobDescription28"
                                    value={description.jobDescription28 || ''}
                                    onChange={handleChange}
                                />

                                <input 
                                    id='28'
                                    type="time"
                                    name="startWork28"
                                    value={start.startWork28 || '00:00'}
                                    onChange={handleChange}
                                />

                                <input 
                                    id='28'
                                    type="time"
                                    name="endWork28"
                                    value={end.endWork28 || '00:00'}
                                    onChange={handleChange}
                                />
                            </div>

                            <div className='eachDay'>
                                <p>{hours.days[29].dayNumber}</p>

                                <input 
                                    id='29'
                                    type="text"
                                    name="jobDescription29"
                                    value={description.jobDescription29 || ''}
                                    onChange={handleChange}
                                />

                                <input 
                                    id='29'
                                    type="time"
                                    name="startWork29"
                                    value={start.startWork29 || '00:00'}
                                    onChange={handleChange}
                                />

                                <input 
                                    id='29'
                                    type="time"
                                    name="endWork29"
                                    value={end.endWork29 || '00:00'}
                                    onChange={handleChange}
                                />
                            </div>

                            <div className='eachDay'>
                                <p>{hours.days[30].dayNumber}</p>

                                <input 
                                    id='30'
                                    type="text"
                                    name="jobDescription30"
                                    value={description.jobDescription30 || ''}
                                    onChange={handleChange}
                                />

                                <input 
                                    id='30'
                                    type="time"
                                    name="startWork30"
                                    value={start.startWork30 || '00:00'}
                                    onChange={handleChange}
                                />

                                <input 
                                    id='30'
                                    type="time"
                                    name="endWork30"
                                    value={end.endWork30 || '00:00'}
                                    onChange={handleChange}
                                />
                            </div>
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