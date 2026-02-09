using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using WebProdavnica.Entities;

namespace WebProdavnica.DAL.Abstract
{
    public interface IReviewRepository
    {
        bool Add(Review r);
        List<Review> GetByCraftsman(int craftsmanId);
    }
}
