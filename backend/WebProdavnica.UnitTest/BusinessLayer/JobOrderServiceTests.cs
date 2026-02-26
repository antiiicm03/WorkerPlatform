using Xunit;
using Moq;
using WebProdavnica.BusinessLayer.Impl;
using WebProdavnica.DAL.Abstract;
using WebProdavnica.Entities;

namespace WebProdavnica.UnitTest.Services
{
    public class JobOrderServiceTests
    {
        private readonly Mock<IJobOrderRepository> _mockJobOrderRepo;
        private readonly JobOrderService _jobOrderService;

        public JobOrderServiceTests()
        {
            _mockJobOrderRepo = new Mock<IJobOrderRepository>();
            _jobOrderService = new JobOrderService(_mockJobOrderRepo.Object);
        }

        #region Add Tests

        [Fact]
        public void Add_WithValidJobOrder_ReturnsTrue()
        {
            // Arrange
            var jobOrder = new JobOrder
            {
                UserId = 1,
                CraftsmanId = 2,
                JobDescription = "Fix sink",
                ScheduledDate = DateTime.Now.AddDays(1),
                Status = "Zakazano",
                TotalPrice = 5000
            };

            _mockJobOrderRepo.Setup(r => r.Add(jobOrder)).Returns(true);

            // Act
            var result = _jobOrderService.Add(jobOrder);

            // Assert
            Assert.True(result);
            _mockJobOrderRepo.Verify(r => r.Add(jobOrder), Times.Once);
        }

        [Fact]
        public void Add_WhenRepositoryFails_ReturnsFalse()
        {
            // Arrange
            var jobOrder = new JobOrder { JobDescription = "Test" };
            _mockJobOrderRepo.Setup(r => r.Add(jobOrder)).Returns(false);

            // Act
            var result = _jobOrderService.Add(jobOrder);

            // Assert
            Assert.False(result);
        }

        #endregion

        #region Update Tests

        [Fact]
        public void Update_WithValidJobOrder_ReturnsTrue()
        {
            // Arrange
            var jobOrder = new JobOrder
            {
                JobId = 1,
                Status = "U toku",
                TotalPrice = 6000
            };

            _mockJobOrderRepo.Setup(r => r.Update(jobOrder)).Returns(true);

            // Act
            var result = _jobOrderService.Update(jobOrder);

            // Assert
            Assert.True(result);
            _mockJobOrderRepo.Verify(r => r.Update(jobOrder), Times.Once);
        }

        [Fact]
        public void Update_WhenRepositoryFails_ReturnsFalse()
        {
            // Arrange
            var jobOrder = new JobOrder { JobId = 999 };
            _mockJobOrderRepo.Setup(r => r.Update(jobOrder)).Returns(false);

            // Act
            var result = _jobOrderService.Update(jobOrder);

            // Assert
            Assert.False(result);
        }

        #endregion

        #region Delete Tests

        [Fact]
        public void Delete_WithValidId_ReturnsTrue()
        {
            // Arrange
            _mockJobOrderRepo.Setup(r => r.Delete(1)).Returns(true);

            // Act
            var result = _jobOrderService.Delete(1);

            // Assert
            Assert.True(result);
            _mockJobOrderRepo.Verify(r => r.Delete(1), Times.Once);
        }

        [Fact]
        public void Delete_WithInvalidId_ReturnsFalse()
        {
            // Arrange
            _mockJobOrderRepo.Setup(r => r.Delete(999)).Returns(false);

            // Act
            var result = _jobOrderService.Delete(999);

            // Assert
            Assert.False(result);
        }

        #endregion

        #region Get Tests

        [Fact]
        public void Get_WithValidId_ReturnsJobOrder()
        {
            // Arrange
            var expectedJob = new JobOrder
            {
                JobId = 1,
                JobDescription = "Fix plumbing",
                Status = "Zakazano"
            };

            _mockJobOrderRepo.Setup(r => r.Get(1)).Returns(expectedJob);

            // Act
            var result = _jobOrderService.Get(1);

            // Assert
            Assert.NotNull(result);
            Assert.Equal(1, result.JobId);
            Assert.Equal("Fix plumbing", result.JobDescription);
        }

        [Fact]
        public void Get_WithInvalidId_ReturnsNull()
        {
            // Arrange
            _mockJobOrderRepo.Setup(r => r.Get(999)).Returns((JobOrder)null);

            // Act
            var result = _jobOrderService.Get(999);

            // Assert
            Assert.Null(result);
        }

        #endregion

        #region GetAll Tests

        [Fact]
        public void GetAll_ReturnsAllJobOrders()
        {
            // Arrange
            var expectedJobs = new List<JobOrder>
            {
                new JobOrder { JobId = 1 },
                new JobOrder { JobId = 2 },
                new JobOrder { JobId = 3 }
            };

            _mockJobOrderRepo.Setup(r => r.GetAll()).Returns(expectedJobs);

            // Act
            var result = _jobOrderService.GetAll();

            // Assert
            Assert.Equal(3, result.Count);
            _mockJobOrderRepo.Verify(r => r.GetAll(), Times.Once);
        }

        [Fact]
        public void GetAll_WithNoData_ReturnsEmptyList()
        {
            // Arrange
            _mockJobOrderRepo.Setup(r => r.GetAll()).Returns(new List<JobOrder>());

            // Act
            var result = _jobOrderService.GetAll();

            // Assert
            Assert.Empty(result);
        }

        #endregion

        #region GetByUser Tests

        [Fact]
        public void GetByUser_ReturnsJobsForSpecificUser()
        {
            // Arrange
            var allJobs = new List<JobOrder>
            {
                new JobOrder { JobId = 1, UserId = 10, ScheduledDate = DateTime.Now.AddDays(1) },
                new JobOrder { JobId = 2, UserId = 20, ScheduledDate = DateTime.Now.AddDays(2) },
                new JobOrder { JobId = 3, UserId = 10, ScheduledDate = DateTime.Now.AddDays(3) }
            };

            _mockJobOrderRepo.Setup(r => r.GetAll()).Returns(allJobs);

            // Act
            var result = _jobOrderService.GetByUser(10);

            // Assert
            Assert.Equal(2, result.Count);
            Assert.All(result, job => Assert.Equal(10, job.UserId));
        }

        [Fact]
        public void GetByUser_OrdersByScheduledDateDescending()
        {
            // Arrange
            var baseDate = new DateTime(2024, 1, 1);
            var allJobs = new List<JobOrder>
            {
                new JobOrder { JobId = 1, UserId = 10, ScheduledDate = baseDate.AddDays(1) },
                new JobOrder { JobId = 2, UserId = 10, ScheduledDate = baseDate.AddDays(5) },
                new JobOrder { JobId = 3, UserId = 10, ScheduledDate = baseDate.AddDays(3) }
            };

            _mockJobOrderRepo.Setup(r => r.GetAll()).Returns(allJobs);

            // Act
            var result = _jobOrderService.GetByUser(10);

            // Assert
            Assert.Equal(3, result.Count);
            Assert.Equal(baseDate.AddDays(5), result[0].ScheduledDate); // Newest first
            Assert.Equal(baseDate.AddDays(3), result[1].ScheduledDate);
            Assert.Equal(baseDate.AddDays(1), result[2].ScheduledDate); // Oldest last
        }

        [Fact]
        public void GetByUser_WithNoMatchingJobs_ReturnsEmptyList()
        {
            // Arrange
            var allJobs = new List<JobOrder>
            {
                new JobOrder { JobId = 1, UserId = 10 },
                new JobOrder { JobId = 2, UserId = 20 }
            };

            _mockJobOrderRepo.Setup(r => r.GetAll()).Returns(allJobs);

            // Act
            var result = _jobOrderService.GetByUser(999);

            // Assert
            Assert.Empty(result);
        }

        #endregion

        #region GetByCraftsman Tests

        [Fact]
        public void GetByCraftsman_ReturnsJobsForSpecificCraftsman()
        {
            // Arrange
            var allJobs = new List<JobOrder>
            {
                new JobOrder { JobId = 1, CraftsmanId = 5, ScheduledDate = DateTime.Now.AddDays(1) },
                new JobOrder { JobId = 2, CraftsmanId = 10, ScheduledDate = DateTime.Now.AddDays(2) },
                new JobOrder { JobId = 3, CraftsmanId = 5, ScheduledDate = DateTime.Now.AddDays(3) }
            };

            _mockJobOrderRepo.Setup(r => r.GetAll()).Returns(allJobs);

            // Act
            var result = _jobOrderService.GetByCraftsman(5);

            // Assert
            Assert.Equal(2, result.Count);
            Assert.All(result, job => Assert.Equal(5, job.CraftsmanId));
        }

        [Fact]
        public void GetByCraftsman_OrdersByScheduledDateDescending()
        {
            // Arrange
            var baseDate = new DateTime(2024, 1, 1);
            var allJobs = new List<JobOrder>
            {
                new JobOrder { JobId = 1, CraftsmanId = 5, ScheduledDate = baseDate.AddDays(2) },
                new JobOrder { JobId = 2, CraftsmanId = 5, ScheduledDate = baseDate.AddDays(10) },
                new JobOrder { JobId = 3, CraftsmanId = 5, ScheduledDate = baseDate.AddDays(5) }
            };

            _mockJobOrderRepo.Setup(r => r.GetAll()).Returns(allJobs);

            // Act
            var result = _jobOrderService.GetByCraftsman(5);

            // Assert
            Assert.Equal(3, result.Count);
            Assert.Equal(baseDate.AddDays(10), result[0].ScheduledDate); // Newest first
            Assert.Equal(baseDate.AddDays(5), result[1].ScheduledDate);
            Assert.Equal(baseDate.AddDays(2), result[2].ScheduledDate); // Oldest last
        }

        [Fact]
        public void GetByCraftsman_WithNoMatchingJobs_ReturnsEmptyList()
        {
            // Arrange
            var allJobs = new List<JobOrder>
            {
                new JobOrder { JobId = 1, CraftsmanId = 5 },
                new JobOrder { JobId = 2, CraftsmanId = 10 }
            };

            _mockJobOrderRepo.Setup(r => r.GetAll()).Returns(allJobs);

            // Act
            var result = _jobOrderService.GetByCraftsman(999);

            // Assert
            Assert.Empty(result);
        }

        #endregion

        #region GetByCraftsmanId Tests

        [Fact]
        public void GetByCraftsmanId_CallsRepositoryMethod()
        {
            // Arrange
            var expectedJobs = new List<JobOrder>
            {
                new JobOrder { JobId = 1, CraftsmanId = 5 },
                new JobOrder { JobId = 2, CraftsmanId = 5 }
            };

            _mockJobOrderRepo.Setup(r => r.GetByCraftsmanId(5)).Returns(expectedJobs);

            // Act
            var result = _jobOrderService.GetByCraftsmanId(5);

            // Assert
            Assert.Equal(2, result.Count);
            Assert.All(result, job => Assert.Equal(5, job.CraftsmanId));
            _mockJobOrderRepo.Verify(r => r.GetByCraftsmanId(5), Times.Once);
        }

        [Fact]
        public void GetByCraftsmanId_ReturnsRepositoryResult()
        {
            // Arrange
            var expectedJobs = new List<JobOrder>();
            _mockJobOrderRepo.Setup(r => r.GetByCraftsmanId(999)).Returns(expectedJobs);

            // Act
            var result = _jobOrderService.GetByCraftsmanId(999);

            // Assert
            Assert.Same(expectedJobs, result); // Returns exact same instance
        }

        #endregion

        #region GetByStatus Tests

        [Fact]
        public void GetByStatus_ReturnsJobsWithMatchingStatus()
        {
            // Arrange
            var allJobs = new List<JobOrder>
            {
                new JobOrder { JobId = 1, Status = "Zakazano" },
                new JobOrder { JobId = 2, Status = "U toku" },
                new JobOrder { JobId = 3, Status = "Zakazano" },
                new JobOrder { JobId = 4, Status = "Završeno" }
            };

            _mockJobOrderRepo.Setup(r => r.GetAll()).Returns(allJobs);

            // Act
            var result = _jobOrderService.GetByStatus("Zakazano");

            // Assert
            Assert.Equal(2, result.Count);
            Assert.All(result, job => Assert.Equal("Zakazano", job.Status));
        }

        [Fact]
        public void GetByStatus_CaseInsensitive_ReturnsMatches()
        {
            // Arrange
            var allJobs = new List<JobOrder>
            {
                new JobOrder { JobId = 1, Status = "ZAKAZANO" },
                new JobOrder { JobId = 2, Status = "zakazano" },
                new JobOrder { JobId = 3, Status = "Zakazano" },
                new JobOrder { JobId = 4, Status = "U toku" }
            };

            _mockJobOrderRepo.Setup(r => r.GetAll()).Returns(allJobs);

            // Act
            var result = _jobOrderService.GetByStatus("ZaKaZaNo");

            // Assert
            Assert.Equal(3, result.Count);
        }

        [Fact]
        public void GetByStatus_WithNoMatches_ReturnsEmptyList()
        {
            // Arrange
            var allJobs = new List<JobOrder>
            {
                new JobOrder { JobId = 1, Status = "Zakazano" },
                new JobOrder { JobId = 2, Status = "U toku" }
            };

            _mockJobOrderRepo.Setup(r => r.GetAll()).Returns(allJobs);

            // Act
            var result = _jobOrderService.GetByStatus("Otkazano");

            // Assert
            Assert.Empty(result);
        }

        [Theory]
        [InlineData("Zakazano")]
        [InlineData("U toku")]
        [InlineData("Završeno")]
        [InlineData("Otkazano")]
        public void GetByStatus_WithDifferentStatuses_FiltersCorrectly(string status)
        {
            // Arrange
            var allJobs = new List<JobOrder>
            {
                new JobOrder { JobId = 1, Status = "Zakazano" },
                new JobOrder { JobId = 2, Status = "U toku" },
                new JobOrder { JobId = 3, Status = "Završeno" },
                new JobOrder { JobId = 4, Status = "Otkazano" }
            };

            _mockJobOrderRepo.Setup(r => r.GetAll()).Returns(allJobs);

            // Act
            var result = _jobOrderService.GetByStatus(status);

            // Assert
            Assert.Single(result);
            Assert.Equal(status, result[0].Status);
        }

        #endregion

        #region GetUrgent Tests

        [Fact]
        public void GetUrgent_ReturnsOnlyUrgentJobs()
        {
            // Arrange
            var allJobs = new List<JobOrder>
            {
                new JobOrder { JobId = 1, Urgent = true, ScheduledDate = DateTime.Now.AddDays(1) },
                new JobOrder { JobId = 2, Urgent = false, ScheduledDate = DateTime.Now.AddDays(2) },
                new JobOrder { JobId = 3, Urgent = true, ScheduledDate = DateTime.Now.AddDays(3) },
                new JobOrder { JobId = 4, Urgent = false, ScheduledDate = DateTime.Now.AddDays(4) }
            };

            _mockJobOrderRepo.Setup(r => r.GetAll()).Returns(allJobs);

            // Act
            var result = _jobOrderService.GetUrgent();

            // Assert
            Assert.Equal(2, result.Count);
            Assert.All(result, job => Assert.True(job.Urgent));
        }

        [Fact]
        public void GetUrgent_OrdersByScheduledDateAscending()
        {
            // Arrange
            var baseDate = new DateTime(2024, 1, 1);
            var allJobs = new List<JobOrder>
            {
                new JobOrder { JobId = 1, Urgent = true, ScheduledDate = baseDate.AddDays(5) },
                new JobOrder { JobId = 2, Urgent = true, ScheduledDate = baseDate.AddDays(1) },
                new JobOrder { JobId = 3, Urgent = true, ScheduledDate = baseDate.AddDays(3) }
            };

            _mockJobOrderRepo.Setup(r => r.GetAll()).Returns(allJobs);

            // Act
            var result = _jobOrderService.GetUrgent();

            // Assert
            Assert.Equal(3, result.Count);
            Assert.Equal(baseDate.AddDays(1), result[0].ScheduledDate); // Soonest first
            Assert.Equal(baseDate.AddDays(3), result[1].ScheduledDate);
            Assert.Equal(baseDate.AddDays(5), result[2].ScheduledDate); // Latest last
        }

        [Fact]
        public void GetUrgent_WithNoUrgentJobs_ReturnsEmptyList()
        {
            // Arrange
            var allJobs = new List<JobOrder>
            {
                new JobOrder { JobId = 1, Urgent = false },
                new JobOrder { JobId = 2, Urgent = false }
            };

            _mockJobOrderRepo.Setup(r => r.GetAll()).Returns(allJobs);

            // Act
            var result = _jobOrderService.GetUrgent();

            // Assert
            Assert.Empty(result);
        }

        [Fact]
        public void GetUrgent_PrioritizesSoonerDates()
        {
            // Arrange
            var today = DateTime.Now;
            var allJobs = new List<JobOrder>
            {
                new JobOrder { JobId = 1, Urgent = true, ScheduledDate = today.AddDays(10) },
                new JobOrder { JobId = 2, Urgent = true, ScheduledDate = today.AddHours(2) },  // Most urgent
                new JobOrder { JobId = 3, Urgent = true, ScheduledDate = today.AddDays(1) }
            };

            _mockJobOrderRepo.Setup(r => r.GetAll()).Returns(allJobs);

            // Act
            var result = _jobOrderService.GetUrgent();

            // Assert
            Assert.Equal(2, result[0].JobId); // Job in 2 hours should be first
            Assert.Equal(3, result[1].JobId); // Job tomorrow should be second
            Assert.Equal(1, result[2].JobId); // Job in 10 days should be last
        }

        #endregion

        #region UpdateStatus Tests

        [Fact]
        public void UpdateStatus_WithValidJobId_UpdatesStatusAndReturnsTrue()
        {
            // Arrange
            var existingJob = new JobOrder
            {
                JobId = 1,
                Status = "Zakazano",
                JobDescription = "Test job"
            };

            _mockJobOrderRepo.Setup(r => r.Get(1)).Returns(existingJob);
            _mockJobOrderRepo.Setup(r => r.Update(It.IsAny<JobOrder>())).Returns(true);

            // Act
            var result = _jobOrderService.UpdateStatus(1, "U toku");

            // Assert
            Assert.True(result);
            Assert.Equal("U toku", existingJob.Status);
            _mockJobOrderRepo.Verify(r => r.Get(1), Times.Once);
            _mockJobOrderRepo.Verify(r => r.Update(It.Is<JobOrder>(
                j => j.JobId == 1 && j.Status == "U toku"
            )), Times.Once);
        }

        [Fact]
        public void UpdateStatus_WithInvalidJobId_ReturnsFalse()
        {
            // Arrange
            _mockJobOrderRepo.Setup(r => r.Get(999)).Returns((JobOrder)null);

            // Act
            var result = _jobOrderService.UpdateStatus(999, "U toku");

            // Assert
            Assert.False(result);
            _mockJobOrderRepo.Verify(r => r.Get(999), Times.Once);
            _mockJobOrderRepo.Verify(r => r.Update(It.IsAny<JobOrder>()), Times.Never);
        }

        [Fact]
        public void UpdateStatus_WhenUpdateFails_ReturnsFalse()
        {
            // Arrange
            var existingJob = new JobOrder { JobId = 1, Status = "Zakazano" };
            _mockJobOrderRepo.Setup(r => r.Get(1)).Returns(existingJob);
            _mockJobOrderRepo.Setup(r => r.Update(existingJob)).Returns(false);

            // Act
            var result = _jobOrderService.UpdateStatus(1, "U toku");

            // Assert
            Assert.False(result);
        }

        [Theory]
        [InlineData("Zakazano", "U toku")]
        [InlineData("U toku", "Završeno")]
        [InlineData("Zakazano", "Otkazano")]
        public void UpdateStatus_WithDifferentStatusTransitions_Works(string oldStatus, string newStatus)
        {
            // Arrange
            var job = new JobOrder { JobId = 1, Status = oldStatus };
            _mockJobOrderRepo.Setup(r => r.Get(1)).Returns(job);
            _mockJobOrderRepo.Setup(r => r.Update(job)).Returns(true);

            // Act
            var result = _jobOrderService.UpdateStatus(1, newStatus);

            // Assert
            Assert.True(result);
            Assert.Equal(newStatus, job.Status);
        }

        [Fact]
        public void UpdateStatus_OnlyChangesStatus_PreservesOtherFields()
        {
            // Arrange
            var originalJob = new JobOrder
            {
                JobId = 1,
                Status = "Zakazano",
                JobDescription = "Original Description",
                TotalPrice = 5000,
                Urgent = true,
                UserId = 10,
                CraftsmanId = 5
            };

            _mockJobOrderRepo.Setup(r => r.Get(1)).Returns(originalJob);
            _mockJobOrderRepo.Setup(r => r.Update(originalJob)).Returns(true);

            // Act
            _jobOrderService.UpdateStatus(1, "U toku");

            // Assert
            Assert.Equal("U toku", originalJob.Status); // Changed
            Assert.Equal("Original Description", originalJob.JobDescription); // Unchanged
            Assert.Equal(5000, originalJob.TotalPrice); // Unchanged
            Assert.True(originalJob.Urgent); // Unchanged
            Assert.Equal(10, originalJob.UserId); // Unchanged
            Assert.Equal(5, originalJob.CraftsmanId); // Unchanged
        }

        #endregion

        #region Edge Cases

        [Fact]
        public void GetByUser_WithEmptyDatabase_ReturnsEmptyList()
        {
            // Arrange
            _mockJobOrderRepo.Setup(r => r.GetAll()).Returns(new List<JobOrder>());

            // Act
            var result = _jobOrderService.GetByUser(1);

            // Assert
            Assert.Empty(result);
        }

        [Fact]
        public void GetByCraftsman_WithEmptyDatabase_ReturnsEmptyList()
        {
            // Arrange
            _mockJobOrderRepo.Setup(r => r.GetAll()).Returns(new List<JobOrder>());

            // Act
            var result = _jobOrderService.GetByCraftsman(1);

            // Assert
            Assert.Empty(result);
        }

        [Fact]
        public void GetByStatus_WithEmptyDatabase_ReturnsEmptyList()
        {
            // Arrange
            _mockJobOrderRepo.Setup(r => r.GetAll()).Returns(new List<JobOrder>());

            // Act
            var result = _jobOrderService.GetByStatus("Zakazano");

            // Assert
            Assert.Empty(result);
        }

        [Fact]
        public void GetUrgent_WithEmptyDatabase_ReturnsEmptyList()
        {
            // Arrange
            _mockJobOrderRepo.Setup(r => r.GetAll()).Returns(new List<JobOrder>());

            // Act
            var result = _jobOrderService.GetUrgent();

            // Assert
            Assert.Empty(result);
        }

        #endregion
    }
}