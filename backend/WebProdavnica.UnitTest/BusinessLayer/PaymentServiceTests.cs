using Xunit;
using Moq;
using WebProdavnica.BusinessLayer.Impl;
using WebProdavnica.DAL.Abstract;
using WebProdavnica.Entities;

namespace WebProdavnica.UnitTest.Services
{
    public class PaymentServiceTests
    {
        private readonly Mock<IPaymentRepository> _mockPaymentRepo;
        private readonly PaymentService _paymentService;

        public PaymentServiceTests()
        {
            _mockPaymentRepo = new Mock<IPaymentRepository>();
            _paymentService = new PaymentService(_mockPaymentRepo.Object);
        }

        #region Add Tests - Business Logic

        [Fact]
        public void Add_AutomaticallySetPaymentDate()
        {
            // Arrange
            var payment = new Payment
            {
                JobId = 1,
                Amount = 5000,
                PaymentMethod = "Card"
                // PaymentDate not set - should be auto-set
            };

            var beforeAdd = DateTime.Now;
            _mockPaymentRepo.Setup(r => r.Add(It.IsAny<Payment>())).Returns(true);

            // Act
            _paymentService.Add(payment);

            // Assert
            Assert.NotEqual(default(DateTime), payment.PaymentDate);
            Assert.True(payment.PaymentDate >= beforeAdd);
            Assert.True(payment.PaymentDate <= DateTime.Now.AddSeconds(1)); // Within 1 second
        }

        [Fact]
        public void Add_AutomaticallySetStatusToCompleted()
        {
            // Arrange
            var payment = new Payment
            {
                JobId = 1,
                Amount = 5000,
                PaymentMethod = "Card"
                // PaymentStatus not set - should be auto-set to "Completed"
            };

            _mockPaymentRepo.Setup(r => r.Add(It.IsAny<Payment>())).Returns(true);

            // Act
            _paymentService.Add(payment);

            // Assert
            Assert.Equal("Completed", payment.PaymentStatus);
        }

        [Fact]
        public void Add_OverridesExistingStatus()
        {
            // Arrange
            var payment = new Payment
            {
                JobId = 1,
                Amount = 5000,
                PaymentMethod = "Card",
                PaymentStatus = "Pending" // Will be overridden
            };

            _mockPaymentRepo.Setup(r => r.Add(It.IsAny<Payment>())).Returns(true);

            // Act
            _paymentService.Add(payment);

            // Assert
            Assert.Equal("Completed", payment.PaymentStatus);
            Assert.NotEqual("Pending", payment.PaymentStatus);
        }

        [Fact]
        public void Add_OverridesExistingDate()
        {
            // Arrange
            var oldDate = new DateTime(2020, 1, 1);
            var payment = new Payment
            {
                JobId = 1,
                Amount = 5000,
                PaymentMethod = "Card",
                PaymentDate = oldDate // Will be overridden
            };

            _mockPaymentRepo.Setup(r => r.Add(It.IsAny<Payment>())).Returns(true);

            // Act
            _paymentService.Add(payment);

            // Assert
            Assert.NotEqual(oldDate, payment.PaymentDate);
            Assert.True(payment.PaymentDate > oldDate);
        }

        [Fact]
        public void Add_PreservesOtherProperties()
        {
            // Arrange
            var payment = new Payment
            {
                PaymentID = 1,
                JobId = 123,
                Amount = 7500,
                PaymentMethod = "Cash"
            };

            _mockPaymentRepo.Setup(r => r.Add(It.IsAny<Payment>())).Returns(true);

            // Act
            _paymentService.Add(payment);

            // Assert - All original properties should be preserved
            Assert.Equal(1, payment.PaymentID);
            Assert.Equal(123, payment.JobId);
            Assert.Equal(7500, payment.Amount);
            Assert.Equal("Cash", payment.PaymentMethod);
            // PaymentDate and PaymentStatus are set by the service, so we verify they're NOT default
            Assert.NotEqual(default(DateTime), payment.PaymentDate);
            Assert.Equal("Completed", payment.PaymentStatus);
        }

        [Fact]
        public void Add_SetsDateAndStatusBeforeCallingRepository()
        {
            // Arrange
            Payment capturedPayment = null;
            var payment = new Payment
            {
                JobId = 1,
                Amount = 5000
            };

            _mockPaymentRepo.Setup(r => r.Add(It.IsAny<Payment>()))
                .Callback<Payment>(p => capturedPayment = p)
                .Returns(true);

            // Act
            _paymentService.Add(payment);

            // Assert - Verify repository received payment with date and status set
            Assert.NotNull(capturedPayment);
            Assert.NotEqual(default(DateTime), capturedPayment.PaymentDate);
            Assert.Equal("Completed", capturedPayment.PaymentStatus);
        }

        [Fact]
        public void Add_CallsRepositoryWithModifiedPayment()
        {
            // Arrange
            var payment = new Payment { JobId = 1, Amount = 1000 };
            _mockPaymentRepo.Setup(r => r.Add(It.IsAny<Payment>())).Returns(true);

            // Act
            _paymentService.Add(payment);

            // Assert
            _mockPaymentRepo.Verify(r => r.Add(It.Is<Payment>(
                p => p.PaymentStatus == "Completed" &&
                     p.PaymentDate != default(DateTime)
            )), Times.Once);
        }

        #endregion

        #region Add Tests - Return Value

        [Fact]
        public void Add_WhenRepositorySucceeds_ReturnsTrue()
        {
            // Arrange
            var payment = new Payment { JobId = 1, Amount = 1000 };
            _mockPaymentRepo.Setup(r => r.Add(It.IsAny<Payment>())).Returns(true);

            // Act
            var result = _paymentService.Add(payment);

            // Assert
            Assert.True(result);
        }

        [Fact]
        public void Add_WhenRepositoryFails_ReturnsFalse()
        {
            // Arrange
            var payment = new Payment { JobId = 1, Amount = 1000 };
            _mockPaymentRepo.Setup(r => r.Add(It.IsAny<Payment>())).Returns(false);

            // Act
            var result = _paymentService.Add(payment);

            // Assert
            Assert.False(result);
        }

        [Fact]
        public void Add_ReturnsRepositoryResult()
        {
            // Arrange
            var payment = new Payment { JobId = 1, Amount = 1000 };

            // Test both true and false scenarios
            _mockPaymentRepo.Setup(r => r.Add(It.IsAny<Payment>())).Returns(true);
            var resultTrue = _paymentService.Add(payment);

            _mockPaymentRepo.Setup(r => r.Add(It.IsAny<Payment>())).Returns(false);
            var resultFalse = _paymentService.Add(payment);

            // Assert
            Assert.True(resultTrue);
            Assert.False(resultFalse);
        }

        #endregion

        #region GetByJob Tests

        [Fact]
        public void GetByJob_ReturnsPaymentsForSpecificJob()
        {
            // Arrange
            var jobId = 123;
            var expectedPayments = new List<Payment>
            {
                new Payment { PaymentID = 1, JobId = 123, Amount = 5000 },
                new Payment { PaymentID = 2, JobId = 123, Amount = 3000 }
            };

            _mockPaymentRepo.Setup(r => r.GetByJob(jobId)).Returns(expectedPayments);

            // Act
            var result = _paymentService.GetByJob(jobId);

            // Assert
            Assert.Equal(2, result.Count);
            Assert.All(result, p => Assert.Equal(123, p.JobId));
            _mockPaymentRepo.Verify(r => r.GetByJob(123), Times.Once);
        }

        [Fact]
        public void GetByJob_WithNoPayments_ReturnsEmptyList()
        {
            // Arrange
            _mockPaymentRepo.Setup(r => r.GetByJob(999)).Returns(new List<Payment>());

            // Act
            var result = _paymentService.GetByJob(999);

            // Assert
            Assert.Empty(result);
        }

        [Fact]
        public void GetByJob_CallsRepositoryWithCorrectJobId()
        {
            // Arrange
            var jobId = 42;
            _mockPaymentRepo.Setup(r => r.GetByJob(jobId)).Returns(new List<Payment>());

            // Act
            _paymentService.GetByJob(jobId);

            // Assert
            _mockPaymentRepo.Verify(r => r.GetByJob(42), Times.Once);
        }

        [Theory]
        [InlineData(1)]
        [InlineData(10)]
        [InlineData(100)]
        public void GetByJob_WithDifferentJobIds_CallsRepository(int jobId)
        {
            // Arrange
            _mockPaymentRepo.Setup(r => r.GetByJob(jobId))
                .Returns(new List<Payment>());

            // Act
            _paymentService.GetByJob(jobId);

            // Assert
            _mockPaymentRepo.Verify(r => r.GetByJob(jobId), Times.Once);
        }

        [Fact]
        public void GetByJob_ReturnsExactRepositoryResult()
        {
            // Arrange
            var expectedList = new List<Payment> { new Payment { PaymentID = 1 } };
            _mockPaymentRepo.Setup(r => r.GetByJob(1)).Returns(expectedList);

            // Act
            var result = _paymentService.GetByJob(1);

            // Assert
            Assert.Same(expectedList, result); // Returns exact same instance
        }

        #endregion

        #region Edge Cases

        [Fact]
        public void Add_WithNullPaymentMethod_StillSetsDateAndStatus()
        {
            // Arrange
            var payment = new Payment
            {
                JobId = 1,
                Amount = 1000,
                PaymentMethod = null
            };

            _mockPaymentRepo.Setup(r => r.Add(It.IsAny<Payment>())).Returns(true);

            // Act
            _paymentService.Add(payment);

            // Assert
            Assert.NotEqual(default(DateTime), payment.PaymentDate);
            Assert.Equal("Completed", payment.PaymentStatus);
        }

        [Fact]
        public void Add_WithZeroAmount_StillSetsDateAndStatus()
        {
            // Arrange
            var payment = new Payment
            {
                JobId = 1,
                Amount = 0
            };

            _mockPaymentRepo.Setup(r => r.Add(It.IsAny<Payment>())).Returns(true);

            // Act
            _paymentService.Add(payment);

            // Assert
            Assert.NotEqual(default(DateTime), payment.PaymentDate);
            Assert.Equal("Completed", payment.PaymentStatus);
        }

        [Fact]
        public void Add_CalledMultipleTimes_SetsCurrentDateEachTime()
        {
            // Arrange
            var payment1 = new Payment { JobId = 1, Amount = 1000 };
            var payment2 = new Payment { JobId = 2, Amount = 2000 };

            _mockPaymentRepo.Setup(r => r.Add(It.IsAny<Payment>())).Returns(true);

            // Act
            _paymentService.Add(payment1);
            System.Threading.Thread.Sleep(10); // Small delay
            _paymentService.Add(payment2);

            // Assert
            Assert.True(payment2.PaymentDate >= payment1.PaymentDate);
        }

        #endregion

        #region Business Rule Validation

        [Fact]
        public void Add_AlwaysSetsCompletedStatus_NeverOtherStatuses()
        {
            // Arrange
            var payments = new List<Payment>
            {
                new Payment { JobId = 1, Amount = 1000, PaymentStatus = "Pending" },
                new Payment { JobId = 2, Amount = 2000, PaymentStatus = "Failed" },
                new Payment { JobId = 3, Amount = 3000, PaymentStatus = "Processing" },
                new Payment { JobId = 4, Amount = 4000, PaymentStatus = null }
            };

            _mockPaymentRepo.Setup(r => r.Add(It.IsAny<Payment>())).Returns(true);

            // Act
            foreach (var payment in payments)
            {
                _paymentService.Add(payment);
            }

            // Assert
            Assert.All(payments, p => Assert.Equal("Completed", p.PaymentStatus));
        }

        [Fact]
        public void Add_DateIsAlwaysNow_NeverFutureOrPast()
        {
            // Arrange
            var payment = new Payment
            {
                JobId = 1,
                Amount = 1000,
                PaymentDate = DateTime.Now.AddYears(1) // Future date
            };

            var beforeAdd = DateTime.Now;
            _mockPaymentRepo.Setup(r => r.Add(It.IsAny<Payment>())).Returns(true);

            // Act
            _paymentService.Add(payment);

            // Assert
            Assert.True(payment.PaymentDate >= beforeAdd);
            Assert.True(payment.PaymentDate <= DateTime.Now.AddSeconds(1));
            Assert.True(payment.PaymentDate < DateTime.Now.AddYears(1));
        }

        #endregion
    }
}