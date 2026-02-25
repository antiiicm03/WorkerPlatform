using WebProdavnica.Entities;

namespace WebProdavnica.BusinessLayer.Abstract
{
    public interface IChatService
    {
        Task<IEnumerable<Chat>> GetChatsByUserIdAsync(int userId);
        Task<IEnumerable<Chat>> GetChatsByCraftsmanIdAsync(int craftsmanId);
        Task<IEnumerable<Chat>> GetConversationAsync(int userId, int craftsmanId);
        Task<Chat> SendMessageAsync(Chat chat);
        Task MarkAsReadAsync(int userId, int craftsmanId, string readerRole);
    }
}