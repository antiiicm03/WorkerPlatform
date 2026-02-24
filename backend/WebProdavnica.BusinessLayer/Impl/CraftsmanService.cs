using WebProdavnica.DAL.Abstract;
using WebProdavnica.Entities;

namespace WebProdavnica.BusinessLayer.Impl
{
    public class CraftsmanService : Abstract.ICraftsmanService
    {
        private readonly ICraftsmanRepository _craftsmanRepository;

        public CraftsmanService(ICraftsmanRepository craftsmanRepository)
        {
            _craftsmanRepository = craftsmanRepository;
        }

        public bool Add(Craftsman craftsman) => _craftsmanRepository.Add(craftsman);

        public bool Update(Craftsman craftsman) => _craftsmanRepository.Update(craftsman);

        public bool Delete(int id) => _craftsmanRepository.Delete(id);

        public Craftsman? Get(int id) => _craftsmanRepository.Get(id);

        public List<Craftsman> GetAll() => _craftsmanRepository.GetAll();

        public List<Craftsman> GetByProfession(string profession) =>
            _craftsmanRepository.GetAll()
                .Where(c => c.Profession.ToLower().Contains(profession.ToLower()))
                .ToList();

        public List<Craftsman> GetByLocation(string location) =>
            _craftsmanRepository.GetAll()
                .Where(c => c.Location.ToLower().Contains(location.ToLower()))
                .ToList();

        // Pretraga po vise kriterijuma - glavna funkcionalnost platforme
        public List<Craftsman> Search(string? profession, string? location, decimal? maxRate, decimal? minRating)
        {
            var all = _craftsmanRepository.GetAll();

            if (!string.IsNullOrEmpty(profession))
                all = all.Where(c => c.Profession.ToLower().Contains(profession.ToLower())).ToList();

            if (!string.IsNullOrEmpty(location))
                all = all.Where(c => c.Location.ToLower().Contains(location.ToLower())).ToList();

            if (maxRate.HasValue)
                all = all.Where(c => c.HourlyRate <= maxRate.Value).ToList();

            if (minRating.HasValue)
                all = all.Where(c => c.AverageRating >= minRating.Value).ToList();

            return all.OrderByDescending(c => c.AverageRating).ToList();
        }
    }
}