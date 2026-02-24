using WebProdavnica.Entities;

namespace WebProdavnica.BusinessLayer.Abstract
{
    public interface ICraftsmanService
    {
        bool Add(Craftsman craftsman);
        bool Update(Craftsman craftsman);
        bool Delete(int id);
        Craftsman? Get(int id);
        List<Craftsman> GetAll();
        List<Craftsman> GetByProfession(string profession);
        List<Craftsman> GetByLocation(string location);
        List<Craftsman> Search(string? profession, string? location, decimal? maxRate, decimal? minRating);
    }
}