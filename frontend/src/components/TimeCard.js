import React from 'react'
import { useState } from 'react'

const TimeCard = ({ user }) => {
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
                              <p>Day: {day.dayNumber} Start: {day.startWork}, End: {day.endWork}</p>
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
        return (
            <div>
                <h1>Upload data</h1>
                <button onClick={() => toScreen('1')} >Back</button>

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