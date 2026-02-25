using WebProdavnica.BusinessLayer.Abstract;
using WebProdavnica.DAL.Abstract;
using WebProdavnica.Entities;

namespace WebProdavnica.BusinessLayer.Impl
{
    public class ChatService : IChatService
    {
        private readonly IChatRepository _chatRepository;

        public ChatService(IChatRepository chatRepository)
        {
            _chatRepository = chatRepository;
        }

        public Task<IEnumerable<Chat>> GetChatsByUserIdAsync(int userId)
            => _chatRepository.GetChatsByUserIdAsync(userId);

        public Task<IEnumerable<Chat>> GetChatsByCraftsmanIdAsync(int craftsmanId)
            => _chatRepository.GetChatsByCraftsmanIdAsync(craftsmanId);

        public Task<IEnumerable<Chat>> GetConversationAsync(int userId, int craftsmanId)
            => _chatRepository.GetConversationAsync(userId, craftsmanId);

        public Task<Chat> SendMessageAsync(Chat chat)
            => _chatRepository.SendMessageAsync(chat);

        public Task MarkAsReadAsync(int userId, int craftsmanId, string readerRole)
            => _chatRepository.MarkAsReadAsync(userId, craftsmanId, readerRole);
    }
}