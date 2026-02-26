using Xunit;
using Moq;
using WebProdavnica.BusinessLayer.Impl;
using WebProdavnica.DAL.Abstract;
using WebProdavnica.Entities;

namespace WebProdavnica.UnitTest.Services
{
    public class ChatServiceTests
    {
        private readonly Mock<IChatRepository> _mockChatRepo;
        private readonly ChatService _chatService;

        public ChatServiceTests()
        {
            _mockChatRepo = new Mock<IChatRepository>();
            _chatService = new ChatService(_mockChatRepo.Object);
        }

        #region GetChatsByUserIdAsync Tests

        [Fact]
        public async Task GetChatsByUserIdAsync_WithValidUserId_ReturnsChatList()
        {
            // Arrange
            var userId = 1;
            var expectedChats = new List<Chat>
            {
                new Chat
                {
                    ChatId = 1,
                    UserId = 1,
                    CraftsmanId = 2,
                    Message = "Hello",
                    SentAt = DateTime.Now,
                    SenderType = "User",
                    IsRead = false
                },
                new Chat
                {
                    ChatId = 2,
                    UserId = 1,
                    CraftsmanId = 3,
                    Message = "Hi there",
                    SentAt = DateTime.Now,
                    SenderType = "User",
                    IsRead = false
                }
            };

            _mockChatRepo.Setup(r => r.GetChatsByUserIdAsync(userId))
                .ReturnsAsync(expectedChats);

            // Act
            var result = await _chatService.GetChatsByUserIdAsync(userId);

            // Assert
            Assert.NotNull(result);
            Assert.Equal(2, result.Count());
            Assert.All(result, chat => Assert.Equal(userId, chat.UserId));
            _mockChatRepo.Verify(r => r.GetChatsByUserIdAsync(userId), Times.Once);
        }

        [Fact]
        public async Task GetChatsByUserIdAsync_WithNoChats_ReturnsEmptyList()
        {
            // Arrange
            var userId = 999;
            var emptyList = new List<Chat>();

            _mockChatRepo.Setup(r => r.GetChatsByUserIdAsync(userId))
                .ReturnsAsync(emptyList);

            // Act
            var result = await _chatService.GetChatsByUserIdAsync(userId);

            // Assert
            Assert.NotNull(result);
            Assert.Empty(result);
            _mockChatRepo.Verify(r => r.GetChatsByUserIdAsync(userId), Times.Once);
        }

        [Fact]
        public async Task GetChatsByUserIdAsync_CallsRepositoryWithCorrectParameter()
        {
            // Arrange
            var userId = 42;
            _mockChatRepo.Setup(r => r.GetChatsByUserIdAsync(userId))
                .ReturnsAsync(new List<Chat>());

            // Act
            await _chatService.GetChatsByUserIdAsync(userId);

            // Assert
            _mockChatRepo.Verify(r => r.GetChatsByUserIdAsync(42), Times.Once);
        }

        #endregion

        #region GetChatsByCraftsmanIdAsync Tests

        [Fact]
        public async Task GetChatsByCraftsmanIdAsync_WithValidCraftsmanId_ReturnsChatList()
        {
            // Arrange
            var craftsmanId = 5;
            var expectedChats = new List<Chat>
            {
                new Chat
                {
                    ChatId = 3,
                    UserId = 10,
                    CraftsmanId = 5,
                    Message = "Can you help?",
                    SentAt = DateTime.Now,
                    SenderType = "User",
                    IsRead = false
                },
                new Chat
                {
                    ChatId = 4,
                    UserId = 10,
                    CraftsmanId = 5,
                    Message = "Sure!",
                    SentAt = DateTime.Now.AddMinutes(5),
                    SenderType = "Craftsman",
                    IsRead = true
                }
            };

            _mockChatRepo.Setup(r => r.GetChatsByCraftsmanIdAsync(craftsmanId))
                .ReturnsAsync(expectedChats);

            // Act
            var result = await _chatService.GetChatsByCraftsmanIdAsync(craftsmanId);

            // Assert
            Assert.NotNull(result);
            Assert.Equal(2, result.Count());
            Assert.All(result, chat => Assert.Equal(craftsmanId, chat.CraftsmanId));
            _mockChatRepo.Verify(r => r.GetChatsByCraftsmanIdAsync(craftsmanId), Times.Once);
        }

        [Fact]
        public async Task GetChatsByCraftsmanIdAsync_WithNoChats_ReturnsEmptyList()
        {
            // Arrange
            var craftsmanId = 999;
            var emptyList = new List<Chat>();

            _mockChatRepo.Setup(r => r.GetChatsByCraftsmanIdAsync(craftsmanId))
                .ReturnsAsync(emptyList);

            // Act
            var result = await _chatService.GetChatsByCraftsmanIdAsync(craftsmanId);

            // Assert
            Assert.NotNull(result);
            Assert.Empty(result);
            _mockChatRepo.Verify(r => r.GetChatsByCraftsmanIdAsync(craftsmanId), Times.Once);
        }

        [Fact]
        public async Task GetChatsByCraftsmanIdAsync_CallsRepositoryWithCorrectParameter()
        {
            // Arrange
            var craftsmanId = 77;
            _mockChatRepo.Setup(r => r.GetChatsByCraftsmanIdAsync(craftsmanId))
                .ReturnsAsync(new List<Chat>());

            // Act
            await _chatService.GetChatsByCraftsmanIdAsync(craftsmanId);

            // Assert
            _mockChatRepo.Verify(r => r.GetChatsByCraftsmanIdAsync(77), Times.Once);
        }

        #endregion

        #region GetConversationAsync Tests

        [Fact]
        public async Task GetConversationAsync_WithValidIds_ReturnsConversation()
        {
            // Arrange
            var userId = 10;
            var craftsmanId = 5;
            var conversation = new List<Chat>
            {
                new Chat
                {
                    ChatId = 1,
                    UserId = 10,
                    CraftsmanId = 5,
                    Message = "I need help",
                    SentAt = DateTime.Now.AddHours(-2),
                    SenderType = "User",
                    IsRead = true
                },
                new Chat
                {
                    ChatId = 2,
                    UserId = 10,
                    CraftsmanId = 5,
                    Message = "What do you need?",
                    SentAt = DateTime.Now.AddHours(-1),
                    SenderType = "Craftsman",
                    IsRead = true
                },
                new Chat
                {
                    ChatId = 3,
                    UserId = 10,
                    CraftsmanId = 5,
                    Message = "Fix my sink",
                    SentAt = DateTime.Now,
                    SenderType = "User",
                    IsRead = false
                }
            };

            _mockChatRepo.Setup(r => r.GetConversationAsync(userId, craftsmanId))
                .ReturnsAsync(conversation);

            // Act
            var result = await _chatService.GetConversationAsync(userId, craftsmanId);

            // Assert
            Assert.NotNull(result);
            Assert.Equal(3, result.Count());
            Assert.All(result, chat =>
            {
                Assert.Equal(userId, chat.UserId);
                Assert.Equal(craftsmanId, chat.CraftsmanId);
            });
            _mockChatRepo.Verify(r => r.GetConversationAsync(userId, craftsmanId), Times.Once);
        }

        [Fact]
        public async Task GetConversationAsync_WithNoMessages_ReturnsEmptyList()
        {
            // Arrange
            var userId = 100;
            var craftsmanId = 200;
            var emptyConversation = new List<Chat>();

            _mockChatRepo.Setup(r => r.GetConversationAsync(userId, craftsmanId))
                .ReturnsAsync(emptyConversation);

            // Act
            var result = await _chatService.GetConversationAsync(userId, craftsmanId);

            // Assert
            Assert.NotNull(result);
            Assert.Empty(result);
            _mockChatRepo.Verify(r => r.GetConversationAsync(userId, craftsmanId), Times.Once);
        }

        [Fact]
        public async Task GetConversationAsync_CallsRepositoryWithCorrectParameters()
        {
            // Arrange
            var userId = 15;
            var craftsmanId = 25;
            _mockChatRepo.Setup(r => r.GetConversationAsync(userId, craftsmanId))
                .ReturnsAsync(new List<Chat>());

            // Act
            await _chatService.GetConversationAsync(userId, craftsmanId);

            // Assert
            _mockChatRepo.Verify(r => r.GetConversationAsync(15, 25), Times.Once);
        }

        [Theory]
        [InlineData(1, 1)]
        [InlineData(5, 10)]
        [InlineData(100, 200)]
        public async Task GetConversationAsync_WithVariousIds_CallsRepository(int userId, int craftsmanId)
        {
            // Arrange
            _mockChatRepo.Setup(r => r.GetConversationAsync(userId, craftsmanId))
                .ReturnsAsync(new List<Chat>());

            // Act
            await _chatService.GetConversationAsync(userId, craftsmanId);

            // Assert
            _mockChatRepo.Verify(r => r.GetConversationAsync(userId, craftsmanId), Times.Once);
        }

        #endregion

        #region SendMessageAsync Tests

        [Fact]
        public async Task SendMessageAsync_WithValidChat_ReturnsSavedChat()
        {
            // Arrange
            var chatToSend = new Chat
            {
                UserId = 1,
                CraftsmanId = 2,
                Message = "Test message",
                SenderType = "User",
                IsRead = false
            };

            var savedChat = new Chat
            {
                ChatId = 100,
                UserId = 1,
                CraftsmanId = 2,
                Message = "Test message",
                SentAt = DateTime.Now,
                SenderType = "User",
                IsRead = false
            };

            _mockChatRepo.Setup(r => r.SendMessageAsync(chatToSend))
                .ReturnsAsync(savedChat);

            // Act
            var result = await _chatService.SendMessageAsync(chatToSend);

            // Assert
            Assert.NotNull(result);
            Assert.Equal(100, result.ChatId);
            Assert.Equal("Test message", result.Message);
            Assert.NotEqual(default(DateTime), result.SentAt);
            _mockChatRepo.Verify(r => r.SendMessageAsync(chatToSend), Times.Once);
        }

        [Fact]
        public async Task SendMessageAsync_FromUser_SetsCorrectSenderType()
        {
            // Arrange
            var userMessage = new Chat
            {
                UserId = 10,
                CraftsmanId = 5,
                Message = "User message",
                SenderType = "User"
            };

            var savedMessage = new Chat
            {
                ChatId = 1,
                UserId = 10,
                CraftsmanId = 5,
                Message = "User message",
                SenderType = "User",
                SentAt = DateTime.Now
            };

            _mockChatRepo.Setup(r => r.SendMessageAsync(userMessage))
                .ReturnsAsync(savedMessage);

            // Act
            var result = await _chatService.SendMessageAsync(userMessage);

            // Assert
            Assert.Equal("User", result.SenderType);
        }

        [Fact]
        public async Task SendMessageAsync_FromCraftsman_SetsCorrectSenderType()
        {
            // Arrange
            var craftsmanMessage = new Chat
            {
                UserId = 10,
                CraftsmanId = 5,
                Message = "Craftsman reply",
                SenderType = "Craftsman"
            };

            var savedMessage = new Chat
            {
                ChatId = 2,
                UserId = 10,
                CraftsmanId = 5,
                Message = "Craftsman reply",
                SenderType = "Craftsman",
                SentAt = DateTime.Now
            };

            _mockChatRepo.Setup(r => r.SendMessageAsync(craftsmanMessage))
                .ReturnsAsync(savedMessage);

            // Act
            var result = await _chatService.SendMessageAsync(craftsmanMessage);

            // Assert
            Assert.Equal("Craftsman", result.SenderType);
        }

        [Fact]
        public async Task SendMessageAsync_CallsRepositoryOnce()
        {
            // Arrange
            var chat = new Chat { UserId = 1, CraftsmanId = 2, Message = "Test" };
            _mockChatRepo.Setup(r => r.SendMessageAsync(chat))
                .ReturnsAsync(new Chat { ChatId = 1 });

            // Act
            await _chatService.SendMessageAsync(chat);

            // Assert
            _mockChatRepo.Verify(r => r.SendMessageAsync(It.IsAny<Chat>()), Times.Once);
        }

        #endregion

        #region MarkAsReadAsync Tests

        [Fact]
        public async Task MarkAsReadAsync_ByUser_CallsRepositoryWithCorrectParameters()
        {
            // Arrange
            var userId = 10;
            var craftsmanId = 5;
            var readerRole = "User";

            _mockChatRepo.Setup(r => r.MarkAsReadAsync(userId, craftsmanId, readerRole))
                .Returns(Task.CompletedTask);

            // Act
            await _chatService.MarkAsReadAsync(userId, craftsmanId, readerRole);

            // Assert
            _mockChatRepo.Verify(r => r.MarkAsReadAsync(10, 5, "User"), Times.Once);
        }

        [Fact]
        public async Task MarkAsReadAsync_ByCraftsman_CallsRepositoryWithCorrectParameters()
        {
            // Arrange
            var userId = 15;
            var craftsmanId = 20;
            var readerRole = "Craftsman";

            _mockChatRepo.Setup(r => r.MarkAsReadAsync(userId, craftsmanId, readerRole))
                .Returns(Task.CompletedTask);

            // Act
            await _chatService.MarkAsReadAsync(userId, craftsmanId, readerRole);

            // Assert
            _mockChatRepo.Verify(r => r.MarkAsReadAsync(15, 20, "Craftsman"), Times.Once);
        }

        [Theory]
        [InlineData(1, 2, "User")]
        [InlineData(5, 10, "Craftsman")]
        [InlineData(100, 200, "User")]
        public async Task MarkAsReadAsync_WithVariousParameters_CallsRepository(
            int userId,
            int craftsmanId,
            string readerRole)
        {
            // Arrange
            _mockChatRepo.Setup(r => r.MarkAsReadAsync(userId, craftsmanId, readerRole))
                .Returns(Task.CompletedTask);

            // Act
            await _chatService.MarkAsReadAsync(userId, craftsmanId, readerRole);

            // Assert
            _mockChatRepo.Verify(r => r.MarkAsReadAsync(userId, craftsmanId, readerRole), Times.Once);
        }

        [Fact]
        public async Task MarkAsReadAsync_CompletesSuccessfully()
        {
            // Arrange
            var userId = 1;
            var craftsmanId = 2;
            var readerRole = "User";

            _mockChatRepo.Setup(r => r.MarkAsReadAsync(userId, craftsmanId, readerRole))
                .Returns(Task.CompletedTask);

            // Act & Assert (should not throw)
            await _chatService.MarkAsReadAsync(userId, craftsmanId, readerRole);

            // Verify it was called
            _mockChatRepo.Verify(r => r.MarkAsReadAsync(userId, craftsmanId, readerRole), Times.Once);
        }

        #endregion

        #region Edge Cases and Error Handling

        [Fact]
        public async Task GetChatsByUserIdAsync_WithZeroUserId_StillCallsRepository()
        {
            // Arrange
            _mockChatRepo.Setup(r => r.GetChatsByUserIdAsync(0))
                .ReturnsAsync(new List<Chat>());

            // Act
            var result = await _chatService.GetChatsByUserIdAsync(0);

            // Assert
            Assert.NotNull(result);
            _mockChatRepo.Verify(r => r.GetChatsByUserIdAsync(0), Times.Once);
        }

        [Fact]
        public async Task GetChatsByCraftsmanIdAsync_WithNegativeId_StillCallsRepository()
        {
            // Arrange
            _mockChatRepo.Setup(r => r.GetChatsByCraftsmanIdAsync(-1))
                .ReturnsAsync(new List<Chat>());

            // Act
            var result = await _chatService.GetChatsByCraftsmanIdAsync(-1);

            // Assert
            Assert.NotNull(result);
            _mockChatRepo.Verify(r => r.GetChatsByCraftsmanIdAsync(-1), Times.Once);
        }

        [Fact]
        public async Task SendMessageAsync_WithEmptyMessage_CallsRepository()
        {
            // Arrange
            var chat = new Chat
            {
                UserId = 1,
                CraftsmanId = 2,
                Message = "",
                SenderType = "User"
            };

            _mockChatRepo.Setup(r => r.SendMessageAsync(chat))
                .ReturnsAsync(new Chat { ChatId = 1, Message = "" });

            // Act
            var result = await _chatService.SendMessageAsync(chat);

            // Assert
            Assert.NotNull(result);
            _mockChatRepo.Verify(r => r.SendMessageAsync(It.IsAny<Chat>()), Times.Once);
        }

        #endregion
    }
}