using WebProdavnica.Entities;
using WebProdavnica.DAL.Abstract;
using WebProdavnica.DAL.Impl;

namespace WebProdavnica.TestConsole
{
    internal class Program
    {
        static void Main(string[] args)
        {
            IUserRepository userRepository = new UserRepository();

            User user = new User
            {
                FirstName = "Test",
                LastName = "Test",
                Email = "test@gmail.com",
                PasswordHash = "pass",
            };
            if (userRepository.Add(user) == true)
            {
                Console.WriteLine("Uspeno");

            }
            else
            {
                Console.WriteLine("Greska");
            }

        }
    }
}