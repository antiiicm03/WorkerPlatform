namespace WebProdavnica.Entities
{
    public class Chat
    {
        public int ChatId { get; set; }
        public string Message { get; set; } = string.Empty;
        public DateTime SentAt { get; set; }
        public int UserId { get; set; }
        public int CraftsmanId { get; set; }
        public string SenderType { get; set; } = "user"; // "user" ili "craftsman"
        public User? User { get; set; }
        public Craftsman? Craftsman { get; set; }
        public bool IsRead { get; set; }
    }
}