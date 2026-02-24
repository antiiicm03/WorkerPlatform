using WebProdavnica.DAL.Abstract;
using WebProdavnica.Entities;

namespace WebProdavnica.BusinessLayer.Impl
{
    public class UserService : Abstract.IUserService
    {
        private readonly IUserRepository _userRepository;

        public UserService(IUserRepository userRepository)
        {
            _userRepository = userRepository;
        }

        
        public bool Add(User user) => _userRepository.Add(user);

        public bool Update(User user) => _userRepository.Update(user);

        public bool Delete(int id) => _userRepository.Delete(id);

        public User? Get(int id) => _userRepository.Get(id);

        public List<User> GetAll() => _userRepository.GetAll();
    }
}