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
    public class CraftsmanRepository : ICraftsmanRepository
    {
        public bool Add(Craftsman c)
        {
            using SqlConnection conn = new(DataBaseConstant.ConnectionString);
            conn.Open();

            SqlCommand cmd = conn.CreateCommand();
            cmd.CommandText = @"INSERT INTO dbo.craftsmen
                (first_name, last_name, email, phone, location, profession, 
                experience, hourly_rate, working_hours, average_rating, password_hash, rating_count)
                VALUES(@fn, @ln, @e, @p, @l, @pr, @ex, @hr, @wh, @ar, @ph, @rc)";

            cmd.Parameters.AddWithValue("@fn", c.FirstName);
            cmd.Parameters.AddWithValue("@ln", c.LastName);
            cmd.Parameters.AddWithValue("@e", c.Email);
            cmd.Parameters.AddWithValue("@p", c.Phone);
            cmd.Parameters.AddWithValue("@l", c.Location);
            cmd.Parameters.AddWithValue("@pr", c.Profession);
            cmd.Parameters.AddWithValue("@ex", c.Experience);
            cmd.Parameters.AddWithValue("@hr", c.HourlyRate);
            cmd.Parameters.AddWithValue("@wh", c.WorkingHours);
            cmd.Parameters.AddWithValue("@ar", (object?)c.AverageRating ?? DBNull.Value);
            cmd.Parameters.AddWithValue("@ph", (object?)c.PasswordHash ?? DBNull.Value);
            cmd.Parameters.AddWithValue("@rc", c.RatingCount);

            return cmd.ExecuteNonQuery() > 0;
        }

        public bool Delete(int id)
        {
            using SqlConnection conn = new(DataBaseConstant.ConnectionString);
            conn.Open();
            SqlCommand cmd = conn.CreateCommand();
            cmd.CommandText = "DELETE FROM dbo.craftsmen WHERE craftsman_id=@id";
            cmd.Parameters.AddWithValue("@id", id);
            return cmd.ExecuteNonQuery() > 0;
        }

        public Craftsman? Get(int id)
        {
            using SqlConnection conn = new(DataBaseConstant.ConnectionString);
            conn.Open();

            SqlCommand cmd = conn.CreateCommand();
            cmd.CommandText = @"SELECT craftsman_id, first_name, last_name, email, phone, 
                                location, profession, experience, hourly_rate, working_hours, 
                                average_rating, password_hash, refresh_token, refresh_token_expiry, rating_count
                                FROM dbo.craftsmen WHERE craftsman_id=@id";
            cmd.Parameters.AddWithValue("@id", id);

            SqlDataReader r = cmd.ExecuteReader();
            if (!r.Read()) return null;

            return MapCraftsman(r);
        }

        public List<Craftsman> GetAll()
        {
            List<Craftsman> list = new();
            using SqlConnection conn = new(DataBaseConstant.ConnectionString);
            conn.Open();

            SqlCommand cmd = conn.CreateCommand();
            cmd.CommandText = @"SELECT craftsman_id, first_name, last_name, email, phone, 
                                location, profession, experience, hourly_rate, working_hours, 
                                average_rating, password_hash, refresh_token, refresh_token_expiry, rating_count
                                FROM dbo.craftsmen";
            SqlDataReader r = cmd.ExecuteReader();

            while (r.Read())
                list.Add(MapCraftsman(r));

            return list;
        }

        public Craftsman? GetByEmail(string email)
        {
            using SqlConnection conn = new(DataBaseConstant.ConnectionString);
            conn.Open();

            SqlCommand cmd = conn.CreateCommand();
            cmd.CommandText = @"SELECT craftsman_id, first_name, last_name, email, phone, 
                                location, profession, experience, hourly_rate, working_hours, 
                                average_rating, password_hash, refresh_token, refresh_token_expiry, rating_count
                                FROM dbo.craftsmen WHERE email=@email";
            cmd.Parameters.AddWithValue("@email", email);

            SqlDataReader r = cmd.ExecuteReader();
            if (!r.Read()) return null;

            return MapCraftsman(r);
        }

        public bool Update(Craftsman craftsman)
        {
            using SqlConnection conn = new(DataBaseConstant.ConnectionString);
            conn.Open();
            SqlCommand cmd = conn.CreateCommand();

            cmd.CommandText = @"UPDATE dbo.craftsmen SET
                first_name=@fn, 
                last_name=@ln, 
                email=@e, 
                phone=@p,
                location=@loc, 
                profession=@prof, 
                experience=@exp,
                hourly_rate=@hr, 
                working_hours=@wh,
                average_rating=@ar,
                password_hash=@ph,
                refresh_token=@rt,
                refresh_token_expiry=@rte,
                rating_count=@rc
                WHERE craftsman_id=@id";

            cmd.Parameters.AddWithValue("@fn", craftsman.FirstName);
            cmd.Parameters.AddWithValue("@ln", craftsman.LastName);
            cmd.Parameters.AddWithValue("@e", craftsman.Email);
            cmd.Parameters.AddWithValue("@p", craftsman.Phone);
            cmd.Parameters.AddWithValue("@loc", craftsman.Location);
            cmd.Parameters.AddWithValue("@prof", craftsman.Profession);
            cmd.Parameters.AddWithValue("@exp", craftsman.Experience);
            cmd.Parameters.AddWithValue("@hr", craftsman.HourlyRate);
            cmd.Parameters.AddWithValue("@wh", craftsman.WorkingHours);
            cmd.Parameters.AddWithValue("@ar", (object)craftsman.AverageRating ?? DBNull.Value);
            cmd.Parameters.AddWithValue("@ph", (object)craftsman.PasswordHash ?? DBNull.Value);
            cmd.Parameters.AddWithValue("@rt", (object)craftsman.RefreshToken ?? DBNull.Value);
            cmd.Parameters.AddWithValue("@rte", (object)craftsman.RefreshTokenExpiry ?? DBNull.Value);
            cmd.Parameters.AddWithValue("@rc", craftsman.RatingCount);
            cmd.Parameters.AddWithValue("@id", craftsman.CraftsmanId);

            return cmd.ExecuteNonQuery() > 0;
        }

        private Craftsman MapCraftsman(SqlDataReader r)
        {
            return new Craftsman
            {
                CraftsmanId = r.GetInt32(0),
                FirstName = r.GetString(1),
                LastName = r.GetString(2),
                Email = r.GetString(3),
                Phone = r.GetString(4),
                Location = r.GetString(5),
                Profession = r.GetString(6),
                Experience = r.GetInt32(7),
                HourlyRate = r.GetDecimal(8),
                WorkingHours = r.GetString(9),
                AverageRating = r.IsDBNull(10) ? null : r.GetDecimal(10),
                PasswordHash = r.IsDBNull(11) ? null : r.GetString(11),
                RefreshToken = r.IsDBNull(12) ? null : r.GetString(12),
                RefreshTokenExpiry = r.IsDBNull(13) ? null : r.GetDateTime(13),
                RatingCount = r.IsDBNull(14) ? 0 : r.GetInt32(14)
            };
        }
    }
}