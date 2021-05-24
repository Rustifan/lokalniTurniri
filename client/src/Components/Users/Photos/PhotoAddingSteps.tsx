import React, { useCallback } from 'react'
import { Step } from 'semantic-ui-react'

interface Props
{
    step: number;
    setStep: (step: number)=>void;
}

export default function PhotoAddingSteps({step, setStep}: Props) 
{
  
    const handleOnClick = useCallback((selectStep: number)=>
    {
        
        setStep(selectStep);
        
       
    }, [setStep])

    const handleHover = (event: React.MouseEvent<HTMLDivElement>, stepOfElement: number)=>
    {
        if(step > stepOfElement)
        {
            event.currentTarget.style.cursor = "pointer";
           
        }
    }
    const mouseLeave = (event: React.MouseEvent<HTMLDivElement>)=>
    {
        event.currentTarget.style.cursor = "default";
       
        
    }

    return (
        <div style={{marginTop: 20, display: "flex", alignItems: "center", justifyContent: "center"}}>
        <Step.Group ordered>
            <Step as="div" 
                onMouseOver={(event:React.MouseEvent<HTMLDivElement>)=>handleHover(event,1)} 
                onClick={step > 1 ? ()=>handleOnClick(1) : undefined} 
                active={step===1} completed={step > 1}
                onMouseLeave={mouseLeave}
                >
                
                <Step.Content>
                    <Step.Title>Odabiri sliku</Step.Title>
                </Step.Content>
            </Step>

            <Step as="div" 
                onClick={step > 2 ? ()=>handleOnClick(2) : undefined} 
                active={step===2} 
                completed={step > 2}
                onMouseOver={(event:React.MouseEvent<HTMLDivElement>)=>handleHover(event,2)} 
                onMouseLeave={mouseLeave}

                >
                <Step.Content>
                    <Step.Title>Uredi sliku</Step.Title>
                </Step.Content>
            </Step>

            <Step as="div" 
                onClick={step > 3 ? ()=>handleOnClick(3) : undefined} 
                active={step===3}
                completed={step > 3}
                >
                <Step.Content>
                    <Step.Title>Pošalji sliku</Step.Title>
                </Step.Content>
            </Step>
        </Step.Group>
        </div>
    )
}