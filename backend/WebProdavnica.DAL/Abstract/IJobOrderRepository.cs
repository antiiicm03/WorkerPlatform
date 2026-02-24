using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using WebProdavnica.Entities;

namespace WebProdavnica.DAL.Abstract
{
    public interface IJobOrderRepository
    {
        bool Add(JobOrder j);
        bool Update(JobOrder j);
        bool Delete(int id);
        JobOrder Get(int id);
        List<JobOrder> GetAll();

        List<JobOrder> GetByCraftsmanId(int id);
    }
}
