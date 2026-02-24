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

        [HttpGet("user/{userId}")]
        public async Task<IActionResult> GetByUser(int userId)
        {
            var chats = await _chatService.GetChatsByUserIdAsync(userId);
            return Ok(chats);
        }

        [HttpGet("craftsman/{craftsmanId}")]
        public async Task<IActionResult> GetByCraftsman(int craftsmanId)
        {
            var chats = await _chatService.GetChatsByCraftsmanIdAsync(craftsmanId);
            return Ok(chats);
        }

        [HttpPost]
        public async Task<IActionResult> SendMessage([FromBody] Chat chat)
        {
            var result = await _chatService.SendMessageAsync(chat);
            return Ok(result);
        }
    }
}