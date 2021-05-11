export default function PictureFromSport(sport: string)
{
    let sportImg = "";
    switch(sport.toLowerCase())
    {
        case "šah":
        sportImg = "chess.png";
        break;
        case "potezanje konopa":
        sportImg = "potezanjeKonopa.png";
        break;
        case "briškula":
        sportImg = "cards.png"
        break;
        case "bela":
        sportImg = "cards.png"
        break;
        case "nogomet":
        sportImg = "soccer.png";
        break;
        default:
        sportImg = "ostalo.png";
        break;
    }
    return "/Assets/Images/"+sportImg;
}