import React, { useState } from "react"
import { Container } from "semantic-ui-react"
import PhotoAddingSteps from "./PhotoAddingSteps"
import PhotoCropper from "./PhotoCropper";
import PhotoDropzone from "./PhotoDropzone"
import PhotoResult from "./PhotoResult";



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



