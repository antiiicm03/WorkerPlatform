using WebProdavnica.Entities.DTOs;

namespace WebProdavnica.BusinessLayer.Abstract
{
    public interface IAuthService
    {
        AuthResponse? Login(LoginRequest request);
        AuthResponse? RegisterUser(RegisterUserRequest request);
        AuthResponse? RegisterCraftsman(RegisterCraftsmanRequest request);
    }
}