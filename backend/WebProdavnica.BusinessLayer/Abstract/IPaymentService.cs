using WebProdavnica.Entities;

namespace WebProdavnica.BusinessLayer.Abstract
{
    public interface IPaymentService
    {
        bool Add(Payment payment);
        List<Payment> GetByJob(int jobId);
    }
}