import React from 'react'
import { Tooltip, Button } from 'ui-neumorphism'
import diamondIcon from '../../assets/svg/diamondYellowRedStroke.svg'

const ExpScore = ({ exp }) => {
    return (
        <div className="gameScore">
            <Tooltip
                bottom
                style={{top: 0}}
                content={<div>Finish sessions to gain diamonds</div>}
            >
                <Button bordered depressed>
                    <div className='gameScore__inner'>
                        <img src={diamondIcon} alt="" />
                        <span>{exp}</span>
                    </div>
                </Button>
            </Tooltip>

        </div>
    )
}

export default ExpScore