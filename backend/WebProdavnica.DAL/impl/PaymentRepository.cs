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
    public class PaymentRepository : IPaymentRepository
    {
        public bool Add(Payment p)
        {
            using SqlConnection conn = new(DataBaseConstant.ConnectionString);
            conn.Open();

            SqlCommand cmd = conn.CreateCommand();
            cmd.CommandText = @"INSERT INTO dbo.payments
            (amount,payment_date,payment_method,payment_status,job_id)
            VALUES(@a,@d,@m,@s,@jid)";

            cmd.Parameters.AddWithValue("@a", p.Amount);
            cmd.Parameters.AddWithValue("@d", p.PaymentDate);
            cmd.Parameters.AddWithValue("@m", p.PaymentMethod);
            cmd.Parameters.AddWithValue("@s", p.PaymentStatus);
            cmd.Parameters.AddWithValue("@jid", p.JobId);

            return cmd.ExecuteNonQuery() > 0;
        }

        public List<Payment> GetByJob(int jobId)
        {
            List<Payment> list = new();
            using SqlConnection conn = new(DataBaseConstant.ConnectionString);
            conn.Open();

            SqlCommand cmd = conn.CreateCommand();
            cmd.CommandText = "SELECT * FROM dbo.payments WHERE job_id=@id";
            cmd.Parameters.AddWithValue("@id", jobId);

            SqlDataReader r = cmd.ExecuteReader();
            while (r.Read())
            {
                list.Add(new Payment
                {
                    Amount = r.GetDecimal(1),
                    PaymentDate = r.GetDateTime(2),
                    PaymentMethod = r.GetString(3),
                    PaymentStatus = r.GetString(4),
                    JobId = r.GetInt32(5)
                });
            }
            return list;
        }
    }
}
