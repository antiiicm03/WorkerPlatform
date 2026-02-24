using Microsoft.Data.SqlClient;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using WebProdavnica.Core.Constant;
using WebProdavnica.DAL.Abstract;
using WebProdavnica.Entities;

namespace WebProdavnica.DAL.Impl
{
    public class ChatRepository : IChatRepository
    {
        public async Task<IEnumerable<Chat>> GetChatsByUserIdAsync(int userId)
        {
            var chats = new List<Chat>();
            using SqlConnection conn = new(DataBaseConstant.ConnectionString);
            await conn.OpenAsync();
            SqlCommand cmd = conn.CreateCommand();
            cmd.CommandText = "SELECT * FROM chats WHERE user_id = @UserId ORDER BY sent_at ASC";
            cmd.Parameters.AddWithValue("@UserId", userId);
            using var reader = await cmd.ExecuteReaderAsync();
            while (await reader.ReadAsync())
                chats.Add(MapChat(reader));
            return chats;
        }

        public async Task<IEnumerable<Chat>> GetChatsByCraftsmanIdAsync(int craftsmanId)
        {
            var chats = new List<Chat>();
            using SqlConnection conn = new(DataBaseConstant.ConnectionString);
            await conn.OpenAsync();
            SqlCommand cmd = conn.CreateCommand();
            cmd.CommandText = "SELECT * FROM chats WHERE craftsman_id = @CraftsmanId ORDER BY sent_at ASC";
            cmd.Parameters.AddWithValue("@CraftsmanId", craftsmanId);
            using var reader = await cmd.ExecuteReaderAsync();
            while (await reader.ReadAsync())
                chats.Add(MapChat(reader));
            return chats;
        }

        public async Task<Chat> SendMessageAsync(Chat chat)
        {
            using SqlConnection conn = new(DataBaseConstant.ConnectionString);
            await conn.OpenAsync();
            SqlCommand cmd = conn.CreateCommand();
            cmd.CommandText = @"
                INSERT INTO chats (message, sent_at, user_id, craftsman_id)
                OUTPUT INSERTED.chat_id, INSERTED.sent_at
                VALUES (@Message, GETDATE(), @UserId, @CraftsmanId)";
            cmd.Parameters.AddWithValue("@Message", chat.Message);
            cmd.Parameters.AddWithValue("@UserId", chat.UserId);
            cmd.Parameters.AddWithValue("@CraftsmanId", chat.CraftsmanId);
            using var reader = await cmd.ExecuteReaderAsync();
            if (await reader.ReadAsync())
            {
                chat.ChatId = reader.GetInt32(0);
                chat.SentAt = reader.GetDateTime(1);
            }
            return chat;
        }

        private static Chat MapChat(SqlDataReader r) => new Chat
        {
            ChatId = r.GetInt32(r.GetOrdinal("chat_id")),
            Message = r.GetString(r.GetOrdinal("message")),
            SentAt = r.GetDateTime(r.GetOrdinal("sent_at")),
            UserId = r.GetInt32(r.GetOrdinal("user_id")),
            CraftsmanId = r.GetInt32(r.GetOrdinal("craftsman_id"))
        };
    }
}
