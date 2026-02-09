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
    public class JobOrderRepository : IJobOrderRepository
    {
        public bool Add(JobOrder j)
        {
            using SqlConnection conn = new(DataBaseConstant.ConnectionString);
            conn.Open();

            SqlCommand cmd = conn.CreateCommand();
            cmd.CommandText = @"INSERT INTO dbo.job_orders
            (scheduled_date,job_description,status,urgent,total_price,user_id,craftsman_id)
            VALUES(@sd,@jd,@st,@u,@tp,@uid,@cid)";

            cmd.Parameters.AddWithValue("@sd", j.ScheduledDate);
            cmd.Parameters.AddWithValue("@jd", j.JobDescription);
            cmd.Parameters.AddWithValue("@st", j.Status);
            cmd.Parameters.AddWithValue("@u", j.Urgent);
            cmd.Parameters.AddWithValue("@tp", j.TotalPrice);
            cmd.Parameters.AddWithValue("@uid", j.UserId);
            cmd.Parameters.AddWithValue("@cid", j.CraftsmanId);

            return cmd.ExecuteNonQuery() > 0;
        }

        public bool Delete(int id)
        {
            using SqlConnection conn = new(DataBaseConstant.ConnectionString);
            conn.Open();

            SqlCommand cmd = conn.CreateCommand();
            cmd.CommandText = "DELETE FROM dbo.job_orders WHERE job_id=@id";
            cmd.Parameters.AddWithValue("@id", id);

            return cmd.ExecuteNonQuery() > 0;
        }

        public JobOrder Get(int id)
        {
            using SqlConnection conn = new(DataBaseConstant.ConnectionString);
            conn.Open();

            SqlCommand cmd = conn.CreateCommand();
            cmd.CommandText = "SELECT * FROM dbo.job_orders WHERE job_id=@id";
            cmd.Parameters.AddWithValue("@id", id);

            SqlDataReader r = cmd.ExecuteReader();
            if (!r.Read()) return null;

            return new JobOrder
            {
                JobId = r.GetInt32(0),
                ScheduledDate = r.GetDateTime(1),
                JobDescription = r.GetString(2),
                Status = r.GetString(3),
                Urgent = r.GetBoolean(4),
                TotalPrice = r.GetDecimal(5),
                UserId = r.GetInt32(6),
                CraftsmanId = r.GetInt32(7)
            };
        }

        public List<JobOrder> GetAll()
        {
            List<JobOrder> list = new();
            using SqlConnection conn = new(DataBaseConstant.ConnectionString);
            conn.Open();

            SqlCommand cmd = conn.CreateCommand();
            cmd.CommandText = "SELECT * FROM dbo.job_orders";
            SqlDataReader r = cmd.ExecuteReader();

            while (r.Read())
            {
                list.Add(new JobOrder
                {
                    JobId = r.GetInt32(0),
                    ScheduledDate = r.GetDateTime(1),
                    JobDescription = r.GetString(2),
                    Status = r.GetString(3),
                    Urgent = r.GetBoolean(4),
                    TotalPrice = r.GetDecimal(5),
                    UserId = r.GetInt32(6),
                    CraftsmanId = r.GetInt32(7)
                });
            }
            return list;
        }

        public bool Update(JobOrder j)
        {
            using SqlConnection conn = new(DataBaseConstant.ConnectionString);
            conn.Open();

            SqlCommand cmd = conn.CreateCommand();
            cmd.CommandText = @"UPDATE dbo.job_orders SET
                scheduled_date=@sd,job_description=@jd,status=@st,
                urgent=@u,total_price=@tp
                WHERE job_id=@id";

            cmd.Parameters.AddWithValue("@sd", j.ScheduledDate);
            cmd.Parameters.AddWithValue("@jd", j.JobDescription);
            cmd.Parameters.AddWithValue("@st", j.Status);
            cmd.Parameters.AddWithValue("@u", j.Urgent);
            cmd.Parameters.AddWithValue("@tp", j.TotalPrice);
            cmd.Parameters.AddWithValue("@id", j.JobId);

            return cmd.ExecuteNonQuery() > 0;
        }
    }
}
