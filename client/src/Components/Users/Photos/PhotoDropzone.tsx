import React, {useCallback} from 'react'
import {useDropzone} from 'react-dropzone'
import CSS from "csstype"
import { Header } from 'semantic-ui-react'

interface Props
{
    setImage: (image: string | null | ArrayBuffer)=>void;
    setStep: (step: number)=>void;
}

export default function PhotoDropzone({setImage, setStep}: Props) 
{
    const style: CSS.Properties = 
    {  

       width: "500px",
       height: "500px",
       border: "black 5px dashed",
       margin: "auto",
       display: "flex",
       justifyContent:"center",
       alignItems: "center",
       
    }

    const paragraphStyle: CSS.Properties =
    {
        fontSize: "15px",
        fontWeight: "bold"
    }

    const handleFocus = (event: React.MouseEvent<HTMLDivElement>)=>
    {
        event.currentTarget.style.cursor = "pointer";
        
        
        event.currentTarget.style.border = event.type === "mouseover" ? 
        "red dashed 5px" : "black dashed 5px";
       
        
    };

    

    const onDrop = useCallback((acceptedFiles) => {
        acceptedFiles.forEach((file: Blob) => {
          const reader = new FileReader()
            
          reader.onabort = () => console.log('file reading was aborted')
          reader.onerror = () => console.log('file reading has failed')
          reader.onload = () => {
          
            const binaryStr = reader.result
            setImage(binaryStr);
          }
          if(file.type ==="image/jpeg" || file.type ==="image/png")
          {
              reader.readAsDataURL(file)
              setStep(2);
            }

        })
      }, [setImage, setStep])

  const {getRootProps, getInputProps, isDragActive} = useDropzone({onDrop, accept: "image/jpeg, image/png"})

  return (
    <>
    <Header style={{padding: 20}} textAlign="center" as="h2">Odaberi sliku</Header>
    <div onMouseOver={handleFocus} onMouseLeave={handleFocus} style={style} {...getRootProps()}>
      <input {...getInputProps()} />
      {
        isDragActive ?
          <p style={paragraphStyle}>Slobodno pusti sliku</p> :
          <p style={paragraphStyle}>Klikni ovdje ili dovuci svoju sliku</p>
      }
    </div>
    </>
  )
}