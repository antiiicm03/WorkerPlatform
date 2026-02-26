using Xunit;
using Moq;
using WebProdavnica.BusinessLayer.Impl;
using WebProdavnica.BusinessLayer.Abstract;
using WebProdavnica.DAL.Abstract;
using WebProdavnica.Entities;
using WebProdavnica.Entities.DTOs;
using Entities.Configuration;

namespace WebProdavnica.UnitTest.Services
{
    public class AuthServiceTests
    {
        private readonly Mock<IUserRepository> _mockUserRepo;
        private readonly Mock<ICraftsmanRepository> _mockCraftsmanRepo;
        private readonly Mock<IJwtService> _mockJwtService;
        private readonly JwtSettings _jwtSettings;
        private readonly AuthService _authService;

        public AuthServiceTests()
        {
            _mockUserRepo = new Mock<IUserRepository>();
            _mockCraftsmanRepo = new Mock<ICraftsmanRepository>();
            _mockJwtService = new Mock<IJwtService>();

            _jwtSettings = new JwtSettings
            {
                AccessTokenExpirationMinutes = 60,
                RefreshTokenExpirationDays = 7,
                Secret = "test-secret-key-for-testing-purposes-only",
                Issuer = "TestIssuer",
                Audience = "TestAudience"
            };

            _authService = new AuthService(
                _mockUserRepo.Object,
                _mockCraftsmanRepo.Object,
                _mockJwtService.Object,
                _jwtSettings
            );
        }

        #region Login Tests - Craftsman

        [Fact]
        public void Login_WithValidCraftsmanCredentials_ReturnsAuthResponse()
        {
            // Arrange
            var passwordHash = BCrypt.Net.BCrypt.HashPassword("password123");
            var craftsman = new Craftsman
            {
                CraftsmanId = 1,
                Email = "craftsman@test.com",
                FirstName = "Petar",
                LastName = "Petrović",
                PasswordHash = passwordHash
            };

            var loginRequest = new LoginRequest
            {
                Email = "craftsman@test.com",
                Password = "password123",
                UserType = "craftsman"
            };

            _mockCraftsmanRepo.Setup(r => r.GetByEmail("craftsman@test.com")).Returns(craftsman);
            _mockCraftsmanRepo.Setup(r => r.Update(It.IsAny<Craftsman>())).Returns(true);
            _mockJwtService.Setup(j => j.GenerateRefreshToken()).Returns("refresh_token_123");
            _mockJwtService.Setup(j => j.GenerateAccessToken(
                It.IsAny<int>(),
                It.IsAny<string>(),
                It.IsAny<string>(),
                It.IsAny<string>()
            )).Returns("access_token_123");

            // Act
            var result = _authService.Login(loginRequest);

            // Assert
            Assert.NotNull(result);
            Assert.Equal("access_token_123", result.AccessToken);
            Assert.Equal("refresh_token_123", result.RefreshToken);
            Assert.Equal("craftsman@test.com", result.Email);
            Assert.Equal("Petar Petrović", result.FullName);
            Assert.Equal(1, result.UserId);
            Assert.Equal("Craftsman", result.Role);
            Assert.Equal(3600, result.ExpiresIn); // 60 minutes * 60 seconds

            // Verify refresh token was updated
            _mockCraftsmanRepo.Verify(r => r.Update(It.Is<Craftsman>(
                c => c.RefreshToken == "refresh_token_123" &&
                     c.RefreshTokenExpiry > DateTime.UtcNow
            )), Times.Once);
        }

        [Fact]
        public void Login_WithInvalidCraftsmanEmail_ReturnsNull()
        {
            // Arrange
            var loginRequest = new LoginRequest
            {
                Email = "nonexistent@test.com",
                Password = "password123",
                UserType = "craftsman"
            };

            _mockCraftsmanRepo.Setup(r => r.GetByEmail("nonexistent@test.com")).Returns((Craftsman)null);

            // Act
            var result = _authService.Login(loginRequest);

            // Assert
            Assert.Null(result);
            _mockCraftsmanRepo.Verify(r => r.Update(It.IsAny<Craftsman>()), Times.Never);
        }

        [Fact]
        public void Login_WithInvalidCraftsmanPassword_ReturnsNull()
        {
            // Arrange
            var passwordHash = BCrypt.Net.BCrypt.HashPassword("correct_password");
            var craftsman = new Craftsman
            {
                CraftsmanId = 1,
                Email = "craftsman@test.com",
                PasswordHash = passwordHash
            };

            var loginRequest = new LoginRequest
            {
                Email = "craftsman@test.com",
                Password = "wrong_password",
                UserType = "craftsman"
            };

            _mockCraftsmanRepo.Setup(r => r.GetByEmail("craftsman@test.com")).Returns(craftsman);

            // Act
            var result = _authService.Login(loginRequest);

            // Assert
            Assert.Null(result);
            _mockCraftsmanRepo.Verify(r => r.Update(It.IsAny<Craftsman>()), Times.Never);
        }

        [Fact]
        public void Login_WithNullCraftsmanPasswordHash_ReturnsNull()
        {
            // Arrange
            var craftsman = new Craftsman
            {
                CraftsmanId = 1,
                Email = "craftsman@test.com",
                PasswordHash = null // No password set
            };

            var loginRequest = new LoginRequest
            {
                Email = "craftsman@test.com",
                Password = "password123",
                UserType = "craftsman"
            };

            _mockCraftsmanRepo.Setup(r => r.GetByEmail("craftsman@test.com")).Returns(craftsman);

            // Act
            var result = _authService.Login(loginRequest);

            // Assert
            Assert.Null(result);
        }

        #endregion

        #region Login Tests - User

        [Fact]
        public void Login_WithValidUserCredentials_ReturnsAuthResponse()
        {
            // Arrange
            var passwordHash = BCrypt.Net.BCrypt.HashPassword("password123");
            var user = new User
            {
                UserId = 2,
                Email = "user@test.com",
                FirstName = "Marko",
                LastName = "Marković",
                PasswordHash = passwordHash
            };

            var loginRequest = new LoginRequest
            {
                Email = "user@test.com",
                Password = "password123",
                UserType = "user"
            };

            _mockUserRepo.Setup(r => r.GetByEmail("user@test.com")).Returns(user);
            _mockUserRepo.Setup(r => r.Update(It.IsAny<User>())).Returns(true);
            _mockJwtService.Setup(j => j.GenerateRefreshToken()).Returns("refresh_token_456");
            _mockJwtService.Setup(j => j.GenerateAccessToken(
                It.IsAny<int>(),
                It.IsAny<string>(),
                It.IsAny<string>(),
                It.IsAny<string>()
            )).Returns("access_token_456");

            // Act
            var result = _authService.Login(loginRequest);

            // Assert
            Assert.NotNull(result);
            Assert.Equal("access_token_456", result.AccessToken);
            Assert.Equal("refresh_token_456", result.RefreshToken);
            Assert.Equal("user@test.com", result.Email);
            Assert.Equal("Marko Marković", result.FullName);
            Assert.Equal(2, result.UserId);
            Assert.Equal("User", result.Role);

            // Verify refresh token was updated
            _mockUserRepo.Verify(r => r.Update(It.Is<User>(
                u => u.RefreshToken == "refresh_token_456" &&
                     u.RefreshTokenExpiry > DateTime.UtcNow
            )), Times.Once);
        }

        [Fact]
        public void Login_WithInvalidUserEmail_ReturnsNull()
        {
            // Arrange
            var loginRequest = new LoginRequest
            {
                Email = "nonexistent@test.com",
                Password = "password123",
                UserType = "user"
            };

            _mockUserRepo.Setup(r => r.GetByEmail("nonexistent@test.com")).Returns((User)null);

            // Act
            var result = _authService.Login(loginRequest);

            // Assert
            Assert.Null(result);
            _mockUserRepo.Verify(r => r.Update(It.IsAny<User>()), Times.Never);
        }

        [Fact]
        public void Login_WithInvalidUserPassword_ReturnsNull()
        {
            // Arrange
            var passwordHash = BCrypt.Net.BCrypt.HashPassword("correct_password");
            var user = new User
            {
                UserId = 2,
                Email = "user@test.com",
                PasswordHash = passwordHash
            };

            var loginRequest = new LoginRequest
            {
                Email = "user@test.com",
                Password = "wrong_password",
                UserType = "user"
            };

            _mockUserRepo.Setup(r => r.GetByEmail("user@test.com")).Returns(user);

            // Act
            var result = _authService.Login(loginRequest);

            // Assert
            Assert.Null(result);
            _mockUserRepo.Verify(r => r.Update(It.IsAny<User>()), Times.Never);
        }

        #endregion

        #region RegisterUser Tests

        [Fact]
        public void RegisterUser_WithValidRequest_CreatesUserAndReturnsAuthResponse()
        {
            // Arrange
            var request = new RegisterUserRequest
            {
                FirstName = "Ana",
                LastName = "Anić",
                Email = "ana@test.com",
                Phone = "123456789",
                Location = "Beograd",
                Password = "password123"
            };

            // Setup sequence: first call returns null (email doesn't exist), second call returns the created user (for login)
            var createdUser = new User
            {
                UserId = 3,
                FirstName = "Ana",
                LastName = "Anić",
                Email = "ana@test.com",
                PasswordHash = BCrypt.Net.BCrypt.HashPassword("password123")
            };

            _mockUserRepo.SetupSequence(r => r.GetByEmail("ana@test.com"))
                .Returns((User)null)  // First call - email check (doesn't exist)
                .Returns(createdUser); // Second call - login after registration

            _mockUserRepo.Setup(r => r.Add(It.IsAny<User>())).Returns(true);
            _mockUserRepo.Setup(r => r.Update(It.IsAny<User>())).Returns(true);
            _mockJwtService.Setup(j => j.GenerateRefreshToken()).Returns("refresh_token_789");
            _mockJwtService.Setup(j => j.GenerateAccessToken(
                It.IsAny<int>(),
                It.IsAny<string>(),
                It.IsAny<string>(),
                It.IsAny<string>()
            )).Returns("access_token_789");

            // Act
            var result = _authService.RegisterUser(request);

            // Assert
            Assert.NotNull(result);
            Assert.Equal("ana@test.com", result.Email);
            Assert.Equal("User", result.Role);

            // Verify user was added with hashed password
            _mockUserRepo.Verify(r => r.Add(It.Is<User>(
                u => u.FirstName == "Ana" &&
                     u.LastName == "Anić" &&
                     u.Email == "ana@test.com" &&
                     u.Phone == "123456789" &&
                     u.Location == "Beograd" &&
                     !string.IsNullOrEmpty(u.PasswordHash) &&
                     u.CreatedAt != default(DateTime)
            )), Times.Once);
        }

        [Fact]
        public void RegisterUser_WithExistingEmail_ReturnsNull()
        {
            // Arrange
            var existingUser = new User
            {
                UserId = 1,
                Email = "existing@test.com"
            };

            var request = new RegisterUserRequest
            {
                FirstName = "Test",
                LastName = "User",
                Email = "existing@test.com",
                Password = "password123"
            };

            _mockUserRepo.Setup(r => r.GetByEmail("existing@test.com")).Returns(existingUser);

            // Act
            var result = _authService.RegisterUser(request);

            // Assert
            Assert.Null(result);
            _mockUserRepo.Verify(r => r.Add(It.IsAny<User>()), Times.Never);
        }

        [Fact]
        public void RegisterUser_HashesPassword()
        {
            // Arrange
            var request = new RegisterUserRequest
            {
                FirstName = "Test",
                LastName = "User",
                Email = "test@test.com",
                Password = "plaintext_password"
            };

            User capturedUser = null;
            _mockUserRepo.Setup(r => r.GetByEmail("test@test.com")).Returns((User)null);
            _mockUserRepo.Setup(r => r.Add(It.IsAny<User>()))
                .Callback<User>(u => capturedUser = u)
                .Returns(true);

            // Act
            _authService.RegisterUser(request);

            // Assert
            Assert.NotNull(capturedUser);
            Assert.NotEqual("plaintext_password", capturedUser.PasswordHash);
            Assert.True(BCrypt.Net.BCrypt.Verify("plaintext_password", capturedUser.PasswordHash));
        }

        #endregion

        #region RegisterCraftsman Tests

        [Fact]
        public void RegisterCraftsman_WithValidRequest_CreatesCraftsmanAndReturnsAuthResponse()
        {
            // Arrange
            var request = new RegisterCraftsmanRequest
            {
                FirstName = "Nikola",
                LastName = "Nikolić",
                Email = "nikola@test.com",
                Phone = "987654321",
                Location = "Novi Sad",
                Profession = "Stolar",
                Experience = 5,
                HourlyRate = 2000,
                WorkingHours = "8-16",
                Password = "password123"
            };

            // Setup sequence: first call returns null (email doesn't exist), second call returns the created craftsman (for login)
            var createdCraftsman = new Craftsman
            {
                CraftsmanId = 4,
                FirstName = "Nikola",
                LastName = "Nikolić",
                Email = "nikola@test.com",
                PasswordHash = BCrypt.Net.BCrypt.HashPassword("password123")
            };

            _mockCraftsmanRepo.SetupSequence(r => r.GetByEmail("nikola@test.com"))
                .Returns((Craftsman)null)  // First call - email check (doesn't exist)
                .Returns(createdCraftsman); // Second call - login after registration

            _mockCraftsmanRepo.Setup(r => r.Add(It.IsAny<Craftsman>())).Returns(true);
            _mockCraftsmanRepo.Setup(r => r.Update(It.IsAny<Craftsman>())).Returns(true);
            _mockJwtService.Setup(j => j.GenerateRefreshToken()).Returns("refresh_token_999");
            _mockJwtService.Setup(j => j.GenerateAccessToken(
                It.IsAny<int>(),
                It.IsAny<string>(),
                It.IsAny<string>(),
                It.IsAny<string>()
            )).Returns("access_token_999");

            // Act
            var result = _authService.RegisterCraftsman(request);

            // Assert
            Assert.NotNull(result);
            Assert.Equal("nikola@test.com", result.Email);
            Assert.Equal("Craftsman", result.Role);

            // Verify craftsman was added with all properties
            _mockCraftsmanRepo.Verify(r => r.Add(It.Is<Craftsman>(
                c => c.FirstName == "Nikola" &&
                     c.LastName == "Nikolić" &&
                     c.Email == "nikola@test.com" &&
                     c.Phone == "987654321" &&
                     c.Location == "Novi Sad" &&
                     c.Profession == "Stolar" &&
                     c.Experience == 5 &&
                     c.HourlyRate == 2000 &&
                     c.WorkingHours == "8-16" &&
                     !string.IsNullOrEmpty(c.PasswordHash)
            )), Times.Once);
        }

        [Fact]
        public void RegisterCraftsman_WithExistingEmail_ReturnsNull()
        {
            // Arrange
            var existingCraftsman = new Craftsman
            {
                CraftsmanId = 1,
                Email = "existing@test.com"
            };

            var request = new RegisterCraftsmanRequest
            {
                FirstName = "Test",
                LastName = "Craftsman",
                Email = "existing@test.com",
                Password = "password123",
                Profession = "Test",
                Experience = 1,
                HourlyRate = 1000,
                WorkingHours = "9-17"
            };

            _mockCraftsmanRepo.Setup(r => r.GetByEmail("existing@test.com")).Returns(existingCraftsman);

            // Act
            var result = _authService.RegisterCraftsman(request);

            // Assert
            Assert.Null(result);
            _mockCraftsmanRepo.Verify(r => r.Add(It.IsAny<Craftsman>()), Times.Never);
        }

        [Fact]
        public void RegisterCraftsman_HashesPassword()
        {
            // Arrange
            var request = new RegisterCraftsmanRequest
            {
                FirstName = "Test",
                LastName = "Craftsman",
                Email = "test@test.com",
                Password = "plaintext_password",
                Profession = "Test",
                Experience = 1,
                HourlyRate = 1000,
                WorkingHours = "9-17"
            };

            Craftsman capturedCraftsman = null;
            _mockCraftsmanRepo.Setup(r => r.GetByEmail("test@test.com")).Returns((Craftsman)null);
            _mockCraftsmanRepo.Setup(r => r.Add(It.IsAny<Craftsman>()))
                .Callback<Craftsman>(c => capturedCraftsman = c)
                .Returns(true);

            // Act
            _authService.RegisterCraftsman(request);

            // Assert
            Assert.NotNull(capturedCraftsman);
            Assert.NotEqual("plaintext_password", capturedCraftsman.PasswordHash);
            Assert.True(BCrypt.Net.BCrypt.Verify("plaintext_password", capturedCraftsman.PasswordHash));
        }

        #endregion

        #region JWT Settings Tests

        [Fact]
        public void Login_SetsCorrectRefreshTokenExpiry()
        {
            // Arrange
            var passwordHash = BCrypt.Net.BCrypt.HashPassword("password123");
            var user = new User
            {
                UserId = 1,
                Email = "user@test.com",
                PasswordHash = passwordHash
            };

            var loginRequest = new LoginRequest
            {
                Email = "user@test.com",
                Password = "password123",
                UserType = "user"
            };

            var beforeLogin = DateTime.UtcNow;

            _mockUserRepo.Setup(r => r.GetByEmail("user@test.com")).Returns(user);
            _mockUserRepo.Setup(r => r.Update(It.IsAny<User>())).Returns(true);
            _mockJwtService.Setup(j => j.GenerateRefreshToken()).Returns("token");
            _mockJwtService.Setup(j => j.GenerateAccessToken(
                It.IsAny<int>(), It.IsAny<string>(), It.IsAny<string>(), It.IsAny<string>()
            )).Returns("token");

            // Act
            _authService.Login(loginRequest);

            // Assert
            _mockUserRepo.Verify(r => r.Update(It.Is<User>(u =>
                u.RefreshTokenExpiry >= beforeLogin.AddDays(7) &&
                u.RefreshTokenExpiry <= DateTime.UtcNow.AddDays(7).AddMinutes(1)
            )), Times.Once);
        }

        [Fact]
        public void Login_ReturnsCorrectExpiresInSeconds()
        {
            // Arrange
            var passwordHash = BCrypt.Net.BCrypt.HashPassword("password123");
            var user = new User
            {
                UserId = 1,
                Email = "user@test.com",
                PasswordHash = passwordHash
            };

            var loginRequest = new LoginRequest
            {
                Email = "user@test.com",
                Password = "password123",
                UserType = "user"
            };

            _mockUserRepo.Setup(r => r.GetByEmail("user@test.com")).Returns(user);
            _mockUserRepo.Setup(r => r.Update(It.IsAny<User>())).Returns(true);
            _mockJwtService.Setup(j => j.GenerateRefreshToken()).Returns("token");
            _mockJwtService.Setup(j => j.GenerateAccessToken(
                It.IsAny<int>(), It.IsAny<string>(), It.IsAny<string>(), It.IsAny<string>()
            )).Returns("token");

            // Act
            var result = _authService.Login(loginRequest);

            // Assert
            Assert.NotNull(result);
            Assert.Equal(3600, result.ExpiresIn); // 60 minutes * 60 seconds
        }

        #endregion
    }
}