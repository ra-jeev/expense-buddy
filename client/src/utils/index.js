let dateTimeFormatter;
let currencyFormatter;

export const formatDateTime = (dateString) => {
  if (!dateString) {
    return '';
  }

  if (!dateTimeFormatter) {
    dateTimeFormatter = new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: 'numeric',
      minute: 'numeric',
    });
  }

  return dateTimeFormatter.format(new Date(dateString));
};

export const formatCurrency = (amount) => {
  if (!currencyFormatter) {
    currencyFormatter = new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 2,
    });
  }

  return currencyFormatter.format(amount);
};
