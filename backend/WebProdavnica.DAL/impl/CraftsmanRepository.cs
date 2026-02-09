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
            (first_name,last_name,email,phone,location,profession,experience,hourly_rate,working_hours,average_rating)
            VALUES(@fn,@ln,@e,@p,@l,@pr,@ex,@hr,@wh,@ar)";

            cmd.Parameters.AddWithValue("@fn", c.FirstName);
            cmd.Parameters.AddWithValue("@ln", c.LastName);
            cmd.Parameters.AddWithValue("@e", c.Email);
            cmd.Parameters.AddWithValue("@p", c.Phone);
            cmd.Parameters.AddWithValue("@l", c.Location);
            cmd.Parameters.AddWithValue("@pr", c.Profession);
            cmd.Parameters.AddWithValue("@ex", c.Experience);
            cmd.Parameters.AddWithValue("@hr", c.HourlyRate);
            cmd.Parameters.AddWithValue("@wh", c.WorkingHours);
            cmd.Parameters.AddWithValue("@ar", c.AverageRating);

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

        public Craftsman Get(int id)
        {
            using SqlConnection conn = new(DataBaseConstant.ConnectionString);
            conn.Open();

            SqlCommand cmd = conn.CreateCommand();
            cmd.CommandText = "SELECT * FROM dbo.craftsmen WHERE craftsman_id=@id";
            cmd.Parameters.AddWithValue("@id", id);

            SqlDataReader r = cmd.ExecuteReader();
            if (!r.Read()) return null;

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
                AverageRating = r.GetDecimal(10)
            };
        }

        public List<Craftsman> GetAll()
        {
            List<Craftsman> list = new();
            using SqlConnection conn = new(DataBaseConstant.ConnectionString);
            conn.Open();

            SqlCommand cmd = conn.CreateCommand();
            cmd.CommandText = "SELECT * FROM dbo.craftsmen";
            SqlDataReader r = cmd.ExecuteReader();

            while (r.Read())
            {
                list.Add(new Craftsman
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
                    AverageRating = r.GetDecimal(10)
                });
            }
            return list;
        }

        public bool Update(Craftsman c)
        {
            using SqlConnection conn = new(DataBaseConstant.ConnectionString);
            conn.Open();

            SqlCommand cmd = conn.CreateCommand();
            cmd.CommandText = @"UPDATE dbo.craftsmen SET
                first_name=@fn,last_name=@ln,email=@e,phone=@p,location=@l,
                profession=@pr,experience=@ex,hourly_rate=@hr,working_hours=@wh,average_rating=@ar
                WHERE craftsman_id=@id";

            cmd.Parameters.AddWithValue("@id", c.CraftsmanId);
            cmd.Parameters.AddWithValue("@fn", c.FirstName);
            cmd.Parameters.AddWithValue("@ln", c.LastName);
            cmd.Parameters.AddWithValue("@e", c.Email);
            cmd.Parameters.AddWithValue("@p", c.Phone);
            cmd.Parameters.AddWithValue("@l", c.Location);
            cmd.Parameters.AddWithValue("@pr", c.Profession);
            cmd.Parameters.AddWithValue("@ex", c.Experience);
            cmd.Parameters.AddWithValue("@hr", c.HourlyRate);
            cmd.Parameters.AddWithValue("@wh", c.WorkingHours);
            cmd.Parameters.AddWithValue("@ar", c.AverageRating);

            return cmd.ExecuteNonQuery() > 0;
        }
    }
}
