const toLocalDateKey = (value) => {
  if (!value) return null;

  // MySQL DATE values are returned as YYYY-MM-DD in most API responses. Keep
  // that representation intact so the browser timezone cannot shift the date.
  if (typeof value === "string" && /^\d{4}-\d{2}-\d{2}$/.test(value)) {
    return value;
  }

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return null;

  return [date.getFullYear(), String(date.getMonth() + 1).padStart(2, "0"), String(date.getDate()).padStart(2, "0")].join("-");
};

export const hasActiveDiscount = (product) => {
  const percentage = Number(product?.discount_percentage);
  const startDate = toLocalDateKey(product?.start_date);
  const endDate = toLocalDateKey(product?.end_date);
  const today = toLocalDateKey(new Date());

  return Boolean(
    Number(product?.is_active) === 1
    && Number.isFinite(percentage)
    && percentage > 0
    && startDate
    && endDate
    && startDate <= today
    && today < endDate,
  );
};

export const getDiscountedPrice = (price, discountPercentage) => {
  const numericPrice = Number(price);
  const percentage = Number(discountPercentage);

  if (!Number.isFinite(numericPrice) || !Number.isFinite(percentage)) return price;

  return numericPrice - (numericPrice * percentage) / 100;
};
