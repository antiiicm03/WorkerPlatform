using Xunit;
using Moq;
using WebProdavnica.BusinessLayer.Impl;
using WebProdavnica.DAL.Abstract;
using WebProdavnica.Entities;

namespace WebProdavnica.UnitTest.Services
{
    public class UserServiceTests
    {
        private readonly Mock<IUserRepository> _mockUserRepo;
        private readonly UserService _userService;

        public UserServiceTests()
        {
            _mockUserRepo = new Mock<IUserRepository>();
            _userService = new UserService(_mockUserRepo.Object);
        }

        #region Add Tests

        [Fact]
        public void Add_WithValidUser_ReturnsTrue()
        {
            // Arrange
            var user = new User
            {
                FirstName = "Marko",
                LastName = "Marković",
                Email = "marko@test.com",
                Phone = "123456789",
                Location = "Beograd"
            };

            _mockUserRepo.Setup(r => r.Add(user)).Returns(true);

            // Act
            var result = _userService.Add(user);

            // Assert
            Assert.True(result);
            _mockUserRepo.Verify(r => r.Add(user), Times.Once);
        }

        [Fact]
        public void Add_WhenRepositoryFails_ReturnsFalse()
        {
            // Arrange
            var user = new User { FirstName = "Test" };
            _mockUserRepo.Setup(r => r.Add(user)).Returns(false);

            // Act
            var result = _userService.Add(user);

            // Assert
            Assert.False(result);
        }

        [Fact]
        public void Add_CallsRepositoryOnce()
        {
            // Arrange
            var user = new User { Email = "test@test.com" };
            _mockUserRepo.Setup(r => r.Add(user)).Returns(true);

            // Act
            _userService.Add(user);

            // Assert
            _mockUserRepo.Verify(r => r.Add(It.IsAny<User>()), Times.Once);
        }

        #endregion

        #region Update Tests

        [Fact]
        public void Update_WithValidUser_ReturnsTrue()
        {
            // Arrange
            var user = new User
            {
                UserId = 1,
                FirstName = "Updated",
                LastName = "Name",
                Email = "updated@test.com"
            };

            _mockUserRepo.Setup(r => r.Update(user)).Returns(true);

            // Act
            var result = _userService.Update(user);

            // Assert
            Assert.True(result);
            _mockUserRepo.Verify(r => r.Update(user), Times.Once);
        }

        [Fact]
        public void Update_WhenRepositoryFails_ReturnsFalse()
        {
            // Arrange
            var user = new User { UserId = 999 };
            _mockUserRepo.Setup(r => r.Update(user)).Returns(false);

            // Act
            var result = _userService.Update(user);

            // Assert
            Assert.False(result);
        }

        [Fact]
        public void Update_CallsRepositoryOnce()
        {
            // Arrange
            var user = new User { UserId = 1 };
            _mockUserRepo.Setup(r => r.Update(user)).Returns(true);

            // Act
            _userService.Update(user);

            // Assert
            _mockUserRepo.Verify(r => r.Update(It.IsAny<User>()), Times.Once);
        }

        #endregion

        #region Delete Tests

        [Fact]
        public void Delete_WithValidId_ReturnsTrue()
        {
            // Arrange
            _mockUserRepo.Setup(r => r.Delete(1)).Returns(true);

            // Act
            var result = _userService.Delete(1);

            // Assert
            Assert.True(result);
            _mockUserRepo.Verify(r => r.Delete(1), Times.Once);
        }

        [Fact]
        public void Delete_WithInvalidId_ReturnsFalse()
        {
            // Arrange
            _mockUserRepo.Setup(r => r.Delete(999)).Returns(false);

            // Act
            var result = _userService.Delete(999);

            // Assert
            Assert.False(result);
        }

        [Fact]
        public void Delete_CallsRepositoryWithCorrectId()
        {
            // Arrange
            var userId = 42;
            _mockUserRepo.Setup(r => r.Delete(userId)).Returns(true);

            // Act
            _userService.Delete(userId);

            // Assert
            _mockUserRepo.Verify(r => r.Delete(42), Times.Once);
        }

        [Theory]
        [InlineData(1)]
        [InlineData(5)]
        [InlineData(100)]
        public void Delete_WithDifferentIds_CallsRepository(int userId)
        {
            // Arrange
            _mockUserRepo.Setup(r => r.Delete(userId)).Returns(true);

            // Act
            _userService.Delete(userId);

            // Assert
            _mockUserRepo.Verify(r => r.Delete(userId), Times.Once);
        }

        #endregion

        #region Get Tests

        [Fact]
        public void Get_WithValidId_ReturnsUser()
        {
            // Arrange
            var expectedUser = new User
            {
                UserId = 1,
                FirstName = "Ana",
                LastName = "Anić",
                Email = "ana@test.com",
                Phone = "987654321"
            };

            _mockUserRepo.Setup(r => r.Get(1)).Returns(expectedUser);

            // Act
            var result = _userService.Get(1);

            // Assert
            Assert.NotNull(result);
            Assert.Equal(1, result.UserId);
            Assert.Equal("Ana", result.FirstName);
            Assert.Equal("Anić", result.LastName);
            Assert.Equal("ana@test.com", result.Email);
            _mockUserRepo.Verify(r => r.Get(1), Times.Once);
        }

        [Fact]
        public void Get_WithInvalidId_ReturnsNull()
        {
            // Arrange
            _mockUserRepo.Setup(r => r.Get(999)).Returns((User)null);

            // Act
            var result = _userService.Get(999);

            // Assert
            Assert.Null(result);
            _mockUserRepo.Verify(r => r.Get(999), Times.Once);
        }

        [Fact]
        public void Get_CallsRepositoryWithCorrectId()
        {
            // Arrange
            _mockUserRepo.Setup(r => r.Get(123)).Returns(new User { UserId = 123 });

            // Act
            _userService.Get(123);

            // Assert
            _mockUserRepo.Verify(r => r.Get(123), Times.Once);
        }

        [Theory]
        [InlineData(1)]
        [InlineData(10)]
        [InlineData(100)]
        public void Get_WithDifferentIds_CallsRepository(int userId)
        {
            // Arrange
            _mockUserRepo.Setup(r => r.Get(userId))
                .Returns(new User { UserId = userId });

            // Act
            var result = _userService.Get(userId);

            // Assert
            Assert.NotNull(result);
            Assert.Equal(userId, result.UserId);
        }

        #endregion

        #region GetAll Tests

        [Fact]
        public void GetAll_ReturnsAllUsers()
        {
            // Arrange
            var expectedUsers = new List<User>
            {
                new User { UserId = 1, FirstName = "Marko" },
                new User { UserId = 2, FirstName = "Ana" },
                new User { UserId = 3, FirstName = "Petar" }
            };

            _mockUserRepo.Setup(r => r.GetAll()).Returns(expectedUsers);

            // Act
            var result = _userService.GetAll();

            // Assert
            Assert.NotNull(result);
            Assert.Equal(3, result.Count);
            Assert.Equal("Marko", result[0].FirstName);
            Assert.Equal("Ana", result[1].FirstName);
            Assert.Equal("Petar", result[2].FirstName);
            _mockUserRepo.Verify(r => r.GetAll(), Times.Once);
        }

        [Fact]
        public void GetAll_WithNoData_ReturnsEmptyList()
        {
            // Arrange
            _mockUserRepo.Setup(r => r.GetAll()).Returns(new List<User>());

            // Act
            var result = _userService.GetAll();

            // Assert
            Assert.NotNull(result);
            Assert.Empty(result);
        }

        [Fact]
        public void GetAll_CallsRepositoryOnce()
        {
            // Arrange
            _mockUserRepo.Setup(r => r.GetAll()).Returns(new List<User>());

            // Act
            _userService.GetAll();

            // Assert
            _mockUserRepo.Verify(r => r.GetAll(), Times.Once);
        }

        [Fact]
        public void GetAll_ReturnsExactRepositoryResult()
        {
            // Arrange
            var expectedList = new List<User>
            {
                new User { UserId = 1 }
            };
            _mockUserRepo.Setup(r => r.GetAll()).Returns(expectedList);

            // Act
            var result = _userService.GetAll();

            // Assert
            Assert.Same(expectedList, result); // Returns exact same instance
        }

        #endregion

        #region UpdatePassword Tests

        [Fact]
        public void UpdatePassword_WithValidParameters_ReturnsTrue()
        {
            // Arrange
            var userId = 1;
            var newPasswordHash = BCrypt.Net.BCrypt.HashPassword("newPassword123");

            _mockUserRepo.Setup(r => r.UpdatePassword(userId, newPasswordHash))
                .Returns(true);

            // Act
            var result = _userService.UpdatePassword(userId, newPasswordHash);

            // Assert
            Assert.True(result);
            _mockUserRepo.Verify(r => r.UpdatePassword(userId, newPasswordHash), Times.Once);
        }

        [Fact]
        public void UpdatePassword_WithInvalidUserId_ReturnsFalse()
        {
            // Arrange
            var userId = 999;
            var newPasswordHash = "hashedPassword";

            _mockUserRepo.Setup(r => r.UpdatePassword(userId, newPasswordHash))
                .Returns(false);

            // Act
            var result = _userService.UpdatePassword(userId, newPasswordHash);

            // Assert
            Assert.False(result);
        }

        [Fact]
        public void UpdatePassword_CallsRepositoryWithCorrectParameters()
        {
            // Arrange
            var userId = 42;
            var passwordHash = "testHash123";

            _mockUserRepo.Setup(r => r.UpdatePassword(userId, passwordHash))
                .Returns(true);

            // Act
            _userService.UpdatePassword(userId, passwordHash);

            // Assert
            _mockUserRepo.Verify(r => r.UpdatePassword(42, "testHash123"), Times.Once);
        }

        [Fact]
        public void UpdatePassword_WithHashedPassword_Works()
        {
            // Arrange
            var userId = 1;
            var plainPassword = "MySecurePassword123!";
            var hashedPassword = BCrypt.Net.BCrypt.HashPassword(plainPassword);

            _mockUserRepo.Setup(r => r.UpdatePassword(userId, hashedPassword))
                .Returns(true);

            // Act
            var result = _userService.UpdatePassword(userId, hashedPassword);

            // Assert
            Assert.True(result);
            Assert.NotEqual(plainPassword, hashedPassword); // Verify it's actually hashed
            Assert.True(BCrypt.Net.BCrypt.Verify(plainPassword, hashedPassword)); // Verify hash is valid
        }

        [Theory]
        [InlineData(1, "hash1")]
        [InlineData(5, "hash2")]
        [InlineData(10, "hash3")]
        public void UpdatePassword_WithDifferentParameters_CallsRepository(
            int userId,
            string passwordHash)
        {
            // Arrange
            _mockUserRepo.Setup(r => r.UpdatePassword(userId, passwordHash))
                .Returns(true);

            // Act
            _userService.UpdatePassword(userId, passwordHash);

            // Assert
            _mockUserRepo.Verify(r => r.UpdatePassword(userId, passwordHash), Times.Once);
        }

        [Fact]
        public void UpdatePassword_WhenRepositoryFails_ReturnsFalse()
        {
            // Arrange
            _mockUserRepo.Setup(r => r.UpdatePassword(It.IsAny<int>(), It.IsAny<string>()))
                .Returns(false);

            // Act
            var result = _userService.UpdatePassword(1, "anyHash");

            // Assert
            Assert.False(result);
        }

        #endregion

        #region Integration-Style Tests

        [Fact]
        public void Add_Then_Get_ReturnsAddedUser()
        {
            // Arrange
            var user = new User
            {
                UserId = 1,
                FirstName = "Test",
                Email = "test@test.com"
            };

            _mockUserRepo.Setup(r => r.Add(user)).Returns(true);
            _mockUserRepo.Setup(r => r.Get(1)).Returns(user);

            // Act
            var addResult = _userService.Add(user);
            var getResult = _userService.Get(1);

            // Assert
            Assert.True(addResult);
            Assert.NotNull(getResult);
            Assert.Equal(user.Email, getResult.Email);
        }

        [Fact]
        public void Update_Then_Get_ReturnsUpdatedUser()
        {
            // Arrange
            var originalUser = new User { UserId = 1, FirstName = "Original" };
            var updatedUser = new User { UserId = 1, FirstName = "Updated" };

            _mockUserRepo.Setup(r => r.Update(updatedUser)).Returns(true);
            _mockUserRepo.Setup(r => r.Get(1)).Returns(updatedUser);

            // Act
            var updateResult = _userService.Update(updatedUser);
            var getResult = _userService.Get(1);

            // Assert
            Assert.True(updateResult);
            Assert.Equal("Updated", getResult.FirstName);
        }

        [Fact]
        public void Delete_Then_Get_ReturnsNull()
        {
            // Arrange
            _mockUserRepo.Setup(r => r.Delete(1)).Returns(true);
            _mockUserRepo.Setup(r => r.Get(1)).Returns((User)null);

            // Act
            var deleteResult = _userService.Delete(1);
            var getResult = _userService.Get(1);

            // Assert
            Assert.True(deleteResult);
            Assert.Null(getResult);
        }

        #endregion

        #region Edge Cases

        [Fact]
        public void Get_WithZeroId_CallsRepository()
        {
            // Arrange
            _mockUserRepo.Setup(r => r.Get(0)).Returns((User)null);

            // Act
            var result = _userService.Get(0);

            // Assert
            Assert.Null(result);
            _mockUserRepo.Verify(r => r.Get(0), Times.Once);
        }

        [Fact]
        public void Get_WithNegativeId_CallsRepository()
        {
            // Arrange
            _mockUserRepo.Setup(r => r.Get(-1)).Returns((User)null);

            // Act
            var result = _userService.Get(-1);

            // Assert
            Assert.Null(result);
            _mockUserRepo.Verify(r => r.Get(-1), Times.Once);
        }

        [Fact]
        public void UpdatePassword_WithEmptyHash_StillCallsRepository()
        {
            // Arrange
            _mockUserRepo.Setup(r => r.UpdatePassword(1, "")).Returns(true);

            // Act
            var result = _userService.UpdatePassword(1, "");

            // Assert
            Assert.True(result);
            _mockUserRepo.Verify(r => r.UpdatePassword(1, ""), Times.Once);
        }

        [Fact]
        public void Add_WithNullProperties_StillCallsRepository()
        {
            // Arrange
            var user = new User { UserId = 1 }; // Only ID set, other properties null
            _mockUserRepo.Setup(r => r.Add(user)).Returns(true);

            // Act
            var result = _userService.Add(user);

            // Assert
            Assert.True(result);
        }

        #endregion

        #region Verify No Side Effects

        [Fact]
        public void Add_DoesNotModifyUserObject()
        {
            // Arrange
            var user = new User
            {
                UserId = 1,
                FirstName = "Original",
                Email = "original@test.com"
            };
            var originalFirstName = user.FirstName;
            var originalEmail = user.Email;

            _mockUserRepo.Setup(r => r.Add(user)).Returns(true);

            // Act
            _userService.Add(user);

            // Assert
            Assert.Equal(originalFirstName, user.FirstName); // Unchanged
            Assert.Equal(originalEmail, user.Email); // Unchanged
        }

        [Fact]
        public void Update_DoesNotModifyUserObject()
        {
            // Arrange
            var user = new User
            {
                UserId = 1,
                FirstName = "Test",
                LastName = "User"
            };
            var originalLastName = user.LastName;

            _mockUserRepo.Setup(r => r.Update(user)).Returns(true);

            // Act
            _userService.Update(user);

            // Assert
            Assert.Equal(originalLastName, user.LastName); // Unchanged
        }

        #endregion
    }
}