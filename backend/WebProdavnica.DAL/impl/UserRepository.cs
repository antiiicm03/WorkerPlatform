using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

using WebProdavnica.DAL.Abstract;
using Microsoft.Data.SqlClient;
using WebProdavnica.Core.Constant;
using System.Collections.Generic;
using WebProdavnica.DAL.Abstract;
using WebProdavnica.Entities;

namespace WebProdavnica.DAL.Impl
{
    public class UserRepository : IUserRepository
    {
        public bool Add(User u)
        {
            using SqlConnection conn = new(DataBaseConstant.ConnectionString);
            conn.Open();
            SqlCommand cmd = conn.CreateCommand();
            cmd.CommandText = @"INSERT INTO dbo.users
                (first_name,last_name,email,phone,password_hash,location)
                VALUES(@fn,@ln,@e,@p,@ph,@l)";

            cmd.Parameters.AddWithValue("@fn", u.FirstName);
            cmd.Parameters.AddWithValue("@ln", u.LastName);
            cmd.Parameters.AddWithValue("@e", u.Email);
            cmd.Parameters.AddWithValue("@p", u.Phone);
            cmd.Parameters.AddWithValue("@ph", u.PasswordHash);
            cmd.Parameters.AddWithValue("@l", u.Location);

            return cmd.ExecuteNonQuery() > 0;
        }

        public bool Delete(int id)
        {
            using SqlConnection conn = new(DataBaseConstant.ConnectionString);
            conn.Open();
            SqlCommand cmd = conn.CreateCommand();
            cmd.CommandText = "DELETE FROM dbo.users WHERE user_id=@id";
            cmd.Parameters.AddWithValue("@id", id);
            return cmd.ExecuteNonQuery() > 0;
        }

        public User Get(int id)
        {
            using SqlConnection conn = new(DataBaseConstant.ConnectionString);
            conn.Open();
            SqlCommand cmd = conn.CreateCommand();
            cmd.CommandText = "SELECT * FROM dbo.users WHERE user_id=@id";
            cmd.Parameters.AddWithValue("@id", id);

            SqlDataReader r = cmd.ExecuteReader();
            if (!r.Read()) return null;

            return new User
            {
                UserId = r.GetInt32(0),
                FirstName = r.GetString(1),
                LastName = r.GetString(2),
                Email = r.GetString(3),
                Phone = r.GetString(4),
                PasswordHash = r.GetString(5),
                Location = r.GetString(6),
                CreatedAt = r.GetDateTime(7)
            };
        }

        public List<User> GetAll()
        {
            List<User> list = new();
            using SqlConnection conn = new(DataBaseConstant.ConnectionString);
            conn.Open();

            SqlCommand cmd = conn.CreateCommand();
            cmd.CommandText = "SELECT * FROM dbo.users";
            SqlDataReader r = cmd.ExecuteReader();

            while (r.Read())
            {
                list.Add(new User
                {
                    UserId = r.GetInt32(0),
                    FirstName = r.GetString(1),
                    LastName = r.GetString(2),
                    Email = r.GetString(3),
                    Phone = r.GetString(4),
                    PasswordHash = r.GetString(5),
                    Location = r.GetString(6),
                    CreatedAt = r.GetDateTime(7)
                });
            }
            return list;
        }

        public bool Update(User u)
        {
            using SqlConnection conn = new(DataBaseConstant.ConnectionString);
            conn.Open();

            SqlCommand cmd = conn.CreateCommand();
            cmd.CommandText = @"UPDATE dbo.users SET
                first_name=@fn,last_name=@ln,email=@e,phone=@p,location=@l
                WHERE user_id=@id";

            cmd.Parameters.AddWithValue("@fn", u.FirstName);
            cmd.Parameters.AddWithValue("@ln", u.LastName);
            cmd.Parameters.AddWithValue("@e", u.Email);
            cmd.Parameters.AddWithValue("@p", u.Phone);
            cmd.Parameters.AddWithValue("@l", u.Location);
            cmd.Parameters.AddWithValue("@id", u.UserId);

            return cmd.ExecuteNonQuery() > 0;
        }
    }
}
