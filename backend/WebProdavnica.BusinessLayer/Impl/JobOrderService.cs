using WebProdavnica.DAL.Abstract;
using WebProdavnica.Entities;

namespace WebProdavnica.BusinessLayer.Impl
{
    public class JobOrderService : Abstract.IJobOrderService
    {
        private readonly IJobOrderRepository _jobOrderRepository;

        public JobOrderService(IJobOrderRepository jobOrderRepository)
        {
            _jobOrderRepository = jobOrderRepository;
        }

        public bool Add(JobOrder jobOrder)
        {
            return _jobOrderRepository.Add(jobOrder);
        }

        public bool Update(JobOrder jobOrder) => _jobOrderRepository.Update(jobOrder);

        public bool Delete(int id) => _jobOrderRepository.Delete(id);

        public JobOrder? Get(int id) => _jobOrderRepository.Get(id);

        public List<JobOrder> GetAll() => _jobOrderRepository.GetAll();

        public List<JobOrder> GetByUser(int userId) =>
            _jobOrderRepository.GetAll()
                .Where(j => j.UserId == userId)
                .OrderByDescending(j => j.ScheduledDate)
                .ToList();

        public List<JobOrder> GetByCraftsman(int craftsmanId) =>
            _jobOrderRepository.GetAll()
                .Where(j => j.CraftsmanId == craftsmanId)
                .OrderByDescending(j => j.ScheduledDate)
                .ToList();

        
        public List<JobOrder> GetByCraftsmanId(int id) =>
            _jobOrderRepository.GetByCraftsmanId(id);

        public List<JobOrder> GetByStatus(string status) =>
            _jobOrderRepository.GetAll()
                .Where(j => j.Status.ToLower() == status.ToLower())
                .ToList();

        public List<JobOrder> GetUrgent() =>
            _jobOrderRepository.GetAll()
                .Where(j => j.Urgent == true)
                .OrderBy(j => j.ScheduledDate)
                .ToList();

        public bool UpdateStatus(int jobId, string status)
        {
            var job = _jobOrderRepository.Get(jobId);
            if (job == null) return false;
            job.Status = status;
            return _jobOrderRepository.Update(job);
        }
    }
}