using WebProdavnica.DAL.Abstract;
using WebProdavnica.Entities;

namespace WebProdavnica.BusinessLayer.Impl
{
    public class ReviewService : Abstract.IReviewService
    {
        private readonly IReviewRepository _reviewRepository;
        private readonly ICraftsmanRepository _craftsmanRepository;

        public ReviewService(IReviewRepository reviewRepository, ICraftsmanRepository craftsmanRepository)
        {
            _reviewRepository = reviewRepository;
            _craftsmanRepository = craftsmanRepository;
        }

        public bool Add(Review review)
        {
            if (review.Rating < 1 || review.Rating > 5) return false;

            review.CreatedAt = DateTime.Now;
            bool success = _reviewRepository.Add(review);

            // Nakon svake recenzije azuriramo prosecnu ocenu zanatlije
            if (success)
            {
                var avg = GetAverageRating(review.CraftsmanId);
                var craftsman = _craftsmanRepository.Get(review.CraftsmanId);
                if (craftsman != null)
                {
                    craftsman.AverageRating = (decimal)avg;
                    _craftsmanRepository.Update(craftsman);
                }
            }

            return success;
        }

        public List<Review> GetByCraftsman(int craftsmanId) =>
            _reviewRepository.GetByCraftsman(craftsmanId);

        public List<Review> GetByUser(int userId) =>
            _reviewRepository.GetAll()
                .Where(r => r.UserId == userId)
                .ToList();

        public double GetAverageRating(int craftsmanId)
        {
            var reviews = _reviewRepository.GetByCraftsman(craftsmanId);
            if (!reviews.Any()) return 0;
            return Math.Round(reviews.Average(r => r.Rating), 2);
        }
    }
}