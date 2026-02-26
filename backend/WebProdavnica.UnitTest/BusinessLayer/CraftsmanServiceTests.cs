using Xunit;
using Moq;
using WebProdavnica.BusinessLayer.Impl;
using WebProdavnica.DAL.Abstract;
using WebProdavnica.Entities;

namespace WebProdavnica.UnitTest.Services
{
    public class CraftsmanServiceTests
    {
        private readonly Mock<ICraftsmanRepository> _mockCraftsmanRepo;
        private readonly CraftsmanService _craftsmanService;

        public CraftsmanServiceTests()
        {
            _mockCraftsmanRepo = new Mock<ICraftsmanRepository>();
            _craftsmanService = new CraftsmanService(_mockCraftsmanRepo.Object);
        }

        #region Add Tests

        [Fact]
        public void Add_WithValidCraftsman_ReturnsTrue()
        {
            // Arrange
            var craftsman = new Craftsman
            {
                FirstName = "Petar",
                LastName = "Petrović",
                Email = "petar@test.com",
                Profession = "Stolar",
                HourlyRate = 2000
            };

            _mockCraftsmanRepo.Setup(r => r.Add(craftsman)).Returns(true);

            // Act
            var result = _craftsmanService.Add(craftsman);

            // Assert
            Assert.True(result);
            _mockCraftsmanRepo.Verify(r => r.Add(craftsman), Times.Once);
        }

        [Fact]
        public void Add_WhenRepositoryFails_ReturnsFalse()
        {
            // Arrange
            var craftsman = new Craftsman { FirstName = "Test" };
            _mockCraftsmanRepo.Setup(r => r.Add(craftsman)).Returns(false);

            // Act
            var result = _craftsmanService.Add(craftsman);

            // Assert
            Assert.False(result);
        }

        #endregion

        #region Update Tests

        [Fact]
        public void Update_WithValidCraftsman_ReturnsTrue()
        {
            // Arrange
            var craftsman = new Craftsman
            {
                CraftsmanId = 1,
                FirstName = "Updated",
                LastName = "Name",
                HourlyRate = 2500
            };

            _mockCraftsmanRepo.Setup(r => r.Update(craftsman)).Returns(true);

            // Act
            var result = _craftsmanService.Update(craftsman);

            // Assert
            Assert.True(result);
            _mockCraftsmanRepo.Verify(r => r.Update(craftsman), Times.Once);
        }

        [Fact]
        public void Update_WhenRepositoryFails_ReturnsFalse()
        {
            // Arrange
            var craftsman = new Craftsman { CraftsmanId = 999 };
            _mockCraftsmanRepo.Setup(r => r.Update(craftsman)).Returns(false);

            // Act
            var result = _craftsmanService.Update(craftsman);

            // Assert
            Assert.False(result);
        }

        #endregion

        #region Delete Tests

        [Fact]
        public void Delete_WithValidId_ReturnsTrue()
        {
            // Arrange
            _mockCraftsmanRepo.Setup(r => r.Delete(1)).Returns(true);

            // Act
            var result = _craftsmanService.Delete(1);

            // Assert
            Assert.True(result);
            _mockCraftsmanRepo.Verify(r => r.Delete(1), Times.Once);
        }

        [Fact]
        public void Delete_WithInvalidId_ReturnsFalse()
        {
            // Arrange
            _mockCraftsmanRepo.Setup(r => r.Delete(999)).Returns(false);

            // Act
            var result = _craftsmanService.Delete(999);

            // Assert
            Assert.False(result);
        }

        #endregion

        #region Get Tests

        [Fact]
        public void Get_WithValidId_ReturnsCraftsman()
        {
            // Arrange
            var expectedCraftsman = new Craftsman
            {
                CraftsmanId = 1,
                FirstName = "Marko",
                LastName = "Marković",
                Profession = "Električar"
            };

            _mockCraftsmanRepo.Setup(r => r.Get(1)).Returns(expectedCraftsman);

            // Act
            var result = _craftsmanService.Get(1);

            // Assert
            Assert.NotNull(result);
            Assert.Equal(1, result.CraftsmanId);
            Assert.Equal("Marko", result.FirstName);
            _mockCraftsmanRepo.Verify(r => r.Get(1), Times.Once);
        }

        [Fact]
        public void Get_WithInvalidId_ReturnsNull()
        {
            // Arrange
            _mockCraftsmanRepo.Setup(r => r.Get(999)).Returns((Craftsman)null);

            // Act
            var result = _craftsmanService.Get(999);

            // Assert
            Assert.Null(result);
        }

        #endregion

        #region GetAll Tests

        [Fact]
        public void GetAll_ReturnsAllCraftsmen()
        {
            // Arrange
            var expectedCraftsmen = new List<Craftsman>
            {
                new Craftsman { CraftsmanId = 1, FirstName = "Petar" },
                new Craftsman { CraftsmanId = 2, FirstName = "Marko" },
                new Craftsman { CraftsmanId = 3, FirstName = "Ana" }
            };

            _mockCraftsmanRepo.Setup(r => r.GetAll()).Returns(expectedCraftsmen);

            // Act
            var result = _craftsmanService.GetAll();

            // Assert
            Assert.NotNull(result);
            Assert.Equal(3, result.Count);
            _mockCraftsmanRepo.Verify(r => r.GetAll(), Times.Once);
        }

        [Fact]
        public void GetAll_WithNoData_ReturnsEmptyList()
        {
            // Arrange
            _mockCraftsmanRepo.Setup(r => r.GetAll()).Returns(new List<Craftsman>());

            // Act
            var result = _craftsmanService.GetAll();

            // Assert
            Assert.NotNull(result);
            Assert.Empty(result);
        }

        #endregion

        #region GetByProfession Tests

        [Fact]
        public void GetByProfession_WithExactMatch_ReturnsCraftsmen()
        {
            // Arrange
            var allCraftsmen = new List<Craftsman>
            {
                new Craftsman { CraftsmanId = 1, Profession = "Stolar" },
                new Craftsman { CraftsmanId = 2, Profession = "Električar" },
                new Craftsman { CraftsmanId = 3, Profession = "Stolar" }
            };

            _mockCraftsmanRepo.Setup(r => r.GetAll()).Returns(allCraftsmen);

            // Act
            var result = _craftsmanService.GetByProfession("Stolar");

            // Assert
            Assert.Equal(2, result.Count);
            Assert.All(result, c => Assert.Contains("Stolar", c.Profession));
        }

        [Fact]
        public void GetByProfession_CaseInsensitive_ReturnsCraftsmen()
        {
            // Arrange
            var allCraftsmen = new List<Craftsman>
            {
                new Craftsman { CraftsmanId = 1, Profession = "Stolar" },
                new Craftsman { CraftsmanId = 2, Profession = "STOLAR" },
                new Craftsman { CraftsmanId = 3, Profession = "stolar" }
            };

            _mockCraftsmanRepo.Setup(r => r.GetAll()).Returns(allCraftsmen);

            // Act
            var result = _craftsmanService.GetByProfession("StOlAr");

            // Assert
            Assert.Equal(3, result.Count);
        }

        [Fact]
        public void GetByProfession_WithPartialMatch_ReturnsCraftsmen()
        {
            // Arrange
            var allCraftsmen = new List<Craftsman>
            {
                new Craftsman { CraftsmanId = 1, Profession = "Električar" },
                new Craftsman { CraftsmanId = 2, Profession = "Električar za auto" },
                new Craftsman { CraftsmanId = 3, Profession = "Stolar" }
            };

            _mockCraftsmanRepo.Setup(r => r.GetAll()).Returns(allCraftsmen);

            // Act
            var result = _craftsmanService.GetByProfession("elektr");

            // Assert
            Assert.Equal(2, result.Count);
            Assert.All(result, c => Assert.Contains("elektr", c.Profession.ToLower()));
        }

        [Fact]
        public void GetByProfession_WithNoMatches_ReturnsEmptyList()
        {
            // Arrange
            var allCraftsmen = new List<Craftsman>
            {
                new Craftsman { CraftsmanId = 1, Profession = "Stolar" },
                new Craftsman { CraftsmanId = 2, Profession = "Električar" }
            };

            _mockCraftsmanRepo.Setup(r => r.GetAll()).Returns(allCraftsmen);

            // Act
            var result = _craftsmanService.GetByProfession("Vodoinstalater");

            // Assert
            Assert.Empty(result);
        }

        #endregion

        #region GetByLocation Tests

        [Fact]
        public void GetByLocation_WithExactMatch_ReturnsCraftsmen()
        {
            // Arrange
            var allCraftsmen = new List<Craftsman>
            {
                new Craftsman { CraftsmanId = 1, Location = "Beograd" },
                new Craftsman { CraftsmanId = 2, Location = "Novi Sad" },
                new Craftsman { CraftsmanId = 3, Location = "Beograd" }
            };

            _mockCraftsmanRepo.Setup(r => r.GetAll()).Returns(allCraftsmen);

            // Act
            var result = _craftsmanService.GetByLocation("Beograd");

            // Assert
            Assert.Equal(2, result.Count);
            Assert.All(result, c => Assert.Contains("Beograd", c.Location));
        }

        [Fact]
        public void GetByLocation_CaseInsensitive_ReturnsCraftsmen()
        {
            // Arrange
            var allCraftsmen = new List<Craftsman>
            {
                new Craftsman { CraftsmanId = 1, Location = "Beograd" },
                new Craftsman { CraftsmanId = 2, Location = "BEOGRAD" },
                new Craftsman { CraftsmanId = 3, Location = "beograd" }
            };

            _mockCraftsmanRepo.Setup(r => r.GetAll()).Returns(allCraftsmen);

            // Act
            var result = _craftsmanService.GetByLocation("BeOgRaD");

            // Assert
            Assert.Equal(3, result.Count);
        }

        [Fact]
        public void GetByLocation_WithPartialMatch_ReturnsCraftsmen()
        {
            // Arrange
            var allCraftsmen = new List<Craftsman>
            {
                new Craftsman { CraftsmanId = 1, Location = "Novi Beograd" },
                new Craftsman { CraftsmanId = 2, Location = "Stari Beograd" },
                new Craftsman { CraftsmanId = 3, Location = "Niš" }
            };

            _mockCraftsmanRepo.Setup(r => r.GetAll()).Returns(allCraftsmen);

            // Act
            var result = _craftsmanService.GetByLocation("beograd");

            // Assert
            Assert.Equal(2, result.Count);
            Assert.All(result, c => Assert.Contains("beograd", c.Location.ToLower()));
        }

        [Fact]
        public void GetByLocation_WithNoMatches_ReturnsEmptyList()
        {
            // Arrange
            var allCraftsmen = new List<Craftsman>
            {
                new Craftsman { CraftsmanId = 1, Location = "Beograd" },
                new Craftsman { CraftsmanId = 2, Location = "Novi Sad" }
            };

            _mockCraftsmanRepo.Setup(r => r.GetAll()).Returns(allCraftsmen);

            // Act
            var result = _craftsmanService.GetByLocation("Zagreb");

            // Assert
            Assert.Empty(result);
        }

        #endregion

        #region Search Tests

        [Fact]
        public void Search_WithAllNullParameters_ReturnsAllCraftsmenOrderedByRating()
        {
            // Arrange
            var allCraftsmen = new List<Craftsman>
            {
                new Craftsman { CraftsmanId = 1, AverageRating = 3.5m },
                new Craftsman { CraftsmanId = 2, AverageRating = 5.0m },
                new Craftsman { CraftsmanId = 3, AverageRating = 4.0m }
            };

            _mockCraftsmanRepo.Setup(r => r.GetAll()).Returns(allCraftsmen);

            // Act
            var result = _craftsmanService.Search(null, null, null, null);

            // Assert
            Assert.Equal(3, result.Count);
            Assert.Equal(5.0m, result[0].AverageRating); // Highest first
            Assert.Equal(4.0m, result[1].AverageRating);
            Assert.Equal(3.5m, result[2].AverageRating); // Lowest last
        }

        [Fact]
        public void Search_WithProfessionOnly_FiltersByProfession()
        {
            // Arrange
            var allCraftsmen = new List<Craftsman>
            {
                new Craftsman { CraftsmanId = 1, Profession = "Stolar", AverageRating = 4.0m },
                new Craftsman { CraftsmanId = 2, Profession = "Električar", AverageRating = 5.0m },
                new Craftsman { CraftsmanId = 3, Profession = "Stolar", AverageRating = 3.5m }
            };

            _mockCraftsmanRepo.Setup(r => r.GetAll()).Returns(allCraftsmen);

            // Act
            var result = _craftsmanService.Search("Stolar", null, null, null);

            // Assert
            Assert.Equal(2, result.Count);
            Assert.All(result, c => Assert.Contains("Stolar", c.Profession));
            Assert.Equal(4.0m, result[0].AverageRating); // Higher rating first
            Assert.Equal(3.5m, result[1].AverageRating);
        }

        [Fact]
        public void Search_WithLocationOnly_FiltersByLocation()
        {
            // Arrange
            var allCraftsmen = new List<Craftsman>
            {
                new Craftsman { CraftsmanId = 1, Location = "Beograd", AverageRating = 3.0m },
                new Craftsman { CraftsmanId = 2, Location = "Novi Sad", AverageRating = 5.0m },
                new Craftsman { CraftsmanId = 3, Location = "Beograd", AverageRating = 4.5m }
            };

            _mockCraftsmanRepo.Setup(r => r.GetAll()).Returns(allCraftsmen);

            // Act
            var result = _craftsmanService.Search(null, "Beograd", null, null);

            // Assert
            Assert.Equal(2, result.Count);
            Assert.All(result, c => Assert.Contains("Beograd", c.Location));
            Assert.Equal(4.5m, result[0].AverageRating); // Higher rating first
        }

        [Fact]
        public void Search_WithMaxRateOnly_FiltersRate()
        {
            // Arrange
            var allCraftsmen = new List<Craftsman>
            {
                new Craftsman { CraftsmanId = 1, HourlyRate = 1500, AverageRating = 4.0m },
                new Craftsman { CraftsmanId = 2, HourlyRate = 2500, AverageRating = 5.0m },
                new Craftsman { CraftsmanId = 3, HourlyRate = 2000, AverageRating = 4.5m }
            };

            _mockCraftsmanRepo.Setup(r => r.GetAll()).Returns(allCraftsmen);

            // Act
            var result = _craftsmanService.Search(null, null, 2000, null);

            // Assert
            Assert.Equal(2, result.Count);
            Assert.All(result, c => Assert.True(c.HourlyRate <= 2000));
            Assert.Equal(4.5m, result[0].AverageRating); // Ordered by rating
        }

        [Fact]
        public void Search_WithMinRatingOnly_FiltersRating()
        {
            // Arrange
            var allCraftsmen = new List<Craftsman>
            {
                new Craftsman { CraftsmanId = 1, AverageRating = 3.0m },
                new Craftsman { CraftsmanId = 2, AverageRating = 4.5m },
                new Craftsman { CraftsmanId = 3, AverageRating = 5.0m }
            };

            _mockCraftsmanRepo.Setup(r => r.GetAll()).Returns(allCraftsmen);

            // Act
            var result = _craftsmanService.Search(null, null, null, 4.0m);

            // Assert
            Assert.Equal(2, result.Count);
            Assert.All(result, c => Assert.True(c.AverageRating >= 4.0m));
            Assert.Equal(5.0m, result[0].AverageRating);
            Assert.Equal(4.5m, result[1].AverageRating);
        }

        [Fact]
        public void Search_WithAllParameters_AppliesAllFilters()
        {
            // Arrange
            var allCraftsmen = new List<Craftsman>
            {
                new Craftsman
                {
                    CraftsmanId = 1,
                    Profession = "Stolar",
                    Location = "Beograd",
                    HourlyRate = 1800,
                    AverageRating = 4.5m
                },
                new Craftsman
                {
                    CraftsmanId = 2,
                    Profession = "Stolar",
                    Location = "Beograd",
                    HourlyRate = 2500,
                    AverageRating = 5.0m
                },
                new Craftsman
                {
                    CraftsmanId = 3,
                    Profession = "Stolar",
                    Location = "Beograd",
                    HourlyRate = 1500,
                    AverageRating = 3.5m
                },
                new Craftsman
                {
                    CraftsmanId = 4,
                    Profession = "Električar",
                    Location = "Beograd",
                    HourlyRate = 1500,
                    AverageRating = 4.8m
                }
            };

            _mockCraftsmanRepo.Setup(r => r.GetAll()).Returns(allCraftsmen);

            // Act - Stolar, Beograd, max 2000 RSD/hr, min 4.0 rating
            var result = _craftsmanService.Search("Stolar", "Beograd", 2000, 4.0m);

            // Assert
            Assert.Single(result); // Only craftsman #1 matches all criteria
            Assert.Equal(1, result[0].CraftsmanId);
            Assert.Equal("Stolar", result[0].Profession);
            Assert.Equal("Beograd", result[0].Location);
            Assert.True(result[0].HourlyRate <= 2000);
            Assert.True(result[0].AverageRating >= 4.0m);
        }

        [Fact]
        public void Search_WithNoMatches_ReturnsEmptyList()
        {
            // Arrange
            var allCraftsmen = new List<Craftsman>
            {
                new Craftsman
                {
                    Profession = "Stolar",
                    Location = "Beograd",
                    HourlyRate = 3000,
                    AverageRating = 3.0m
                }
            };

            _mockCraftsmanRepo.Setup(r => r.GetAll()).Returns(allCraftsmen);

            // Act - Looking for cheap, highly-rated electrician in Novi Sad
            var result = _craftsmanService.Search("Električar", "Novi Sad", 1000, 5.0m);

            // Assert
            Assert.Empty(result);
        }

        [Fact]
        public void Search_OrdersByRatingDescending()
        {
            // Arrange
            var allCraftsmen = new List<Craftsman>
            {
                new Craftsman { CraftsmanId = 1, Profession = "Stolar", AverageRating = 3.5m },
                new Craftsman { CraftsmanId = 2, Profession = "Stolar", AverageRating = 5.0m },
                new Craftsman { CraftsmanId = 3, Profession = "Stolar", AverageRating = 4.2m },
                new Craftsman { CraftsmanId = 4, Profession = "Stolar", AverageRating = 4.8m }
            };

            _mockCraftsmanRepo.Setup(r => r.GetAll()).Returns(allCraftsmen);

            // Act
            var result = _craftsmanService.Search("Stolar", null, null, null);

            // Assert
            Assert.Equal(4, result.Count);
            Assert.Equal(5.0m, result[0].AverageRating);
            Assert.Equal(4.8m, result[1].AverageRating);
            Assert.Equal(4.2m, result[2].AverageRating);
            Assert.Equal(3.5m, result[3].AverageRating);
        }

        [Fact]
        public void Search_CaseInsensitiveForProfessionAndLocation()
        {
            // Arrange
            var allCraftsmen = new List<Craftsman>
            {
                new Craftsman
                {
                    CraftsmanId = 1,
                    Profession = "STOLAR",
                    Location = "BEOGRAD",
                    AverageRating = 4.0m
                },
                new Craftsman
                {
                    CraftsmanId = 2,
                    Profession = "stolar",
                    Location = "beograd",
                    AverageRating = 5.0m
                }
            };

            _mockCraftsmanRepo.Setup(r => r.GetAll()).Returns(allCraftsmen);

            // Act
            var result = _craftsmanService.Search("StOlAr", "BeOgRaD", null, null);

            // Assert
            Assert.Equal(2, result.Count);
        }

        [Theory]
        [InlineData(1000, 1)] // Max 1000 -> only 800 matches (FIXED: was 2)
        [InlineData(1500, 2)] // Max 1500 -> 800, 1200 match (FIXED: was 3)
        [InlineData(2000, 4)] // Max 2000 -> all 4 match
        public void Search_WithDifferentMaxRates_FiltersCorrectly(decimal maxRate, int expectedCount)
        {
            // Arrange
            var allCraftsmen = new List<Craftsman>
            {
                new Craftsman { HourlyRate = 800, AverageRating = 4.0m },   // <= 1000 ✓
                new Craftsman { HourlyRate = 1200, AverageRating = 4.5m },  // <= 1000 ✗, <= 1500 ✓
                new Craftsman { HourlyRate = 1600, AverageRating = 5.0m },  // <= 1500 ✗, <= 2000 ✓
                new Craftsman { HourlyRate = 2000, AverageRating = 3.5m }   // <= 2000 ✓
            };

            _mockCraftsmanRepo.Setup(r => r.GetAll()).Returns(allCraftsmen);

            // Act
            var result = _craftsmanService.Search(null, null, maxRate, null);

            // Assert
            Assert.Equal(expectedCount, result.Count);
            Assert.All(result, c => Assert.True(c.HourlyRate <= maxRate));
        }

        [Theory]
        [InlineData(3.0, 4)] // Min 3.0 -> all 4 match
        [InlineData(4.0, 3)] // Min 4.0 -> 3 match
        [InlineData(4.5, 2)] // Min 4.5 -> 2 match
        [InlineData(5.0, 1)] // Min 5.0 -> 1 match
        public void Search_WithDifferentMinRatings_FiltersCorrectly(decimal minRating, int expectedCount)
        {
            // Arrange
            var allCraftsmen = new List<Craftsman>
            {
                new Craftsman { AverageRating = 3.5m },
                new Craftsman { AverageRating = 4.0m },
                new Craftsman { AverageRating = 4.5m },
                new Craftsman { AverageRating = 5.0m }
            };

            _mockCraftsmanRepo.Setup(r => r.GetAll()).Returns(allCraftsmen);

            // Act
            var result = _craftsmanService.Search(null, null, null, minRating);

            // Assert
            Assert.Equal(expectedCount, result.Count);
            Assert.All(result, c => Assert.True(c.AverageRating >= minRating));
        }

        #endregion

        #region Edge Cases

        [Fact]
        public void Search_WithEmptyStrings_TreatsAsNullFilter()
        {
            // Arrange
            var allCraftsmen = new List<Craftsman>
            {
                new Craftsman { Profession = "Stolar", AverageRating = 4.0m },
                new Craftsman { Profession = "Električar", AverageRating = 5.0m }
            };

            _mockCraftsmanRepo.Setup(r => r.GetAll()).Returns(allCraftsmen);

            // Act
            var result = _craftsmanService.Search("", "", null, null);

            // Assert
            Assert.Equal(2, result.Count); // Empty strings should not filter
        }

        [Fact]
        public void GetByProfession_WithEmptyDatabase_ReturnsEmptyList()
        {
            // Arrange
            _mockCraftsmanRepo.Setup(r => r.GetAll()).Returns(new List<Craftsman>());

            // Act
            var result = _craftsmanService.GetByProfession("Stolar");

            // Assert
            Assert.Empty(result);
        }

        [Fact]
        public void GetByLocation_WithEmptyDatabase_ReturnsEmptyList()
        {
            // Arrange
            _mockCraftsmanRepo.Setup(r => r.GetAll()).Returns(new List<Craftsman>());

            // Act
            var result = _craftsmanService.GetByLocation("Beograd");

            // Assert
            Assert.Empty(result);
        }

        #endregion
    }
}