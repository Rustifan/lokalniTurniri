export default interface Message
{
    id: string;
    sender: string;
    receiver: string;
    read: boolean;
    timeOfSending: Date;
}