namespace WebProdavnica.BusinessLayer.Abstract
{
    public interface IJwtService
    {
        string GenerateAccessToken(int userId, string email, string fullName, string role);
        string GenerateRefreshToken();
    }
}