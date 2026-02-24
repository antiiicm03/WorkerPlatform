using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using WebProdavnica.Entities;

namespace WebProdavnica.DAL.Abstract
{
    public interface IChatRepository
    {
        Task<IEnumerable<Chat>> GetChatsByUserIdAsync(int userId);
        Task<IEnumerable<Chat>> GetChatsByCraftsmanIdAsync(int craftsmanId);
        Task<Chat> SendMessageAsync(Chat chat);
    }
}
