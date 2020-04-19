import React from 'react'

export const Rank = ({ name, entries }) => {
    return (
        <div>
            <div className='white f3'>
            {`${name}, your current image count....`}
            </div>
        
    
            <div className='white f1'>
            {entries}</div>
        
    </div>
    )
}

export default Rank