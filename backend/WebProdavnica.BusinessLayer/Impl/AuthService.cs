using Entities.Configuration;
using WebProdavnica.BusinessLayer.Abstract;
using WebProdavnica.DAL.Abstract;
using WebProdavnica.Entities;
using WebProdavnica.Entities.DTOs;

namespace WebProdavnica.BusinessLayer.Impl
{
    public class AuthService : IAuthService
    {
        private readonly IUserRepository _userRepository;
        private readonly ICraftsmanRepository _craftsmanRepository;
        private readonly IJwtService _jwtService;
        private readonly JwtSettings _jwtSettings;

        public AuthService(
            IUserRepository userRepository,
            ICraftsmanRepository craftsmanRepository,
            IJwtService jwtService,
            JwtSettings jwtSettings)
        {
            _userRepository = userRepository;
            _craftsmanRepository = craftsmanRepository;
            _jwtService = jwtService;
            _jwtSettings = jwtSettings;
        }

        public AuthResponse? Login(LoginRequest request)
        {
            if (request.UserType == "craftsman")
            {
                var craftsman = _craftsmanRepository.GetByEmail(request.Email);
                if (craftsman == null || string.IsNullOrEmpty(craftsman.PasswordHash))
                    return null;

                if (!BCrypt.Net.BCrypt.Verify(request.Password, craftsman.PasswordHash))
                    return null;

                craftsman.RefreshToken = _jwtService.GenerateRefreshToken();
                craftsman.RefreshTokenExpiry = DateTime.UtcNow.AddDays(_jwtSettings.RefreshTokenExpirationDays);
                _craftsmanRepository.Update(craftsman);

                var accessToken = _jwtService.GenerateAccessToken(
                    craftsman.CraftsmanId,
                    craftsman.Email,
                    $"{craftsman.FirstName} {craftsman.LastName}",
                    "Craftsman"
                );

                return new AuthResponse
                {
                    AccessToken = accessToken,
                    RefreshToken = craftsman.RefreshToken,
                    ExpiresIn = _jwtSettings.AccessTokenExpirationMinutes * 60,
                    Email = craftsman.Email,
                    FullName = $"{craftsman.FirstName} {craftsman.LastName}",
                    UserId = craftsman.CraftsmanId,
                    Role = "Craftsman"
                };
            }
            else
            {
                var user = _userRepository.GetByEmail(request.Email);
                if (user == null || string.IsNullOrEmpty(user.PasswordHash))
                    return null;

                if (!BCrypt.Net.BCrypt.Verify(request.Password, user.PasswordHash))
                    return null;

                user.RefreshToken = _jwtService.GenerateRefreshToken();
                user.RefreshTokenExpiry = DateTime.UtcNow.AddDays(_jwtSettings.RefreshTokenExpirationDays);
                _userRepository.Update(user);

                var accessToken = _jwtService.GenerateAccessToken(
                    user.UserId,
                    user.Email,
                    $"{user.FirstName} {user.LastName}",
                    "User"
                );

                return new AuthResponse
                {
                    AccessToken = accessToken,
                    RefreshToken = user.RefreshToken,
                    ExpiresIn = _jwtSettings.AccessTokenExpirationMinutes * 60,
                    Email = user.Email,
                    FullName = $"{user.FirstName} {user.LastName}",
                    UserId = user.UserId,
                    Role = "User"
                };
            }
        }

        public AuthResponse? RegisterUser(RegisterUserRequest request)
        {
            if (_userRepository.GetByEmail(request.Email) != null)
                return null;

            var user = new User
            {
                FirstName = request.FirstName,
                LastName = request.LastName,
                Email = request.Email,
                Phone = request.Phone,
                Location = request.Location,
                PasswordHash = BCrypt.Net.BCrypt.HashPassword(request.Password),
                CreatedAt = DateTime.Now
            };

            _userRepository.Add(user);

            return Login(new LoginRequest
            {
                Email = request.Email,
                Password = request.Password,
                UserType = "user"
            });
        }

        public AuthResponse? RegisterCraftsman(RegisterCraftsmanRequest request)
        {
            if (_craftsmanRepository.GetByEmail(request.Email) != null)
                return null;

            var craftsman = new Craftsman
            {
                FirstName = request.FirstName,
                LastName = request.LastName,
                Email = request.Email,
                Phone = request.Phone,
                Location = request.Location,
                Profession = request.Profession,
                Experience = request.Experience,
                HourlyRate = request.HourlyRate,
                WorkingHours = request.WorkingHours,
                PasswordHash = BCrypt.Net.BCrypt.HashPassword(request.Password)
            };

            _craftsmanRepository.Add(craftsman);

            return Login(new LoginRequest
            {
                Email = request.Email,
                Password = request.Password,
                UserType = "craftsman"
            });
        }
    }
}