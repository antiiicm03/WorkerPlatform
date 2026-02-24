using Microsoft.Data.SqlClient;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using WebProdavnica.Core.Constant;
using WebProdavnica.DAL.Abstract;
using WebProdavnica.Entities;

namespace WebProdavnica.DAL.Impl
{
    public class ReviewRepository : IReviewRepository
    {
        public bool Add(Review r)
        {
            using SqlConnection conn = new(DataBaseConstant.ConnectionString);
            conn.Open();

            SqlCommand cmd = conn.CreateCommand();
            cmd.CommandText = @"INSERT INTO dbo.reviews
            (rating,comment,user_id,craftsman_id)
            VALUES(@ra,@c,@uid,@cid)";

            cmd.Parameters.AddWithValue("@ra", r.Rating);
            cmd.Parameters.AddWithValue("@c", r.Comment);
            cmd.Parameters.AddWithValue("@uid", r.UserId);
            cmd.Parameters.AddWithValue("@cid", r.CraftsmanId);

            return cmd.ExecuteNonQuery() > 0;
        }

        public List<Review> GetByCraftsman(int craftsmanId)
        {
            List<Review> list = new();
            using SqlConnection conn = new(DataBaseConstant.ConnectionString);
            conn.Open();

            SqlCommand cmd = conn.CreateCommand();
            cmd.CommandText = "SELECT * FROM dbo.reviews WHERE craftsman_id=@id";
            cmd.Parameters.AddWithValue("@id", craftsmanId);

            SqlDataReader r = cmd.ExecuteReader();
            while (r.Read())
            {
                list.Add(new Review
                {
                    ReviewId = r.GetInt32(0),
                    Rating = r.GetInt32(1),
                    Comment = r.GetString(2),
                    CreatedAt = r.GetDateTime(3),
                    UserId = r.GetInt32(4),
                    CraftsmanId = r.GetInt32(5)
                });
            }
            return list;
        }

        public List<Review> GetAll()
        {
            List<Review> list = new();
            using SqlConnection conn = new(DataBaseConstant.ConnectionString);
            conn.Open();
            SqlCommand cmd = conn.CreateCommand();
            cmd.CommandText = "SELECT * FROM dbo.reviews";
            SqlDataReader r = cmd.ExecuteReader();
            while (r.Read())
            {
                list.Add(new Review
                {
                    ReviewId = r.GetInt32(0),
                    Rating = r.GetInt32(1),
                    Comment = r.IsDBNull(2) ? null : r.GetString(2),
                    CreatedAt = r.GetDateTime(3),
                    UserId = r.GetInt32(4),
                    CraftsmanId = r.GetInt32(5)
                });
            }
            return list;
        }
    }
}
