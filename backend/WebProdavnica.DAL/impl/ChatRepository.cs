using Microsoft.Data.SqlClient;
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

        public async Task<IEnumerable<Chat>> GetConversationAsync(int userId, int craftsmanId)
        {
            var chats = new List<Chat>();
            using SqlConnection conn = new(DataBaseConstant.ConnectionString);
            await conn.OpenAsync();
            SqlCommand cmd = conn.CreateCommand();
            cmd.CommandText = @"SELECT * FROM chats 
                WHERE user_id = @UserId AND craftsman_id = @CraftsmanId 
                ORDER BY sent_at ASC";
            cmd.Parameters.AddWithValue("@UserId", userId);
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
                INSERT INTO chats (message, sent_at, user_id, craftsman_id, sender_type, is_read)
                OUTPUT INSERTED.chat_id, INSERTED.sent_at
                VALUES (@Message, GETDATE(), @UserId, @CraftsmanId, @SenderType, 0)";
            cmd.Parameters.AddWithValue("@Message", chat.Message);
            cmd.Parameters.AddWithValue("@UserId", chat.UserId);
            cmd.Parameters.AddWithValue("@CraftsmanId", chat.CraftsmanId);
            cmd.Parameters.AddWithValue("@SenderType", chat.SenderType ?? "user");
            using var reader = await cmd.ExecuteReaderAsync();
            if (await reader.ReadAsync())
            {
                chat.ChatId = reader.GetInt32(0);
                chat.SentAt = reader.GetDateTime(1);
            }
            return chat;
        }

        public async Task MarkAsReadAsync(int userId, int craftsmanId, string readerRole)
        {
            using SqlConnection conn = new(DataBaseConstant.ConnectionString);
            await conn.OpenAsync();
            SqlCommand cmd = conn.CreateCommand();
            // Oznacava kao procitane samo poruke koje je poslala DRUGA strana
            cmd.CommandText = @"
                UPDATE chats 
                SET is_read = 1
                WHERE user_id = @UserId 
                  AND craftsman_id = @CraftsmanId
                  AND is_read = 0
                  AND sender_type != @ReaderRole";
            cmd.Parameters.AddWithValue("@UserId", userId);
            cmd.Parameters.AddWithValue("@CraftsmanId", craftsmanId);
            cmd.Parameters.AddWithValue("@ReaderRole", readerRole);
            await cmd.ExecuteNonQueryAsync();
        }

        private static Chat MapChat(SqlDataReader r) => new Chat
        {
            ChatId = r.GetInt32(r.GetOrdinal("chat_id")),
            Message = r.GetString(r.GetOrdinal("message")),
            SentAt = r.GetDateTime(r.GetOrdinal("sent_at")),
            UserId = r.GetInt32(r.GetOrdinal("user_id")),
            CraftsmanId = r.GetInt32(r.GetOrdinal("craftsman_id")),
            SenderType = r.IsDBNull(r.GetOrdinal("sender_type")) ? "user" : r.GetString(r.GetOrdinal("sender_type")),
            IsRead = !r.IsDBNull(r.GetOrdinal("is_read")) && r.GetBoolean(r.GetOrdinal("is_read"))
        };
    }
}