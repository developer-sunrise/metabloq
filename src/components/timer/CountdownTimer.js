import React from 'react';
import DateTimeDisplay from './DateTimeDisplay';
import { useCountdown } from './useCountdown';

const ExpiredNotice = ({jsonUpdation}) => {
    return (
        <div className="expired-notice">
            <p className='text-danger'>Expired!!!</p>
            {/* {jsonUpdation()} */}
            {/* <p>Please select a future date and time.</p> */}
        </div>
    );
};

const ShowCounter = ({ days, hours, minutes, seconds }) => {
    return (
        <div className="show-counter" style={{ display: 'flex', flexDirection: 'row',width:'80%'}}>
            <DateTimeDisplay dayValue={days} hourValue={hours} minValue={minutes} secValue={seconds} isDanger={days <= 3} />
            {/* <DateTimeDisplay value={hours} type={'Hours'} isDanger={false} />
            <DateTimeDisplay value={minutes} type={'Mins'} isDanger={false} />
            <DateTimeDisplay value={seconds} type={'Sec'} isDanger={false} /> */}
        </div>
    );
};

const CountdownTimer = ({ targetDate,jsonUpdation }) => {
    const [days, hours, minutes, seconds] = useCountdown(targetDate);

    if (days + hours + minutes + seconds <= 0) {
        return <ExpiredNotice jsonUpdation={jsonUpdation}/>;
    } else {
        return (
            <ShowCounter
                days={days}
                hours={hours}
                minutes={minutes}
                seconds={seconds}
            />
        );
    }
};

export default CountdownTimer;