// Formateadores para React Native

export const formatCurrency = (amount) => {
  return new Intl.NumberFormat('es-GT', { 
    style: 'currency', 
    currency: 'GTQ' 
  }).format(amount ?? 0);
};

export const formatDate = (dateString) => {
  if (!dateString) return '---';
  const date = new Date(dateString);
  return isNaN(date.getTime()) ? '---' : date.toLocaleDateString('es-GT', { 
    day: '2-digit', 
    month: 'short', 
    year: 'numeric' 
  });
};

export const formatDateTime = (dateString) => {
  if (!dateString) return '---';
  const date = new Date(dateString);
  return isNaN(date.getTime()) ? '---' : date.toLocaleDateString('es-GT', { 
    day: '2-digit', 
    month: 'short', 
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
};

export const formatNumber = (number) => {
  return new Intl.NumberFormat('es-GT').format(number ?? 0);
};

export const formatPercentage = (value) => {
  return new Intl.NumberFormat('es-GT', {
    style: 'percent',
    minimumFractionDigits: 1,
    maximumFractionDigits: 1,
  }).format(value / 100);
};
