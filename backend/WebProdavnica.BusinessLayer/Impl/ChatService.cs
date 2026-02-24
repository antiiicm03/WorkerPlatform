using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using WebProdavnica.BusinessLayer.Abstract;
using WebProdavnica.DAL.Impl;
using WebProdavnica.Entities;
using WebProdavnica.DAL.Abstract;

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

        public Task<Chat> SendMessageAsync(Chat chat)
            => _chatRepository.SendMessageAsync(chat);
    }
}
