using WebProdavnica.DAL.Abstract;
using WebProdavnica.Entities;

namespace WebProdavnica.BusinessLayer.Impl
{
    public class PaymentService : Abstract.IPaymentService
    {
        private readonly IPaymentRepository _paymentRepository;

        public PaymentService(IPaymentRepository paymentRepository)
        {
            _paymentRepository = paymentRepository;
        }

        public bool Add(Payment payment)
        {
            payment.PaymentDate = DateTime.Now;
            payment.PaymentStatus = "Completed";
            return _paymentRepository.Add(payment);
        }

        public List<Payment> GetByJob(int jobId) => _paymentRepository.GetByJob(jobId);
    }
}