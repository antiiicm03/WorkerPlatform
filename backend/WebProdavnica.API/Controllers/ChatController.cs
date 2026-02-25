using Microsoft.AspNetCore.Mvc;
using WebProdavnica.BusinessLayer.Abstract;
using WebProdavnica.Entities;

namespace WebProdavnica.API.Controllers
{
    [ApiController]
    [Route("api/chat")]
    public class ChatController : ControllerBase
    {
        private readonly IChatService _chatService;

        public ChatController(IChatService chatService)
        {
            _chatService = chatService;
        }

        // GET: api/chat/user/{userId} — sve poruke za usera
        [HttpGet("user/{userId}")]
        public async Task<IActionResult> GetByUser(int userId)
        {
            var chats = await _chatService.GetChatsByUserIdAsync(userId);
            return Ok(new { success = true, data = chats });
        }

        // GET: api/chat/craftsman/{craftsmanId} — sve poruke za majstora
        [HttpGet("craftsman/{craftsmanId}")]
        public async Task<IActionResult> GetByCraftsman(int craftsmanId)
        {
            var chats = await _chatService.GetChatsByCraftsmanIdAsync(craftsmanId);
            return Ok(new { success = true, data = chats });
        }

        // GET: api/chat/conversation/{userId}/{craftsmanId} — poruke između usera i majstora
        [HttpGet("conversation/{userId}/{craftsmanId}")]
        public async Task<IActionResult> GetConversation(int userId, int craftsmanId)
        {
            var chats = await _chatService.GetConversationAsync(userId, craftsmanId);
            return Ok(new { success = true, data = chats });
        }

        // POST: api/chat — slanje poruke
        [HttpPost]
        public async Task<IActionResult> SendMessage([FromBody] SendMessageRequest request)
        {
            var chat = new Chat
            {
                Message = request.Message,
                UserId = request.UserId,
                CraftsmanId = request.CraftsmanId,
                SenderType = request.SenderType
            };
            var result = await _chatService.SendMessageAsync(chat);
            return Ok(new { success = true, data = result });
        }

        // PUT: api/chat/read/{userId}/{craftsmanId}?readerRole=user — oznaci poruke kao procitane
        [HttpPut("read/{userId}/{craftsmanId}")]
        public async Task<IActionResult> MarkAsRead(int userId, int craftsmanId, [FromQuery] string readerRole = "user")
        {
            await _chatService.MarkAsReadAsync(userId, craftsmanId, readerRole);
            return Ok(new { success = true });
        }
    }

    public class SendMessageRequest
    {
        public string Message { get; set; } = string.Empty;
        public int UserId { get; set; }
        public int CraftsmanId { get; set; }
        public string SenderType { get; set; } = "user"; // "user" ili "craftsman"
    }
}