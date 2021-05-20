import React, { useCallback, useState } from 'react'
import Cropper from 'react-easy-crop'
import { Button, Header, Icon } from 'semantic-ui-react'
import { getCroppedImg } from './cropImage'


interface Props {
    image: string;
    setStep: (step: number) => void;
    setCroppedImage: (img: Blob) => void;
}

export default function PhotoCropper({ image, setStep, setCroppedImage }: Props) {
    const [crop, setCrop] = useState({ x: 0, y: 0 })
    const [zoom, setZoom] = useState(1)
    const [loading, setLoading] = useState(false);
    const [croppedAreaPixels, setCroppedAreaPixels] = useState<any>(null);

    const onCropComplete = useCallback((croppedArea, croppedAreaPixels) => {
        console.log("set");
        setCroppedAreaPixels(croppedAreaPixels);

    }, [setCroppedAreaPixels])

    const handleCrop = () => 
    {
        setLoading(true);
        getCroppedImg(image, croppedAreaPixels)
            .then((img: Blob) => 
            {

                setCroppedImage(img);
                setLoading(false);
                setStep(3);
            });
    }

    return (
        <>
            <Header style={{ padding: 20 }} textAlign="center" as="h2">Uredi Sliku</Header>

            <div>
                <Cropper
                    style={{ containerStyle: { width: "500px", height: "500px", position: "relative", margin: "auto" } }}
                    image={image}
                    crop={crop}
                    zoom={zoom}
                    aspect={1 / 1}
                    onCropChange={setCrop}
                    onCropComplete={onCropComplete}
                    onZoomChange={setZoom}
                />
            </div>
            <div style={{ marginTop: 10, display: "flex", justifyContent: "center" }}>
                <Button onClick={() => setStep(1)} negative><Icon name="x" />Odaberi drugu</Button>
                <Button loading={loading} onClick={handleCrop} positive><Icon name="check" />Potvrdi</Button>
            </div>
        </>
    )
}