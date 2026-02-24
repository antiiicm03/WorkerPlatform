using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using WebProdavnica.Entities;

namespace WebProdavnica.DAL.Abstract
{

    public interface IUserRepository
    {
        bool Add(User user);
        bool Update(User user);
        bool Delete(int id);
        User Get(int id);
        List<User> GetAll();
        User? GetByEmail(string email);
    }
}
