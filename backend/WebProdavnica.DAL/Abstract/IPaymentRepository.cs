using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using WebProdavnica.Entities;

namespace WebProdavnica.DAL.Abstract
{
    public interface IPaymentRepository
    {
        bool Add(Payment p);
        List<Payment> GetByJob(int jobId);
    }
}
