namespace Application.Messages
{
    public class DeleteMessageResult
    {
        public bool IsSuccess { get; set; }
        public string Error { get; set; }
        public string Reciever { get; set; }
        public static DeleteMessageResult Sucess(string reciever)
        {
            return new DeleteMessageResult{IsSuccess=true, Error=null, Reciever=reciever};
        }
        
        public static DeleteMessageResult Failed(string error)
        {
            return new DeleteMessageResult{IsSuccess=false, Error=error, Reciever=null};
        }
    }
}