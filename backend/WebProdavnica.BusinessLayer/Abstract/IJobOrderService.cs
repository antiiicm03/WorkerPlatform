using WebProdavnica.Entities;

namespace WebProdavnica.BusinessLayer.Abstract
{
    public interface IJobOrderService
    {
        bool Add(JobOrder jobOrder);
        bool Update(JobOrder jobOrder);
        bool Delete(int id);
        JobOrder? Get(int id);
        List<JobOrder> GetAll();
        List<JobOrder> GetByUser(int userId);
        List<JobOrder> GetByCraftsman(int craftsmanId);
        List<JobOrder> GetByCraftsmanId(int id);
        List<JobOrder> GetByStatus(string status);
        List<JobOrder> GetUrgent();
        bool UpdateStatus(int jobId, string status);
    }
}