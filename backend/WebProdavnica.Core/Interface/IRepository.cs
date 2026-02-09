using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace WebProdavnica.Core.Interface
{
    public interface IRepository<T>
    {
        // CRUD operacije
        List<T> GetAll();
        T Get(int id);
        bool Add(T item);
        bool Update(T item);
        bool Delete(int Id);
    }
}
