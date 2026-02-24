using WebProdavnica.Entities;

namespace WebProdavnica.BusinessLayer.Abstract
{
    public interface IReviewService
    {
        bool Add(Review review);
        List<Review> GetByCraftsman(int craftsmanId);
        List<Review> GetByUser(int userId);
        double GetAverageRating(int craftsmanId);
    }
}