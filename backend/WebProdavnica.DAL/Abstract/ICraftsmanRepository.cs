using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using WebProdavnica.Entities;

namespace WebProdavnica.DAL.Abstract
{
    public interface ICraftsmanRepository
    {
        bool Add(Craftsman c);
        bool Update(Craftsman c);
        bool Delete(int id);
        Craftsman Get(int id);
        List<Craftsman> GetAll();

        Craftsman? GetByEmail(string email);
    }
}
