export default function reduceText(text: string, characterNumber: number)
{
    if(text.length <= characterNumber) return text;

    return text.substr(0, characterNumber-1)+"...";
}