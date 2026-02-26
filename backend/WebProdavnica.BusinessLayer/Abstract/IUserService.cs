using WebProdavnica.Entities;

namespace WebProdavnica.BusinessLayer.Abstract
{
    public interface IUserService
    {
        bool Add(User user);
        bool Update(User user);
        bool Delete(int id);
        User? Get(int id);
        List<User> GetAll();

        bool UpdatePassword(int userId, string newPasswordHash);
    }
}