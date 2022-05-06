import React from "react"
import { nanoid } from "nanoid"

export default function Die(props){
    const [dots, setDots] = React.useState(generateDots)
    function generateDots(){
        const dots=[]
        for(let dot=0;dot<props.value;dot++){
            dots.push(<span key={nanoid()} className="dots"></span>)
        }
        return dots
    }
    const styles={
        backgroundColor: props.isHeld ? '#59E391' : 'white'
    }
    return(
        <div className="tile" style={styles} onClick={()=>props.setHold(props.id)}>
            {dots}
        </div>
    )
}