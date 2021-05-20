import React, { useState } from "react"
import { Container } from "semantic-ui-react"
import PhotoAddingSteps from "./Photos/PhotoAddingSteps"
import PhotoCropper from "./Photos/PhotoCropper";
import PhotoDropzone from "./Photos/PhotoDropzone"
import PhotoResult from "./Photos/PhotoResult";



export default function Photos() 
{
    const [step, setStep] = useState(1);

    const [image, setImage] = useState<string | ArrayBuffer | null>(null)
    const [croppedImage, setCroppedImage] = useState<Blob | null>(null);

    return(
    <Container>
        
        <PhotoAddingSteps step={step} setStep={setStep}/>
        {step===1 && 
        <PhotoDropzone setStep={setStep} setImage={setImage}/>
        }
        {step===2 &&
        <PhotoCropper setCroppedImage={setCroppedImage} setStep={setStep} image={image as string}/>
        }
        {step===3 && croppedImage &&
        <PhotoResult setStep={setStep} photo={croppedImage}/>
        }
       
    </Container>
    )

    
}



